// next-js:
import {
    NextRequest,
    NextResponse,
}                           from 'next/server'

// models:
import type {
    PaymentDetail,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internals:
import {
    // utilities:
    findPaymentById,
}                           from '@/libs/order-utilities'



// configs:
export const fetchCache = 'force-no-store';
// export const runtime = 'edge';
// export const config = {
//     runtime: 'edge',
// };
export const maxDuration = 60; // this function can run for a maximum of 60 seconds for long_lived connection stream



// utilities:
const checkPayment = async (paymentId: string): Promise<PaymentDetail|false|null> => {
    try {
        return await prisma.$transaction(async (prismaTransaction): Promise<PaymentDetail|false|null> => {
            const draftOrder = await prismaTransaction.draftOrder.findUnique({
                where  : {
                    paymentId : paymentId,
                },
                select : {
                    id : true,
                },
            });
            if (!!draftOrder) return null;             // still in DraftOrder (not moved to RealOrder) => waiting for payment
            
            
            
            const paymentDetail = await findPaymentById(prismaTransaction, { paymentId: paymentId });
            if (!!paymentDetail) return paymentDetail; // paid
            
            
            
            return false;                              // payment canceled or expired or failed
        });
    }
    catch {
        // ignore any error
        return null;                                   // an error occured during check for payment status => assumes as waiting for payment
    } // try
};



export async function GET(req: NextRequest, res: Response) {
    const rawPaymentId = req.nextUrl.searchParams.get('paymentId');
    if ((typeof(rawPaymentId) !== 'string') || !rawPaymentId) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    };
    
    if (!rawPaymentId.startsWith('#MIDTRANS_')) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    }
    
    const paymentId = rawPaymentId.slice(10); // remove prefix #MIDTRANS_
    if (!paymentId.length) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const midtransPaymentId = paymentId;
    
    
    
    const responseStream = new TransformStream();
    const writer         = responseStream.writable.getWriter();
    const encoder        = new TextEncoder();
    
    
    
    // ready signal:
    Promise.resolve().then(async () => { // wait until the header has sent
        try {
            await writer.write(encoder.encode(`event: ready\ndata: \n\n`));
        }
        catch {} // ignore any errors
    });
    
    
    
    let rescheduleHandler : ReturnType<typeof setTimeout>;
    const scheduleCheckPayment = async (): Promise<void> => {
        const result = await checkPayment(midtransPaymentId);
        
        if (result !== null) {
            try {
                if (result) { // PaymentDetail => payment approved:
                    await writer.write(encoder.encode(`event: paid\ndata: ${JSON.stringify(result)}\n\n`));
                }
                else {        // false         => payment canceled or expired or failed:
                    await writer.write(encoder.encode(`event: canceled\ndata: \n\n`));
                } // if
            }
            catch {} // ignore any errors
            
            
            
            await writer.close();
            return; // payment approved or canceled or expired or failed => no need to pool anymore
        } // if
        
        
        
        rescheduleHandler = setTimeout(() => {
            scheduleCheckPayment(); // the subsequent schedule
        }, 2 * 1000); // re-check every 2 seconds
    }
    scheduleCheckPayment(); // the first schedule
    
    
    
    writer.closed
    .then(() => {
        console.log('Connection to client is closed gracefully.');
        clearTimeout(rescheduleHandler);
    })
    .catch(() => {
        console.log('Connection to client is closed prematurely.');
        clearTimeout(rescheduleHandler);
    });
    
    
    
    // Return response connected to readable
    return new Response(responseStream.readable, {
        headers: {
            //For this example, lets allow access to all the origins, since we;re not sending any credentials:
            'Access-Control-Allow-Origin': '*',
            
            // This is important. We must keep the connection alive to let data stream do its thing:
            'Connection': 'keep-alive',
            
            // Another important line. The 'text/event-stream' content type is mandatory for SSE to work:
            'Content-Type': 'text/event-stream; charset=utf-8',
            
            // No use for caching since we're continuously getting new data:
            'Cache-Control': 'no-cache, no-transform',
            
            // By default, browsers compress the contents with `gzip` and we either have to gzip our content
            // ourselves or not do any encoding at all. I chose the latter, our payload is light anyway. 
            'Content-Encoding': 'none',
            
            'X-Accel-Buffering': 'no',
        },
    });
}

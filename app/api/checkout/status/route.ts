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
    findPayment,
}                           from '../utilities'



export async function GET(req: NextRequest, res: Response) {
    const rawOrderId = req.nextUrl.searchParams.get('paymentId');
    if (typeof(rawOrderId) !== 'string') {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    };
    
    if (!rawOrderId.startsWith('#MIDTRANS_')) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    }
    
    const paymentId = rawOrderId.slice(10); // remove prefix #MIDTRANS_
    if (!paymentId.length) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const midtransPaymentId = paymentId;
    
    
    
    let responseStream = new TransformStream();
    const writer       = responseStream.writable.getWriter();
    const encoder      = new TextEncoder();
    
    
    
    // ready signal:
    Promise.resolve().then(async () => { // wait until the header has sent
        await writer.write(encoder.encode('data: ' + JSON.stringify({ ready: true }) + '\n\n'));
    });
    
    
    
    const checkPayment = async (): Promise<PaymentDetail|false|undefined> => {
        try {
            return await prisma.$transaction(async (prismaTransaction): Promise<PaymentDetail|false|undefined> => {
                const draftOrder = await prisma.draftOrder.findUnique({
                    where  : {
                        paymentId : midtransPaymentId,
                    },
                    select : {}
                });
                if (!!draftOrder) return undefined;        // waiting for payment
                
                
                
                const paymentDetail = await findPayment(prismaTransaction, { paymentId: midtransPaymentId });
                if (!!paymentDetail) return paymentDetail; // paid
                
                
                
                return false;                              // payment canceled or expired
            });
        }
        catch {
            // ignore any error
            return undefined; // waiting for payment
        } // try
    }
    let rescheduleHandler : ReturnType<typeof setTimeout>;
    const handleCheckPayment = async (): Promise<void> => {
        const result = await checkPayment();
        
        if (result !== undefined) {
            if (result) {
                // payment approved:
                await writer.write(encoder.encode('data: ' + JSON.stringify(result) + '\n\n'));
            }
            else {
                // payment canceled|expired:
                await writer.write(encoder.encode('data: ' + JSON.stringify({ canceled: true }) + '\n\n'));
            } // if
            
            
            
            await writer.close();
            return; // payment approved|canceled|expired => no need to pool anymore
        } // if
        
        
        
        rescheduleHandler = setTimeout(() => {
            handleCheckPayment();
        }, 2 * 1000); // re-check every 2 seconds
    }
    
    
    
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

// export const runtime = 'edge';
export const config = {
    runtime: 'edge',
};
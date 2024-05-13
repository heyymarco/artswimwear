// next-js:
import {
    NextRequest,
    NextResponse,
}                           from 'next/server'

// models:
import type {
    PaymentDetail,
}                           from '@/models'

// utilities:
import {
    sha512,
}                           from '@/libs/crypto'



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
    
    
    
    let responseStream = new TransformStream();
    const writer       = responseStream.writable.getWriter();
    const encoder      = new TextEncoder();
    
    
    
    // ready signal:
    Promise.resolve().then(async () => { // wait until the header has sent
        try {
            await writer.write(encoder.encode(`event: ready\ndata: \n\n`));
        }
        catch {} // ignore any errors
    });
    
    
    
    const checkPayment = async (): Promise<PaymentDetail|false|null> => {
        try {
            const dateTime = new Date();
            const response = await fetch(`${process.env.APP_URL ?? ''}/api/checkout/callbacks/__status?paymentId=${encodeURIComponent(midtransPaymentId)}`, {
                headers : {
                    'X-DATETIME'     : dateTime.toISOString(),
                    'X-SIGNATUREKEY' : (await sha512(`${paymentId}${dateTime.valueOf()}${process.env.APP_SECRET ?? ''}`)),
                },
            });
            if (!response.ok) return null;
            const data = await response.json();
            return data?.paymentDetail ?? null;
            /*
                null          : waiting for payment.  
                false         : payment canceled or expired.  
                PaymentDetail : paid.  
            */
        }
        catch {
            // ignore any error
            return null; // an error occured during check for payment status => assumes as waiting for payment
        } // try
    }
    let rescheduleHandler : ReturnType<typeof setTimeout>;
    const scheduleCheckPayment = async (): Promise<void> => {
        const result = await checkPayment();
        
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



// configs:
export const fetchCache = 'force-no-store';
export const runtime = 'edge';
// export const config = {
//     runtime: 'edge',
// };
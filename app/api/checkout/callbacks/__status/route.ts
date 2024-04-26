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
}                           from '../../utilities'

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
    } // if
    const paymentId = rawPaymentId;
    
    
    
    const rawDateTime = req.headers.get('X-DATETIME');
    if ((typeof(rawDateTime) !== 'string') || !rawDateTime) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const numDateTime = Date.parse(rawDateTime);
    if (isNaN(numDateTime)) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const dateTime = new Date(numDateTime);
    const diffDateTime = dateTime.valueOf() - Date.now();
    if ((diffDateTime < (10 * 1000)) || (diffDateTime > (10 * 1000))) { // the dateTime precision must below 10 seconds
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    const rawSignatureKey = req.headers.get('X-SIGNATUREKEY');
    if ((typeof(rawSignatureKey) !== 'string') || !rawSignatureKey || (rawSignatureKey !== (await sha512(`${paymentId}${dateTime.valueOf()}${process.env.APP_SECRET ?? ''}`)))) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    const paymentDetail = await (async (): Promise<PaymentDetail|false|null> => {
        try {
            return await prisma.$transaction(async (prismaTransaction): Promise<PaymentDetail|false|null> => {
                const draftOrder = await prisma.draftOrder.findUnique({
                    where  : {
                        paymentId : paymentId,
                    },
                    select : {}
                });
                if (!!draftOrder) return null;             // waiting for payment
                
                
                
                const paymentDetail = await findPayment(prismaTransaction, { paymentId: paymentId });
                if (!!paymentDetail) return paymentDetail; // paid
                
                
                
                return false;                              // payment canceled or expired
            });
        }
        catch {
            // ignore any error
            return null;                                   // an error occured during check for payment status => assumes as waiting for payment
        } // try
    })();
    
    
    
    // Return OK:
    return Response.json({
        paymentDetail: paymentDetail,
    });
}



// configs:
export const fetchCache = 'force-no-store';

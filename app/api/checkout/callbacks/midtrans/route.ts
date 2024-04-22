// internals:
import {
    midtransTranslateData,
}                           from '../../paymentProcessors.midtrans'

// models:
import {
    // utilities:
    isAuthorizedFundData,
}                           from '@/models'



const sha512test = async (str: string) => {
    const buffer = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(str));
    return Array.prototype.map.call(new Uint8Array(buffer), x=>(('00'+x.toString(16)).slice(-2))).join('');
}

export async function POST(req: Request, res: Response): Promise<Response> {
    const midtransPaymentData = await req.json();
    const {
        // records:
        order_id      : orderId,
        
        
        
        // status:
        status_code   : statusCode,
        
        
        
        // amounts:
        gross_amount  : paymentAmountRaw,
        
        
        
        // security:
        signature_key : signatureKey,
    } = midtransPaymentData;
    
    
    
    if (
        (typeof(orderId     ) !== 'string') || !orderId
        ||
        (typeof(statusCode  ) !== 'string') || !statusCode
        ||
        (!['string', 'number'].includes(typeof(paymentAmountRaw)))
        ||
        (typeof(signatureKey) !== 'string') || !signatureKey
        ||
        (signatureKey !== (await sha512test(`${orderId}${statusCode}${paymentAmountRaw}${process.env.MIDTRANS_ID ?? ''}`)))
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    const result = midtransTranslateData(midtransPaymentData);
    switch (result) {
        case undefined: // Transaction not found.
            // ignore non_existing_transaction
            break;
        case null:      // Transaction creation was denied.
            // ignore failure_create_transaction
            break;
        
        
        
        case false: {   // Transaction was deleted due to canceled or expired.  
            // TODO: delete draftOrder from DB
            break;
        }
        
        
        
        default: {
            if (isAuthorizedFundData(result)) {
                // AuthorizedFundData : Authorized for payment.
                // ignore Authorized for payment
                break;
            } // if
            
            
            
            // PaidFundData : Paid.
            // TODO: commit draftOrder => order to DB
        }
    } // switch
    
    
    
    // Return OK:
    return Response.json({
        ok: true,
    });
}

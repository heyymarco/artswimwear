// reusable-ui core:
import {
    decimalify,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// models:
import type {
    CreateOrderOptions,
    AuthorizedFundData,
    PaidFundData,
}                           from '@/models'



const sha512test = async (str: string) => {
    const buffer = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(str));
    return Array.prototype.map.call(new Uint8Array(buffer), x=>(('00'+x.toString(16)).slice(-2))).join('');
}

export async function POST(req: Request, res: Response) {
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
    
    
    
    switch (midtransPaymentData.transaction_status) {
        // case 'authorize': {
        //     const paymentId   = midtransPaymentData.transaction_id;
        //     if ((typeof(paymentId) !== 'string') || !paymentId) {
        //         // TODO: log unexpected response
        //         console.log('unexpected response: ', midtransPaymentData);
        //         throw Error('unexpected API response');
        //     } // if
        //     
        //     
        //     
        //     return {
        //         paymentId,
        //         redirectData : undefined, // no redirectData required but require a `midtransCaptureFund()` to capture the fund
        //     };
        // }
        
        case 'capture':
        case 'settlement': {
            let paymentAmountRaw = midtransPaymentData.gross_amount;
            const paymentAmount  = decimalify(
                (typeof(paymentAmountRaw) === 'number')
                ? paymentAmountRaw
                : Number.parseFloat(paymentAmountRaw)
            );
            const paidFundData: PaidFundData = {
                paymentSource : {
                    ewallet : {
                        type       : 'EWALLET',
                        brand      : midtransPaymentData.payment_type?.toLowerCase() ?? null,
                        identifier : midtransPaymentData.merchant_id ?? null,
                    },
                },
                paymentAmount : paymentAmount,
                paymentFee    : 0,
            };
            console.log('payment: ', paidFundData);
            break;
        }
        
        default : {
            // TODO: log unexpected response
            console.log('unexpected response: ', midtransPaymentData);
            throw Error('unexpected API response');
        }
    } // switch
    
    
    
    // console.log('webhook: ', {
    //     headers: Array.from(req.headers.entries()).map(([key, value]) => ({key, value})),
    //     data: await req.json(),
    // });
    /*
    {
        "transaction_time": "2023-11-15 18:45:13",
        "transaction_status": "settlement",
        "transaction_id": "513f1f01-c9da-474c-9fc9-d5c64364b709",
        "status_message": "midtrans payment notification",
        "status_code": "200",
        "signature_key": "5d103e36f583c5be27a8c85ee4d348b9924ca2af36f852ef4be3a42a82d86631d93ce279395a799beb8bf4edee9402510531bed20d56efedd94587bc47d78399",
        "settlement_time": "2023-11-15 22:45:13",
        "payment_type": "gopay",
        "order_id": "payment_notif_test_G551313466_ae3953e8-5163-423c-9acf-43c27ded20fe",
        "merchant_id": "G551313466",
        "gross_amount": "105000.00",
        "fraud_status": "accept",
        "currency": "IDR"
    }
    */
    
    
    
    // Return OK:
    return Response.json({
        ok: true,
    });
}
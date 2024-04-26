// models:
import type {
    Payment,
}                           from '@prisma/client'
import {
    // utilities:
    isAuthorizedFundData,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// templates:
import type {
    // types:
    OrderAndData,
}                           from '@/components/Checkout/templates/orderDataContext'

// internals:
import {
    midtransTranslateData,
}                           from '../../paymentProcessors.midtrans'
import {
    // utilities:
    findDraftOrder,
    
    commitOrder,
    revertOrder,
}                           from '../../utilities'
import {
    sendEmailConfirmation,
}                           from '../../emails'

// utilities:
import {
    sha512,
}                           from '@/libs/crypto'



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
        (signatureKey !== (await sha512(`${orderId}${statusCode}${paymentAmountRaw}${process.env.MIDTRANS_ID ?? ''}`)))
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
            const paymentId = midtransPaymentData.transaction_id;
            if (paymentId) {
                await prisma.$transaction(async (prismaTransaction): Promise<void> => {
                    const draftOrder = await findDraftOrder(prismaTransaction, { orderId });
                    if (!draftOrder) return;
                    
                    
                    
                    // payment DECLINED => restore the `Product` stock and delete the `draftOrder`:
                    await revertOrder(prismaTransaction, { draftOrder });
                });
            } // if
            
            
            
            break;
        }
        
        
        
        default: {
            if (isAuthorizedFundData(result)) {
                // AuthorizedFundData : Authorized for payment.
                // ignore Authorized for payment
                break;
            } // if
            
            
            
            //#region save the database
            const {
                paymentSource,
                paymentAmount,
                paymentFee,
            } = result;
            
            const paymentDetail = ((): Omit<Payment, 'billingAddress'> => {
                /* PAY WITH CARD */
                const card = paymentSource?.card;
                if (card) {
                    return {
                        type       : 'CARD',
                        brand      : card.brand?.toLowerCase() ?? null,
                        identifier : card.identifier,
                        
                        amount     : paymentAmount,
                        fee        : paymentFee,
                    };
                } // if
                
                
                
                /* PAY WITH EWALLET */
                const ewallet = paymentSource?.ewallet;
                if (ewallet) {
                    return {
                        type       : 'EWALLET',
                        brand      : ewallet.brand ?? null,
                        identifier : ewallet.identifier,
                        
                        amount     : paymentAmount,
                        fee        : paymentFee,
                    };
                } // if
                
                
                
                /* PAY WITH OTHER */
                return {
                    type       : 'CUSTOM',
                    brand      : null,
                    identifier : null,
                    
                    amount     : paymentAmount,
                    fee        : paymentFee,
                };
            })();
            
            
            
            const newOrder = await prisma.$transaction(async (prismaTransaction): Promise<OrderAndData|null> => {
                const draftOrder = await findDraftOrder(prismaTransaction, { orderId });
                if (!draftOrder) return null;
                
                
                
                return await commitOrder(prismaTransaction, {
                    draftOrder         : draftOrder,
                    payment            : {
                        ...paymentDetail,
                        billingAddress : null,
                    },
                    paymentConfirmationToken : undefined,
                });
            });
            //#endregion save the database
            
            
            
            // send email confirmation:
            if (newOrder) {
                await sendEmailConfirmation({
                    newOrder,
                    
                    isPaid : true,
                    paymentConfirmationToken : undefined,
                });
            } // if
            
            
            
            break;
        }
    } // switch
    
    
    
    // Return OK:
    return Response.json({
        ok: true,
    });
}

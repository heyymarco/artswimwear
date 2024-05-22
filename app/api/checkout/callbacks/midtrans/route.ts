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
    findDraftOrderById,
    
    commitDraftOrderSelect,
    commitDraftOrder,
    revertDraftOrderSelect,
    revertDraftOrder,
    
    findOrderById,
    
    cancelOrderSelect,
    cancelOrder,
    
    commitOrderSelect,
    commitOrder,
}                           from '../../order-utilities'
import {
    sendConfirmationEmail,
}                           from '../../email-utilities'

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
                    const draftOrderReverted : boolean = await (async () : Promise<boolean> => {
                        const draftOrder = await findDraftOrderById(prismaTransaction, {
                            orderId     : orderId,
                            paymentId   : paymentId,
                            
                            orderSelect : revertDraftOrderSelect,
                        });
                        if (!draftOrder) return false; // the draftOrder is not found => ignore
                        
                        
                        
                        // draftOrder CANCELED => restore the `Product` stock and delete the `draftOrder`:
                        await revertDraftOrder(prismaTransaction, {
                            draftOrder : draftOrder,
                        });
                        return true;
                    })();
                    
                    
                    
                    if (!draftOrderReverted) {
                        const order = await findOrderById(prismaTransaction, {
                            orderId     : orderId,
                            paymentId   : paymentId,
                            
                            orderSelect : cancelOrderSelect,
                        });
                        if (!order) return; // the order is not found => ignore
                        if (['CANCELED', 'EXPIRED'].includes(order.orderStatus)) return; // already 'CANCELED'|'EXPIRED' => ignore
                        if (order.payment.type !== 'MANUAL') return; // not 'MANUAL' payment => ignore
                        
                        
                        
                        // (pending)Order EXPIRED => restore the `Product` stock and mark Order as 'EXPIRED':
                        await cancelOrder(prismaTransaction, {
                            order             : order,
                            isExpired         : true, // mark Order as 'EXPIRED'
                            
                            orderSelect       : { id: true },
                        });
                    } // if
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
            const paymentDetail = result;
            
            
            
            const newOrder : OrderAndData|null = await prisma.$transaction(async (prismaTransaction): Promise<OrderAndData|null> => {
                const draftOrder_OrderAndData : OrderAndData|null = await (async (): Promise<OrderAndData|null> => {
                    const draftOrder = await findDraftOrderById(prismaTransaction, {
                        orderId     : orderId,
                        
                        orderSelect : commitDraftOrderSelect,
                    });
                    if (!draftOrder) return null;
                    
                    
                    
                    // payment APPROVED => move the `draftOrder` to `order`:
                    return await commitDraftOrder(prismaTransaction, {
                        draftOrder         : draftOrder,
                        payment            : {
                            ...paymentDetail,
                            expiresAt      : null, // paid, no more payment expiry date
                            billingAddress : null,
                        },
                    });
                })();
                if (draftOrder_OrderAndData) return draftOrder_OrderAndData;
                
                
                
                const order_OrderAndData : OrderAndData|null = await (async (): Promise<OrderAndData|null> => {
                    const order = await findOrderById(prismaTransaction, {
                        orderId     : orderId,
                        
                        orderSelect : commitOrderSelect,
                    });
                    if (!order) return null;
                    
                    
                    
                    // payment APPROVED => mark the `order` as 'MANUAL_PAID':
                    return await commitOrder(prismaTransaction, {
                        order   : order,
                        payment : paymentDetail,
                    });
                })();
                return order_OrderAndData;
            });
            //#endregion save the database
            
            
            
            // send email confirmation:
            if (newOrder) {
                // notify that the payment has been received:
                await sendConfirmationEmail({
                    newOrder,
                    
                    isPaid : true,
                    paymentConfirmationToken : null,
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

// models:
import {
    // utilities:
    isAuthorizedFundData,
}                           from '@/models'

// models:
import {
    commitDraftOrderSelect,
    revertDraftOrderSelect,
    cancelOrderSelect,
    commitOrderSelect,
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
}                           from '../../../checkout/paymentProcessors.midtrans'
import {
    // utilities:
    findDraftOrderById,
    
    commitDraftOrder,
    revertDraftOrder,
    
    findOrderById,
    
    cancelOrder,
    
    commitOrder,
}                           from '../../../checkout/order-utilities'
import {
    sendConfirmationEmail,
}                           from '../../../checkout/email-utilities'

// utilities:
import {
    sha512,
}                           from '@/libs/crypto'



// configs:
export const fetchCache = 'force-no-store';
export const maxDuration = 60; // this function can run for a maximum of 60 seconds for many & complex transactions



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
        case false:     // Transaction was deleted due to canceled.
            // ignore canceled_transaction
            break;
        
        
        
        case '': {   // Transaction was deleted due to expired.
            const paymentId = midtransPaymentData.transaction_id;
            if (paymentId) {
                const result = await prisma.$transaction(async (prismaTransaction): Promise<string|boolean> => {
                    return (
                        // 1st step: search on DraftOrder(s):
                        await (async () : Promise<boolean> => {
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
                        })()
                        
                        ||
                        
                        // 2nd step: search on Order(s):
                        await (async () : Promise<string|boolean> => {
                            const order = await findOrderById(prismaTransaction, {
                                orderId     : orderId,
                                paymentId   : paymentId,
                                
                                orderSelect : cancelOrderSelect,
                            });
                            if (!order) return false; // the order is not found => ignore
                            if (['CANCELED', 'EXPIRED'].includes(order.orderStatus)) return false; // already 'CANCELED'|'EXPIRED' => ignore
                            if (!order.payment || (order.payment.type !== 'MANUAL')) return false; // not 'MANUAL' payment => ignore
                            
                            
                            
                            // (Real)Order EXPIRED => restore the `Product` stock and mark Order as 'EXPIRED':
                            await cancelOrder(prismaTransaction, {
                                order             : {
                                    ...order,
                                    payment : order.payment, // a TS hack
                                },
                                isExpired         : true, // mark Order as 'EXPIRED'
                                
                                orderSelect       : { id: true },
                            });
                            
                            
                            
                            return order.orderId; // the expired RealOrder.orderId
                        })()
                        
                        ||
                        
                        // 3rd step: not found
                        false
                    );
                }, { timeout: 50000 }); // give a longer timeout for `revertDraftOrder`|`cancelOrder`
                
                
                
                if (typeof(result) === 'string') {
                    // notify a payment confirmation has been expired to adminApp via webhook:
                    await fetch(`${process.env.ADMIN_APP_URL ?? ''}/api/webhooks/checkouts/expired`, {
                        method  : 'POST',
                        headers : {
                            'X-Secret' : process.env.APP_SECRET ?? '',
                        },
                        body    : JSON.stringify({
                            orderId : result,
                        }),
                    });
                } // if
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
            
            
            
            const order : OrderAndData|null = await prisma.$transaction(async (prismaTransaction): Promise<OrderAndData|null> => {
                return (
                    // 1st step: search on DraftOrder(s):
                    await (async (): Promise<OrderAndData|null> => {
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
                    })()
                    
                    ??
                    
                    // 2nd step: search on Order(s):
                    await (async (): Promise<OrderAndData|null> => {
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
                    })()
                    
                    ??
                    
                    // 3rd step: not found
                    null
                );
            });
            //#endregion save the database
            
            
            
            // send email confirmation:
            if (
                order
                &&
                (order.payment?.type !== 'CARD') // a payment_card is already notified by `/api/checkout/PATCH`
            ) {
                await Promise.all([
                    // notify that the payment has been received:
                    await sendConfirmationEmail({
                        order                    : order,
                        
                        isPaid                   : true,
                        paymentConfirmationToken : null,
                    }),
                    
                    
                    
                    // notify that the payment has been received to adminApp via webhook:
                    fetch(`${process.env.ADMIN_APP_URL ?? ''}/api/webhooks/checkouts/new`, {
                        method  : 'POST',
                        headers : {
                            'X-Secret' : process.env.APP_SECRET ?? '',
                        },
                        body    : JSON.stringify({
                            orderId : order.orderId,
                        }),
                    }),
                ]);
            } // if
            
            
            
            break;
        }
    } // switch
    
    
    
    // Return OK:
    return Response.json({
        ok: true,
    });
}

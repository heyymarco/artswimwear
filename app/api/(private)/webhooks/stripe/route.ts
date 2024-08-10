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
    stripeTranslateData,
    stripeGetPaymentFee,
}                           from '../../../checkout/paymentProcessors.stripe'
import {
    // utilities:
    findDraftOrderById,
    
    commitDraftOrder,
    revertDraftOrder,
    
    findOrderById,
    
    cancelOrder,
    
    commitOrder,
}                           from '@/libs/order-utilities'
import {
    sendConfirmationEmail,
}                           from '@/libs/email-utilities'

// stripe:
import {
    Stripe,
}                           from 'stripe'



const stripe = !process.env.STRIPE_SECRET ? undefined : new Stripe(process.env.STRIPE_SECRET);
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;



// configs:
export const fetchCache = 'force-no-store';
export const maxDuration = 60; // this function can run for a maximum of 60 seconds for many & complex transactions



export async function POST(req: Request, res: Response): Promise<Response> {
    if (!stripe || !stripeWebhookSecret) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    const stripeSignature = req.headers.get('Stripe-Signature');
    if (!stripeSignature) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    let stripeEvent : Stripe.Event;
    try {
        stripeEvent = stripe.webhooks.constructEvent(Buffer.from(await req.arrayBuffer()), stripeSignature, stripeWebhookSecret);
    }
    catch (error: any) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // try
    
    
    
    switch (stripeEvent.type) {
        case 'payment_intent.canceled'  :   // Transaction was deleted due to canceled. 
        case 'payment_intent.succeeded' : { // Transaction succeeded (paid).
            const paymentIntent = stripeEvent.data.object;
            const result = await stripeTranslateData(paymentIntent);
            switch (result) {
                case undefined: // Transaction not found.
                    // ignore non_existing_transaction
                    break;
                case null:      // Transaction creation was denied.
                    // ignore failure_create_transaction
                    break;
                case 0:         // Transaction is being processed (may be processed on customer_side or stripe_side).
                    // ignore processing_transaction
                    break;
                case false:     // Transaction was deleted due to canceled.
                    // ignore canceled_transaction
                    break;
                
                
                
                default: {
                    if (isAuthorizedFundData(result)) {
                        // AuthorizedFundData : Authorized for payment.
                        // ignore Authorized for payment
                        break;
                    } // if
                    
                    
                    
                    const orderId = paymentIntent.metadata.orderId;
                    if (!orderId) break;
                    
                    
                    
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
                                    
                                    orderSelect : {
                                        ...commitOrderSelect,
                                        payment : {
                                            select : {
                                                type : true,
                                            },
                                        },
                                    },
                                });
                                if (!order) return null;
                                if (order?.payment?.type !== 'MANUAL') {
                                    console.log('The Order is already paid: ', order);
                                    return null; // already paid => ignore
                                } // if
                                
                                
                                
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
                    if (order) {
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
            
            
            
            break;
        }
        
        
        
        case 'charge.updated'           : {
            const charge  = stripeEvent.data.object;
            const orderId = (
                !charge.payment_intent
                ? undefined
                : (
                    (typeof(charge.payment_intent) === 'object')
                    ? charge.payment_intent.metadata.orderId
                    : (await stripe.paymentIntents.retrieve(charge.payment_intent)).metadata.orderId
                )
            );
            if (!orderId) break;
            
            
            
            const fee     = await stripeGetPaymentFee(charge);
            if (fee !== undefined) {
                const updated = await prisma.payment.updateMany({
                    where : {
                        parent : {
                            orderId : orderId, // unique, guarantees only update one or zero
                        },
                    },
                    data  : {
                        fee : fee,
                    },
                });
                console.log('fee updated: ', { orderId, fee, count: updated.count});
            } // if
            break;
        }
    } // switch
    
    
    
    // Return OK:
    return Response.json({
        ok: true,
    });
}

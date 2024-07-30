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
}                           from '../../../checkout/paymentProcessors.stripe'
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
                    
                    
                    //#region save the database
                    const paymentId = paymentIntent.id;
                    const paymentDetail = result;
                    
                    
                    
                    const order : OrderAndData|null = await prisma.$transaction(async (prismaTransaction): Promise<OrderAndData|null> => {
                        return (
                            // 1st step: search on DraftOrder(s):
                            await (async (): Promise<OrderAndData|null> => {
                                const draftOrder = await findDraftOrderById(prismaTransaction, {
                                    paymentId   : paymentId,
                                    
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
                                    paymentId   : paymentId,
                                    
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
            
            
            
            break;
        }
        case 'balance.available'        : {
            const balanceTransaction = stripeEvent.data.object;
            console.log('updated balance: ', balanceTransaction);
            break;
        }
    } // switch
    
    if (stripeEvent.type.startsWith('charge.')) {
        console.log('event: ', stripeEvent.type, stripeEvent.data.object);
    } // if
    
    
    
    // Return OK:
    return Response.json({
        ok: true,
    });
}

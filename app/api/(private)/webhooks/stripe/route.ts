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
        console.log('webhook: invalid config');
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    const stripeSignature = req.headers.get('Stripe-Signature');
    if (!stripeSignature) {
        console.log('webhook: no signature');
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    const body = await req.json();
    let stripeEvent : Stripe.Event;
    try {
        stripeEvent = stripe.webhooks.constructEvent(body, stripeSignature, stripeWebhookSecret);
    }
    catch {
        console.log('webhook: signature mismatch', body);
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // try
    
    
    
    switch (stripeEvent.type) {
        case 'payment_intent.canceled'  :   // Transaction was deleted due to canceled or expired. 
        case 'payment_intent.succeeded' : { // Transaction succeeded (paid).
            const paymentIntent = stripeEvent.data.object;
            const result = stripeTranslateData(paymentIntent);
            console.log('Stripe Webhook: ',  result);
            break;
        }
    } // switch
    
    
    
    // Return OK:
    return Response.json({
        ok: true,
    });
}

// reusable-ui core:
import {
    decimalify,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// models:
import {
    // types:
    type CreateOrderOptions,
    type AuthorizedFundData,
    type PaymentDetail,
    
    
    
    // utilities:
    isAuthorizedFundData,
}                           from '@/models'

// utilities:
import {
    trimNumber,
}                           from '@/libs/formatters'

// stripe:
import {
    Stripe,
}                           from 'stripe'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



const stripe = !process.env.STRIPE_SECRET ? undefined : new Stripe(process.env.STRIPE_SECRET);



export const stripeCreateOrder = async (options: CreateOrderOptions): Promise<AuthorizedFundData> => {
    if (!stripe) throw Error('stripe is not loaded');
    
    
    
    const {
        currency,
        totalCostConverted,
        totalProductPriceConverted,
        totalShippingCostConverted,
        
        detailedItems,
        
        hasShippingAddress,
        shippingAddress,
    } = options;
    
    
    
    const paymentIntent = await stripe.paymentIntents.create({
        currency       : currency.toLowerCase(),
        amount         : Math.ceil(totalCostConverted * 100), // TODO: fix this
        
        shipping       : !shippingAddress ? undefined : {
            address : {
                country     : shippingAddress.country,
                state       : shippingAddress.state,
                city        : shippingAddress.city,
                postal_code : shippingAddress.zip ?? undefined,
                line1       : shippingAddress.address,
                line2       : undefined,
            },
            name            : (shippingAddress.firstName ?? '') + ((!!shippingAddress.firstName && !!shippingAddress.lastName) ? ' ' : '') + (shippingAddress.lastName ?? ''),
            phone           : shippingAddress.phone,
        },
        // capture_method : 'manual'
    });
    const {
        client_secret,
    } = paymentIntent;
    
    
    
    return {
        paymentId    : client_secret, // to be confirmed on the client_side
        redirectData : undefined,     // no redirectData required
    } as AuthorizedFundData;
}



export const stripeCaptureFund = async (paymentId: string): Promise<PaymentDetail|undefined> => {
    if (!stripe) throw Error('stripe is not loaded');
    
    
    
    const paymentIntent = await stripe.paymentIntents.capture(paymentId);
    if (paymentIntent.status !== 'succeeded') return undefined;
    
    
    
    const {
        payment_method,
        
        amount_received,
        application_fee_amount,
    } = paymentIntent;
    const paymentDetailPartial = ((): Pick<PaymentDetail, 'type'|'brand'|'identifier'> => {
        if (payment_method && (typeof(payment_method) === 'object')) {
            /* PAY WITH CARD */
            if (payment_method.card) return {
                type       : 'CARD',
                brand      : payment_method.card.brand,
                identifier : payment_method.card.last4,
            };
        } // if
        
        
        
        /* PAY WITH OTHER */
        return {
            type       : 'CUSTOM',
            brand      : null,
            identifier : null,
        };
    })();
    return {
        ...paymentDetailPartial,
        
        amount : amount_received,
        fee    : application_fee_amount ?? 0,
    } satisfies PaymentDetail;
}
export const stripeCancelOrder = async (paymentId: string): Promise<boolean> => {
    if (!stripe) throw Error('stripe is not loaded');
    
    
    
    const paymentIntent = await stripe.paymentIntents.cancel(paymentId);
    return (paymentIntent.status === 'canceled');
}


const isStripePaymentMethod = (paymentMethod: string|Stripe.PaymentMethod|null) : paymentMethod is Stripe.PaymentMethod => !!paymentMethod && (typeof(paymentMethod) === 'object');

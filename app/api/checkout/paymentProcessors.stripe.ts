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
    if (!stripe) throw Error('not implemented');
    
    
    
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

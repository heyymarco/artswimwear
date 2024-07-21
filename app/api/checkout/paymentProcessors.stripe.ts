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



export const stripeCreateOrder = async (cardToken: string, options: CreateOrderOptions): Promise<AuthorizedFundData|PaymentDetail> => {
    if (!stripe) throw Error('not implemented');
    
    
    
    const paymentIntent = await stripe.paymentIntents.create({
        confirm            : true,
        currency           : options.currency.toLowerCase(),
        amount             : options.totalCostConverted,
        confirmation_token : cardToken,
    });
    const {
        id,
        status,
        client_secret,
        
        amount,
        application_fee_amount,
        
        payment_method,
    } = paymentIntent;
    
    
    
    switch (status) {
        case 'requires_action': return {
            paymentId    : id,
            redirectData : client_secret ?? undefined,
        } satisfies AuthorizedFundData;
        
        
        
        case 'succeeded': return {
            type       : (!payment_method || (typeof(payment_method) !== 'object') || !payment_method.card) ? 'CUSTOM' : 'CARD',
            brand      : (!payment_method || (typeof(payment_method) !== 'object') || !payment_method.card) ? null : payment_method.card.brand,
            identifier : (!payment_method || (typeof(payment_method) !== 'object') || !payment_method.card) ? null : payment_method.card.last4,
            
            amount     : amount,
            fee        : application_fee_amount ?? 0,
        } satisfies PaymentDetail;
        
        
        
        // case 'canceled':
        // case 'processing':
        // case 'requires_capture':
        // case 'requires_confirmation':
        // case 'requires_payment_method':
        
        
        
        default: {
            console.log('unexpected response: ', paymentIntent);
            throw Error('unexpected API response');
        }
    } // switch
}

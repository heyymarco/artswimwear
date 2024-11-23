// react:
import {
    // react:
    type default as React,
}                           from 'react'

// payment components:
import {
    type Stripe,
}                           from '@stripe/stripe-js'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



export const stripeEnabled = checkoutConfigClient.payment.processors.stripe.enabled;
export const clientId      = process.env.NEXT_PUBLIC_STRIPE_ID ?? '';
export let stripeCacheRef : React.MutableRefObject<Stripe|null> = { current: null };

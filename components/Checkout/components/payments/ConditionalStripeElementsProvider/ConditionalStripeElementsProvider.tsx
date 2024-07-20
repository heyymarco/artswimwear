'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// stripe:
import {
    type Stripe,
    type StripeElementsOptions,
    type StripeElementLocale,
    loadStripe,
}                           from '@stripe/stripe-js'
import {
    Elements,
}                           from '@stripe/react-stripe-js'
import {
    IsInStripeElementsProviderContextProvider,
}                           from './states/isInStripeElementsProvider'

// internals:
import {
    // states:
    useCartState,
}                           from '@/components/Cart'
import {
    useCheckoutState,
}                           from '../../../states/checkoutState'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



// utilities:
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripeEnabled = checkoutConfigClient.payment.processors.stripe.enabled;
const clientId      = process.env.NEXT_PUBLIC_STRIPE_ID ?? '';
const stripePromise : Promise<Stripe|null> = (stripeEnabled && !!clientId) ? loadStripe(clientId) : Promise.resolve(null);



const ConditionalStripeElementsProvider = ({children}: React.PropsWithChildren) => {
    // conditions:
    if (
        !stripeEnabled
        ||
        !clientId
    ) {
        // jsx:
        return (
            <>
                {children}
            </>
        );
    } // if
    
    
    
    // jsx:
    return (
        <ImplementedStripeElementsProvider>
            {children}
        </ImplementedStripeElementsProvider>
    );
}
interface ImplementedStripeElementsProviderProps {
    // children:
    children : React.ReactNode
}
const ImplementedStripeElementsProvider = (props: ImplementedStripeElementsProviderProps) => {
    // props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // states:
    const {
        // accessibilities:
        currency,
        
        
        
        // cart data:
        productPriceParts,
    } = useCartState();
    
    const {
        // shipping data:
        totalShippingCost,
    } = useCheckoutState();
    
    
    
    // options:
    const stripeOptions = useMemo<StripeElementsOptions>(() => ({
        currency : checkoutConfigClient.payment.processors.stripe.supportedCurrencies.includes(currency) ? currency.toLowerCase() : 'usd',
        amount   : totalShippingCost ?? 0,
        mode     : 'payment',
        locale   : checkoutConfigClient.intl.locale as StripeElementLocale,
    }), [clientId, currency]);
    
    
    
    // jsx:
    return (
        <Elements
            stripe={stripePromise}
            options={stripeOptions}
        >
            <IsInStripeElementsProviderContextProvider>
                {children}
            </IsInStripeElementsProviderContextProvider>
        </Elements>
    );
};
export {
    ConditionalStripeElementsProvider,            // named export for readibility
    ConditionalStripeElementsProvider as default, // default export to support React.lazy
};

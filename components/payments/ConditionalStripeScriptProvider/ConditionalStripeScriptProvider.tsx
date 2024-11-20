'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useMountedFlag,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// payment components:
import {
    type Stripe,
    type StripeElementsOptions,
    type StripeElementLocale,
    loadStripe,
}                           from '@stripe/stripe-js'
import {
    Elements,
}                           from '@stripe/react-stripe-js'

// cart components:
import {
    // states:
    useCartState,
}                           from '@/components/Cart'

// checkout components:
import {
    useCheckoutState,
}                           from '@/components/Checkout/states/checkoutState'

// models:
import {
    type ProductPricePart,
}                           from '@/models'

// utilities:
import {
    convertAndSumAmount,
}                           from '@/libs/currencyExchanges'
import {
    convertCurrencyToStripeNominal,
}                           from '@/libs/currencyExchanges-stripe'

// internals:
import {
    IsInStripeScriptProviderContextProvider,
}                           from './states/isInStripeScriptProvider'

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



const ConditionalStripeScriptProvider = ({children}: React.PropsWithChildren) => {
    // states:
    const {
        // accessibilities:
        currency,
        
        
        
        // cart data:
        productPriceParts,
    } = useCartState();
    
    const {
        // shipping data:
        isShippingAddressRequired,
        shippingProviderId,
        totalShippingCost,
    } = useCheckoutState();
    
    
    
    // states:
    const [convertedAmount, setConvertedAmount] = useState<number|null|undefined>(undefined);
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if ((productPriceParts === undefined) || (totalShippingCost === undefined)) {
            setConvertedAmount(undefined);
            return;
        } // if
        const amountList : Array<ProductPricePart|number|null|undefined> = [
            ...productPriceParts,
            totalShippingCost,
        ];
        if (!amountList.length) { // empty => nothing to convert
            setConvertedAmount(undefined);
            return;
        } // if
        
        
        
        // actions:
        (async () => {
            const summedAmount = await convertAndSumAmount(amountList, currency);
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            setConvertedAmount(summedAmount);
        })();
    }, [
        productPriceParts,
        totalShippingCost,
        
        currency,
    ]);
    
    
    
    // conditions:
    if (
        !stripeEnabled
        ||
        !clientId
        ||
        !checkoutConfigClient.payment.processors.stripe.supportedCurrencies.includes(currency) // the selected currency is not supported
        ||
        (isShippingAddressRequired && (shippingProviderId === null)) // physical_product => requires shippingProvider BUT NO shippingProvider selected
        ||
        (convertedAmount === undefined) // the conversion is not yet ready
        ||
        (convertedAmount === null) // the totalOrder cost is 0 (free) => nothing to pay
        ||
        (convertedAmount === 0)    // the totalOrder cost is 0 (free) => nothing to pay
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
        <ImplementedStripeScriptProvider
            // options:
            currency={currency}
            totalAmount={convertedAmount}
        >
            {children}
        </ImplementedStripeScriptProvider>
    );
}
interface ImplementedStripeScriptProviderProps {
    // options:
    currency    : string
    totalAmount : number
    
    
    
    // children:
    children    : React.ReactNode
}
const ImplementedStripeScriptProvider = (props: ImplementedStripeScriptProviderProps) => {
    // props:
    const {
        // options:
        currency,
        totalAmount,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // options:
    const stripeOptions = useMemo<StripeElementsOptions>(() => ({
        currency : currency.toLowerCase(),
        amount   : convertCurrencyToStripeNominal(totalAmount, currency),
        mode     : 'payment',
        locale   : checkoutConfigClient.intl.locale as StripeElementLocale,
    }), [currency, totalAmount]);
    
    
    
    // jsx:
    return (
        <Elements
            stripe={stripePromise}
            options={stripeOptions}
        >
            <IsInStripeScriptProviderContextProvider>
                {children}
            </IsInStripeScriptProviderContextProvider>
        </Elements>
    );
};
export {
    ConditionalStripeScriptProvider,            // named export for readibility
    ConditionalStripeScriptProvider as default, // default export to support React.lazy
};

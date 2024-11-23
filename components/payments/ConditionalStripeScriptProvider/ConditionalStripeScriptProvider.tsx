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
import {
    stripeEnabled,
    clientId,
    stripeCacheRef,
}                           from './stripe-caches'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



export interface ConditionalStripeScriptProviderProps {
    // required:
    currency                   : string
    
    
    
    // required for purchasing:
    productPriceParts         ?: ProductPricePart[]
    totalShippingCost         ?: number|null
}
const ConditionalStripeScriptProvider = (props: React.PropsWithChildren<ConditionalStripeScriptProviderProps>) => {
    // props:
    const {
        // required:
        currency,
        
        
        
        // required for purchasing:
        productPriceParts,
        totalShippingCost, // undefined: not selected yet; null: no shipping required (non physical product)
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // states:
    const [stripe, setStripe] = useState<Stripe|null>(() => stripeCacheRef.current);
    const [convertedAmount, setConvertedAmount] = useState<number|null|undefined>(undefined);
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!stripeEnabled) return; // stripe is disabled => ignore
        if (!clientId) return; // stripe's clientId is not configured => ignore
        if (stripe) return; // already loaded => ignore
        
        
        
        // actions:
        loadStripe(clientId)
        .then((stripe) => {
            stripeCacheRef.current = stripe;
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            setStripe(stripe);
        })
    }, [stripe]);
    
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
        !stripe
        ||
        !checkoutConfigClient.payment.processors.stripe.supportedCurrencies.includes(currency) // the selected currency is not supported
        ||
        (convertedAmount === undefined) // the conversion is not yet ready
        ||
        (convertedAmount === null)      // the totalOrder cost is null (free) => nothing to pay
        ||
        (convertedAmount === 0)         // the totalOrder cost is 0    (free) => nothing to pay
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
            // stripe:
            stripe={stripe}
            
            
            
            // options:
            currency={currency}
            totalAmount={convertedAmount}
        >
            {children}
        </ImplementedStripeScriptProvider>
    );
}
interface ImplementedStripeScriptProviderProps {
    // stripe:
    stripe      : Stripe
    
    
    
    // options:
    currency    : string
    totalAmount : number
    
    
    
    // children:
    children    : React.ReactNode
}
const ImplementedStripeScriptProvider = (props: ImplementedStripeScriptProviderProps) => {
    // props:
    const {
        // stripe:
        stripe,
        
        
        
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
            stripe={stripe}
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

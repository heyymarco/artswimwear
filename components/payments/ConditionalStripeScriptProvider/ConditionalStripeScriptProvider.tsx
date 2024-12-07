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
    useCartState,
}                           from '@/components/Cart/states/cartState'

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
    // behaviors:
    saveCardMode ?: boolean
    
    
    
    // required for purchasing:
    totalShippingCost ?: number|null
}
const ConditionalStripeScriptProvider = (props: React.PropsWithChildren<ConditionalStripeScriptProviderProps>) => {
    // props:
    const {
        // behaviors:
        saveCardMode = false,
        
        
        
        // required for purchasing:
        totalShippingCost, // undefined: not selected yet; null: no shipping required (non physical product)
        
        
        
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
        .catch((error: any) => {
            // ignore any error
        });
    }, [stripe]);
    
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (saveCardMode || (productPriceParts === undefined) || (totalShippingCost === undefined)) {
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
        saveCardMode,
        
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
        (
            !saveCardMode
            &&
            (
                (convertedAmount === undefined) // the conversion is not yet ready
                ||
                (convertedAmount === null)      // the totalOrder cost is null (free) => nothing to pay
                ||
                (convertedAmount === 0)         // the totalOrder cost is 0    (free) => nothing to pay
            )
        )
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
            
            
            
            // behaviors:
            saveCardMode={saveCardMode}
            
            
            
            // options:
            currency={currency}
            totalAmount={saveCardMode ? 0 : (convertedAmount as number)}
        >
            {children}
        </ImplementedStripeScriptProvider>
    );
}
interface ImplementedStripeScriptProviderProps
    extends
        // bases
        Pick<ConditionalStripeScriptProviderProps,
            // behaviors:
            |'saveCardMode'
        >
{
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
        // behaviors:
        saveCardMode = false,
        
        
        
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
        amount   : saveCardMode ? undefined : convertCurrencyToStripeNominal(totalAmount, currency),
        mode     : saveCardMode ? 'setup'   : 'payment',
        locale   : checkoutConfigClient.intl.locale as StripeElementLocale,
    }), [saveCardMode, currency, totalAmount]);
    
    
    
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

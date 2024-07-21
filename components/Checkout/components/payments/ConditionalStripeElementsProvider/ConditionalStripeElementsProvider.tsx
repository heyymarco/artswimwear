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

// models:
import {
    type ProductPricePart,
}                           from '@/models'

// internals:
import {
    // states:
    useCartState,
}                           from '@/components/Cart'
import {
    useCheckoutState,
}                           from '../../../states/checkoutState'

// utilities:
import {
    convertAndSumAmount,
}                           from '@/libs/currencyExchanges'
import {
    stripeFormatCurrency,
}                           from './utilities'

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
        shippingProvider,
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
        (isShippingAddressRequired && !shippingProvider) // physical_product => requires shippingProvider BUT NO shippingProvider selected
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
        <ImplementedStripeElementsProvider
            // options:
            currency={currency}
            totalAmount={convertedAmount}
        >
            {children}
        </ImplementedStripeElementsProvider>
    );
}
interface ImplementedStripeElementsProviderProps {
    // options:
    currency    : string
    totalAmount : number
    
    
    
    // children:
    children    : React.ReactNode
}
const ImplementedStripeElementsProvider = (props: ImplementedStripeElementsProviderProps) => {
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
        amount   : stripeFormatCurrency(totalAmount, currency),
        mode     : 'payment',
        locale   : checkoutConfigClient.intl.locale as StripeElementLocale,
    }), [currency, totalAmount]);
    
    
    
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

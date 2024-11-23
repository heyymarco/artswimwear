'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// payment components:
import {
    type PayPalScriptOptions,
}                           from '@paypal/paypal-js'
import {
    PayPalScriptProvider,
}                           from '@paypal/react-paypal-js'

// internals:
import {
    IsInPaypalScriptProviderContextProvider,
}                           from './states/isInPaypalScriptProvider'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



export interface ConditionalPaypalScriptProviderProps {
    // required:
    currency : string
}
const ConditionalPaypalScriptProvider = (props: React.PropsWithChildren<ConditionalPaypalScriptProviderProps>) => {
    // props:
    const {
        // required:
        currency,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // conditions:
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_ID ?? '';
    if (
        !checkoutConfigClient.payment.processors.paypal.enabled
        ||
        !clientId
        ||
        !checkoutConfigClient.payment.processors.paypal.supportedCurrencies.includes(currency) // the selected currency is not supported
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
        <ImplementedPaypalScriptProvider
            // options:
            clientId={clientId}
            currency={currency}
        >
            {children}
        </ImplementedPaypalScriptProvider>
    );
}
interface ImplementedPaypalScriptProviderProps {
    // options:
    clientId : string
    currency : string
    
    
    
    // children:
    children : React.ReactNode
}
const ImplementedPaypalScriptProvider = (props: ImplementedPaypalScriptProviderProps) => {
    // props:
    const {
        // options:
        clientId,
        currency,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // options:
    const paypalOptions = useMemo<PayPalScriptOptions>(() => ({
        clientId         : clientId,
        currency         :  currency.toUpperCase(),
        components       : 'card-fields,buttons',
        // commit           : true,
        // vault            : false,
        // 'data-page-type' : 'product-details',
        
        // UNCOMMENT to test 3DS scenario:
        // buyerCountry     : 'US',
    }), [clientId, currency]);
    
    
    
    // jsx:
    return (
        <PayPalScriptProvider
            options={paypalOptions}
        >
            <IsInPaypalScriptProviderContextProvider>
                {children}
            </IsInPaypalScriptProviderContextProvider>
        </PayPalScriptProvider>
    );
};
export {
    ConditionalPaypalScriptProvider,            // named export for readibility
    ConditionalPaypalScriptProvider as default, // default export to support React.lazy
};

'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// paypal:
import {
    type PayPalScriptOptions,
}                           from '@paypal/paypal-js'
import {
    PayPalScriptProvider,
}                           from '@paypal/react-paypal-js'
import {
    IsInPayPalScriptProviderContextProvider,
}                           from './states/isInPayPalScriptProvider'

// internals:
import {
    // states:
    useCartState,
}                           from '@/components/Cart'
import {
    // types:
    type PaymentSession,
    
    
    
    // states:
    useCheckoutState,
}                           from '../../../states/checkoutState'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



const ConditionalPayPalScriptProvider = ({children}: React.PropsWithChildren) => {
    // states:
    const {
        // accessibilities:
        currency,
    } = useCartState();
    
    const {
        // payment data:
        paymentSession,
    } = useCheckoutState();
    
    
    
    // conditions:
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_ID ?? '';
    if (
        !checkoutConfigClient.payment.processors.paypal.enabled
        ||
        !clientId
        ||
        !paymentSession
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
        <ImplementedPayPalScriptProvider
            // options:
            clientId={clientId}
            paymentSession={paymentSession}
            currency={currency}
        >
            {children}
        </ImplementedPayPalScriptProvider>
    );
}
interface ImplementedPayPalScriptProviderProps {
    // options:
    clientId       : string
    paymentSession : PaymentSession
    currency       : string
    
    
    
    // children:
    children       : React.ReactNode
}
const ImplementedPayPalScriptProvider = (props: ImplementedPayPalScriptProviderProps) => {
    // props:
    const {
        // options:
        clientId,
        paymentSession,
        currency,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // options:
    const paypalOptions = useMemo<PayPalScriptOptions>(() => ({
        'client-id'         : clientId,
        'data-client-token' : paymentSession.token,
        currency            :  currency.toUpperCase(),
        intent              : 'capture',
        components          : 'hosted-fields,buttons',
    }), [clientId, paymentSession, currency]);
    
    
    
    // jsx:
    return (
        <PayPalScriptProvider
            options={paypalOptions}
        >
            <IsInPayPalScriptProviderContextProvider>
                {children}
            </IsInPayPalScriptProviderContextProvider>
        </PayPalScriptProvider>
    );
};
export {
    ConditionalPayPalScriptProvider,            // named export for readibility
    ConditionalPayPalScriptProvider as default, // default export to support React.lazy
};

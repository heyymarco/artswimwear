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

// internals:
import {
    // states:
    useCartState,
}                           from '@/components/Cart'
import {
    // states:
    useCheckoutState,
}                           from '../../states/checkoutState'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



const ConditionalPayPalScriptProvider = ({children}: React.PropsWithChildren) => {
    // states:
    const {
        // payment data:
        paymentToken,
    } = useCheckoutState();
    
    
    
    // conditions:
    const clientId    = process.env.NEXT_PUBLIC_PAYPAL_ID ?? '';
    const clientToken = paymentToken?.paymentToken;
    if (
        !checkoutConfigClient.payment.processors.paypal.enabled
        ||
        !clientId
        ||
        !clientToken
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
            clientToken={clientToken}
        >
            {children}
        </ImplementedPayPalScriptProvider>
    );
}
interface ImplementedPayPalScriptProviderProps {
    // options:
    clientId    : string
    clientToken : string
    
    
    
    // children:
    children    : React.ReactNode
}
const ImplementedPayPalScriptProvider = (props: ImplementedPayPalScriptProviderProps) => {
    // props:
    const {
        // options:
        clientId,
        clientToken,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // states:
    const {
        // accessibilities:
        currency,
    } = useCartState();
    
    
    
    // options:
    const paypalOptions = useMemo<PayPalScriptOptions>(() => ({
        'client-id'         : clientId,
        'data-client-token' : clientToken,
        currency            : checkoutConfigClient.payment.processors.paypal.supportedCurrencies.includes(currency) ? currency : 'USD',
        intent              : 'capture',
        components          : 'hosted-fields,buttons',
    }), [clientId, clientToken, currency]);
    
    
    
    // jsx:
    return (
        <PayPalScriptProvider
            options={paypalOptions}
        >
            {children}
        </PayPalScriptProvider>
    );
};
export {
    ConditionalPayPalScriptProvider,            // named export for readibility
    ConditionalPayPalScriptProvider as default, // default export to support React.lazy
};

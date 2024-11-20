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

// cart components:
import {
    // states:
    useCartState,
}                           from '@/components/Cart'

// checkout components:
import {
    // states:
    useCheckoutState,
}                           from '@/components/Checkout/states/checkoutState'

// models:
import {
    type CheckoutPaymentSessionDetail,
}                           from '@/models'

// internals:
import {
    IsInPayPalScriptProviderContextProvider,
}                           from './states/isInPay_PalScriptProvider'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



const ConditionalPay_PalScriptProvider = ({children}: React.PropsWithChildren) => {
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
    paymentSession : CheckoutPaymentSessionDetail
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
        clientId         : clientId,
        dataClientToken  : paymentSession.paypalSession,
        currency         :  currency.toUpperCase(),
        intent           : 'capture',
        components       : 'card-fields,buttons',
        // commit           : true,
        // vault            : false,
        // 'data-page-type' : 'product-details',
        
        // UNCOMMENT to test 3DS scenario:
        // buyerCountry     : 'US',
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
    ConditionalPay_PalScriptProvider,            // named export for readibility
    ConditionalPay_PalScriptProvider as default, // default export to support React.lazy
};

'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// payment components:
import {
    ConditionalPaypalScriptProvider,
}                           from '@/components/payments/ConditionalPaypalScriptProvider'
import {
    ConditionalStripeScriptProvider,
}                           from '@/components/payments/ConditionalStripeScriptProvider'
import {
    ConditionalMidtransScriptProvider,
}                           from '@/components/payments/ConditionalMidtransScriptProvider'



const ConditionalPaymentScriptProvider = ({children}: React.PropsWithChildren) => {
    // jsx:
    /*
        The <ConditionalStripeScriptProvider> must be on top of <ConditionalPaypalScriptProvider>
        to avoid re-render error from <ConditionalStripeScriptProvider>
        Error:
        Error: Failed to render <PayPalCardFieldsProvider /> component. BraintreeError: Element already contains a Braintree iframe.
    */
    return (
        <ConditionalStripeScriptProvider>
            <ConditionalPaypalScriptProvider>
                <ConditionalMidtransScriptProvider>
                    {children}
                </ConditionalMidtransScriptProvider>
            </ConditionalPaypalScriptProvider>
        </ConditionalStripeScriptProvider>
    );
};
export {
    ConditionalPaymentScriptProvider,            // named export for readibility
    ConditionalPaymentScriptProvider as default, // default export to support React.lazy
}

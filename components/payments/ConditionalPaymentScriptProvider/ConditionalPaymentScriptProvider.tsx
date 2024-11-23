'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// payment components:
import {
    type ConditionalPaypalScriptProviderProps,
    ConditionalPaypalScriptProvider,
}                           from '@/components/payments/ConditionalPaypalScriptProvider'
import {
    type ConditionalStripeScriptProviderProps,
    ConditionalStripeScriptProvider,
}                           from '@/components/payments/ConditionalStripeScriptProvider'
import {
    type ConditionalMidtransScriptProviderProps,
    ConditionalMidtransScriptProvider,
}                           from '@/components/payments/ConditionalMidtransScriptProvider'



export interface ConditionalPaymentScriptProviderProps
    extends
        // bases:
        ConditionalPaypalScriptProviderProps,
        ConditionalStripeScriptProviderProps,
        ConditionalMidtransScriptProviderProps
{
}
const ConditionalPaymentScriptProvider = (props: React.PropsWithChildren<ConditionalPaymentScriptProviderProps>) => {
    const {
        // required:
        currency,
        
        
        
        // required for purchasing:
        productPriceParts,
        totalShippingCost,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // jsx:
    /*
        The <ConditionalStripeScriptProvider> must be on top of <ConditionalPaypalScriptProvider>
        to avoid re-render error from <ConditionalStripeScriptProvider>
        Error:
        Error: Failed to render <PayPalCardFieldsProvider /> component. BraintreeError: Element already contains a Braintree iframe.
    */
    return (
        <ConditionalStripeScriptProvider
            // required:
            currency={currency}
            
            
            
            // required for purchasing:
            productPriceParts={productPriceParts}
            totalShippingCost={totalShippingCost}
        >
            <ConditionalPaypalScriptProvider
                // required:
                currency={currency}
            >
                <ConditionalMidtransScriptProvider
                    // required:
                    currency={currency}
                >
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

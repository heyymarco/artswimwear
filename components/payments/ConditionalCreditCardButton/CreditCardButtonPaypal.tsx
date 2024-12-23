'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// payment components:
import {
    AuthenticatedResult,
}                           from '@/components/payments/states'
import {
    usePaypalCardComposerState,
}                           from '@/components/payments/ConditionalPaypalCardComposerProvider/states/paypalCardComposerState'
import {
    usePayPalCardFields,
}                           from '@paypal/react-paypal-js'
import {
    type ImplementedCreditCardButtonGeneralProps,
    CreditCardButtonGeneral,
}                           from './CreditCardButtonGeneral'

// models:
import {
    // types:
    type PaymentDetail,
    type PlaceOrderDetail,
}                           from '@/models'



// react components:
const CreditCardButtonPaypal   = (props: ImplementedCreditCardButtonGeneralProps): JSX.Element|null => {
    // // states:
    // const {
    //     // billing data:
    //     billingAddress,
    //     
    //     
    //     
    //     // sections:
    //     paymentCardSectionRef,
    // } = useTransactionState();
    
    const {
        signalApprovedOrderIdRef,
    } = usePaypalCardComposerState();
    
    const {
        cardFieldsForm,
    } = usePayPalCardFields();
    
    
    
    // handlers:
    const handlePlaceOrder   = useEvent(async (): Promise<PlaceOrderDetail|PaymentDetail|false> => {
        // conditions:
        // const paymentCardSectionElm = paymentCardSectionRef?.current;
        // if (!paymentCardSectionElm) return false; // payment aborted due to unexpected error
        if (!cardFieldsForm)        return false; // payment aborted due to unexpected error
        
        
        
        // validations:
        const formState = await cardFieldsForm.getState();
        if (!formState.isFormValid) return false; // no need to show invalid fields, already handled by `checkoutState::onTransaction()`
        
        
        
        // submit card data to Paypal_API to get authentication:
        const { promise: promiseApprovedOrderId, resolve: signalApprovedOrderId } = Promise.withResolvers<string|null>();
        signalApprovedOrderIdRef.current = signalApprovedOrderId;
        try {
            await cardFieldsForm.submit(); // triggers <PayPalCardFieldsProvider> => handlePaymentInterfaceStart() => placeOrder()
            
            
            
            const rawOrderId = await promiseApprovedOrderId; // waiting for <PayPalCardFieldsProvider> to approve|decline the payment
            if (rawOrderId === null) return false; // if was error => abort
            const orderId = (
                rawOrderId.startsWith('#PAYPAL_')
                ? rawOrderId              // already prefixed => no need to modify
                : `#PAYPAL_${rawOrderId}` // not     prefixed => modify with prefix #PAYPAL_
            );
            return {
                orderId      : orderId,
                redirectData : undefined,
            } satisfies PlaceOrderDetail;
        }
        catch {
            return false; // payment aborted due to unexpected error
        }
        finally {
            signalApprovedOrderIdRef.current = null; // unref the proxy_resolver
        } // try
    });
    const handleAuthenticate = useEvent(async (placeOrderDetail: PlaceOrderDetail): Promise<AuthenticatedResult|PaymentDetail> => {
        return AuthenticatedResult.AUTHORIZED; // paid => waiting for the payment to be captured on server side
    });
    
    
    
    // jsx:
    return (
        <CreditCardButtonGeneral
            // other props:
            {...props}
            
            
            
            // handlers:
            onPlaceOrder={handlePlaceOrder}
            onAuthenticate={handleAuthenticate}
        />
    );
};
export {
    CreditCardButtonPaypal,            // named export for readibility
    CreditCardButtonPaypal as default, // default export to support React.lazy
}

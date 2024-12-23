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
    useTransactionState,
}                           from '@/components/payments/states'
import {
    useStripe,
    useElements,
}                           from '@stripe/react-stripe-js'
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

// errors:
import {
    ErrorDeclined,
}                           from '@/errors'



// react components:
const CreditCardButtonStripe   = (props: ImplementedCreditCardButtonGeneralProps): JSX.Element|null => {
    // states:
    const {
        // billing data:
        billingAddress,
        
        
        
        // sections:
        paymentCardSectionRef,
        
        
        
        // actions:
        placeOrder,
    } = useTransactionState();
    
    const stripe   = useStripe();
    const elements = useElements();
    
    
    
    // handlers:
    const handlePlaceOrder   = useEvent(async (): Promise<PlaceOrderDetail|PaymentDetail|false> => {
        if (!stripe)                return false; // payment aborted due to unexpected error
        if (!elements)              return false; // payment aborted due to unexpected error
        const cardNumberElement     = elements.getElement('cardNumber');
        if (!cardNumberElement)     return false; // payment aborted due to unexpected error
        const paymentCardSectionElm = paymentCardSectionRef?.current;
        if (!paymentCardSectionElm) return false; // payment aborted due to unexpected error
        
        
        
        // create PaymentMethod using card:
        const {
            error : paymentMethodError,
            paymentMethod,
        } = await stripe.createPaymentMethod({
            type            : 'card',
            card            : cardNumberElement,
            billing_details : (
                !!billingAddress
                ? {
                    address : {
                        country     : billingAddress.country,
                        state       : billingAddress.state,
                        city        : billingAddress.city,
                        postal_code : billingAddress.zip ?? undefined,
                        line1       : billingAddress.address,
                        line2       : undefined,
                    },
                    name            : (billingAddress.firstName ?? '') + ((!!billingAddress.firstName && !!billingAddress.lastName) ? ' ' : '') + (billingAddress.lastName ?? ''),
                    phone           : billingAddress.phone,
                }
                : undefined
            ),
        });
        if (paymentMethodError) {
            throw new ErrorDeclined({ // payment failed due to card declined
                message     : paymentMethodError.message,
                shouldRetry : (paymentMethodError as any).shouldRetry ?? false, // default: please use another card
            });
        } // if
        const cardToken = paymentMethod.id;
        
        
        
        return await placeOrder({
            paymentSource  : 'stripeCard',
            cardToken      : cardToken,
            saveCard       : !!(paymentCardSectionElm.querySelector('input[name="cardSave"]') as HTMLInputElement|null)?.checked,
        });
    });
    const handleAuthenticate = useEvent(async (placeOrderDetail: PlaceOrderDetail): Promise<AuthenticatedResult|PaymentDetail> => {
        if (!stripe)   return AuthenticatedResult.FAILED; // payment failed due to unexpected error
        if (!elements) return AuthenticatedResult.FAILED; // payment failed due to unexpected error
        
        
        
        const clientSecret = placeOrderDetail.redirectData;
        if (clientSecret === undefined) { // if no clientSecret => no need 3ds verification but the payment needs to be captured on server side
            return AuthenticatedResult.AUTHORIZED; // paid => waiting for the payment to be captured on server side
        } // if
        
        
        
        try {
            const {
                error : nextActionError,
                paymentIntent,
                setupIntent,
            } = await stripe.handleNextAction({
                clientSecret : clientSecret,
            });
            if (nextActionError || !(paymentIntent ?? setupIntent)) return AuthenticatedResult.FAILED; // payment failed due to unexpected error
            
            
            
            switch ((paymentIntent ?? setupIntent).status) {
                case 'requires_capture' : return AuthenticatedResult.AUTHORIZED; // paid => waiting for the payment to be captured on server side
                case 'succeeded'        :
                    if (setupIntent) {
                        placeOrderDetail.orderId = `#STRIPE_${setupIntent.id}`;
                        return AuthenticatedResult.AUTHORIZED;                   // if setupIntent => simulates as paid
                    }
                    else {
                        return AuthenticatedResult.CAPTURED;                     // has been CAPTURED (maybe delayed), just needs DISPLAY paid page
                    } // if
                default                 : return AuthenticatedResult.FAILED;     // payment failed due to unexpected error
            } // switch
        }
        catch {
            return AuthenticatedResult.FAILED; // payment failed due to exception
        } // try
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
    CreditCardButtonStripe,            // named export for readibility
    CreditCardButtonStripe as default, // default export to support React.lazy
}

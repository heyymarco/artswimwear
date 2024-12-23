'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useImperativeHandle,
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
    useStripe,
}                           from '@stripe/react-stripe-js'

// models:
import {
    // types:
    type PaymentDetail,
    type PlaceOrderDetail,
}                           from '@/models'



// react components:
export interface ImperativeAuthenticate {
    onAuthenticate: (placeOrderDetail: PlaceOrderDetail) => Promise<AuthenticatedResult|PaymentDetail>
}
export interface ImperativeStripeAuthenticateProps {
    // refs:
    authenticateRef : React.Ref<ImperativeAuthenticate>
}
const ImperativeStripeAuthenticate = (props: ImperativeStripeAuthenticateProps): JSX.Element|null => {
    // props:
    const {
        // refs:
        authenticateRef,
    } = props;
    
    
    
    // api:
    const stripe = useStripe();
    
    
    
    // handlers:
    const handleAuthenticate = useEvent(async (placeOrderDetail: PlaceOrderDetail): Promise<AuthenticatedResult|PaymentDetail> => {
        if (!stripe)   return AuthenticatedResult.FAILED; // payment failed due to unexpected error
        
        
        
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
                        placeOrderDetail.orderId = `#STRIPE_#CAPTURED_${paymentIntent.id}`;
                        return AuthenticatedResult.AUTHORIZED;                   // if paymentIntent => simulates as paid
                    } // if
                default                 : return AuthenticatedResult.FAILED;     // payment failed due to unexpected error
            } // switch
        }
        catch {
            return AuthenticatedResult.FAILED; // payment failed due to exception
        } // try
    });
    
    
    
    // imperatives:
    useImperativeHandle(authenticateRef, () => ({
        onAuthenticate : handleAuthenticate,
    }), []);
    
    
    
    // jsx:
    return null;
};
export {
    ImperativeStripeAuthenticate,            // named export for readibility
    ImperativeStripeAuthenticate as default, // default export to support React.lazy
}

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

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    ButtonWithBusy,
}                           from '../ButtonWithBusy'
import {
    CaptchaDialog,
}                           from '@/components/dialogs/CaptchaDialog'

// internals:
import {
    AuthenticatedResult,
    useCheckoutState,
}                           from '../../states/checkoutState'

// models:
import {
    type PaymentDetail,
    type PlaceOrderRequestOptions,
    type PlaceOrderDetail,
}                           from '@/models'



// react components:
export interface ViewPaymentMethodOtcProps {
    paymentSource : Extract<PlaceOrderRequestOptions['paymentSource'],
        |'manual'
        |'indomaret'
        |'alfamart'
        /* future otc_store goes here */
    >
    storeName     : string
}
const ViewPaymentMethodOtc = (props: ViewPaymentMethodOtcProps): JSX.Element|null => {
    // props:
    const {
        paymentSource,
        storeName,
    } = props;
    
    
    
    // states:
    const {
        // shipping data:
        totalShippingCostStatus,
        
        
        
        // actions:
        startTransaction,
        doPlaceOrder,
    } = useCheckoutState();
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handlePayWithOtc = useEvent(async (): Promise<void> => {
        startTransaction({
            // handlers:
            doPlaceOrder         : async (): Promise<PlaceOrderDetail|PaymentDetail|false> => {
                // conditions:
                const captcha = await showDialog<string>(
                    <CaptchaDialog />
                );
                if (!captcha) return false; // no captcha token => no need further action => aborted
                
                
                
                // createOrder:
                return doPlaceOrder({ // will be immediately paid (always returns `PaymentDetail` or throw `ErrorDeclined`) => no need further action
                    paymentSource : paymentSource,
                    captcha       : captcha,
                });
            },
            doAuthenticate       : async (placeOrderDetail: PlaceOrderDetail): Promise<AuthenticatedResult|PaymentDetail> => {
                // this function should NEVER called because the `doPlaceOrder({paymentSource: 'manual'|'indomaret|alfamart'})` always returns `PaymentDetail` or throw `ErrorDeclined`
                return AuthenticatedResult.FAILED;
            },
            
            
            
            // messages:
            messageFailed        : null, // the payment NEVER rejected
            messageCanceled      : null, // the payment NEVER canceled
            messageExpired       : null, // the payment NEVER expired
            messageDeclined      : (errorMessage) => <>
                <p>
                    Unable to make a transaction.
                </p>
                {!!errorMessage && <p>
                    {errorMessage}
                </p>}
                <p>
                    Please try <strong>another payment method</strong>.
                </p>
            </>,
        });
    });
    
    
    
    // jsx:
    return (
        <>
            <p>
                Pay via <strong>{storeName}</strong>.
            </p>
            <p>
                Click the button below. We will send <em>payment instructions</em> to your (billing) email.
            </p>
            
            <ButtonWithBusy
                // components:
                buttonComponent={
                    <ButtonIcon
                        // appearances:
                        icon='shopping_bag'
                        
                        
                        
                        // variants:
                        gradient={true}
                        
                        
                        
                        // states:
                        enabled={(totalShippingCostStatus !== 'ready') ? false : undefined}
                        
                        
                        
                        // handlers:
                        onClick={handlePayWithOtc}
                    >
                        Pay via {storeName}
                    </ButtonIcon>
                }
            />
        </>
    );
};
export {
    ViewPaymentMethodOtc,            // named export for readibility
    ViewPaymentMethodOtc as default, // default export to support React.lazy
}

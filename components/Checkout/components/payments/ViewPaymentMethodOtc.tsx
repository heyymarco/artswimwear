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
    paymentSource : PlaceOrderRequestOptions['paymentSource']
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
            doPlaceOrder         : async (): Promise<PlaceOrderDetail|true|false> => {
                // conditions:
                const captcha = await showDialog<string>(
                    <CaptchaDialog />
                );
                if (!captcha) return false;
                
                
                
                // createOrder:
                return doPlaceOrder({ // will be immediately paid => no need further action
                    paymentSource : paymentSource,
                    captcha       : captcha,
                });
            },
            doAuthenticate       : async (placeOrderDetail: PlaceOrderDetail): Promise<AuthenticatedResult|PaymentDetail> => {
                // this function should never called because the `doPlaceOrder({paymentSource: 'indomaret|alfamart'})` always returns `true` or throw `ErrorDeclined`
                return AuthenticatedResult.FAILED;
            },
            
            
            
            // messages:
            messageFailed        : null, // never denied
            messageCanceled      : null, // never canceled
            messageExpired       : null, // never expired
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
                Pay at <strong>{storeName} Store</strong>.
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
                        Pay at {storeName} Store
                    </ButtonIcon>
                }
            />
        </>
    );
};
export {
    ViewPaymentMethodOtc,
    ViewPaymentMethodOtc as default,
};

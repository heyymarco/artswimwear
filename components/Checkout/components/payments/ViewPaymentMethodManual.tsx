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
    type PlaceOrderDetail,
}                           from '@/models'



// react components:
const ViewPaymentMethodManual = (): JSX.Element|null => {
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
    const handlePayWithManual = useEvent(async (): Promise<void> => {
        startTransaction({
            // handlers:
            doPlaceOrder         : async (): Promise<PlaceOrderDetail|PaymentDetail|false> => {
                // conditions:
                const captcha = await showDialog<string>(
                    <CaptchaDialog />
                );
                if (!captcha) return false; // no captcha token => failed
                
                
                
                // createOrder:
                return doPlaceOrder({ // will be immediately paid => no need further action
                    paymentSource : 'manual',
                    captcha       : captcha,
                });
            },
            doAuthenticate       : async (placeOrderDetail: PlaceOrderDetail): Promise<AuthenticatedResult|PaymentDetail> => {
                // this function should never called because the `doPlaceOrder({paymentSource: 'manual'})` always returns `true` or throw `ErrorDeclined`
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
                Pay via <strong>bank transfer</strong>.
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
                        onClick={handlePayWithManual}
                    >
                        Pay via Bank Transfer
                    </ButtonIcon>
                }
            />
        </>
    );
};
export {
    ViewPaymentMethodManual,
    ViewPaymentMethodManual as default,
};

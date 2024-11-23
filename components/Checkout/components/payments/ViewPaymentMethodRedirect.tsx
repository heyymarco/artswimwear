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
    RedirectDialog,
}                           from '@/components/dialogs/RedirectDialog'

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
export interface ViewPaymentMethodRedirectProps {
    paymentSource : PlaceOrderRequestOptions['paymentSource']
    appName       : string
}
const ViewPaymentMethodRedirect = (props: ViewPaymentMethodRedirectProps): JSX.Element|null => {
    // props:
    const {
        paymentSource,
        appName,
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
    const handlePayWithRedirect  = useEvent(async (): Promise<void> => {
        startTransaction({
            // handlers:
            doPlaceOrder         : (): Promise<PlaceOrderDetail|true|false> => {
                // createOrder:
                return doPlaceOrder({
                    paymentSource : paymentSource,
                });
            },
            doAuthenticate       : async (placeOrderDetail: PlaceOrderDetail): Promise<AuthenticatedResult|PaymentDetail> => {
                const redirectData = placeOrderDetail.redirectData; // get the unfinished redirectData
                if (!redirectData) return AuthenticatedResult.FAILED; // undefined|empty_string => failed
                
                
                
                const redirectResult = await showDialog<PaymentDetail|false>(
                    <RedirectDialog
                        // accessibilities:
                        title={`Redirecting to ${appName} App`}
                        
                        
                        
                        // resources:
                        appName={appName}
                        redirectUrl={redirectData}
                        paymentId={placeOrderDetail.orderId}
                    />
                );
                switch (redirectResult) {
                    case undefined : return AuthenticatedResult.CANCELED;
                    case false     : return AuthenticatedResult.FAILED;
                } // switch
                return redirectResult;
            },
            
            
            
            // messages:
            messageFailed        : <>
                <p>
                    The transaction has been <strong>denied</strong> by the payment system.
                </p>
                <p>
                    <strong>No funds</strong> have been deducted.
                </p>
                <p>
                    Please try <strong>another payment method</strong>.
                </p>
            </>,
            messageCanceled      : <>
                <p>
                    The transaction has been <strong>canceled</strong> by the user.
                </p>
                <p>
                    <strong>No funds</strong> have been deducted.
                </p>
            </>,
            messageExpired       : <>
                <p>
                    The transaction has been <strong>canceled</strong> due to timeout.
                </p>
                <p>
                    <strong>No funds</strong> have been deducted.
                </p>
            </>,
            messageDeclined      : (errorMessage) => <>
                <p>
                    Unable to make a transaction using {appName} App.
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
                Click the button below. You will be redirected to <strong>{appName} App</strong> to process the payment.
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
                        onClick={handlePayWithRedirect}
                    >
                        Pay with {appName}
                    </ButtonIcon>
                }
            />
        </>
    );
};
export {
    ViewPaymentMethodRedirect,
    ViewPaymentMethodRedirect as default,
};

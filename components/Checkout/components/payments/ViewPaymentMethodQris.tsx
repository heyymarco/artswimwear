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
    QrisDialog,
}                           from '@/components/dialogs/QrisDialog'

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
const ViewPaymentMethodQris = (): JSX.Element|null => {
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
    const handlePayWithQris = useEvent(async (): Promise<void> => {
        startTransaction({
            // handlers:
            doPlaceOrder         : (): Promise<PlaceOrderDetail|PaymentDetail|false> => {
                // createOrder:
                return doPlaceOrder({
                    paymentSource : 'midtransQris',
                });
            },
            doAuthenticate       : async (placeOrderDetail: PlaceOrderDetail): Promise<AuthenticatedResult|PaymentDetail> => {
                const qrisData = placeOrderDetail.redirectData; // get the unfinished redirectData
                if (!qrisData) return AuthenticatedResult.FAILED; // undefined|empty_string => failed
                
                let expiresRaw = placeOrderDetail.expires;
                if (typeof(expiresRaw) === 'string') expiresRaw = new Date(Date.parse(expiresRaw));
                
                
                
                const qrisResult = await showDialog<PaymentDetail|false|0>(
                    <QrisDialog
                        // accessibilities:
                        title='Pay With QRIS'
                        
                        
                        
                        // resources:
                        data={qrisData}
                        expires={expiresRaw}
                        paymentId={placeOrderDetail.orderId}
                    />
                );
                switch (qrisResult) {
                    case 0         : return AuthenticatedResult.EXPIRED;
                    case undefined : return AuthenticatedResult.CANCELED;
                    case false     : return AuthenticatedResult.FAILED;
                } // switch
                return qrisResult;
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
                    Unable to make a transaction using QRIS.
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
                Click the button below. You will be shown a <strong>QRIS code</strong> to scan the payment.
            </p>
            
            <ButtonWithBusy
                // components:
                buttonComponent={
                    <ButtonIcon
                        // appearances:
                        icon='qr_code_scanner'
                        
                        
                        
                        // variants:
                        gradient={true}
                        
                        
                        
                        // states:
                        enabled={(totalShippingCostStatus !== 'ready') ? false : undefined}
                        
                        
                        
                        // handlers:
                        onClick={handlePayWithQris}
                    >
                        Pay with QRIS
                    </ButtonIcon>
                }
            />
        </>
    );
};
export {
    ViewPaymentMethodQris,
    ViewPaymentMethodQris as default,
};

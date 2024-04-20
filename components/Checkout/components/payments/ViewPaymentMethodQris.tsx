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

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewPaymentMethodQris = (): JSX.Element|null => {
    // states:
    const checkoutState = useCheckoutState();
    const {
        // actions:
        doTransaction,
        doPlaceOrder,
        doMakePayment,
    } = checkoutState;
    
    
    
    // dialogs:
    const {
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleError          = useEvent((err: Record<string, unknown>): void => {
        // already handled by `handleCreateOrder()` & `handleFundApproved()`
    });
    
    
    
    // jsx:
    return (
        <>
            <p>
                Click the appropriate QRIS button below. You will be shown a QRIS code to scan the payment.
            </p>
            
            <div className='actionButtons'>
                <ButtonIcon
                    // appearances:
                    icon='qr_code_scanner'
                    
                    
                    
                    // variants:
                    gradient={true}
                    
                    
                    
                    // handlers:
                >
                    <span className='text'>
                        QRIS with GoPay
                    </span>
                </ButtonIcon>
                
                <ButtonIcon
                    // appearances:
                    icon='qr_code_scanner'
                    
                    
                    
                    // variants:
                    gradient={true}
                    
                    
                    
                    // handlers:
                >
                    <span className='text'>
                        QRIS with Airpay Shopee
                    </span>
                </ButtonIcon>
            </div>
        </>
    );
};
export {
    ViewPaymentMethodQris,
    ViewPaymentMethodQris as default,
};

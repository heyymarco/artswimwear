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
}                           from './CaptchaDialog'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewPaymentMethodManual = (): JSX.Element|null => {
    // states:
    const {
        // actions:
        doTransaction,
        doPlaceOrder,
    } = useCheckoutState();
    
    
    
    // dialogs:
    const {
        showDialog,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handlePayWithManual = useEvent(async (): Promise<void> => {
        // conditions:
        const captcha = await showDialog<string>(
            <CaptchaDialog />
        );
        if (!captcha) return;
        
        
        
        doTransaction(async () => {
            try {
                // createOrder:
                await doPlaceOrder({ // will be immediately paid => no need further action
                    paymentSource : 'manual',
                    captcha       : captcha,
                });
            }
            catch (fetchError: any) {
                if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'order' });
            } // try
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

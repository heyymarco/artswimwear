'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    
    
    
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
const ButtonPaymentManual = (): JSX.Element|null => {
    // states:
    const {
        // actions:
        doTransaction,
        doPlaceOrder,
        doMakePayment,
    } = useCheckoutState();
    
    
    
    // dialogs:
    const {
        showDialog,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleFinishOrderButtonClick = useEvent(async () => {
        // conditions:
        const captcha = await showDialog(
            <CaptchaDialog />
        );
        if (!captcha) return;
        console.log('captcha is: ', captcha);
        return;
        
        
        
        doTransaction(async () => {
            try {
                // createOrder:
                const orderId = await doPlaceOrder({paymentSource: 'manual'});
                
                
                
                // then forward the authentication to backend_API to book the order (but not paid yet):
                await doMakePayment(orderId, /*paid:*/false);
            }
            catch (fetchError: any) {
                if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'order' });
            } // try
        });
    });
    
    
    
    // jsx:
    return (
        <ButtonWithBusy
            // components:
            buttonComponent={
                <ButtonIcon
                    // appearances:
                    icon='done'
                    
                    
                    
                    // variants:
                    size='lg'
                    gradient={true}
                    
                    
                    
                    // classes:
                    className='next finishOrder'
                    
                    
                    
                    // handlers:
                    onClick={handleFinishOrderButtonClick}
                >
                    Finish Order
                </ButtonIcon>
            }
        />
    );
};
export {
    ButtonPaymentManual,
    ButtonPaymentManual as default,
};

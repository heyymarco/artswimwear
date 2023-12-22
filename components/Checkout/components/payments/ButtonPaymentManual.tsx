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
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleFinishOrderButtonClick = useEvent(() => {
        doTransaction(async () => {
            try {
                // createOrder:
                const orderId = await doPlaceOrder({paymentSource: 'manual'});
                
                
                
                // then forward the authentication to backend_API to book the order (but not paid yet):
                await doMakePayment(orderId, /*paid:*/false);
            }
            catch (fetchError: any) {
                if (!fetchError?.data?.outOfStockItems) showMessageFetchError({ fetchError, context: 'order' });
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

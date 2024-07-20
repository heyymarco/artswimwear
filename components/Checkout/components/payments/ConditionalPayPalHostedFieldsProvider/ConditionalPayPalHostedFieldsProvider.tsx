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
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    // styles:
    hostedFieldsStyle,
}                           from '../../payments/PayPalHostedFieldWrapper'

// paypal:
import {
    PayPalHostedFieldsProvider,
}                           from '@paypal/react-paypal-js'
import {
    IsInPayPalHostedFieldsProviderContextProvider,
}                           from './states/isInPayPalHostedFieldsProvider'
import {
    useIsInPayPalScriptProvider,
}                           from '../ConditionalPayPalScriptProvider'

// internals:
import {
    // states:
    useCheckoutState,
}                           from '../../../states/checkoutState'



const ConditionalPayPalHostedFieldsProvider = ({children}: React.PropsWithChildren) => {
    // conditions:
    const isInPayPalScriptProvider = useIsInPayPalScriptProvider();
    if (!isInPayPalScriptProvider) {
        // jsx:
        return (
            /* the <div> is for preserving the layout */
            <div>
                {children}
            </div>
        );
    } // if
    
    
    
    // jsx:
    return (
        <ImplementedPayPalHostedFieldsProvider>
            {children}
        </ImplementedPayPalHostedFieldsProvider>
    );
}
interface ImplementedPayPalHostedFieldsProviderProps {
    // children:
    children : React.ReactNode
}
const ImplementedPayPalHostedFieldsProvider = (props: ImplementedPayPalHostedFieldsProviderProps) => {
    // props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // states:
    const {
        // actions:
        doPlaceOrder,
    } = useCheckoutState();
    
    
    
    // dialogs:
    const {
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleCreateOrder = useEvent(async (): Promise<string> => {
        try {
            const draftOrderDetail = await doPlaceOrder();
            if (!draftOrderDetail) throw Error('Oops, an error occured!');
            
            
            
            const rawOrderId = draftOrderDetail.orderId;
            const orderId = (
                rawOrderId.startsWith('#PAYPAL_')
                ? rawOrderId.slice(8) // remove prefix #PAYPAL_
                : rawOrderId
            );
            return orderId;
        }
        catch (fetchError: any) {
            if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'order' });
            throw fetchError;
        } // try
    });
    
    
    
    // jsx:
    return (
        <PayPalHostedFieldsProvider
            // styles:
            styles={hostedFieldsStyle}
            
            
            
            // handlers:
            createOrder={handleCreateOrder}
        >
            <IsInPayPalHostedFieldsProviderContextProvider>
                {children}
            </IsInPayPalHostedFieldsProviderContextProvider>
        </PayPalHostedFieldsProvider>
    );
};
export {
    ConditionalPayPalHostedFieldsProvider,            // named export for readibility
    ConditionalPayPalHostedFieldsProvider as default, // default export to support React.lazy
};

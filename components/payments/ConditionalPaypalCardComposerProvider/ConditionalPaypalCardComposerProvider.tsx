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

// payment components:
import {
    useTransactionState,
}                           from '@/components/payments/states'
import {
    CardFieldsOnApproveData,
}                           from '@paypal/paypal-js'
import {
    PayPalCardFieldsProvider,
}                           from '@paypal/react-paypal-js'
import {
    useIsInPaypalScriptProvider,
}                           from '@/components/payments/ConditionalPaypalScriptProvider'

// internals:
import {
    paypalCardComposerStyle,
}                           from './styles'
import {
    usePaypalCardComposerState,
    PaypalCardComposerStateProvider,
}                           from './states/paypalCardComposerState'



const ConditionalPaypalCardComposerProvider = ({children}: React.PropsWithChildren) => {
    // conditions:
    const isInPaypalScriptProvider = useIsInPaypalScriptProvider();
    if (!isInPaypalScriptProvider) {
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
        <PaypalCardComposerStateProvider>
            <ImplementedPaypalCardComposerProvider>
                {children}
            </ImplementedPaypalCardComposerProvider>
        </PaypalCardComposerStateProvider>
    );
}
interface ImplementedPaypalCardComposerProviderProps {
    // children:
    children : React.ReactNode
}
const ImplementedPaypalCardComposerProvider = (props: ImplementedPaypalCardComposerProviderProps) => {
    // props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // states:
    const {
        // actions:
        onPlaceOrder,
    } = useTransactionState();
    
    const {
        signalApprovedOrderIdRef,
    } = usePaypalCardComposerState();
    
    
    
    // dialogs:
    const {
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handlePaymentInterfaceErrored  = useEvent((error: Record<string, unknown>): void => {
        signalApprovedOrderIdRef.current?.(null); // payment failed
    });
    const handlePaymentInterfaceStart    = useEvent(async (): Promise<string> => {
        try {
            const orderBookedOrPaid = await onPlaceOrder();
            if (!('orderId' in orderBookedOrPaid)) throw Error('Oops, an error occured!'); // immediately paid => unexpected response (that should NOT be happened) => abort            
            
            
            
            const rawOrderId = orderBookedOrPaid.orderId; // get the unfinished orderId
            const orderId = (
                rawOrderId.startsWith('#PAYPAL_')
                ? rawOrderId.slice(8) // remove prefix #PAYPAL_
                : rawOrderId
            );
            return orderId;
        }
        catch (fetchError: any) {
            signalApprovedOrderIdRef.current?.(null); // payment failed
            
            if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'order' });
            throw fetchError;
        } // try
    });
    const handlePaymentInterfaceApproved = useEvent((data: CardFieldsOnApproveData): void => {
        signalApprovedOrderIdRef.current?.(data.orderID); // paid => waiting for the payment to be captured on server side
    });
    
    
    
    // jsx:
    return (
        <PayPalCardFieldsProvider
            // styles:
            style={paypalCardComposerStyle}
            
            
            
            // handlers:
            onError={handlePaymentInterfaceErrored}
            createOrder={handlePaymentInterfaceStart}
            onApprove={handlePaymentInterfaceApproved}
        >
            {children}
        </PayPalCardFieldsProvider>
    );
};
export {
    ConditionalPaypalCardComposerProvider,            // named export for readibility
    ConditionalPaypalCardComposerProvider as default, // default export to support React.lazy
};

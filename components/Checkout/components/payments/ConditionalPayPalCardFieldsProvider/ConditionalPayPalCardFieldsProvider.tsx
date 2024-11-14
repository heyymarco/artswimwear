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
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    // styles:
    cardFieldsStyle,
}                           from '../../payments/PayPalCardFieldWrapper'

// paypal:
import {
    CardFieldsOnApproveData,
}                           from '@paypal/paypal-js'
import {
    PayPalCardFieldsProvider,
}                           from '@paypal/react-paypal-js'
import {
    useIsInPayPalScriptProvider,
}                           from '../ConditionalPayPalScriptProvider'

// internals:
import {
    PayPalCardFieldsStateProvider,
}                           from './states/payPalCardFieldsState'
import {
    // states:
    useCheckoutState,
}                           from '../../../states/checkoutState'



const ConditionalPayPalCardFieldsProvider = ({children}: React.PropsWithChildren) => {
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
        <ImplementedPayPalCardFieldsProvider>
            {children}
        </ImplementedPayPalCardFieldsProvider>
    );
}
interface ImplementedPayPalCardFieldsProviderProps {
    // children:
    children : React.ReactNode
}
const ImplementedPayPalCardFieldsProvider = (props: ImplementedPayPalCardFieldsProviderProps) => {
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
    
    const [approvedOrderId, setApprovedOrderId] = useState<string|undefined>();
    
    
    
    // dialogs:
    const {
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handlePaymentInterfaceErrored  = useEvent((error: Record<string, unknown>) => {
        setApprovedOrderId(undefined);
    });
    const handlePaymentInterfaceStart    = useEvent(async (): Promise<string> => {
        setApprovedOrderId(undefined);
        try {
            const draftOrderDetail = await doPlaceOrder();
            if (draftOrderDetail === true) throw Error('Oops, an error occured!'); // immediately paid => no need further action, that should NOT be happened
            
            
            
            const rawOrderId = draftOrderDetail.orderId; // get the unfinished orderId
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
    const handlePaymentInterfaceApproved = useEvent((data: CardFieldsOnApproveData): void => {
        const orderId = data.orderID;
        setApprovedOrderId(orderId);
    });
    
    
    
    // jsx:
    return (
        <PayPalCardFieldsProvider
            // styles:
            style={cardFieldsStyle}
            
            
            
            // handlers:
            onError={handlePaymentInterfaceErrored}
            createOrder={handlePaymentInterfaceStart}
            onApprove={handlePaymentInterfaceApproved}
        >
            <PayPalCardFieldsStateProvider approvedOrderId={approvedOrderId}>
                {children}
            </PayPalCardFieldsStateProvider>
        </PayPalCardFieldsProvider>
    );
};
export {
    ConditionalPayPalCardFieldsProvider,            // named export for readibility
    ConditionalPayPalCardFieldsProvider as default, // default export to support React.lazy
};

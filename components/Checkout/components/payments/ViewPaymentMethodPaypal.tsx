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

// paypal:
import type {
    CreateOrderData,
    CreateOrderActions,
    OnApproveActions,
    OnApproveData,
    OnShippingChangeActions,
    OnShippingChangeData,
}                           from '@paypal/paypal-js'
import {
    PayPalButtons,
}                           from '@paypal/react-paypal-js'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewPaymentMethodPaypal = (): JSX.Element|null => {
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
    const handleCreateOrder    = useEvent(async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
        try {
            const draftOrderDetail = await doPlaceOrder(data);
            if (!draftOrderDetail) throw Error('Oops, an error occured!');
            return draftOrderDetail.orderId;
        }
        catch (fetchError: any) {
            if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'order' });
            throw fetchError;
        } // try
    });
    const handleFundApproved   = useEvent(async (paypalAuthentication: OnApproveData, actions: OnApproveActions): Promise<void> => {
        doTransaction(async () => {
            try {
                // forward the authentication to backend_API to receive the fund agreement:
                await doMakePayment(paypalAuthentication.orderID, /*paid:*/true);
            }
            catch (fetchError: any) {
                showMessageFetchError({ fetchError, context: 'payment' });
            } // try
        });
    });
    const handleShippingChange = useEvent(async (data: OnShippingChangeData, actions: OnShippingChangeActions): Promise<void> => {
        // prevents the shipping_address DIFFERENT than previously inputed shipping_address:
        const shipping_address = data.shipping_address;
        if (shipping_address) {
            const shippingFieldMap = new Map<string, keyof typeof checkoutState | undefined>([
                ['address_line_1', 'shippingAddress'],
                ['address_line_2', undefined        ],
                ['city'          , 'shippingCity'   ],
                ['admin_area_2'  , 'shippingCity'   ],
                ['state'         , 'shippingZone'   ],
                ['admin_area_1'  , 'shippingZone'   ],
                ['postal_code'   , 'shippingZip'    ],
                ['country_code'  , 'shippingCountry'],
            ]);
            
            
            
            for (const [shippingField, shippingValue] of Object.entries(shipping_address)) {
                if (shippingField === undefined) continue;
                
                
                
                const mappedShippingField = shippingFieldMap.get(shippingField);
                if (mappedShippingField === undefined) {
                    // console.log('unknown shipping field: ', shippingField);
                    return actions.reject();
                } // if
                
                
                
                const originShippingValue = checkoutState[mappedShippingField];
                if (originShippingValue !== shippingValue) {
                    // console.log(`DIFF: ${shippingField} = ${shippingValue} <==> ${mappedShippingField} = ${originShippingValue}`)
                    return actions.reject();
                } // if
            } // for
            
            
            
            return actions.resolve();
        } // if
    });
    const handleError          = useEvent((err: Record<string, unknown>): void => {
        // already handled by `handleCreateOrder()` & `handleFundApproved()`
    });
    
    
    
    // jsx:
    return (
        <>
            <p>
                Click the PayPal button below. You will be redirected to the PayPal website to complete the payment.
            </p>
            
            <PayPalButtons
                // handlers:
                createOrder={handleCreateOrder}
                onApprove={handleFundApproved}
                onShippingChange={handleShippingChange}
                onError={handleError}
            />
        </>
    );
};
export {
    ViewPaymentMethodPaypal,
    ViewPaymentMethodPaypal as default,
};

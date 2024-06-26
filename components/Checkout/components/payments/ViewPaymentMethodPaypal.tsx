'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
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
    OnCancelledActions,
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
        showMessageError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const signalOrderFinishedRef = useRef<(() => void)|undefined>(undefined);
    const handleBeginTransaction = useEvent(() => {
        if (signalOrderFinishedRef.current) return; // already began => ignore
        
        
        
        doTransaction((): Promise<void> => {
            const promiseOrderFinished = new Promise<void>((resolved) => {
                signalOrderFinishedRef.current = resolved;
            });
            return promiseOrderFinished;
        });
    });
    const handleEndTransaction   = useEvent(() => {
        signalOrderFinishedRef.current?.();
        signalOrderFinishedRef.current = undefined;
    });
    
    const handleCreateOrder      = useEvent(async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
        handleBeginTransaction();
        
        
        
        try {
            const draftOrderDetail = await doPlaceOrder(data);
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
            handleEndTransaction();
            
            
            
            if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'order' });
            throw fetchError;
        } // try
    });
    const handleCancelOrder      = useEvent((data: Record<string, unknown>, actions: OnCancelledActions) => {
        try {
            // notify cancel transaction, so the authorized payment will be released:
            const rawOrderId = data.orderID as string;
            const orderId = (
                rawOrderId.startsWith('#PAYPAL_')
                ? rawOrderId              // already prefixed => no need to modify
                : `#PAYPAL_${rawOrderId}` // not     prefixed => modify with prefix #PAYPAL_
            );
            (doMakePayment(orderId, /*paid:*/false, { cancelOrder: true }))
            .catch(() => {
                // ignore any error
            });
            
            
            
            showMessageError({
                error: <>
                    <p>
                        The transaction has been <strong>canceled</strong> by the user.
                    </p>
                    <p>
                        <strong>No funds</strong> have been deducted.
                    </p>
                </>
            });
        }
        finally {
            handleEndTransaction();
        } // try
    });
    const handleFundApproved     = useEvent(async (paypalAuthentication: OnApproveData, actions: OnApproveActions): Promise<void> => {
        try {
            const rawOrderId = paypalAuthentication.orderID;
            const orderId = (
                rawOrderId.startsWith('#PAYPAL_')
                ? rawOrderId              // already prefixed => no need to modify
                : `#PAYPAL_${rawOrderId}` // not     prefixed => modify with prefix #PAYPAL_
            );
            // forward the authentication to backend_API to receive the fund agreement:
            await doMakePayment(orderId, /*paid:*/true);
        }
        catch (fetchError: any) {
            showMessageFetchError({ fetchError, context: 'payment' });
        }
        finally {
            handleEndTransaction();
        } // try
    });
    const handleShippingChange   = useEvent(async (data: OnShippingChangeData, actions: OnShippingChangeActions): Promise<void> => {
        // prevents the shipping_address DIFFERENT than previously inputed shipping_address:
        const shipping_address = data.shipping_address;
        if (shipping_address) {
            const shippingFieldMap = new Map<string, keyof Exclude<typeof checkoutState.shippingAddress, null> | undefined>([
                ['country_code'  , 'country'],
                ['state'         , 'state'  ],
                ['admin_area_1'  , 'state'  ],
                ['city'          , 'city'   ],
                ['admin_area_2'  , 'city'   ],
                ['postal_code'   , 'zip'    ],
                ['address_line_1', 'address'],
                ['address_line_2', undefined],
            ]);
            
            
            
            for (const [shippingField, shippingValue] of Object.entries(shipping_address)) {
                if (shippingField === undefined) continue;
                
                
                
                const mappedShippingField = shippingFieldMap.get(shippingField);
                if (mappedShippingField === undefined) {
                    // console.log('unknown shipping field: ', shippingField);
                    return actions.reject();
                } // if
                
                
                
                const originShippingValue = checkoutState.shippingAddress?.[mappedShippingField];
                if (originShippingValue !== shippingValue) {
                    // console.log(`DIFF: ${shippingField} = ${shippingValue} <==> ${mappedShippingField} = ${originShippingValue}`)
                    return actions.reject();
                } // if
            } // for
            
            
            
            return actions.resolve();
        } // if
    });
    const handleError            = useEvent((err: Record<string, unknown>): void => {
        handleEndTransaction();
        
        
        
        // already handled by `handleCreateOrder()` & `handleFundApproved()`
        console.log('paypal button error', err);
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
                onCancel={handleCancelOrder}
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

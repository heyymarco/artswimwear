'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    Content,
    
    
    
    // status-components:
    Busy,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    MessageError,
}                           from '@/components/MessageError'

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
}                           from '../../../states/checkoutState'

// styles:
import {
    useViewExpressCheckoutStyleSheet,
}                           from './styles/loader'



// react components:
const ViewExpressCheckoutPaypal = (): JSX.Element|null => {
    // styles:
    const styleSheet = useViewExpressCheckoutStyleSheet();
    
    
    
    // states:
    const checkoutState = useCheckoutState();
    const {
        // actions:
        doTransaction,
        doPlaceOrder,
        doMakePayment,
    } = checkoutState;
    
    
    
    // states:
    const enum LoadedState {
        Loading,
        Errored,
        FullyLoaded,
    }
    const [isLoaded  , setIsLoaded  ] = useState<LoadedState>(LoadedState.Loading);
    const [generation, setGeneration] = useState<number>(1);
    
    
    
    // dialogs:
    const {
        showMessageError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleLoaded  = useEvent((): void => {
        setIsLoaded(LoadedState.FullyLoaded);
    });
    const handleErrored = useEvent((): void => {
        // actions:
        setIsLoaded(LoadedState.Errored);
    });
    const handleReload  = useEvent((): void => {
        setIsLoaded(LoadedState.Loading);
        setGeneration((current) => (current + 1));
    });
    
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
    const handleApproved         = useEvent(async (paypalAuthentication: OnApproveData, actions: OnApproveActions): Promise<void> => {
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
    
    
    
    // jsx:
    const isErrored      = (isLoaded === LoadedState.Errored);
    const isLoading      = !isErrored &&               (isLoaded === LoadedState.Loading    );
    const isReady        = !isErrored && !isLoading && (isLoaded === LoadedState.FullyLoaded);
    return (
        <div
            // classes:
            className={styleSheet.main}
        >
            <div className={`${styleSheet.expressCheckout} ${isReady ? '' : 'hidden'}`}>
                <p>
                    Click the PayPal button below. You will be redirected to the PayPal&apos;s website to complete the payment.
                </p>
                
                <PayPalButtons
                    // identifiers:
                    key={generation}
                    
                    
                    
                    // handlers:
                    onInit={handleLoaded}
                    onError={handleErrored}
                    
                    createOrder={handleCreateOrder}
                    onCancel={handleCancelOrder}
                    onApprove={handleApproved}
                    onShippingChange={handleShippingChange}
                />
            </div>
            
            <Content theme='danger' className={`${styleSheet.error} ${isErrored ? '' : 'hidden'}`}>
                <MessageError message={null} onRetry={handleReload} />
            </Content>
            
            <Busy
                // classes:
                className={styleSheet.loading}
                
                
                
                // variants:
                size='lg'
                theme='primary'
                
                
                
                // states:
                expanded={isLoading}
            />
        </div>
    );
};
export {
    ViewExpressCheckoutPaypal,
    ViewExpressCheckoutPaypal as default,
};
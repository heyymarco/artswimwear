'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Indicator,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // layout-components:
    CardBody,
    
    
    
    // status-components:
    Busy,
    
    
    
    // dialog-components:
    ModalCard,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// payment components:
import type {
    PayPalButtonsComponentOptions,
    PayPalButtonOnInit,
    PayPalButtonOnError,
    PayPalButtonCreateOrder,
    PayPalButtonOnCancel,
    PayPalButtonOnApprove,
    PayPalButtonOnShippingAddressChange,
    PayPalButtonOnShippingOptionsChange,
}                           from '@paypal/paypal-js'
import {
    PayPalButtons,
}                           from '@paypal/react-paypal-js'

// internal components:
import {
    MessageError,
}                           from '@/components/MessageError'

// models:
import {
    // types:
    type PaymentDetail,
    type PlaceOrderDetail,
}                           from '@/models'

// internals:
import {
    AuthenticatedResult,
    useCheckoutState,
}                           from '../../../states/checkoutState'

// styles:
import {
    useViewExpressCheckoutStyleSheet,
}                           from './styles/loader'



// styles:
const paypalButtonStyle : PayPalButtonsComponentOptions['style'] = {
    height: 44,
};



// react components:
const ViewExpressCheckoutPaypal = (): JSX.Element|null => {
    // styles:
    const styleSheet = useViewExpressCheckoutStyleSheet();
    
    
    
    // states:
    const checkoutState = useCheckoutState();
    const {
        // states:
        isBusy,
        
        
        
        // shipping data:
        totalShippingCostStatus,
        
        
        
        // actions:
        startTransaction,
        doPlaceOrder,
    } = checkoutState;
    
    
    
    // states:
    const enum LoadedState {
        Loading,
        Errored,
        FullyLoaded,
    }
    const [isLoaded  , setIsLoaded  ] = useState<LoadedState>(LoadedState.Loading);
    const [generation, setGeneration] = useState<number>(1);
    const forceReRender = useMemo(() => [
        generation,
    ], [generation]);
    
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const handlePaymentInterfaceLoaded  = useEvent<PayPalButtonOnInit>((data, actions): void => {
        setIsLoaded(LoadedState.FullyLoaded);
    });
    const handlePaymentInterfaceErrored = useEvent<PayPalButtonOnError>((error): void => {
        /*
            Unable to delegate rendering. Possibly the component is not loaded in the target window.
            
            Error: No ack for postMessage zoid_delegate_paypal_checkout in https://www.sandbox.paypal.com in 10000ms
        */
        
        // actions:
        setIsLoaded(LoadedState.Errored);
        signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.FAILED);
    });
    const handleReload  = useEvent((): void => {
        setIsLoaded(LoadedState.Loading);
        setGeneration((current) => (current + 1));
    });
    
    const signalAuthenticatedOrPaidRef = useRef<((authenticatedResult: AuthenticatedResult|PaymentDetail) => void)|undefined>(undefined);
    const handlePaymentInterfaceStart  = useEvent<PayPalButtonCreateOrder>(async (data, actions): Promise<string> => {
        const {promise: promisePaypalOrderId, resolve: resolvePaypalOrderId, reject: rejectPaypalOrderId} = Promise.withResolvers<string>();
        
        const {promise: promiseAuthenticatedOrPaid , resolve: resolveAuthenticatedOrPaid} = Promise.withResolvers<AuthenticatedResult|PaymentDetail>();
        signalAuthenticatedOrPaidRef.current = (authenticatedResultOrPaymentDetail: AuthenticatedResult|PaymentDetail): void => {
            resolveAuthenticatedOrPaid(authenticatedResultOrPaymentDetail); // invoke the origin_resolver
            signalAuthenticatedOrPaidRef.current = undefined; // now it's resolved => unref the proxy_resolver
        };
        
        startTransaction({ // fire and forget
            // handlers:
            doPlaceOrder         : async (): Promise<PlaceOrderDetail|PaymentDetail|false> => {
                try {
                    const placeOrderDetailOrPaymentDetail = await doPlaceOrder(data);
                    if (!('orderId' in placeOrderDetailOrPaymentDetail)) return false; // immediately paid => unexpected response (that should NOT be happened) => abort
                    
                    
                    
                    const rawOrderId = placeOrderDetailOrPaymentDetail.orderId; // get the DraftOrder's id
                    const orderId = (
                        rawOrderId.startsWith('#PAYPAL_')
                        ? rawOrderId.slice(8) // remove prefix #PAYPAL_
                        : rawOrderId
                    );
                    resolvePaypalOrderId(orderId);
                    
                    
                    
                    return placeOrderDetailOrPaymentDetail; // a DraftOrder has been created
                }
                catch (fetchError: any) { // intercepts the exception
                    // DEL: if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'payment' });
                    rejectPaypalOrderId(fetchError); // the `paypalOrderId` is never resolved because an exception was thrown during DraftOrder creation
                    signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.FAILED); // the authentication is FAILED because an exception was thrown during DraftOrder creation
                    throw fetchError; // re-throw the exception
                } // try
            },
            doAuthenticate       : () => promiseAuthenticatedOrPaid,
            
            
            
            // messages:
            messageFailed        : <>
                <p>
                    Unable to make a transaction using PayPal.
                </p>
                <p>
                    Please try <strong>another payment method</strong>.
                </p>
            </>,
            messageCanceled      : undefined, // use default canceled message
            messageExpired       : undefined, // same as `messageCanceled`
            messageDeclined      : (errorMessage) => <>
                <p>
                    Unable to make a transaction using PayPal.
                </p>
                {!!errorMessage && <p>
                    {errorMessage}
                </p>}
                <p>
                    Please try <strong>another payment method</strong>.
                </p>
            </>,
            messageDeclinedRetry : (errorMessage) => <>
                <p>
                    Unable to make a transaction using PayPal.
                </p>
                {!!errorMessage && <p>
                    {errorMessage}
                </p>}
                <p>
                    Please <strong>try again</strong> in a few minutes.
                </p>
            </>,
        })
        .finally(async () => {
            signalAuthenticatedOrPaidRef.current = undefined; // un-ref
            
            
            
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 400); // wait for a brief moment until the <ModalCard> is fully hidden, so the spinning busy is still visible during collapsing animation
            });
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            setIsProcessing(false);
        });
        
        const paypalOrderId = await promisePaypalOrderId;
        // console.log({paypalOrderId});
        return paypalOrderId;
    });
    const handlePaymentInterfaceAbort    = useEvent<PayPalButtonOnCancel>((data, actions): void => {
        signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.CANCELED);
    });
    const handlePaymentInterfaceApproved = useEvent<PayPalButtonOnApprove>(async (paypalAuthentication, actions): Promise<void> => {
        setIsProcessing(true);
        
        
        
        signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.AUTHORIZED);
    });
    const handleShippingAddressChange    = useEvent<PayPalButtonOnShippingAddressChange>(async (data, actions): Promise<void> => {
        // prevents the shipping_address DIFFERENT than previously inputed shipping_address:
        const shippingAddress = data.shippingAddress;
        if (shippingAddress) {
            // console.log('all fields', shippingAddress);
            const shippingFieldMap = new Map<string, keyof Exclude<typeof checkoutState.shippingAddress, null> | undefined>([
                ['countryCode'   , 'country'],
                ['country_code'  , 'country'],
                ['state'         , 'state'  ],
                ['admin_area_1'  , 'state'  ],
                ['city'          , 'city'   ],
                ['admin_area_2'  , 'city'   ],
                ['postalCode'    , 'zip'    ],
                ['postal_code'   , 'zip'    ],
                ['address_line_1', 'address'],
                ['address_line_2', undefined],
            ]);
            
            
            
            for (const [shippingField, shippingValue] of Object.entries(shippingAddress)) {
                if (shippingField === undefined) continue;
                
                
                
                const mappedShippingField = shippingFieldMap.get(shippingField);
                if (mappedShippingField === undefined) {
                    // console.log('REJECT: unknown shipping field: ', shippingField);
                    return actions.reject();
                } // if
                
                
                
                const originShippingValue = checkoutState.shippingAddress?.[mappedShippingField];
                if (originShippingValue !== shippingValue) {
                    // console.log(`REJECT: ${shippingField} = ${shippingValue} <==> ${mappedShippingField} = ${originShippingValue}`)
                    return actions.reject();
                } // if
            } // for
            
            
            
            // return actions.resolve();
            // actions.buildOrderPatchPayload({}); // nothing to build or patch, we preventing any changes
        } // if
    });
    const handleShippingOptionsChange    = useEvent<PayPalButtonOnShippingOptionsChange>(async (data, actions): Promise<void> => {
        if (data.selectedShippingOption?.type === 'PICKUP') actions.reject();
    });
    
    
    
    // refs:
    const containerRef = useRef<HTMLDivElement|null>(null);
    
    
    
    // jsx:
    const isErrored      = (isLoaded === LoadedState.Errored);
    const isLoading      = !isErrored &&               (isLoaded === LoadedState.Loading    );
    const isReady        = !isErrored && !isLoading && (isLoaded === LoadedState.FullyLoaded);
    return (
        <div
            // refs:
            ref={containerRef}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <div className={`${styleSheet.expressCheckout} ${isReady ? '' : 'hidden'}`}>
                <p>
                    Click the PayPal button below. You will be redirected to the PayPal&apos;s website to complete the payment.
                </p>
                
                <div className={styleSheet.buttonWrapper}>
                    <Indicator
                        className={`${styleSheet.buttonIndicator} paypal`}
                        
                        
                        
                        // states:
                        enabled={(totalShippingCostStatus !== 'ready') ? false : undefined}
                    >
                        <PayPalButtons
                            // identifiers:
                            key={generation}
                            forceReRender={forceReRender}
                            
                            
                            
                            // classes:
                            className={styleSheet.paypalButton}
                            style={paypalButtonStyle}
                            
                            
                            
                            // handlers:
                            onInit={handlePaymentInterfaceLoaded}
                            onError={handlePaymentInterfaceErrored}
                            
                            createOrder={handlePaymentInterfaceStart}
                            onCancel={handlePaymentInterfaceAbort}
                            onApprove={handlePaymentInterfaceApproved}
                            onShippingAddressChange={handleShippingAddressChange}
                            onShippingOptionsChange={handleShippingOptionsChange}
                        />
                    </Indicator>
                </div>
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
            <ModalCard
                // states:
                expanded={isBusy === 'transaction'}
                inheritEnabled={false} // prevents from being seen disabled
                
                
                
                // global stackable:
                viewport={containerRef}
            >
                <CardBody>
                    {!isProcessing && <>
                        <p>
                            A <strong>PayPal&apos;s payment interface</strong> is being displayed.
                        </p>
                        <p>
                            Please follow up on the payment to complete the order.
                        </p>
                    </>}
                    {isProcessing && <p className={styleSheet.processingMessage}>
                        <Busy theme='primary' size='lg' /> Processing your payment...
                    </p>}
                </CardBody>
            </ModalCard>
        </div>
    );
};
export {
    ViewExpressCheckoutPaypal,
    ViewExpressCheckoutPaypal as default,
};

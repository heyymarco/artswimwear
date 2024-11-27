'use client'

// styles:
import {
    useViewExpressCheckoutStyleSheet,
}                           from './styles/loader'
import {
    paypalButtonStyle,
}                           from './styles'

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
import {
    type PayPalButtonOnError,
    type PayPalButtonOnInit,
    type PayPalButtonCreateOrder,
    type PayPalButtonOnCancel,
    type PayPalButtonOnApprove,
    type PayPalButtonOnShippingAddressChange,
    type PayPalButtonOnShippingOptionsChange,
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
    const isMounted = useMountedFlag();
    
    const enum LoadedState {
        Loading,
        Errored,
        FullyLoaded,
    }
    const [isLoaded    , setIsLoaded    ] = useState<LoadedState>(LoadedState.Loading);
    const [generation  , setGeneration  ] = useState<number>(1);
    const forceReRender = useMemo(() => [
        generation,
    ], [generation]);
    
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    
    const signalAuthenticatedOrPaidRef    = useRef<((authenticatedOrPaid: AuthenticatedResult|PaymentDetail) => void)|undefined>(undefined);
    
    
    
    // handlers:
    const handlePaymentInterfaceErrored  = useEvent<PayPalButtonOnError>((error): void => {
        /*
            Unable to delegate rendering. Possibly the component is not loaded in the target window.
            
            Error: No ack for postMessage zoid_delegate_paypal_checkout in https://www.sandbox.paypal.com in 10000ms
        */
        
        setIsLoaded(LoadedState.Errored);
        signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.FAILED); // payment failed due to error
    });
    const handlePaymentInterfaceLoaded   = useEvent<PayPalButtonOnInit>((data, actions): void => {
        setIsLoaded(LoadedState.FullyLoaded);
    });
    const handleReload                   = useEvent((): void => {
        setIsLoaded(LoadedState.Loading);
        setGeneration((current) => (current + 1));
    });
    
    const handlePaymentInterfaceStart    = useEvent<PayPalButtonCreateOrder>(async (data, actions): Promise<string> => {
        const {promise: promisePaypalOrderId, resolve: resolvePaypalOrderId, reject: rejectPaypalOrderId} = Promise.withResolvers<string>();
        
        const {promise: promiseAuthenticatedOrPaid , resolve: resolveAuthenticatedOrPaid} = Promise.withResolvers<AuthenticatedResult|PaymentDetail>();
        signalAuthenticatedOrPaidRef.current = (authenticatedOrPaid: AuthenticatedResult|PaymentDetail): void => { // deref the proxy_resolver
            resolveAuthenticatedOrPaid(authenticatedOrPaid);  // invoke the origin_resolver
            signalAuthenticatedOrPaidRef.current = undefined; // now it's resolved => unref the proxy_resolver
        };
        
        startTransaction({ // fire and forget
            // handlers:
            doPlaceOrder         : async (): Promise<PlaceOrderDetail|PaymentDetail|false> => {
                try {
                    const orderBookedOrPaid = await doPlaceOrder(data);
                    if (!('orderId' in orderBookedOrPaid)) return false; // immediately paid => unexpected response (that should NOT be happened) => abort
                    
                    
                    
                    const rawOrderId = orderBookedOrPaid.orderId; // get the DraftOrder's id
                    const orderId = (
                        rawOrderId.startsWith('#PAYPAL_')
                        ? rawOrderId.slice(8) // remove prefix #PAYPAL_
                        : rawOrderId
                    );
                    resolvePaypalOrderId(orderId);
                    
                    
                    
                    return orderBookedOrPaid satisfies PlaceOrderDetail; // a DraftOrder has been created
                }
                catch (fetchError: any) { // intercepts the exception
                    rejectPaypalOrderId(fetchError); // the `paypalOrderId` is never resolved because an exception was thrown during DraftOrder creation
                    signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.FAILED); // payment failed due to exception
                    throw fetchError; // re-throw the exception
                } // try
            },
            doAuthenticate       : (placeOrderDetail: PlaceOrderDetail) => promiseAuthenticatedOrPaid,
            
            
            
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
        .finally(async () => { // cleanups:
            signalAuthenticatedOrPaidRef.current = undefined; // unref the proxy_resolver
            
            
            
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 400);   // wait for a brief moment until the <ModalCard> is fully hidden, so the spinning busy is still visible during collapsing animation
            });
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            setIsProcessing(false);         // reset the processing status
        });
        
        
        
        return promisePaypalOrderId;
    });
    const handlePaymentInterfaceAbort    = useEvent<PayPalButtonOnCancel>((data, actions): void => {
        signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.CANCELED); // payment failed due to canceled by user
    });
    const handlePaymentInterfaceApproved = useEvent<PayPalButtonOnApprove>(async (paypalAuthentication, actions): Promise<void> => {
        setIsProcessing(true); // paid => waiting for the payment to be captured on server side
        
        
        
        signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.AUTHORIZED); // paid => waiting for the payment to be captured on server side
    });
    const handleShippingAddressChange    = useEvent<PayPalButtonOnShippingAddressChange>(async (data, actions): Promise<void> => {
        // prevents the shipping_address DIFFERENT than previously inputed shipping_address:
        const shippingAddress = data.shippingAddress;
        if (!shippingAddress) return;
        
        
        
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
                actions.reject();
                return;
            } // if
            
            
            
            const originShippingValue = checkoutState.shippingAddress?.[mappedShippingField];
            if (originShippingValue !== shippingValue) {
                // console.log(`REJECT: ${shippingField} = ${shippingValue} <==> ${mappedShippingField} = ${originShippingValue}`)
                actions.reject();
                return;
            } // if
        } // for
        
        
        
        // return actions.resolve();
        // actions.buildOrderPatchPayload({}); // nothing to build or patch, we preventing any changes
    });
    const handleShippingOptionsChange    = useEvent<PayPalButtonOnShippingOptionsChange>(async (data, actions): Promise<void> => {
        if (data.selectedShippingOption?.type === 'PICKUP') actions.reject();
    });
    
    
    
    // refs:
    const containerRef = useRef<HTMLDivElement|null>(null);
    
    
    
    // jsx:
    const isErrored      =                             (isLoaded === LoadedState.Errored    );
    const isLoading      = !isErrored &&               (isLoaded === LoadedState.Loading    );
    const isReady        = !isErrored && !isLoading && (isLoaded === LoadedState.FullyLoaded);
    return (
        <div
            // refs:
            ref={containerRef}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <div
                // classes:
                className={`${styleSheet.expressCheckout} ${isReady ? '' : 'hidden'}`}
            >
                <p>
                    Click the PayPal button below. You will be redirected to the PayPal&apos;s website to complete the payment.
                </p>
                
                <div
                    // classes:
                    className={styleSheet.buttonWrapper}
                >
                    <Indicator
                        // classes:
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
                            onError={handlePaymentInterfaceErrored}
                            onInit={handlePaymentInterfaceLoaded}
                            
                            createOrder={handlePaymentInterfaceStart}
                            onCancel={handlePaymentInterfaceAbort}
                            onApprove={handlePaymentInterfaceApproved}
                            onShippingAddressChange={handleShippingAddressChange}
                            onShippingOptionsChange={handleShippingOptionsChange}
                        />
                    </Indicator>
                </div>
            </div>
            
            <Content
                // variants:
                theme='danger'
                
                
                
                // classes:
                className={`${styleSheet.error} ${isErrored ? '' : 'hidden'}`}
            >
                <MessageError message={null} onRetry={handleReload} />
            </Content>
            
            <Busy
                // variants:
                size='lg'
                theme='primary'
                
                
                
                // classes:
                className={styleSheet.loading}
                
                
                
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
                            Please follow up on the payment instructions to complete the order.
                        </p>
                    </>}
                    {isProcessing && <p className={styleSheet.processingMessage}>
                        <Busy theme='primary' size='lg' expanded={true} /> Processing your payment...
                    </p>}
                </CardBody>
            </ModalCard>
        </div>
    );
};
export {
    ViewExpressCheckoutPaypal,            // named export for readibility
    ViewExpressCheckoutPaypal as default, // default export to support React.lazy
}

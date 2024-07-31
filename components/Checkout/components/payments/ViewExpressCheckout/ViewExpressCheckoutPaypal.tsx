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
    useMountedFlag,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    Content,
    
    
    
    // layout-components:
    CardBody,
    
    
    
    // status-components:
    Busy,
    
    
    
    // dialog-components:
    ModalCard,
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
    PayPalButtonsComponentOptions,
}                           from '@paypal/paypal-js'
import {
    PayPalButtons,
}                           from '@paypal/react-paypal-js'

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
    
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const handleLoaded  = useEvent((): void => {
        setIsLoaded(LoadedState.FullyLoaded);
    });
    const handleErrored = useEvent((): void => {
        /*
            Unable to delegate rendering. Possibly the component is not loaded in the target window.
            
            Error: No ack for postMessage zoid_delegate_paypal_checkout in https://www.sandbox.paypal.com in 10000ms
        */
        
        // actions:
        setIsLoaded(LoadedState.Errored);
        signalAuthenticatedRef.current?.(AuthenticatedResult.FAILED);
    });
    const handleReload  = useEvent((): void => {
        setIsLoaded(LoadedState.Loading);
        setGeneration((current) => (current + 1));
    });
    
    const signalAuthenticatedRef         = useRef<((authenticatedResult: AuthenticatedResult) => void)|undefined>(undefined);
    const handlePaymentInterfaceStart    = useEvent(async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
        const {promise: promisePaypalOrderId, resolve: resolvePaypalOrderId, reject: rejectPaypalOrderId} = ((): ReturnType<typeof Promise.withResolvers<string>> => { // Promise.withResolvers<string>();
            let resolve : ReturnType<typeof Promise.withResolvers<string>>['resolve'];
            let reject  : ReturnType<typeof Promise.withResolvers<string>>['reject' ];
            const promise = new Promise<string>((res, rej) => {
                resolve = res;
                reject  = rej;
            });
            return { promise, resolve: resolve!, reject: reject! };
        })();
        
        const {promise: promiseAuthenticate , resolve: resolveAuthenticate} = ((): ReturnType<typeof Promise.withResolvers<AuthenticatedResult>> => { // Promise.withResolvers<AuthenticatedResult>();
            let resolve : ReturnType<typeof Promise.withResolvers<AuthenticatedResult>>['resolve'];
            let reject  : ReturnType<typeof Promise.withResolvers<AuthenticatedResult>>['reject' ];
            const promise = new Promise<AuthenticatedResult>((res, rej) => {
                resolve = res;
                reject  = rej;
            });
            return { promise, resolve: resolve!, reject: reject! };
        })();
        signalAuthenticatedRef.current = (authenticatedResult: AuthenticatedResult): void => {
            resolveAuthenticate(authenticatedResult);   // invoke the origin_resolver
            signalAuthenticatedRef.current = undefined; // now it's resolved => unref the proxy_resolver
        };
        
        startTransaction({ // fire and forget
            // handlers:
            doPlaceOrder         : async () => {
                try {
                    const draftOrderDetail = await doPlaceOrder(data);
                    if (draftOrderDetail === true) throw Error('Oops, an error occured!'); // immediately paid => no need further action, that should NOT be happened
                    
                    
                    
                    const rawOrderId = draftOrderDetail.orderId; // get the DraftOrder's id
                    const paypalOrderId = (
                        rawOrderId.startsWith('#PAYPAL_')
                        ? rawOrderId.slice(8) // remove prefix #PAYPAL_
                        : rawOrderId
                    );
                    resolvePaypalOrderId(paypalOrderId);
                    
                    
                    
                    return draftOrderDetail; // a DraftOrder has been created
                }
                catch (fetchError: any) { // intercepts the exception
                    // DEL: if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'payment' });
                    rejectPaypalOrderId(fetchError);                 // the `paypalOrderId` is never resolved because an exception was thrown during DraftOrder creation
                    resolveAuthenticate(AuthenticatedResult.FAILED); // the authentication  is FAILED         because an exception was thrown during DraftOrder creation
                    throw fetchError; // re-throw the exception
                } // try
            },
            doAuthenticate       : () => promiseAuthenticate,
            
            
            
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
            signalAuthenticatedRef.current = undefined; // un-ref
            
            
            
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 400); // wait for a brief moment until the <ModalCard> is fully hidden, so the spinning busy is still visible during collapsing animation
            });
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            setIsProcessing(false);
        });
        
        return promisePaypalOrderId;
    });
    const handlePaymentInterfaceAbort    = useEvent((data: Record<string, unknown>, actions: OnCancelledActions) => {
        signalAuthenticatedRef.current?.(AuthenticatedResult.CANCELED);
    });
    const handlePaymentInterfaceApproved = useEvent(async (paypalAuthentication: OnApproveData, actions: OnApproveActions): Promise<void> => {
        setIsProcessing(true);
        
        
        
        signalAuthenticatedRef.current?.(AuthenticatedResult.AUTHORIZED);
    });
    const handleShippingChange           = useEvent(async (data: OnShippingChangeData, actions: OnShippingChangeActions): Promise<void> => {
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
                
                <PayPalButtons
                    // identifiers:
                    key={generation}
                    
                    
                    
                    // classes:
                    className='paypalButton'
                    style={paypalButtonStyle}
                    
                    
                    
                    // handlers:
                    onInit={handleLoaded}
                    onError={handleErrored}
                    
                    createOrder={handlePaymentInterfaceStart}
                    onCancel={handlePaymentInterfaceAbort}
                    onApprove={handlePaymentInterfaceApproved}
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

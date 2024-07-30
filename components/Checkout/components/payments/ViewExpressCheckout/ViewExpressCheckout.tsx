'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
    useState,
    useRef,
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
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    MessageError,
}                           from '@/components/MessageError'

// stores:
import type {
    // types:
    DraftOrderDetail,
}                           from '@/store/features/api/apiSlice'

// stripe:
import {
    type StripeExpressCheckoutElementOptions,
    type StripeExpressCheckoutElementReadyEvent,
    type StripeExpressCheckoutElementClickEvent,
    type StripeExpressCheckoutElementConfirmEvent,
}                           from '@stripe/stripe-js'
import {
    useStripe,
    useElements,
    
    
    
    ExpressCheckoutElement,
}                           from '@stripe/react-stripe-js'

// contexts:
import {
    AuthenticatedResult,
    useCheckoutState,
}                           from '../../../states/checkoutState'

// styles:
import {
    useViewExpressCheckoutStyleSheet,
}                           from './styles/loader'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



// react components:
export type ViewExpressCheckoutType =
    |'googlePay'
    |'applePay'
    |'amazonPay'
    |'paypal'
    |'link'
export interface ViewExpressCheckoutProps {
    // options:
    type        : ViewExpressCheckoutType
    walletName  : string
    websiteName : string
}
const ViewExpressCheckout = (props: ViewExpressCheckoutProps): JSX.Element|null => {
    // props:
    const {
        // options:
        type,
        walletName,
        websiteName,
    } = props;
    
    
    
    // styles:
    const styleSheet = useViewExpressCheckoutStyleSheet();
    
    
    
    // options:
    const options = useMemo<StripeExpressCheckoutElementOptions>(() => ({
        paymentMethods : {
            // reset:
            googlePay : 'never',
            applePay  : 'never',
            amazonPay : 'never',
            link      : 'never',
            paypal    : 'never',
            demoPay   : 'never',
            aliPay    : 'never',
            
            // set:
            [type]    : 'auto',
        },
        layout : {
            maxRows    : 0,
            maxColumns : 1,
            overflow   : 'never',
        },
    }), [type]);
    
    
    
    // states:
    const {
        // states:
        isBusy,
        
        
        
        // shipping data:
        shippingAddress,
        
        
        
        // actions:
        startTransaction,
        doPlaceOrder,
    } = useCheckoutState();
    
    
    
    // states:
    const enum LoadedState {
        Loading,
        Errored,
        NotAvailable,
        FullyLoaded,
    }
    const [isLoaded    , setIsLoaded    ] = useState<LoadedState>(LoadedState.Loading);
    const [generation  , setGeneration  ] = useState<number>(1);
    
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const handleLoaded  = useEvent((event: StripeExpressCheckoutElementReadyEvent) => {
        const availablePaymentMethods = event.availablePaymentMethods;
        setIsLoaded(
            (!!availablePaymentMethods && (Object.entries(availablePaymentMethods).filter(([, enabled]) => !!enabled).length === 1))
            ? LoadedState.FullyLoaded
            : LoadedState.NotAvailable
        );
    });
    const handleErrored = useEvent((): void => {
        // actions:
        setIsLoaded(LoadedState.Errored);
        signalAuthenticatedRef.current?.(AuthenticatedResult.FAILED);
    });
    const handleReload  = useEvent((): void => {
        setIsLoaded(LoadedState.Loading);
        setGeneration((current) => (current + 1));
    });
    
    const stripe                         = useStripe();
    const elements                       = useElements();
    
    const signalAuthenticatedRef         = useRef<((authenticatedResult: AuthenticatedResult) => void)|undefined>(undefined);
    const throwAuthenticatedRef          = useRef<((error: unknown) => void)|undefined>(undefined);
    const draftOrderDetailRef            = useRef<DraftOrderDetail|undefined>(undefined);
    const handlePaymentInterfaceStart    = useEvent((event: StripeExpressCheckoutElementClickEvent): void => {
        const {promise: promiseAuthenticate , resolve: resolveAuthenticate, reject: rejectAuthenticate} = ((): ReturnType<typeof Promise.withResolvers<AuthenticatedResult>> => { // Promise.withResolvers<AuthenticatedResult>();
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
        throwAuthenticatedRef.current = (error: unknown): void => {
            rejectAuthenticate(error);
            throwAuthenticatedRef.current = undefined; // now it's thrown => unref the proxy_resolver
        };
        
        startTransaction({ // fire and forget
            // handlers:
            doPlaceOrder         : async () => { // if returns `DraftOrderDetail` => assumes a DraftOrder has been created
                if (!stripe)   throw Error('Oops, an error occured!');
                if (!elements) throw Error('Oops, an error occured!');
                
                
                
                // collect customer details and display line items:
                event.resolve({
                    // generals:
                    business                 : {
                        name                 : checkoutConfigClient.business.name,
                    },
                    
                    
                    
                    // TODO:
                    // // cart data:
                    // lineItems                : [
                    //     //
                    // ],
                    
                    
                    
                    // customer data:
                    emailRequired            : false,     // use own customer data
                    phoneNumberRequired      : false,     // use own customer data
                    
                    
                    
                    // shipping data:
                    shippingAddressRequired  : false,     // use own shippingAddress data
                    allowedShippingCountries : undefined, // use own shippingAddress data
                    shippingRates            : undefined, // use own shippingAddress data
                    
                    
                    
                    // billing data:
                    billingAddressRequired   : true,      // we don't show billingAddress on express checkout, so we need a billingAddress data
                });
                
                
                
                return {
                    orderId : '', // empty string, will be updated later on `doAuthenticate()`
                } as DraftOrderDetail;
            },
            doAuthenticate       : (draftOrderDetail) => {
                draftOrderDetailRef.current = draftOrderDetail; // de-ref
                
                return promiseAuthenticate;
            },
            
            
            
            // messages:
            messageFailed        : <>
                <p>
                    Unable to make a transaction using {walletName}.
                </p>
                <p>
                    Please try <strong>another payment method</strong>.
                </p>
            </>,
            messageCanceled      : undefined, // use default canceled message
            messageExpired       : undefined, // same as `messageCanceled`
            messageDeclined      : (errorMessage) => <>
                <p>
                    Unable to make a transaction using {walletName}.
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
                    Unable to make a transaction using {walletName}.
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
            draftOrderDetailRef.current    = undefined; // un-ref
            
            signalAuthenticatedRef.current = undefined; // un-ref
            throwAuthenticatedRef.current  = undefined; // un-ref
            
            
            
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 400); // wait for a brief moment until the <ModalCard> is fully hidden, so the spinning busy is still visible during collapsing animation
            });
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            setIsProcessing(false);
        });
    });
    const handlePaymentInterfaceAbort    = useEvent((event): void => {
        signalAuthenticatedRef.current?.(AuthenticatedResult.CANCELED);
    });
    const handlePaymentInterfaceApproved = useEvent(async (event: StripeExpressCheckoutElementConfirmEvent): Promise<void> => {
        try {
            if (!stripe)   throw Error('Oops, an error occured!');
            if (!elements) throw Error('Oops, an error occured!');
            setIsProcessing(true);
            
            
            
            // submit data to stripe:
            const {
                error : submitError,
            } = await elements.submit();
            if (submitError) {
                /*
                    TODO: sample error
                */
                
                signalAuthenticatedRef.current?.(AuthenticatedResult.FAILED);
                return;
            } // if
            
            
            
            // create PaymentMethod using expressCheckout:
            const {
                error             : paymentMethodError,
                confirmationToken : confirmationTokenObject,
            } = await stripe.createConfirmationToken({
                elements : elements,
                params   : {
                    shipping : !shippingAddress ? undefined : {
                        address : {
                            country     : shippingAddress.country,
                            state       : shippingAddress.state,
                            city        : shippingAddress.city,
                            postal_code : shippingAddress.zip ?? null,
                            line1       : shippingAddress.address,
                            line2       : null,
                        },
                        name            : (shippingAddress.firstName ?? '') + ((!!shippingAddress.firstName && !!shippingAddress.lastName) ? ' ' : '') + (shippingAddress.lastName ?? ''),
                        phone           : shippingAddress.phone,
                    },
                    // billing_details : {
                    // },
                },
            });
            if (paymentMethodError) {
                /*
                    TODO: sample error
                */
                
                signalAuthenticatedRef.current?.(AuthenticatedResult.FAILED);
                return;
            } // if
            const confirmationToken = confirmationTokenObject.id;
            
            
            
            const draftOrderDetail = await doPlaceOrder({
                paymentSource  : 'stripeExpress',
                cardToken      : confirmationToken,
            });
            if (draftOrderDetail === true) { // immediately paid => no need further action
                signalAuthenticatedRef.current?.(AuthenticatedResult.CAPTURED);
                return;
            } // if
            
            
            
            const oldDraftOrderDetail = draftOrderDetailRef.current;
            if (oldDraftOrderDetail) oldDraftOrderDetail.orderId = draftOrderDetail.orderId;
            
            
            
            const clientSecret = draftOrderDetail.redirectData;
            if (clientSecret === undefined) {
                signalAuthenticatedRef.current?.(
                    !draftOrderDetail.orderId        // the rawOrderId to be passed to server_side for capturing the fund, if empty_string => already CAPTURED, no need to AUTHORIZE, just needs DISPLAY paid page
                    ? AuthenticatedResult.CAPTURED   // already CAPTURED (maybe delayed), no need to AUTHORIZE, just needs DISPLAY paid page
                    : AuthenticatedResult.AUTHORIZED // will be manually capture on server_side
                );
                return;
            } // if
            
            
            
            const rawOrderId = draftOrderDetail.orderId;
            const orderId = (
                rawOrderId.startsWith('#STRIPE_')
                ? rawOrderId          // not prefixed => no need to modify
                : rawOrderId.slice(8) // is  prefixed => remove prefix #STRIPE_
            );
            
            
            
            const result = await stripe.confirmPayment({
                clientSecret           : clientSecret,
                confirmParams          : {
                    confirmation_token : confirmationToken,
                    return_url         : `${process.env.APP_URL}/checkout?orderId=${encodeURIComponent(orderId)}`,
                },
                redirect               : 'if_required', // do not redirect for non_redirect_based payment
            });
            signalAuthenticatedRef.current?.(
                result.error
                ? AuthenticatedResult.FAILED
                : AuthenticatedResult.CAPTURED // has been CAPTURED (maybe delayed), just needs DISPLAY paid page // TODO: display confirmed payment
            );
        }
        catch (error: any) {
            throwAuthenticatedRef.current?.(error);
        } // try
    });
    
    
    
    // refs:
    const containerRef = useRef<HTMLDivElement|null>(null);
    
    
    
    // jsx:
    const isErrored      = (isLoaded === LoadedState.Errored);
    const isLoading      = !isErrored &&                                  (isLoaded === LoadedState.Loading     );
    const isNotAvailable = !isErrored && !isLoading &&                    (isLoaded === LoadedState.NotAvailable);
    const isReady        = !isErrored && !isLoading && !isNotAvailable && (isLoaded === LoadedState.FullyLoaded );
    return (
        <div
            // refs:
            ref={containerRef}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <div className={`${styleSheet.expressCheckout} ${isReady ? '' : 'hidden'}`}>
                <p>
                    Click the {walletName} button below. You will be redirected to the {websiteName}&apos;s website to complete the payment.
                </p>
                
                <ExpressCheckoutElement
                    // identifiers:
                    key={generation}
                    
                    
                    
                    // options:
                    options={options}
                    
                    
                    
                    // handlers:
                    onReady={handleLoaded}
                    onLoadError={handleErrored}
                    
                    onClick={handlePaymentInterfaceStart}
                    // onShippingAddressChange={undefined} // never called because we configured it to use own shippingAddress
                    // onShippingRateChange={undefined}    // never called because we configured it to use own shippingAddress
                    onCancel={handlePaymentInterfaceAbort}
                    onEscape={undefined}
                    onConfirm={handlePaymentInterfaceApproved}
                />
            </div>
            
            <p className={`${styleSheet.notAvailable} ${isNotAvailable ? '' : 'hidden'}`}>
                Sorry, this payment method is <strong>not available</strong>.
                <br />
                Please choose another payment method.
            </p>
            
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
                            A <strong>{websiteName}&apos;s payment interface</strong> is being displayed.
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
    ViewExpressCheckout,
    ViewExpressCheckout as default,
};

'use client'

// styles:
import {
    useViewExpressCheckoutStyleSheet,
}                           from './styles/loader'

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
    type StripeExpressCheckoutElementOptions,
    type StripeError,
    type StripeExpressCheckoutElementReadyEvent,
    type StripeExpressCheckoutElementClickEvent,
    type StripeExpressCheckoutElementConfirmEvent,
}                           from '@stripe/stripe-js'
import {
    useStripe,
    useElements,
    
    
    
    ExpressCheckoutElement,
}                           from '@stripe/react-stripe-js'

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
        buttonType : {
            googlePay : 'pay',
            applePay  : 'plain',
            paypal    : 'pay',
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
        totalShippingCostStatus,
        
        
        
        // actions:
        startTransaction,
        doPlaceOrder,
    } = useCheckoutState();
    
    
    
    // states:
    const isMounted = useMountedFlag();
    
    const enum LoadedState {
        Loading,
        Errored,
        NotAvailable,
        FullyLoaded,
    }
    const [isLoaded    , setIsLoaded    ] = useState<LoadedState>(LoadedState.Loading);
    const [generation  , setGeneration  ] = useState<number>(1);
    
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    
    const signalAuthenticatedOrPaidRef    = useRef<((authenticatedOrPaid: AuthenticatedResult|PaymentDetail) => void)|undefined>(undefined);
    
    
    
    // payment components:
    const stripe   = useStripe();
    const elements = useElements();
    
    
    
    // handlers:
    const handlePaymentInterfaceErrored  = useEvent((event: { elementType: 'expressCheckout', error: StripeError }): void => {
        setIsLoaded(LoadedState.Errored);
        signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.FAILED); // payment failed due to error
    });
    const handlePaymentInterfaceLoaded   = useEvent((event: StripeExpressCheckoutElementReadyEvent) => {
        const availablePaymentMethods = event.availablePaymentMethods;
        setIsLoaded(
            (!!availablePaymentMethods && Object.entries(availablePaymentMethods).some(([, enabled]) => !!enabled)) // at least 1 payment method must exist
            ? LoadedState.FullyLoaded
            : LoadedState.NotAvailable
        );
    });
    const handleReload                   = useEvent((): void => {
        setIsLoaded(LoadedState.Loading);
        setGeneration((current) => (current + 1));
    });
    
    const handlePaymentInterfaceStart    = useEvent((event: StripeExpressCheckoutElementClickEvent): void => {
        const {promise: promiseAuthenticatedOrPaid , resolve: resolveAuthenticatedOrPaid} = Promise.withResolvers<AuthenticatedResult|PaymentDetail>();
        signalAuthenticatedOrPaidRef.current = (authenticatedOrPaid: AuthenticatedResult|PaymentDetail): void => { // deref the proxy_resolver
            resolveAuthenticatedOrPaid(authenticatedOrPaid);  // invoke the origin_resolver
            signalAuthenticatedOrPaidRef.current = undefined; // now it's resolved => unref the proxy_resolver
        };
        
        startTransaction({ // fire and forget
            // handlers:
            doPlaceOrder         : async (): Promise<PlaceOrderDetail|PaymentDetail|false> => {
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
                
                
                
                // just returning a dummy `PlaceOrderDetail`, so the `doAuthenticate()` will be invoked by `startTransaction()`:
                return {
                    orderId : '',
                } as PlaceOrderDetail;
            },
            doAuthenticate       : (placeOrderDetail: PlaceOrderDetail) => promiseAuthenticatedOrPaid,
            
            
            
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
        .finally(async () => { // cleanups:
            signalAuthenticatedOrPaidRef.current = undefined; // unref the proxy_resolver
            
            
            
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 400);   // wait for a brief moment until the <ModalCard> is fully hidden, so the spinning busy is still visible during collapsing animation
            });
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            setIsProcessing(false);         // reset the processing status
        });
    });
    const handlePaymentInterfaceAbort    = useEvent((event: { elementType: 'expressCheckout' }): void => {
        signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.CANCELED); // payment failed due to canceled by user
    });
    const handlePaymentInterfaceApproved = useEvent(async (event: StripeExpressCheckoutElementConfirmEvent): Promise<void> => {
        setIsProcessing(true); // paid => waiting for the payment to be captured on server side
        
        
        
        try {
            if (!stripe || !elements) {
                signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.FAILED); // payment failed due to unexpected error
                return;
            } // if
            
            
            
            // submit data to stripe:
            const {
                error : submitError,
            } = await elements.submit();
            if (submitError) {
                signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.FAILED); // payment failed due to unexpected error
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
                signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.FAILED); // payment failed due to unexpected error
                return;
            } // if
            const confirmationToken = confirmationTokenObject.id;
            
            
            
            const placeOrderDetailOrPaymentDetail = await doPlaceOrder({
                paymentSource  : 'stripeExpress',
                cardToken      : confirmationToken,
            });
            if (!('orderId' in placeOrderDetailOrPaymentDetail)) { // immediately paid => no need further action
                signalAuthenticatedOrPaidRef.current?.(placeOrderDetailOrPaymentDetail satisfies PaymentDetail);
                return;
            } // if
            
            
            
            const clientSecret = placeOrderDetailOrPaymentDetail.redirectData;
            if (clientSecret === undefined) {
                signalAuthenticatedOrPaidRef.current?.(
                    !placeOrderDetailOrPaymentDetail.orderId // the rawOrderId to be passed to server_side for capturing the fund, if empty_string => already CAPTURED, no need to AUTHORIZE, just needs DISPLAY paid page
                    ? AuthenticatedResult.CAPTURED           // already CAPTURED (maybe delayed), no need to AUTHORIZE, just needs DISPLAY paid page
                    : AuthenticatedResult.AUTHORIZED         // will be manually capture on server_side
                );
                return;
            } // if
            
            
            
            const result = await stripe.handleNextAction({
                clientSecret : clientSecret,
            });
            /*
                the code below is actually never be called because the webpage is redirected to amazon's website
            */
            if (result.error || !result.paymentIntent) {
                signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.FAILED); // payment failed due to unexpected error
                return;
            } // if
            
            
            
            switch (result.paymentIntent.status) {
                case 'requires_capture':
                    signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.AUTHORIZED); // will be manually capture on server_side
                    break;
                
                
                
                case 'succeeded':
                    signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.CAPTURED); // has been CAPTURED (maybe delayed), just needs DISPLAY paid page
                    break;
                
                
                
                default:
                    signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.FAILED); // payment failed due to unexpected error
            } // switch
            
            
            
            /*
                NOT WORKING:
                
                
                
                const rawOrderId = placeOrderDetail.orderId;
                const orderId = (
                    rawOrderId.startsWith('#STRIPE_')
                    ? rawOrderId.slice(8) // remove prefix #STRIPE_
                    : rawOrderId
                );
                
                
                
                const result = await stripe.confirmPayment({
                    clientSecret           : clientSecret,
                    confirmParams          : {
                        confirmation_token : confirmationToken,
                        return_url         : `${process.env.NEXT_PUBLIC_APP_URL}/checkout?orderId=${encodeURIComponent(orderId)}`,
                    },
                    redirect               : 'if_required', // do not redirect for non_redirect_based payment
                });
                signalAuthenticatedOrPaidRef.current?.(
                    result.error
                    ? AuthenticatedResult.FAILED   // payment failed due to unexpected error
                    : AuthenticatedResult.CAPTURED // has been CAPTURED (maybe delayed), just needs DISPLAY paid page // TODO: display confirmed payment
                );
            */
        }
        catch (error: any) {
            signalAuthenticatedOrPaidRef.current?.(AuthenticatedResult.FAILED); // payment failed due to exception
        } // try
    });
    
    
    
    // refs:
    const containerRef = useRef<HTMLDivElement|null>(null);
    
    
    
    // jsx:
    const isErrored      =                                                (isLoaded === LoadedState.Errored     );
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
            <div
                // classes:
                className={`${styleSheet.expressCheckout} ${isReady ? '' : 'hidden'}`}
            >
                <p>
                    Click the {walletName} button below. You will be redirected to the {websiteName}&apos;s website to complete the payment.
                </p>
                
                <div
                    // classes:
                    className={styleSheet.buttonWrapper}
                >
                    <Indicator
                        // classes:
                        className={styleSheet.buttonIndicator}
                        
                        
                        
                        // states:
                        enabled={(totalShippingCostStatus !== 'ready') ? false : undefined}
                    >
                        <ExpressCheckoutElement
                            // identifiers:
                            key={generation}
                            
                            
                            
                            // options:
                            options={options}
                            
                            
                            
                            // handlers:
                            onLoadError={handlePaymentInterfaceErrored}
                            onReady={handlePaymentInterfaceLoaded}
                            
                            onClick={handlePaymentInterfaceStart}
                            onCancel={handlePaymentInterfaceAbort}
                            onEscape={undefined}
                            onConfirm={handlePaymentInterfaceApproved}
                            // onShippingAddressChange={undefined} // never called because we configured it to use own shippingAddress
                            // onShippingRateChange={undefined}    // never called because we configured it to use own shippingAddress
                        />
                    </Indicator>
                </div>
            </div>
            
            <p
                // classes:
                className={`${styleSheet.notAvailable} ${isNotAvailable ? '' : 'hidden'}`}
            >
                Sorry, this payment method is <strong>not available</strong>.
                <br />
                Please choose another payment method.
            </p>
            
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
                            A <strong>{websiteName}&apos;s payment interface</strong> is being displayed.
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
    ViewExpressCheckout,            // named export for readibility
    ViewExpressCheckout as default, // default export to support React.lazy
}

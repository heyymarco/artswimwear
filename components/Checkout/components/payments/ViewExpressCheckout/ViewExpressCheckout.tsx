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
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    Content,
    
    
    
    // status-components:
    Busy,
    
    
    
    // utility-components:
    useDialogMessage,
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
    useCartState,
}                           from '@/components/Cart/states/cartState'
import {
    useCheckoutState,
}                           from '../../../states/checkoutState'

// internals:
import {
    ErrorDeclined,
}                           from '../ErrorDeclined'

// styles:
import {
    useViewExpressCheckoutStyleSheet,
}                           from './styles/loader'



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
        // cart data:
        productPriceParts,
    } = useCartState();
    
    const checkoutState = useCheckoutState();
    const {
        // shipping data:
        shippingAddress,
        
        
        
        // actions:
        doTransaction,
        doPlaceOrder,
        doMakePayment,
    } = checkoutState;
    
    
    
    // states:
    const enum LoadedState {
        Loading,
        Errored,
        NotAvailable,
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
    });
    const handleReload  = useEvent((): void => {
        setIsLoaded(LoadedState.Loading);
        setGeneration((current) => (current + 1));
    });
    
    const stripe   = useStripe();
    const elements = useElements();
    
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
    
    const handleCreateOrder      = useEvent((event: StripeExpressCheckoutElementClickEvent): void => {
        handleBeginTransaction(); // enters `doTransaction()`
        
        
        
        event.resolve({
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
    });
    const handleCancelOrder      = useEvent((event): void => {
        handleEndTransaction(); // exits `doTransaction()`
    });
    const handleApproved         = useEvent(async (event: StripeExpressCheckoutElementConfirmEvent): Promise<void> => {
        try {
            // createOrder:
            const [draftOrderDetail, confirmationToken] = await proxyDoPlaceOrder();
            if (draftOrderDetail === true) return; // immediately paid => no need further action
            if (!proxyDoNextAction) return; // the nextAction callback is not defined => no need further action
            
            
            
            const rawOrderId = draftOrderDetail.orderId;
            let authenticatedResult : AuthenticatedResult;
            try {
                authenticatedResult = await proxyDoNextAction(draftOrderDetail, confirmationToken); // trigger `authenticate` function
            }
            catch (error: any) { // an unexpected error occured
                // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                handleRevertDraftOrder(rawOrderId);
                
                throw error;
            } // try
            
            
            
            switch (authenticatedResult) {
                case AuthenticatedResult.FAILED     : {
                    // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                    handleRevertDraftOrder(rawOrderId);
                    
                    
                    
                    showMessageError({
                        error: <>
                            <p>
                                Unable to make a transaction using {walletName}.
                            </p>
                            <p>
                                Please try <strong>another payment method</strong>.
                            </p>
                        </>
                    });
                    break;
                }
                
                case AuthenticatedResult.CANCELED   :
                case AuthenticatedResult.EXPIRED    : {
                    // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                    handleRevertDraftOrder(rawOrderId);
                    
                    
                    
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
                    break;
                }
                
                
                
                case AuthenticatedResult.AUTHORIZED : { // will be manually capture on server_side
                    // then forward the authentication to backend_API to receive the fund:
                    await doMakePayment(rawOrderId, /*paid:*/true);
                    break;
                }
                
                
                
                case AuthenticatedResult.PENDING    :
                case AuthenticatedResult.CAPTURED   : { // has been CAPTURED (maybe delayed), just needs DISPLAY paid page
                    // gotoFinished(); // TODO: DISPLAY paid page
                    break;
                }
                
                
                
                default : {
                    // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                    handleRevertDraftOrder(rawOrderId);
                    
                    
                    
                    throw Error('Oops, an error occured!');
                }
            } // switch
        }
        catch (fetchError: any) {
            if ((fetchError instanceof ErrorDeclined) || (fetchError?.status === 402)) {
                showMessageError({
                    error: <>
                        <p>
                            Unable to make a transaction using {walletName}.
                        </p>
                        {!!fetchError.message && <p>
                            {fetchError.message}
                        </p>}
                        {!fetchError.shouldRetry  /* === false */ && <p>
                            Please try <strong>another payment method</strong>.
                        </p>}
                        {!!fetchError.shouldRetry /* === true  */ && <p>
                            Please <strong>try again</strong> in a few minutes.
                        </p>}
                    </>
                });
            }
            else if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'payment' });
            // TODO: re-generate PaypalPaymentSession
        }
        finally {
            handleEndTransaction(); // exits `doTransaction()`
        } // try
    });
    
    const proxyDoPlaceOrder      = useEvent(async (): Promise<[DraftOrderDetail|true, string]> => {
        if (!stripe)   throw Error('Oops, an error occured!');
        if (!elements) throw Error('Oops, an error occured!');
        
        
        
        // submit data to stripe:
        const {
            error : submitError,
        } = await elements.submit();
        if (submitError) {
            /*
                TODO: sample error
            */
            
            throw new ErrorDeclined({
                message     : submitError.message,
                shouldRetry : (submitError as any).shouldRetry ?? false, // default: please use another payment method
            });
        } // if
        
        
        
        // create PaymentMethod using expressCheckout:
        const {
            error : paymentMethodError,
            confirmationToken,
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
            
            throw new ErrorDeclined({
                message     : paymentMethodError.message,
                shouldRetry : (paymentMethodError as any).shouldRetry ?? false, // default: please use another payment method
            });
        } // if
        
        
        
        return [
            await doPlaceOrder({
                paymentSource  : 'stripeExpress',
                cardToken      : confirmationToken.id,
            }),
            confirmationToken.id
        ];
    });
    const enum AuthenticatedResult {
        /**
         * The user is not authenticated until the timeout expires.
         */
        EXPIRED    = -2, // never
        /**
         * The user has decided to cancel the transaction.
         */
        CANCELED   = -1, // never
        /**
         * An error occured.  
         * Unknown error, but usually caused by incorrect configuration.
         */
        FAILED     = 0, // once
        
        /**
         * Requires to capture the funds in server side.
         */
        AUTHORIZED = 1, // once
        /**
         * The transaction was successful but the funds have not yet settled your account.
         */
        PENDING    = 2, // never
        /**
         * The transaction was successful and the funds have settled your account.
         */
        CAPTURED   = 3, // twice
    }
    const proxyDoNextAction      = useEvent(async (draftOrderDetail: DraftOrderDetail, confirmationToken: string): Promise<AuthenticatedResult> => {
        if (!stripe)   throw Error('Oops, an error occured!');
        if (!elements) throw Error('Oops, an error occured!');
        
        
        
        const clientSecret = draftOrderDetail.redirectData;
        if (clientSecret === undefined) return (
            !draftOrderDetail.orderId        // the rawOrderId to be passed to server_side for capturing the fund, if empty_string => already CAPTURED, no need to AUTHORIZE, just needs DISPLAY paid page
            ? AuthenticatedResult.CAPTURED   // already CAPTURED (maybe delayed), no need to AUTHORIZE, just needs DISPLAY paid page
            : AuthenticatedResult.AUTHORIZED // will be manually capture on server_side
        );
        
        
        
        const rawOrderId = draftOrderDetail.orderId;
        const orderId = (
            rawOrderId.startsWith('#STRIPE_')
            ? rawOrderId          // not prefixed => no need to modify
            : rawOrderId.slice(8) // is  prefixed => remove prefix #STRIPE_
        );
        try {
            const result = await stripe.confirmPayment({
                clientSecret : clientSecret,
                confirmParams : {
                    confirmation_token : confirmationToken,
                    return_url         : `${process.env.APP_URL}/checkout?orderId=${encodeURIComponent(orderId)}`,
                },
            });
            if (result.error) return AuthenticatedResult.FAILED;
            return AuthenticatedResult.CAPTURED; // has been CAPTURED (maybe delayed), just needs DISPLAY paid page
        }
        catch {
            throw Error('Oops, an error occured!');
        } // try
    });
    const handleRevertDraftOrder = useEvent((orderId: string): void => {
        // notify to cancel transaction, so the draftOrder (if any) will be reverted:
        doMakePayment(orderId, /*paid:*/false, { cancelOrder: true })
        .catch(() => {
            // ignore any error
        });
    });
    
    
    
    // jsx:
    const isErrored      = (isLoaded === LoadedState.Errored);
    const isLoading      = !isErrored &&                                  (isLoaded === LoadedState.Loading     );
    const isNotAvailable = !isErrored && !isLoading &&                    (isLoaded === LoadedState.NotAvailable);
    const isReady        = !isErrored && !isLoading && !isNotAvailable && (isLoaded === LoadedState.FullyLoaded );
    return (
        <div
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
                    
                    onClick={handleCreateOrder}
                    // onShippingAddressChange={undefined} // never called because we configured it to use own shippingAddress
                    // onShippingRateChange={undefined}    // never called because we configured it to use own shippingAddress
                    onCancel={handleCancelOrder}
                    onEscape={undefined}
                    onConfirm={handleApproved}
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
        </div>
    );
};
export {
    ViewExpressCheckout,
    ViewExpressCheckout as default,
};

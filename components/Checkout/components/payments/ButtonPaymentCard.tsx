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
    // simple-components:
    ButtonIcon,
    
    
    
    // dialog-components:
    PromiseDialog,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    ButtonWithBusy,
}                           from '../ButtonWithBusy'
import {
    IframeDialog,
}                           from '@/components/dialogs/IframeDialog'

// stores:
import type {
    // types:
    DraftOrderDetail,
}                           from '@/store/features/api/apiSlice'

// paypal:
import {
    usePayPalHostedFields,
}                           from '@paypal/react-paypal-js'
import {
    useIsInPayPalScriptProvider,
}                           from './ConditionalPayPalScriptProvider'

// stripe:
import {
    useStripe,
    useElements,
}                           from '@stripe/react-stripe-js'
import {
    useIsInStripeElementsProvider,
}                           from './ConditionalStripeElementsProvider'

// midtrans:
import {
    useIsInMidtransScriptProvider,
}                           from './ConditionalMidtransScriptProvider'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'

// configs:
import {
    type checkoutConfigClient,
}                           from '@/checkout.config.client'



// react components:
const ButtonPaymentCard = (): JSX.Element|null => {
    // states:
    const {
        // shipping data:
        shippingAddress,
        
        
        
        // billing data:
        billingAsShipping,
        
        billingAddress,
        
        
        
        // payment data:
        appropriatePaymentProcessors,
        
        
        
        // sections:
        paymentCardSectionRef,
        
        
        
        // actions:
        doTransaction,
        doPlaceOrder,
        doMakePayment,
    } = useCheckoutState();
    
    const finalBillingAddress = billingAsShipping ? shippingAddress : billingAddress;
    
    
    
    // dialogs:
    const {
        showDialog,
        showMessageError,
        showMessageFetchError,
    } = useDialogMessage();
    const modal3dsRef = useRef<PromiseDialog<boolean|null|undefined>|null>(null);
    
    
    
    const isInPayPalScriptProvider   = useIsInPayPalScriptProvider();
    const isInStripeElementsProvider = useIsInStripeElementsProvider();
    const isInMidtransScriptProvider = useIsInMidtransScriptProvider();
    const supportedCardProcessors    : string[] = (
        ([
            !isInPayPalScriptProvider   ? undefined : 'paypal',
            !isInStripeElementsProvider ? undefined : 'stripe',
            !isInMidtransScriptProvider ? undefined : 'midtrans',
        ] satisfies ((typeof checkoutConfigClient.payment.preferredProcessors[number])|undefined)[])
        .filter((item): item is Exclude<typeof item, undefined> => (item !== undefined))
    );
    const priorityPaymentProcessor   = appropriatePaymentProcessors.find((processor) => supportedCardProcessors.includes(processor)); // find the highest priority payment processor that supports card payment
    const isPayUsingPaypalPriority   = (priorityPaymentProcessor === 'paypal');
    const isPayUsingStripePriority   = (priorityPaymentProcessor === 'stripe');
    const isPayUsingMidtransPriority = (priorityPaymentProcessor === 'midtrans');
    
    
    
    // jsx:
    if (isPayUsingPaypalPriority  ) return <ButtonPaymentCardForPayPal />;
    if (isPayUsingStripePriority  ) return <ButtonPaymentCardForStripe />;
    if (isPayUsingMidtransPriority) return <ButtonPaymentCardForMidtrans />;
    return null;
}
const ButtonPaymentCardForPayPal = (): JSX.Element|null => {
    // states:
    const {
        // shipping data:
        shippingAddress,
        
        
        
        // billing data:
        billingAsShipping,
        
        billingAddress,
        
        
        
        // sections:
        paymentCardSectionRef,
    } = useCheckoutState();
    
    const finalBillingAddress = billingAsShipping ? shippingAddress : billingAddress;
    
    
    
    // handlers:
    const hostedFields      = usePayPalHostedFields();
    
    const proxyDoPlaceOrder = useEvent(async (): Promise<DraftOrderDetail|undefined> => {
        const paymentCardSectionElm = paymentCardSectionRef?.current;
        const paypalDoPlaceOrder    = hostedFields.cardFields?.submit;
        if (!paymentCardSectionElm) return undefined;
        if (!paypalDoPlaceOrder)    return undefined;
        
        
        
        // submit card data to PayPal_API to get authentication:
        const formData = new FormData(paymentCardSectionElm);
        const paypalAuthentication = await paypalDoPlaceOrder({
            // trigger 3D Secure authentication:
            contingencies  : ['SCA_WHEN_REQUIRED'],
            
            cardholderName        : formData.get('cardHolder')?.toString()?.trim(), // cardholder's first and last name
            billingAddress : {
                countryCodeAlpha2 : finalBillingAddress?.country, // country Code
                region            : finalBillingAddress?.state,   // state
                locality          : finalBillingAddress?.city,    // city
                postalCode        : finalBillingAddress?.zip,     // postal Code
                streetAddress     : finalBillingAddress?.address, // street address, line 1
             // extendedAddress   : undefined,                    // street address, line 2 (Ex: Unit, Apartment, etc.)
            },
        });
        /*
            example:
            {
                authenticationReason: undefined
                authenticationStatus: "APPROVED",
                card: {
                    brand: "VISA",
                    card_type: "VISA",
                    last_digits: "7704",
                    type: "CREDIT",
                },
                liabilityShift: undefined
                liabilityShifted: undefined
                orderId: "1N785713SG267310M"
            }
        */
        const rawOrderId = paypalAuthentication.orderId;
        const orderId = (
            rawOrderId.startsWith('#PAYPAL_')
            ? rawOrderId              // already prefixed => no need to modify
            : `#PAYPAL_${rawOrderId}` // not     prefixed => modify with prefix #PAYPAL_
        );
        return {
            orderId      : orderId,
            redirectData : undefined,
        } satisfies DraftOrderDetail;
    });
    
    
    
    // jsx:
    return (
        <ButtonPaymentCardGeneral
            // handlers:
            doPlaceOrder={proxyDoPlaceOrder}
        />
    );
};
const ButtonPaymentCardForStripe = (): JSX.Element|null => {
    // states:
    const {
        // shipping data:
        shippingAddress,
        
        
        
        // billing data:
        billingAsShipping,
        
        billingAddress,
        
        
        
        // actions:
        doPlaceOrder,
    } = useCheckoutState();
    
    const finalBillingAddress = billingAsShipping ? shippingAddress : billingAddress;
    
    
    
    // dialogs:
    const {
        showMessageError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const stripe              = useStripe();
    const elements            = useElements();
    
    const proxyDoPlaceOrder   = useEvent(async (): Promise<DraftOrderDetail|undefined> => {
        if (!stripe)   return undefined;
        if (!elements) return undefined;
        
        
        
        // trigger form validation and wallet collection:
        const {error: submitError} = await elements.submit();
        if (submitError) {
            showMessageError({
                error : <>
                    Oops, there was an error processing your transaction.
                </>
            });
            return undefined;
        } // if
        
        
        
        const {error: tokenizeError, confirmationToken} = await stripe.createConfirmationToken({
            elements,
            params : {
                payment_method_data : {
                    billing_details : !finalBillingAddress ? undefined : {
                        address : {
                            country     : finalBillingAddress.country,
                            state       : finalBillingAddress.state,
                            city        : finalBillingAddress.city,
                            postal_code : finalBillingAddress.zip,
                            line1       : finalBillingAddress.address,
                            line2       : null,
                        },
                        name            : (finalBillingAddress.firstName ?? '') + ((!!finalBillingAddress.firstName && !!finalBillingAddress.lastName) ? ' ' : '') + (finalBillingAddress.lastName ?? ''),
                        phone           : finalBillingAddress.phone,
                    },
                },
                shipping : !shippingAddress ? undefined : {
                    address : {
                        country     : shippingAddress.country,
                        state       : shippingAddress.state,
                        city        : shippingAddress.city,
                        postal_code : shippingAddress.zip,
                        line1       : shippingAddress.address,
                        line2       : null,
                    },
                    name    : (shippingAddress.firstName ?? '') + ((!!shippingAddress.firstName && !!shippingAddress.lastName) ? ' ' : '') + (shippingAddress.lastName ?? ''),
                    phone   : shippingAddress.phone,
                },
            },
        });
        if (tokenizeError) {
            showMessageError({
                error : <>
                    Oops, there was an error processing your transaction.
                </>
            });
            return undefined;
        } // if
        
        
        
        return await doPlaceOrder({
            paymentSource  : 'stripeCard',
            cardToken      : confirmationToken.id,
        });
    });
    const proxyDoAuthenticate = useEvent(async (redirectData: string): Promise<boolean|null|undefined> => {
        if (!stripe)   return false; // payment failed
        if (!elements) return false; // payment failed
        
        
        
        try {
            const result = await stripe.handleNextAction({
                clientSecret : redirectData,
            });
            if (result.error) return false; // payment failed
            return true;; // payment succeeded
        }
        catch {
            return false;
        } // try
    });
    
    
    
    // jsx:
    return (
        <ButtonPaymentCardGeneral
            // handlers:
            doPlaceOrder={proxyDoPlaceOrder}
            doAuthenticate={proxyDoAuthenticate}
        />
    );
};
const ButtonPaymentCardForMidtrans = (): JSX.Element|null => {
    // states:
    const {
        // sections:
        paymentCardSectionRef,
        
        
        
        // actions:
        doPlaceOrder,
    } = useCheckoutState();
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    const modal3dsRef = useRef<PromiseDialog<boolean|null|undefined>|null>(null);
    
    
    
    // handlers:
    const proxyDoPlaceOrder   = useEvent(async (): Promise<DraftOrderDetail|undefined> => {
        const paymentCardSectionElm = paymentCardSectionRef?.current;
        if (!paymentCardSectionElm) return undefined;
        
        
        
        const MidtransNew3ds = (window as any).MidtransNew3ds;
        const cardToken = await new Promise<string>((resolve, reject) => {
            const formData = new FormData(paymentCardSectionElm);
            const card = {
                card_number         : formData.get('cardNumber' )?.toString()?.trim()?.replaceAll(' ', '')?.trim(),
                card_exp_month      : formData.get('cardExpires')?.toString()?.trim()?.split('/')?.[0] || undefined,
                card_exp_year       : formData.get('cardExpires')?.toString()?.trim()?.split('/')?.[1] || undefined,
                card_cvv            : formData.get('cardCvv'    )?.toString()?.trim(),
                // bank_one_time_token : "12345678"
            };
            MidtransNew3ds.getCardToken(card, {
                onSuccess : (response: any) => {
                    resolve(response.token_id);
                },
                onFailure : (response: any) => {
                    const defaultErrorMessage = 'Cannot make transactions with this card. Try using another card.';
                    let errorMessage = response?.validation_messages ?? defaultErrorMessage;
                    if (Array.isArray(errorMessage)) errorMessage = errorMessage?.[0] ?? defaultErrorMessage;
                    reject(
                        Error(errorMessage, {
                            cause : new Response(errorMessage, {
                                headers : {
                                    'Content-Type': 'text/plain',
                                },
                            }),
                        })
                    );
                },
            })
        });
        
        
        
        return await doPlaceOrder({
            paymentSource  : 'midtransCard',
            cardToken      : cardToken,
        });
    });
    const proxyDoAuthenticate = useEvent(async (redirectData: string): Promise<boolean|null|undefined> => {
        return new Promise<boolean|null|undefined>((resolve) => {
            const MidtransNew3ds = (window as any).MidtransNew3ds;
            MidtransNew3ds.authenticate(redirectData, {
                performAuthentication: function(redirectUrl: string){
                    // Implement how you will open iframe to display 3ds authentication redirectUrl to customer
                    modal3dsRef.current = showDialog<boolean|null>(
                        <IframeDialog
                            // accessibilities:
                            title='3DS Verification'
                            
                            
                            
                            // resources:
                            src={redirectUrl}
                        />
                    );
                    modal3dsRef.current.collapseEndEvent().then(({data}) => {
                        resolve(data); // undefined : payment aborted
                        modal3dsRef.current = null;
                    });
                },
                onSuccess: function(response: Response){
                    // 3ds authentication success, implement payment success scenario
                    modal3dsRef.current?.closeDialog(true, 'ui'); // true: payment succeed
                },
                onFailure: function(response: Response){
                    // 3ds authentication failure, implement payment failure scenario
                    modal3dsRef.current?.closeDialog(false, 'ui'); // false     : payment failed
                },
                onPending: function(response: Response){
                    // transaction is pending, transaction result will be notified later via 
                    // HTTP POST notification, implement as you wish here
                    modal3dsRef.current?.closeDialog(null, 'ui'); // null      : payment pending
                    // TODO: handle pending transaction
                },
            });
        });
    });
    
    
    
    // jsx:
    return (
        <ButtonPaymentCardGeneral
            // handlers:
            doPlaceOrder={proxyDoPlaceOrder}
            doAuthenticate={proxyDoAuthenticate}
        />
    );
};
interface ButtonPaymentGeneralProps {
    doPlaceOrder    : () => Promise<DraftOrderDetail|undefined>
    doAuthenticate ?: (redirectData: string) => Promise<boolean|null|undefined>
}
const ButtonPaymentCardGeneral = (props: ButtonPaymentGeneralProps): JSX.Element|null => {
    // props:
    const {
        doPlaceOrder   : proxyDoPlaceOrder,
        doAuthenticate : proxyDoAuthenticate,
    } = props;
    
    
    
    // states:
    const {
        // actions:
        doTransaction,
        doMakePayment,
    } = useCheckoutState();
    
    
    
    // dialogs:
    const {
        showMessageError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handlePayButtonClick = useEvent(async () => {
        doTransaction(async () => {
            try {
                // createOrder:
                const draftOrderDetail = await proxyDoPlaceOrder();
                if (!draftOrderDetail) return; // paid => no need redirection
                
                
                
                const redirectData = draftOrderDetail.redirectData;
                if (redirectData /* not undefined && not empty_string */ && proxyDoAuthenticate) {
                    switch (await proxyDoAuthenticate(redirectData) /* trigger `authenticate` function */) {
                        case undefined: { // payment canceled or expired
                            // notify cancel transaction, so the authorized payment will be released:
                            (doMakePayment(draftOrderDetail.orderId, /*paid:*/false, { cancelOrder: true }))
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
                            return;
                        }
                        
                        
                        
                        case null  :   // payment pending => assumes as payment failed
                        case false : { // payment failed
                            showMessageError({
                                error: <>
                                    <p>
                                        The credit card <strong>verification failed</strong>.
                                    </p>
                                    <p>
                                        <strong>No funds</strong> have been deducted.
                                    </p>
                                    <p>
                                        Please try using another card.
                                    </p>
                                </>
                            });
                            return;
                        }
                    } // switch
                } // if
                
                
                
                // then forward the authentication to backend_API to receive the fund:
                await doMakePayment(draftOrderDetail.orderId, /*paid:*/true);
            }
            catch (fetchError: any) {
                if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'payment' });
                // TODO: re-generate PaypalPaymentSession
            } // try
        });
    });
    
    
    
    // jsx:
    return (
        <ButtonWithBusy
            // components:
            buttonComponent={
                <ButtonIcon
                    // appearances:
                    icon='shopping_bag'
                    
                    
                    
                    // variants:
                    gradient={true}
                    
                    
                    
                    // classes:
                    className='payButton'
                    
                    
                    
                    // handlers:
                    onClick={handlePayButtonClick}
                >
                    Pay Now
                </ButtonIcon>
            }
        />
    );
};
export {
    ButtonPaymentCard,
    ButtonPaymentCard as default,
};

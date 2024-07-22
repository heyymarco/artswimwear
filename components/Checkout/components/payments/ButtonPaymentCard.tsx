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
        // payment data:
        appropriatePaymentProcessors,
    } = useCheckoutState();
    
    
    
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
    
    const proxyDoPlaceOrder = useEvent(async (): Promise<DraftOrderDetail> => {
        const paymentCardSectionElm = paymentCardSectionRef?.current;
        const paypalDoPlaceOrder    = hostedFields.cardFields?.submit;
        if (!paymentCardSectionElm) throw Error('Oops, an error occured!');
        if (!paypalDoPlaceOrder)    throw Error('Oops, an error occured!');
        
        
        
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
    const stripe            = useStripe();
    const elements          = useElements();
    
    const proxyDoPlaceOrder = useEvent(async (): Promise<DraftOrderDetail> => {
        if (!stripe)            throw Error('Oops, an error occured!');
        if (!elements)          throw Error('Oops, an error occured!');
        const cardNumberElement = elements.getElement('cardNumber');
        if (!cardNumberElement) throw Error('Oops, an error occured!');
        
        
        
        const draftOrderDetail = await doPlaceOrder({
            paymentSource  : 'stripeCard',
        });
        if (draftOrderDetail === true) throw Error('Oops, an error occured!'); // immediately paid => no need further action, that should NOT be happened
        
        
        
        // trigger form validation and wallet collection:
        const rawOrderId = draftOrderDetail.orderId;
        const clientSecret = (
            rawOrderId.startsWith('#STRIPE_')
            ? rawOrderId.slice(8) // remove prefix #STRIPE_
            : rawOrderId          // not prefixed => no need to modify
        );
        const {error: submitError, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
            payment_method : {
                card : cardNumberElement,
                billing_details : !finalBillingAddress ? undefined : {
                    address : {
                        country     : finalBillingAddress.country,
                        state       : finalBillingAddress.state,
                        city        : finalBillingAddress.city,
                        postal_code : finalBillingAddress.zip ?? undefined,
                        line1       : finalBillingAddress.address,
                        line2       : undefined,
                    },
                    name            : (finalBillingAddress.firstName ?? '') + ((!!finalBillingAddress.firstName && !!finalBillingAddress.lastName) ? ' ' : '') + (finalBillingAddress.lastName ?? ''),
                    phone           : finalBillingAddress.phone,
                },
            },
        });
        if (submitError) {
            throw Error('Oops, an error occured!');
        } // if
        
        
        /*
            with feature capture_method : 'manual'
            {
                id: "pi_3PfEJUD6SqU8owGY0YZF7VAk",
                object: "payment_intent",
                amount: 2512,
                amount_details: {
                    tip: {
                    },
                },
                automatic_payment_methods: {
                    allow_redirects: "always",
                    enabled: true,
                },
                canceled_at: null,
                cancellation_reason: null,
                capture_method: "manual",
                client_secret: "pi_3PfEJUD6SqU8owGY0YZF7VAk_secret_UK4Y2RHas2eSOx2Te9teI75do",
                confirmation_method: "automatic",
                created: 1721624252,
                currency: "usd",
                description: null,
                last_payment_error: null,
                livemode: false,
                next_action: null,
                payment_method: "pm_1PfEJVD6SqU8owGYbDXZJGfM",
                payment_method_configuration_details: {
                    id: "pmc_1MjPO8D6SqU8owGY7P1fFomG",
                    parent: null,
                },
                payment_method_types: [
                    "card",
                    "link",
                    "cashapp",
                ],
                processing: null,
                receipt_email: null,
                setup_future_usage: null,
                shipping: {
                    address: {
                    city: "Yogyakarta",
                    country: "ID",
                    line1: "Jl monjali",
                    line2: null,
                    postal_code: "55284",
                    state: "DI Yogyakarta",
                    },
                    carrier: null,
                    name: "Yunus Kurniawan",
                    phone: "0888889999999",
                    tracking_number: null,
                },
                source: null,
                status: "requires_capture", // not paid until manually capture on server_side
            }
        */
        /*
            without feature capture_method : 'manual'
            {
                id: "pi_3PfEMfD6SqU8owGY1fBYM3cw",
                object: "payment_intent",
                amount: 2512,
                amount_details: {
                    tip: {
                    },
                },
                automatic_payment_methods: {
                    allow_redirects: "always",
                    enabled: true,
                },
                canceled_at: null,
                cancellation_reason: null,
                capture_method: "automatic_async",
                client_secret: "pi_3PfEMfD6SqU8owGY1fBYM3cw_secret_vnymV4LeCpkO1tLf6ES08xIiQ",
                confirmation_method: "automatic",
                created: 1721624449,
                currency: "usd",
                description: null,
                last_payment_error: null,
                livemode: false,
                next_action: null,
                payment_method: "pm_1PfEMhD6SqU8owGYEvlI3zH5",
                payment_method_configuration_details: {
                    id: "pmc_1MjPO8D6SqU8owGY7P1fFomG",
                    parent: null,
                },
                payment_method_types: [
                    "card",
                    "link",
                    "cashapp",
                ],
                processing: null,
                receipt_email: null,
                setup_future_usage: null,
                shipping: {
                    address: {
                    city: "Yogyakarta",
                    country: "ID",
                    line1: "Jl monjali",
                    line2: null,
                    postal_code: "55284",
                    state: "DI Yogyakarta",
                    },
                    carrier: null,
                    name: "Yunus Kurniawan",
                    phone: "0888889999999",
                    tracking_number: null,
                },
                source: null,
                status: "succeeded",
            }
        */
        const {
            id,
            next_action,
            
            /*
                Status of this PaymentIntent, one of:
                * requires_payment_method   // MAYBE happened => if the payment attempt fails (for example due to a decline), the PaymentIntent’s status returns to requires_payment_method
                * requires_confirmation     // never happened => the `confirmCardPayment()` is already invoked
                * requires_action           // MAYBE happened => handled by `next_action?.redirect_to_url?.url`
                * processing                // never happened => cards are processed more quickly and don''t go into the processing status
                * requires_capture          // never happened => if you’re separately authorizing and capturing funds, your PaymentIntent can instead move to requires_capture. In that case, attempting to capture the funds moves it to processing.
                * canceled                  // never happened => you can cancel a PaymentIntent at any point before it’s in a processing2 or succeeded state
                * succeeded                 // MAYBE happened => instant PAID without 3DS_verification
            */
            status,
        } = paymentIntent;
        
        
        switch (status) {
            // step 1:
            case 'requires_payment_method' : { // if the payment attempt fails (for example due to a decline)
                throw 'DECLINED';
            }
            
            
            
            // step 2:
         // case 'requires_confirmation'   :   // never happened, the confirmation is already invoked
            
            
            
            // step 3:
            case 'requires_action'         : { // the payment requires additional actions, such as authenticating with 3D Secure
                return {
                    orderId      : id, // paymentIntent Id
                    redirectData : next_action?.redirect_to_url?.url ?? undefined, // will be processed by `handleNextAction()`
                } satisfies DraftOrderDetail;
            }
            
            
            
            // step 4 (optional):
            case 'requires_capture'        : { // not paid until manually capture on server_side
                return {
                    orderId      : id, // paymentIntent Id
                    redirectData : undefined, // will be handled by `proxyDoNextAction()` => AUTHORIZED => will be manually capture on server_side
                } satisfies DraftOrderDetail;
            }
            
            
            
            // step 5 (for asynchronous payment methods):
         // case 'processing'              :   // never happened for cards
            
            
            
            // step 6:
         // case 'canceled'                :   // never happened, unless manually requested by api
            
            
            
            // step 7:
            case 'succeeded'               : { // paid
                return {
                    orderId      : '',        // an empty_string means already CAPTURED (maybe delayed), no need to AUTHORIZE, just needs DISPLAY paid page
                    redirectData : undefined, // will be handled by `proxyDoNextAction()` => CAPTURED => will be manually capture on server_side
                } satisfies DraftOrderDetail;
            }
            
            
            
            default : {
                throw Error('Oops, an error occured!');
            }
        } // switch
    });
    const proxyDoNextAction = useEvent(async (draftOrderDetail: DraftOrderDetail): Promise<AuthenticatedResult> => {
        if (!stripe)   return AuthenticatedResult.FAILED;
        if (!elements) return AuthenticatedResult.FAILED;
        
        
        
        const redirectData = draftOrderDetail.redirectData;
        if (redirectData === undefined) return (
            !draftOrderDetail.orderId
            ? AuthenticatedResult.CAPTURED   // already CAPTURED (maybe delayed), no need to AUTHORIZE, just needs DISPLAY paid page
            : AuthenticatedResult.AUTHORIZED // will be manually capture on server_side
        );
        
        
        
        try {
            const result = await stripe.handleNextAction({
                clientSecret : redirectData,
            });
            if (result.error || !result.paymentIntent) return AuthenticatedResult.FAILED;
            switch (result.paymentIntent.status) {
                case 'requires_capture' : {
                    return AuthenticatedResult.AUTHORIZED; // will be manually capture on server_side
                }
                
                
                
                case 'succeeded'        : {
                    return AuthenticatedResult.CAPTURED; // has been CAPTURED (maybe delayed), just needs DISPLAY paid page
                }
                
                
                
                default : {
                    throw Error('Oops, an error occured!');
                }
            } // switch
        }
        catch {
            return AuthenticatedResult.FAILED;
        } // try
    });
    
    
    
    // jsx:
    return (
        <ButtonPaymentCardGeneral
            // handlers:
            doPlaceOrder={proxyDoPlaceOrder}
            doNextAction={proxyDoNextAction}
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
    const modal3dsRef = useRef<PromiseDialog<AuthenticatedResult>|null>(null);
    
    
    
    // handlers:
    const proxyDoPlaceOrder = useEvent(async (): Promise<DraftOrderDetail|true> => {
        const paymentCardSectionElm = paymentCardSectionRef?.current;
        if (!paymentCardSectionElm) throw Error('Oops, an error occured!');
        
        
        
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
                    reject('DECLINED');
                },
            })
        });
        
        
        
        return await doPlaceOrder({ // may require further action -OR- immediately paid
            paymentSource  : 'midtransCard',
            cardToken      : cardToken,
        });
    });
    const proxyDoNextAction = useEvent(async (draftOrderDetail: DraftOrderDetail): Promise<AuthenticatedResult> => {
        const redirectData = draftOrderDetail.redirectData;
        if (redirectData === undefined) throw Error('Oops, an error occured!');
        
        
        
        return new Promise<AuthenticatedResult>((resolve) => {
            const MidtransNew3ds = (window as any).MidtransNew3ds;
            MidtransNew3ds.authenticate(redirectData, {
                performAuthentication: function(redirectUrl: string){
                    // Implement how you will open iframe to display 3ds authentication redirectUrl to customer
                    modal3dsRef.current = showDialog<AuthenticatedResult>(
                        <IframeDialog
                            // accessibilities:
                            title='3DS Verification'
                            
                            
                            
                            // resources:
                            src={redirectUrl}
                        />
                    );
                    modal3dsRef.current.collapseEndEvent().then(({data}) => {
                        resolve(data ?? AuthenticatedResult.CANCELED /* undefined => escape the dialog => CANCELED */);
                        modal3dsRef.current = null;
                    });
                },
                onSuccess: function(response: any){
                    // 3ds authentication success, implement payment success scenario
                    /*
                        with feature type: 'authorize'
                        {
                            status_code: "200",
                            transaction_id: "a82a389b-94c9-4a82-9d01-da9dc3745615",
                            gross_amount: "406000.00",
                            currency: "IDR",
                            order_id: "0465054995089660",
                            payment_type: "credit_card",
                            signature_key: "6f81de66301e701f9028d69eda2bdf078af9ec58bf460408520ce1fd58105d5d1fa32eb9915f257c959b63a4fed7509127b5b279ead997a037dd20f176cf8619",
                            transaction_status: "authorize", // not paid until manually capture on server_side
                            fraud_status: "accept",
                            status_message: "Success, Credit Card transaction is successful",
                            merchant_id: "G551313466",
                            transaction_time: "2024-07-22 03:02:11",
                            expiry_time: "2024-07-30 03:02:10",
                            channel_response_code: "00",
                            channel_response_message: "Approved",
                            bank: "mandiri",
                            approval_code: "1721592142277",
                            masked_card: "48111111-1114",
                            card_type: "credit",
                            channel: "mti",
                            three_ds_version: "2",
                            on_us: false,
                            challenge_completion: true,
                            eci: "05",
                        }
                    */
                    /*
                        without feature type: 'authorize'
                        {
                            status_code: "200",
                            transaction_id: "68394be2-9038-4029-8a8d-f7832d0de064",
                            gross_amount: "406000.00",
                            currency: "IDR",
                            order_id: "2014825178094227",
                            payment_type: "credit_card",
                            signature_key: "4fc5c2f0031729965e93f4790fe5a05219fd379a059347d7a3fe3be75039301baed01050badabe8e4d1e1d2291bca7cb63b7a6bba82efa86613b9d12e5c93f9b",
                            transaction_status: "capture", // capture => paid
                            fraud_status: "accept",
                            status_message: "Success, Credit Card capture transaction is successful",
                            merchant_id: "G551313466",
                            transaction_time: "2024-07-22 03:04:19",
                            settlement_time: "2024-07-22 03:04:27", // settlement => paid
                            expiry_time: "2024-07-30 03:04:19",
                            channel_response_code: "00",
                            channel_response_message: "Approved",
                            bank: "mega",
                            approval_code: "1721592267072",
                            masked_card: "48111111-1114",
                            card_type: "credit",
                            channel: "dragon",
                            three_ds_version: "2",
                            on_us: false,
                            challenge_completion: true,
                            eci: "05",
                        }
                    */
                    switch (response?.transaction_status?.toLowerCase?.()) {
                        case 'authorize':
                            modal3dsRef.current?.closeDialog(AuthenticatedResult.AUTHORIZED, 'ui'); // will be manually capture on server_side
                            break;
                        
                        
                        
                        case 'capture':
                            modal3dsRef.current?.closeDialog(AuthenticatedResult.CAPTURED, 'ui'); // has been CAPTURED (maybe delayed), just needs DISPLAY paid page
                            break;
                        
                        
                        
                        default:
                            throw Error('Oops, an error occured!');
                    } // switch
                },
                onFailure: function(response: any){
                    // 3ds authentication failure, implement payment failure scenario
                    modal3dsRef.current?.closeDialog(AuthenticatedResult.FAILED, 'ui');
                },
                onPending: function(response: any){
                    // transaction is pending, transaction result will be notified later via 
                    // HTTP POST notification, implement as you wish here
                    modal3dsRef.current?.closeDialog(AuthenticatedResult.PENDING, 'ui');
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
            doNextAction={proxyDoNextAction}
        />
    );
};
const enum AuthenticatedResult {
    /**
     * The user is not authenticated until the timeout expires.
     */
    EXPIRED    = -2,
    /**
     * The user has decided to cancel the transaction.
     */
    CANCELED   = -1,
    /**
     * An error occured.  
     * Usually using invalid card.
     */
    FAILED     = 0,
    
    /**
     * Requires to capture the funds in server side.
     */
    AUTHORIZED = 1,
    /**
     * The transaction was successful but the funds have not yet settled your account.
     */
    PENDING    = 2,
    /**
     * The transaction was successful and the funds have settled your account.
     */
    CAPTURED   = 3,
}
interface ButtonPaymentGeneralProps {
    doPlaceOrder    : () => Promise<DraftOrderDetail|true>
    doNextAction   ?: (draftOrderDetail: DraftOrderDetail) => Promise<AuthenticatedResult>
}
const ButtonPaymentCardGeneral = (props: ButtonPaymentGeneralProps): JSX.Element|null => {
    // props:
    const {
        doPlaceOrder : proxyDoPlaceOrder,
        doNextAction : proxyDoNextAction,
    } = props;
    
    
    
    // states:
    const {
        // actions:
        // gotoFinished,
        
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
                if (draftOrderDetail === true) return; // immediately paid => no need further action
                if (!proxyDoNextAction) return; // the nextAction callback is not defined => no need further action
                
                
                
                switch (await proxyDoNextAction(draftOrderDetail) /* trigger `authenticate` function */) {
                    case AuthenticatedResult.FAILED     : {
                        showMessageError({
                            error: <>
                                <p>
                                    The credit card <strong>verification failed</strong>.
                                </p>
                                <p>
                                    <strong>No funds</strong> have been deducted.
                                </p>
                                <p>
                                    Please try using <strong>another card</strong>.
                                </p>
                            </>
                        });
                        break;
                    }
                    
                    case AuthenticatedResult.CANCELED   :
                    case AuthenticatedResult.EXPIRED    : {
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
                        break;
                    }
                    
                    
                    
                    case AuthenticatedResult.AUTHORIZED : { // will be manually capture on server_side
                        // then forward the authentication to backend_API to receive the fund:
                        await doMakePayment(draftOrderDetail.orderId, /*paid:*/true);
                        break;
                    }
                    
                    
                    
                    case AuthenticatedResult.PENDING    :
                    case AuthenticatedResult.CAPTURED   : { // has been CAPTURED (maybe delayed), just needs DISPLAY paid page
                        // gotoFinished(); // TODO: DISPLAY paid page
                        break;
                    }
                    
                    
                    
                    default : {
                        throw Error('Oops, an error occured!');
                    }
                } // switch
            }
            catch (fetchError: any) {
                if (fetchError === 'DECLINED') {
                    showMessageError({
                        error: <>
                            <p>
                                Cannot make transactions with this card.
                            </p>
                            <p>
                                Please try using <strong>another card</strong>.
                            </p>
                        </>
                    });
                }
                else if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'payment' });
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

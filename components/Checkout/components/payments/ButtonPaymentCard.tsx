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
import {
    ErrorDeclined,
}                           from './ErrorDeclined'

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
        doMakePayment,
    } = useCheckoutState();
    
    const finalBillingAddress = billingAsShipping ? shippingAddress : billingAddress;
    
    
    
    // handlers:
    const stripe   = useStripe();
    const elements = useElements();
    
    const proxyDoPlaceOrder      = useEvent(async (): Promise<DraftOrderDetail|true> => {
        if (!stripe)            throw Error('Oops, an error occured!');
        if (!elements)          throw Error('Oops, an error occured!');
        const cardNumberElement = elements.getElement('cardNumber');
        if (!cardNumberElement) throw Error('Oops, an error occured!');
        
        
        
        // trigger form validation and wallet collection:
        const {
            error : paymentMethodError,
            paymentMethod,
        } = await stripe.createPaymentMethod({
            type            : 'card',
            card            : cardNumberElement,
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
        });
        if (paymentMethodError) {
            /*
                TODO: sample error
            */
            
            throw new ErrorDeclined({
                message     : paymentMethodError.message,
                shouldRetry : (paymentMethodError as any).shouldRetry ?? false, // default: please use another card
            });
        } // if
        
        
        
        return await doPlaceOrder({
            paymentSource  : 'stripeCard',
            cardToken      : paymentMethod.id,
        });
    });
    const proxyDoNextAction      = useEvent(async (draftOrderDetail: DraftOrderDetail): Promise<AuthenticatedResult> => {
        if (!stripe)   throw Error('Oops, an error occured!');
        if (!elements) throw Error('Oops, an error occured!');
        
        
        
        const redirectData = draftOrderDetail.redirectData;
        if (redirectData === undefined) return (
            !draftOrderDetail.orderId        // the rawOrderId to be passed to server_side for capturing the fund, if empty_string => already CAPTURED, no need to AUTHORIZE, just needs DISPLAY paid page
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
            throw Error('Oops, an error occured!');
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
                    reject(new ErrorDeclined({
                        shouldRetry : false, // please use another card
                    }));
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
            try {
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
                        /*
                            {
                                status_code: "202",
                                transaction_id: "25b6db00-550e-42b4-8cbd-bf778a78fa54",
                                gross_amount: "405000.00",
                                currency: "IDR",
                                order_id: "9291695765128641",
                                payment_type: "credit_card",
                                signature_key: "9ae5243ff9508672571004b0b01e69abad9890a87e31fe27e174e1ded172d32eccec845b9f3b936d72483af6e4bfd63eb5c19485208ee33c8be502657492ac32",
                                transaction_status: "deny",
                                fraud_status: "accept",
                                status_message: "Deny by Bank [MANDIRI] with code [05] and message [Do not honour]",
                                merchant_id: "G551313466",
                                transaction_time: "2024-07-25 02:53:35",
                                expiry_time: "2024-08-02 02:53:35",
                                channel_response_code: "05",
                                channel_response_message: "Do not honour",
                                bank: "mandiri",
                                masked_card: "49111111-1113",
                                card_type: "debit",
                                channel: "mti",
                                three_ds_version: "2",
                                on_us: false,
                                challenge_completion: true,
                                eci: "05",
                            }
                        */
                        /*
                            {
                                status_code: "202",
                                transaction_id: "ca52b211-13f6-4627-9166-297cd8501483",
                                gross_amount: "405000.00",
                                currency: "IDR",
                                order_id: "8381211428235331",
                                payment_type: "credit_card",
                                signature_key: "4dc8e84d8f7844e6c4d8ac5a7fc5a307e152c378ef9c3d2e4546d6b26d3bd322df84f04de072d6e2a55f19a330536403a9d81de600709001cc8c789f5fee0a4d",
                                transaction_status: "deny",
                                fraud_status: "deny",
                                status_message: "Denied by Veritrans Fraud Detection System",
                                merchant_id: "G551313466",
                                transaction_time: "2024-07-25 02:56:13",
                                expiry_time: "2024-08-02 02:56:13",
                                bank: "mandiri",
                                masked_card: "46111111-1116",
                                card_type: "debit",
                                channel: "mti",
                                three_ds_version: "2",
                                on_us: false,
                                challenge_completion: false,
                                eci: "06",
                            }
                        */
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
            }
            catch {
                throw Error('Oops, an error occured!');
            } // try
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
    const handlePayButtonClick   = useEvent(async () => {
        doTransaction(async () => {
            try {
                // createOrder:
                const draftOrderDetail = await proxyDoPlaceOrder();
                if (draftOrderDetail === true) return; // immediately paid => no need further action
                if (!proxyDoNextAction) return; // the nextAction callback is not defined => no need further action
                
                
                
                const rawOrderId = draftOrderDetail.orderId;
                let authenticatedResult : AuthenticatedResult;
                try {
                    authenticatedResult = await proxyDoNextAction(draftOrderDetail); // trigger `authenticate` function
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
                                    The credit card <strong>verification failed</strong>.
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
                                Cannot make transactions with this card.
                            </p>
                            {/* <p>
                                The credit card <strong>verification failed</strong>.
                            </p> */}
                            {!fetchError.message && <p>
                                Your card was declined.
                            </p>}
                            {!!fetchError.message && <p>
                                {fetchError.message}
                            </p>}
                            {!fetchError.shouldRetry  /* === false */ && <p>
                                Please try using <strong>another card</strong>.
                            </p>}
                            {!!fetchError.shouldRetry /* === true  */ && <p>
                                Please <strong>try again</strong> in a few minutes.
                            </p>}
                        </>
                    });
                }
                else if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'payment' });
                // TODO: re-generate PaypalPaymentSession
            } // try
        });
    });
    const handleRevertDraftOrder = useEvent((orderId: string): void => {
        // notify to cancel transaction, so the draftOrder (if any) will be reverted:
        doMakePayment(orderId, /*paid:*/false, { cancelOrder: true })
        .catch(() => {
            // ignore any error
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

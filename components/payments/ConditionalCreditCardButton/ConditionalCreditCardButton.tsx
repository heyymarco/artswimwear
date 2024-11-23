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
    type ButtonIconProps,
    ButtonIcon,
    
    
    
    // dialog-components:
    PromiseDialog,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    IframeDialog,
}                           from '@/components/dialogs/IframeDialog'

// payment components:
import {
    usePaymentProcessorPriority,
}                           from '@/components/payments/hooks'
import {
    usePaypalCardComposerState,
}                           from '@/components/payments/ConditionalPaypalCardComposerProvider/states/paypalCardComposerState'
import {
    usePayPalCardFields,
}                           from '@paypal/react-paypal-js'
import {
    useStripe,
    useElements,
}                           from '@stripe/react-stripe-js'

// cart components:
import {
    useCartState,
}                           from '@/components/Cart/states/cartState'

// checkout components:
import {
    AuthenticatedResult,
    type StartTransactionArg,
    useCheckoutState,
}                           from '@/components/Checkout/states/checkoutState'

// models:
import {
    // types:
    type PlaceOrderDetail,
}                           from '@/models'

// errors:
import {
    ErrorDeclined,
}                           from '@/errors'



// react components:
const ConditionalCreditCardButton = (props: ImplementedButtonPaymentGeneralProps): JSX.Element|null => {
    // states:
    const {
        // payment data:
        currency,
    } = useCartState();
    
    const {
        isPaymentPriorityPaypal,
        isPaymentPriorityStripe,
        isPaymentPriorityMidtrans,
    } = usePaymentProcessorPriority({
        currency,
    });
    
    
    
    // jsx:
    if (isPaymentPriorityPaypal  ) return <CreditCardButtonPaypal   {...props} />;
    if (isPaymentPriorityStripe  ) return <CreditCardButtonStripe   {...props} />;
    if (isPaymentPriorityMidtrans) return <CreditCardButtonMidtrans {...props} />;
    return null;
};
export {
    ConditionalCreditCardButton,
    ConditionalCreditCardButton as default,
};



const CreditCardButtonPaypal   = (props: ImplementedButtonPaymentGeneralProps): JSX.Element|null => {
    // // states:
    // const {
    //     // shipping data:
    //     shippingAddress,
    //     
    //     
    //     
    //     // billing data:
    //     billingAsShipping,
    //     
    //     billingAddress,
    //     
    //     
    //     
    //     // sections:
    //     paymentCardSectionRef,
    // } = useCheckoutState();
    
    const {
        signalApprovedOrderIdRef,
    } = usePaypalCardComposerState();
    
    // const finalBillingAddress = billingAsShipping ? shippingAddress : billingAddress;
    
    
    
    // handlers:
    const {
        cardFieldsForm,
    } = usePayPalCardFields();
    
    const proxyDoPlaceOrder   = useEvent(async (): Promise<PlaceOrderDetail|false> => {
        // conditions:
        if (!cardFieldsForm)        throw Error('Oops, an error occured!');
        // const paymentCardSectionElm = paymentCardSectionRef?.current;
        const paypalDoPlaceOrder    = cardFieldsForm.submit;
        // if (!paymentCardSectionElm) throw Error('Oops, an error occured!');
        if (!paypalDoPlaceOrder)    throw Error('Oops, an error occured!');
        
        
        
        // validations:
        const formState = await cardFieldsForm.getState();
        if (!formState.isFormValid) return false; // no need to show invalid fields, already handled by `checkoutState::doTransaction()`
        
        
        
        // submit card data to Paypal_API to get authentication:
        const { promise: approvedOrderIdPromise, resolve: signalApprovedOrderId } = Promise.withResolvers<string|null>();
        signalApprovedOrderIdRef.current = signalApprovedOrderId;
        try {
            await paypalDoPlaceOrder(); // triggers <PayPalCardFieldsProvider> => proxyDoPlaceOrder() => doPlaceOrder()
        }
        catch {
            signalApprovedOrderIdRef.current = null;
            return false;
        } // try
        
        
        
        const rawOrderId = await approvedOrderIdPromise;
        signalApprovedOrderIdRef.current = null;
        if (rawOrderId === null) return false; // if was error => abort
        const orderId = (
            rawOrderId.startsWith('#PAYPAL_')
            ? rawOrderId              // already prefixed => no need to modify
            : `#PAYPAL_${rawOrderId}` // not     prefixed => modify with prefix #PAYPAL_
        );
        return {
            orderId      : orderId,
            redirectData : undefined,
        } satisfies PlaceOrderDetail;
    });
    const proxyDoAuthenticate = useEvent(async (placeOrderDetail: PlaceOrderDetail): Promise<AuthenticatedResult> => {
        return AuthenticatedResult.AUTHORIZED;
    });
    
    
    
    // jsx:
    return (
        <CreditCardButtonGeneral
            // other props:
            {...props}
            
            
            
            // handlers:
            doPlaceOrder={proxyDoPlaceOrder}
            doAuthenticate={proxyDoAuthenticate}
        />
    );
};
const CreditCardButtonStripe   = (props: ImplementedButtonPaymentGeneralProps): JSX.Element|null => {
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
    
    
    
    // handlers:
    const stripe   = useStripe();
    const elements = useElements();
    
    const proxyDoPlaceOrder   = useEvent(async (): Promise<PlaceOrderDetail|true> => {
        if (!stripe)            throw Error('Oops, an error occured!');
        if (!elements)          throw Error('Oops, an error occured!');
        const cardNumberElement = elements.getElement('cardNumber');
        if (!cardNumberElement) throw Error('Oops, an error occured!');
        
        
        
        // create PaymentMethod using card:
        const {
            error : paymentMethodError,
            paymentMethod,
        } = await stripe.createPaymentMethod({
            type            : 'card',
            card            : cardNumberElement,
            billing_details : (
                !!finalBillingAddress
                ? {
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
                }
                : undefined
            ),
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
    const proxyDoAuthenticate = useEvent(async (placeOrderDetail: PlaceOrderDetail): Promise<AuthenticatedResult> => {
        if (!stripe)   throw Error('Oops, an error occured!');
        if (!elements) throw Error('Oops, an error occured!');
        
        
        
        const clientSecret = placeOrderDetail.redirectData;
        if (clientSecret === undefined) return (
            !placeOrderDetail.orderId        // the rawOrderId to be passed to server_side for capturing the fund, if empty_string => already CAPTURED, no need to AUTHORIZE, just needs DISPLAY paid page
            ? AuthenticatedResult.CAPTURED   // already CAPTURED (maybe delayed), no need to AUTHORIZE, just needs DISPLAY paid page
            : AuthenticatedResult.AUTHORIZED // will be manually capture on server_side
        );
        
        
        
        try {
            const result = await stripe.handleNextAction({
                clientSecret : clientSecret,
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
        <CreditCardButtonGeneral
            // other props:
            {...props}
            
            
            
            // handlers:
            doPlaceOrder={proxyDoPlaceOrder}
            doAuthenticate={proxyDoAuthenticate}
        />
    );
};
const CreditCardButtonMidtrans = (props: ImplementedButtonPaymentGeneralProps): JSX.Element|null => {
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
    const proxyDoPlaceOrder   = useEvent(async (): Promise<PlaceOrderDetail|true> => {
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
    const proxyDoAuthenticate = useEvent(async (placeOrderDetail: PlaceOrderDetail): Promise<AuthenticatedResult> => {
        const redirectData = placeOrderDetail.redirectData;
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
        <CreditCardButtonGeneral
            // other props:
            {...props}
            
            
            
            // handlers:
            doPlaceOrder={proxyDoPlaceOrder}
            doAuthenticate={proxyDoAuthenticate}
        />
    );
};



interface ButtonPaymentGeneralProps
    extends
        // bases:
        ButtonIconProps,
        
        // handlers:
        Pick<StartTransactionArg,
            // handlers:
            |'doPlaceOrder'
            |'doAuthenticate'
        >
{
}
interface ImplementedButtonPaymentGeneralProps
    extends
        // bases:
        Omit<ButtonPaymentGeneralProps,
            // handlers:
            |'doPlaceOrder'
            |'doAuthenticate'
        >
{
}
const CreditCardButtonGeneral = (props: ButtonPaymentGeneralProps): JSX.Element|null => {
    // props:
    const {
        doPlaceOrder,
        doAuthenticate,
        
        
        
        // other props:
        ...restButtonPaymentGeneralProps
    } = props;
    
    
    
    // states:
    const {
        // shipping data:
        totalShippingCostStatus,
        
        
        
        // actions:
        startTransaction,
    } = useCheckoutState();
    
    
    
    // handlers:
    const handlePayButtonClick   = useEvent(async () => {
        startTransaction({
            // handlers:
            doPlaceOrder         : doPlaceOrder,   // if returns `PlaceOrderDetail` => assumes a DraftOrder has been created
            doAuthenticate       : doAuthenticate, // trigger `authenticate` function
            
            
            
            // messages:
            messageFailed        : <>
                <p>
                    The credit card <strong>verification failed</strong>.
                </p>
                <p>
                    Please try using <strong>another card</strong>.
                </p>
            </>,
            messageCanceled      : undefined, // use default canceled message
            messageExpired       : undefined, // same as `messageCanceled`
            messageDeclined      : (errorMessage) => <>
                <p>
                    Unable to make a transaction using this card.
                </p>
                {!errorMessage && <p>
                    Your card was declined.
                </p>}
                {!!errorMessage && <p>
                    {errorMessage}{errorMessage?.endsWith('.') ? '' : '.'}
                </p>}
                <p>
                    Please try using <strong>another card</strong>.
                </p>
            </>,
            messageDeclinedRetry : (errorMessage) => <>
                <p>
                    Unable to make a transaction using this card.
                </p>
                {!errorMessage && <p>
                    Your card was declined.
                </p>}
                {!!errorMessage && <p>
                    {errorMessage}{errorMessage?.endsWith('.') ? '' : '.'}
                </p>}
                <p>
                    Please <strong>try again</strong> in a few minutes.
                </p>
            </>,
        });
    });
    
    
    
    // default props:
    const {
        // appearances:
        icon      = 'shopping_bag',
        
        
        
        // variants:
        gradient  = true,
        
        
        
        // classes:
        className = '',
        
        
        
        // states:
        enabled   = (totalShippingCostStatus !== 'ready') ? false : undefined,
        
        
        // children:
        children  = <>
            Pay Now
        </>,
        
        
        
        // other props:
        ...restButtonIconProps
    } = restButtonPaymentGeneralProps;
    
    
    
    // jsx:
    return (
        <ButtonIcon
            // other props:
            {...restButtonIconProps}
            
            
            
            // appearances:
            icon={icon}
            
            
            
            // variants:
            gradient={gradient}
            
            
            
            // classes:
            className={`payButton ${className}`}
            
            
            
            // states:
            enabled={enabled}
            
            
            
            // handlers:
            onClick={handlePayButtonClick}
        >
            {children}
        </ButtonIcon>
    );
};

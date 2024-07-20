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
    useIsInPayPalHostedFieldsProvider,
}                           from './ConditionalPayPalHostedFieldsProvider'

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
    
    
    
    const isInPayPalHostedFieldsProvider = useIsInPayPalHostedFieldsProvider();
    const supportedCardProcessors : string[] = (
        ([
            !isInPayPalHostedFieldsProvider ? undefined : 'paypal',
            'stripe',
            'midtrans',
        ] satisfies ((typeof checkoutConfigClient.payment.preferredProcessors[number])|undefined)[])
        .filter((item): item is Exclude<typeof item, undefined> => (item !== undefined))
    );
    const priorityPaymentProcessor   = appropriatePaymentProcessors.find((processor) => supportedCardProcessors.includes(processor)); // find the highest priority payment processor that supports card payment
    const isPayUsingPaypalPriority   = (priorityPaymentProcessor === 'paypal');
    
    
    
    // handlers:
    const hostedFields = usePayPalHostedFields();
    const handlePayButtonClick = useEvent(async () => {
        const paypalDoPlaceOrder = hostedFields.cardFields?.submit;
        const paymentCardSectionElm = paymentCardSectionRef?.current;
        const proxyDoPlaceOrder : (() => Promise<DraftOrderDetail|undefined>)|undefined = (
            isPayUsingPaypalPriority
            ? (
                (!paymentCardSectionElm || (typeof(paypalDoPlaceOrder) !== 'function')) // validate that `submit()` exists before invoke it
                ? undefined
                : async (): Promise<DraftOrderDetail> => {
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
                    };
                }
            )
            : (
                !paymentCardSectionElm
                ? undefined
                : async (): Promise<DraftOrderDetail|undefined> => {
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
                    
                    const draftOrderDetail = await doPlaceOrder({
                        paymentSource  : 'midtransCard',
                        cardToken      : cardToken,
                    });
                    if (!draftOrderDetail) return undefined;
                    return draftOrderDetail;
                }
            )
        );
        if (!proxyDoPlaceOrder) return;
        
        
        
        doTransaction(async () => {
            try {
                // createOrder:
                const draftOrderDetail = await proxyDoPlaceOrder();
                if (!draftOrderDetail) return; // paid => no need redirection
                
                
                
                const redirectData = draftOrderDetail.redirectData;
                if (redirectData) { // not undefined && not empty_string
                    // trigger `authenticate` function
                    const isVerified = await new Promise<boolean|null|undefined>((resolve) => {
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
                    switch (isVerified) {
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

'use client'

// react:
import {
    // react:
    default as React,
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

// internals:
import {
    PaymentDetail,
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ButtonPaymentCard = (): JSX.Element|null => {
    // states:
    const {
        // shipping data:
        shippingFirstName : _shippingFirstName, // not implemented yet, because billingFirstName is not implemented
        shippingLastName  : _shippingLastName,  // not implemented yet, because billingLastName  is not implemented
        
        shippingPhone     : _shippingPhone,     // not implemented yet, because billingPhone     is not implemented
        
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        
        
        // billing data:
        billingAsShipping,
        
        billingFirstName  : _billingFirstName,  // not implemented, already to use cardholderName
        billingLastName   : _billingLastName,   // not implemented, already to use cardholderName
        
        billingPhone      : _billingPhone,      // not implemented yet
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
        
        
        
        // payment data:
        appropriatePaymentProcessor,
        
        
        
        // fields:
        cardholderInputRef,
        
        
        
        // actions:
        doTransaction,
        doPlaceOrder,
        doMakePayment,
    } = useCheckoutState();
    
    
    
    // dialogs:
    const {
        showDialog,
        showMessageError,
        showMessageFetchError,
    } = useDialogMessage();
    const modal3dsRef = useRef<PromiseDialog<boolean|null|undefined>|null>(null);
    
    
    
    const isPayUsingPaypal = (appropriatePaymentProcessor === 'paypal');
    
    
    
    // handlers:
    const hostedFields = usePayPalHostedFields();
    const handlePayButtonClick = useEvent(async () => {
        const paypalDoPlaceOrder = hostedFields.cardFields?.submit;
        const proxyDoPlaceOrder : (() => Promise<DraftOrderDetail|undefined>)|undefined = (
            isPayUsingPaypal
            ? (
                (typeof(paypalDoPlaceOrder) !== 'function') // validate that `submit()` exists before invoke it
                ? undefined
                : async (): Promise<DraftOrderDetail> => {
                    // submit card data to PayPal_API to get authentication:
                    const paypalAuthentication = await paypalDoPlaceOrder({
                        // trigger 3D Secure authentication:
                        contingencies  : ['SCA_WHEN_REQUIRED'],
                        
                        cardholderName        : cardholderInputRef?.current?.value, // cardholder's first and last name
                        billingAddress : {
                            streetAddress     : billingAsShipping ? shippingAddress : billingAddress, // street address, line 1
                         // extendedAddress   : undefined,                                            // street address, line 2 (Ex: Unit, Apartment, etc.)
                            locality          : billingAsShipping ? shippingCity    : billingCity,    // city
                            region            : billingAsShipping ? shippingZone    : billingZone,    // state
                            postalCode        : billingAsShipping ? shippingZip     : billingZip,     // postal Code
                            countryCodeAlpha2 : billingAsShipping ? shippingCountry : billingCountry, // country Code
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
                    return {
                        orderId     : paypalAuthentication.orderId,
                        redirectUrl : undefined,
                    };
                }
            )
            : async (): Promise<DraftOrderDetail|undefined> => {
                const MidtransNew3ds = (window as any).MidtransNew3ds;
                const cardToken = await new Promise<string>((resolve, reject) => {
                    const card = {
                        card_number         : "4811111111111114",
                        card_cvv            : "123",
                        card_exp_month      : "12",
                        card_exp_year       : "2025",
                        bank_one_time_token : "12345678"
                    };
                    MidtransNew3ds.getCardToken(card, {
                        onSuccess : (response: any) => {
                            resolve(response.token_id);
                        },
                        onFailure : (response: any) => {
                            reject(response?.validation_messages ?? 'Cannot make transactions with this card. Try using another card.');
                        },
                    })
                });
                
                const draftOrderDetail = await doPlaceOrder({
                    paymentSource        : 'midtransCard',
                    midtransPaymentToken : cardToken,
                });
                if (!draftOrderDetail) return undefined;
                return draftOrderDetail;
            }
        );
        if (!proxyDoPlaceOrder) return;
        
        
        
        doTransaction(async () => {
            try {
                // createOrder:
                const draftOrderDetail = await proxyDoPlaceOrder();
                if (!draftOrderDetail) return; // paid => no need redirection
                
                
                
                const redirectUrl = draftOrderDetail.redirectUrl;
                if (redirectUrl) { // not undefined && not empty_string
                    // trigger `authenticate` function
                    const isVerified = await new Promise<boolean|null|undefined>((resolve) => {
                        const MidtransNew3ds = (window as any).MidtransNew3ds;
                        MidtransNew3ds.authenticate(redirectUrl, {
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
                        
                        case undefined: {
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
                    } // switch
                } // if
                
                
                
                // then forward the authentication to backend_API to receive the fund:
                await doMakePayment(draftOrderDetail.orderId, /*paid:*/true);
            }
            catch (fetchError: any) {
                if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'payment' });
                // TODO: re-generate paypal payment token
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
                    icon='monetization_on'
                    
                    
                    
                    // variants:
                    size='lg'
                    gradient={true}
                    
                    
                    
                    // classes:
                    className='next payNow'
                    
                    
                    
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

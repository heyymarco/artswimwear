'use client'

// react:
import {
    // react:
    default as React,
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
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    ButtonWithBusy,
}                           from '../ButtonWithBusy'

// paypal:
import {
    usePayPalHostedFields,
}                           from '@paypal/react-paypal-js'

// internals:
import {
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
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    const isPayUsingPaypal = (appropriatePaymentProcessor === 'paypal');
    
    
    
    // handlers:
    const hostedFields = usePayPalHostedFields();
    const handlePayButtonClick = useEvent(() => {
        const paypalDoPlaceOrder = hostedFields.cardFields?.submit;
        const proxyDoPlaceOrder : (() => Promise<string>)|undefined = (
            isPayUsingPaypal
            ? (
                (typeof(paypalDoPlaceOrder) !== 'function') // validate that `submit()` exists before invoke it
                ? undefined
                : async (): Promise<string> => {
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
                    return paypalAuthentication.orderId;
                }
            )
            : async (): Promise<string> => {
                const MidtransNew3ds = (window as any).MidtransNew3ds;
                const cardToken = await new Promise<string>((resolve, reject) => {
                    const card = {
                        card_number: "4811111111111114",
                        card_cvv: "123",
                        card_exp_month: "12",
                        card_exp_year: "2025",
                        bank_one_time_token: "12345678"
                    }
                    MidtransNew3ds.getCardToken(card, {
                        onSuccess : (response: any) => {
                            resolve(response.token_id);
                        },
                        onFailure : (response: any) => {
                            reject(response?.validation_messages ?? 'Cannot make transactions with this card. Try using another card.');
                        },
                    })
                });
                
                const orderId = await doPlaceOrder({
                    paymentSource        : 'midtransCard',
                    midtransPaymentToken : cardToken,
                });
                return orderId;
            }
        );
        if (!proxyDoPlaceOrder) return;
        
        
        
        doTransaction(async () => {
            try {
                // createOrder:
                const orderId = await proxyDoPlaceOrder();
                
                
                
                // then forward the authentication to backend_API to receive the fund:
                await doMakePayment(orderId, /*paid:*/true);
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

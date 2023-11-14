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
        
        
        
        // fields:
        cardholderInputRef,
        
        
        
        // actions:
        doTransaction,
        doMakePayment,
    } = useCheckoutState();
    
    
    
    // dialogs:
    const {
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const hostedFields = usePayPalHostedFields();
    const handlePayButtonClick = useEvent(() => {
        if (typeof(hostedFields.cardFields?.submit) !== 'function') return; // validate that `submit()` exists before invoke it
        const submitCardData = hostedFields.cardFields?.submit;
        doTransaction(async () => {
            try {
                // submit card data to PayPal_API to get authentication:
                const paypalAuthentication = await submitCardData({
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
                
                
                
                // then forward the authentication to backend_API to receive the fund:
                await doMakePayment(paypalAuthentication.orderId, /*paid:*/true);
            }
            catch (fetchError: any) {
                showMessageFetchError({ fetchError, context: 'payment' });
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

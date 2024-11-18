// paypal:
import {
    PayPalNumberField,
    PayPalNameField,
    PayPalExpiryField,
    PayPalCVVField,
}                           from '@paypal/react-paypal-js'

// internals:
import {
    type PayPalCardFieldWrapperProps,
}                           from './PayPalCardFieldWrapper'



// options:
export const paypalCardNumberOptions : PayPalCardFieldWrapperProps = {
    // selector              : '#cardNumber',
    placeholder              : '1111-2222-3333-4444',
    type                     : 'cardNumberField',
    payPalCardFieldComponent : <PayPalNumberField />,
};
export const paypalCardNameOptions   : PayPalCardFieldWrapperProps = {
    // selector              : '#cardName',
    placeholder              : 'John Doe',
    type                     : 'cardNameField',
    payPalCardFieldComponent : <PayPalNameField />,
};
export const paypalCardExpiryOptions : PayPalCardFieldWrapperProps = {
    // selector              : '#cardExpiry',
    placeholder              : '11/2020',
    type                     : 'cardExpiryField',
    payPalCardFieldComponent : <PayPalExpiryField />,
};
export const paypalCardCvvOptions    : PayPalCardFieldWrapperProps = {
    // selector              : '#cardCvv',
    placeholder              : '123',
    type                     : 'cardCvvField',
    payPalCardFieldComponent : <PayPalCVVField />,
};

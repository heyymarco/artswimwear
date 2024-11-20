// payment components:
import {
    PayPalNumberField,
    PayPalNameField,
    PayPalExpiryField,
    PayPalCVVField,
}                           from '@paypal/react-paypal-js'

// internals:
import {
    type PaypalCardFieldWrapperProps,
}                           from './PaypalCardFieldWrapper'



// options:
export const paypalCardNumberOptions : PaypalCardFieldWrapperProps = {
    // selector              : '#cardNumber',
    placeholder              : '1111-2222-3333-4444',
    type                     : 'cardNumberField',
    payPalCardFieldComponent : <PayPalNumberField />,
};
export const paypalCardNameOptions   : PaypalCardFieldWrapperProps = {
    // selector              : '#cardName',
    placeholder              : 'John Doe',
    type                     : 'cardNameField',
    payPalCardFieldComponent : <PayPalNameField />,
};
export const paypalCardExpiryOptions : PaypalCardFieldWrapperProps = {
    // selector              : '#cardExpiry',
    placeholder              : '11/2020',
    type                     : 'cardExpiryField',
    payPalCardFieldComponent : <PayPalExpiryField />,
};
export const paypalCardCvvOptions    : PaypalCardFieldWrapperProps = {
    // selector              : '#cardCvv',
    placeholder              : '123',
    type                     : 'cardCvvField',
    payPalCardFieldComponent : <PayPalCVVField />,
};

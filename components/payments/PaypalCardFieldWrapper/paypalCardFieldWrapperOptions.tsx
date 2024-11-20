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
    placeholder              : '1111-2222-3333-4444',
    type                     : 'cardNumberField',
    paypalCardFieldComponent : <PayPalNumberField />,
};
export const paypalCardNameOptions   : PaypalCardFieldWrapperProps = {
    placeholder              : 'John Doe',
    type                     : 'cardNameField',
    paypalCardFieldComponent : <PayPalNameField />,
};
export const paypalCardExpiryOptions : PaypalCardFieldWrapperProps = {
    placeholder              : '11/2020',
    type                     : 'cardExpiryField',
    paypalCardFieldComponent : <PayPalExpiryField />,
};
export const paypalCardCvvOptions    : PaypalCardFieldWrapperProps = {
    placeholder              : '123',
    type                     : 'cardCvvField',
    paypalCardFieldComponent : <PayPalCVVField />,
};

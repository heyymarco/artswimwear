// payment components:
import {
    PayPalNumberField,
    PayPalNameField,
    PayPalExpiryField,
    PayPalCVVField,
}                           from '@paypal/react-paypal-js'

// internals:
import {
    type Pay_PalCardFieldWrapperProps,
}                           from './Pay_PalCardFieldWrapper'



// options:
export const paypalCardNumberOptions : Pay_PalCardFieldWrapperProps = {
    // selector              : '#cardNumber',
    placeholder              : '1111-2222-3333-4444',
    type                     : 'cardNumberField',
    payPalCardFieldComponent : <PayPalNumberField />,
};
export const paypalCardNameOptions   : Pay_PalCardFieldWrapperProps = {
    // selector              : '#cardName',
    placeholder              : 'John Doe',
    type                     : 'cardNameField',
    payPalCardFieldComponent : <PayPalNameField />,
};
export const paypalCardExpiryOptions : Pay_PalCardFieldWrapperProps = {
    // selector              : '#cardExpiry',
    placeholder              : '11/2020',
    type                     : 'cardExpiryField',
    payPalCardFieldComponent : <PayPalExpiryField />,
};
export const paypalCardCvvOptions    : Pay_PalCardFieldWrapperProps = {
    // selector              : '#cardCvv',
    placeholder              : '123',
    type                     : 'cardCvvField',
    payPalCardFieldComponent : <PayPalCVVField />,
};

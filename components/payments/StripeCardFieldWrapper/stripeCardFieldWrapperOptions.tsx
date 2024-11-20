// payment components:
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
}                           from '@stripe/react-stripe-js'

// internals:
import {
    type StripeCardFieldWrapperProps,
}                           from './StripeCardFieldWrapper'



// options:
export const stripeCardNumberOptions : StripeCardFieldWrapperProps = {
    placeholder          : '1111-2222-3333-4444',
    cardElementComponent : <CardNumberElement />,
};
export const stripeCardExpiryOptions : StripeCardFieldWrapperProps = {
    // placeholder          : '11/2020', // leave it blank, to avoid confusion of `MM/YY` or `MM/YYYY`
    cardElementComponent : <CardExpiryElement />,
};
export const stripeCardCvvOptions    : StripeCardFieldWrapperProps = {
    placeholder          : '123',
    cardElementComponent : <CardCvcElement />,
};

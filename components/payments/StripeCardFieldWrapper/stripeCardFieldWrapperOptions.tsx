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
    cardElementComponent : <CardNumberElement
        options = {{
            placeholder  : '1111-2222-3333-4444',
        }}
    />,
};
export const stripeCardExpiryOptions : StripeCardFieldWrapperProps = {
    cardElementComponent : <CardExpiryElement
        options = {{
            // placeholder  : '11/2020', // leave it blank, to avoid confusion of `MM/YY` or `MM/YYYY`
        }}
    />,
};
export const stripeCardCvvOptions    : StripeCardFieldWrapperProps = {
    cardElementComponent : <CardCvcElement
        options = {{
            placeholder  : '123',
        }}
    />,
};

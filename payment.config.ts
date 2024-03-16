import type {
    CurrencyCode,
    CurrencyConversionRounding,
}   from './commerce.config'



export interface PaymentConfig {
    paymentProcessors : {
        paypal : {
            supportedCurrencies : CurrencyCode[]
            defaultCurrency     : PaymentConfig['paymentProcessors']['paypal']['supportedCurrencies'][number]
        },
    },
    preferredPaymentProcessors  : (keyof PaymentConfig['paymentProcessors'])[]
    currencyOptions             : CurrencyCode[]
    currencyConversionRounding  : CurrencyConversionRounding
}
export const paymentConfig : PaymentConfig = {
    paymentProcessors : {
        paypal : {
            supportedCurrencies : [
                'USD',
            ],
            defaultCurrency     : 'USD',
        },
    },
    preferredPaymentProcessors  : [
        'paypal',
    ],
    currencyOptions             : [
        'USD',
        'IDR',
    ],
    currencyConversionRounding  : 'FLOOR',
};

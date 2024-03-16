import type {
    CurrencyCode,
    CurrencyConversionRounding,
}   from './commerce.config'



export interface PaymentConfig {
    paymentProcessors : {
        paypal : {
            supportedCurrencies : CurrencyCode[]
            defaultCurrency     : CurrencyCode
        },
    },
    preferredPaymentProcessors  : (keyof PaymentConfig['paymentProcessors'])[]
    currencyConversionRounding  : CurrencyConversionRounding
}
export const paymentConfig : PaymentConfig = {
    paymentProcessors : {
        paypal : {
            supportedCurrencies : [
                'IDR',
            ],
            defaultCurrency     : 'IDR',
        },
    },
    preferredPaymentProcessors  : [
        'paypal',
    ],
    currencyConversionRounding  : 'FLOOR',
};

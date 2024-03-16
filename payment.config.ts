import type {
    CurrencyCode,
    CurrencyConversionRounding,
}   from './commerce.config'



export interface PaymentConfig {
    paypal : {
        supportedCurrencies        : CurrencyCode[]
        defaultCurrency            : CurrencyCode
        currencyConversionRounding : CurrencyConversionRounding
    },
    preferredPaymentProcessor      : (keyof Omit<PaymentConfig, 'preferredPaymentProcessor'>)[]
}
export const paymentConfig : PaymentConfig = {
    paypal : {
        supportedCurrencies        : [
            'IDR',
        ],
        defaultCurrency            : 'IDR',
        currencyConversionRounding : 'FLOOR',
    },
    preferredPaymentProcessor      : [
        'paypal',
    ],
};

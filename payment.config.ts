import type {
    CurrencyCode,
}   from './commerce.config'



export interface PaymentConfig {
    paypal : {
        supportedCurrencies        : CurrencyCode[]
        defaultCurrency            : CurrencyCode
        currencyConversionRounding : 'ROUND'|'FLOOR'|'CEIL'
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

import type {
    CurrencyCode,
    CurrencyConversionRounding,
}   from './commerce.config'



export interface PaymentConfig {
    paymentCurrencyOptions      : CurrencyCode[]
    defaultPaymentCurrency      : PaymentConfig['paymentCurrencyOptions'][number]
    
    paymentProcessors           : {
        paypal : {
            supportedCurrencies : CurrencyCode[]
            defaultCurrency     : PaymentConfig['paymentProcessors']['paypal']['supportedCurrencies'][number]
        },
    },
    preferredPaymentProcessors  : (keyof PaymentConfig['paymentProcessors'])[]
    
    currencyConversionRounding  : CurrencyConversionRounding
}
export const paymentConfig : PaymentConfig = {
    paymentCurrencyOptions      : [
        'USD',
        'IDR',
    ],
    defaultPaymentCurrency      : 'IDR',
    
    paymentProcessors           : {
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
    
    currencyConversionRounding  : 'FLOOR',
};

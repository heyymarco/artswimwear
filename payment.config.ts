import type {
    CurrencyCode,
    CurrencyConversionRounding,
}   from './commerce.config'



export interface PaymentConfig {
    currencyOptions             : CurrencyCode[]
    defaultCurrency             : PaymentConfig['currencyOptions'][number]
    
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
    currencyOptions             : [
        'USD',
        'IDR',
    ],
    defaultCurrency             : 'IDR',
    
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

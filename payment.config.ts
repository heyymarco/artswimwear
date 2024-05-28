import type {
    CurrencyCode,
    CurrencyConversionRounding,
}                           from '@/components/Checkout/types'



export interface PaymentProcessorConfig {
    enabled             : boolean
    supportedCurrencies : CurrencyCode[]
}
export interface PaymentConfig {
    paymentCurrencyOptions      : CurrencyCode[]
    defaultPaymentCurrency      : PaymentConfig['paymentCurrencyOptions'][number]
    
    paymentProcessors           : {
        paypal : PaymentProcessorConfig & {
            /**
             * @deprecated
             */
            defaultCurrency     : PaymentConfig['paymentProcessors']['paypal']['supportedCurrencies'][number]
        },
        midtrans : PaymentProcessorConfig,
    },
    preferredPaymentProcessors  : (keyof PaymentConfig['paymentProcessors'])[]
    
    /**
     * @deprecated
     */
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
            enabled             : true,
            supportedCurrencies : [
                'USD',
            ],
            defaultCurrency     : 'USD',
        },
        midtrans : {
            enabled             : true,
            supportedCurrencies : [
                'IDR',
            ],
        },
    },
    preferredPaymentProcessors  : [
        'paypal',
        'midtrans',
    ],
    
    currencyConversionRounding  : 'FLOOR',
};

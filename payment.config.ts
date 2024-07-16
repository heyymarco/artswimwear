import type {
    CurrencyCode,
}                           from '@/components/Checkout/types'



export interface PaymentProcessorConfig {
    enabled             : boolean
    supportedCurrencies : CurrencyCode[]
}
export interface PaymentConfig {
    paymentProcessors           : {
        paypal : PaymentProcessorConfig
        midtrans : PaymentProcessorConfig
    }
    preferredPaymentProcessors  : (keyof PaymentConfig['paymentProcessors'])[]
}
export const paymentConfig : PaymentConfig = {
    paymentProcessors           : {
        paypal : {
            enabled             : true,
            supportedCurrencies : [
                'USD',
            ],
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
};

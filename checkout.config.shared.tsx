// configs:
import type {
    CheckoutConfigShared,
}                           from '@/components/Checkout/types'



export const checkoutConfigShared   : CheckoutConfigShared = {
    business                        : {
        name                        : process.env.NEXT_PUBLIC_BUSINESS_NAME  ?? '',
        url                         : process.env.NEXT_PUBLIC_BUSINESS_URL   ?? '',
    },
    intl                            : {
        locale                      : process.env.NEXT_PUBLIC_INTL_LOCALE || 'en-US',
        defaultTimezone             : Number.parseFloat(process.env.NEXT_PUBLIC_INTL_DEFAULT_TIMEZONE ?? '0') || 0, // GMT+0
        currencies                  : {
            IDR: {
                locale              : 'id-ID',
                sign                : 'Rp',
                fractionMin         : 2,
                fractionMax         : 2,
                fractionUnit        : 100,
            },
            USD: {
                locale              : 'en-US',
                sign                : '$',
                fractionMin         : 2,
                fractionMax         : 2,
                fractionUnit        : 0.01,
            },
        },
        /**
         * @deprecated Use `checkoutConfigXXX.payment.defaultCurrency` instead.
         */
        defaultCurrency             : process.env.NEXT_PUBLIC_INTL_DEFAULT_CURRENCY ?? 'USD',
        currencyConversionRounding  : 'ROUND',
    },
    payment                         : {
        currencyOptions             : [
            'USD',
            'IDR',
        ],
        defaultCurrency             : 'IDR',
        processors                  : {
            bank                    : {
                enabled             : true,
                supportedCurrencies : [
                    'IDR',
                ],
            },
            paypal                  : {
                enabled             : true,
                supportedCurrencies : [
                    'USD',
                ],
                savePaymentMethods  : {
                    card            : true,
                },
            },
            stripe                  : {
                enabled             : true,
                supportedCurrencies : [
                    'USD',
                ],
                savePaymentMethods  : {
                    card            : true,
                },
            },
            midtrans                : {
                enabled             : true,
                supportedCurrencies : [
                    'IDR',
                ],
                savePaymentMethods  : {
                    card            : false,
                },
            },
        },
        preferredProcessors         : [
            'midtrans',
            'stripe',
            'paypal',
            'bank',
        ],
    },
};

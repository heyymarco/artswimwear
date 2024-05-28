// configs:
import type {
    CheckoutConfigShared,
}                           from '@/components/Checkout/types'



export const checkoutConfigShared : CheckoutConfigShared = {
    business            : {
        name            : process.env.NEXT_PUBLIC_BUSINESS_NAME ?? '',
        url             : process.env.NEXT_PUBLIC_BUSINESS_URL  ?? '',
    },
    intl                : {
        locale          : process.env.NEXT_PUBLIC_INTL_LOCALE || 'id-ID',
        defaultTimeZone : Number.parseFloat(process.env.NEXT_PUBLIC_INTL_DEFAULT_TIMEZONE ?? '0') || 0, // GMT+0
    },
};

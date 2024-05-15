// configs:
import type {
    CheckoutConfigShared,
}                           from '@/components/Checkout/types'



export const checkoutConfigShared : CheckoutConfigShared = {
    business            : {
        name            : process.env.NEXT_PUBLIC_BUSINESS_NAME ?? '',
        url             : process.env.NEXT_PUBLIC_BUSINESS_URL  ?? '',
    },
};

// configs:
import type {
    CheckoutConfigClient,
}                           from '@/components/Checkout/types'

// internals:
import {
    checkoutConfigShared,
}                               from './checkout.config.shared'



export const checkoutConfigClient  : CheckoutConfigClient = {
    business                       : checkoutConfigShared.business,
    intl                           : checkoutConfigShared.intl,
    payment                        : checkoutConfigShared.payment,
};

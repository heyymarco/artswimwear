// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// configs:
export const paypalPaymentMethodEnabledOfAnyMethod    = (
    checkoutConfigShared.payment.processors.paypal.enabled
    &&
    !!checkoutConfigShared.payment.processors.paypal.savePaymentMethods
    &&
    Object.values(checkoutConfigShared.payment.processors.paypal.savePaymentMethods).some((value) => value)
);
export const stripePaymentMethodEnabledOfAnyMethod    = (
    checkoutConfigShared.payment.processors.stripe.enabled
    &&
    !!checkoutConfigShared.payment.processors.stripe.savePaymentMethods
    &&
    Object.values(checkoutConfigShared.payment.processors.stripe.savePaymentMethods).some((value) => value)
);
export const midtransPaymentMethodEnabledOfAnyMethod  = (
    checkoutConfigShared.payment.processors.midtrans.enabled
    &&
    !!checkoutConfigShared.payment.processors.midtrans.savePaymentMethods
    &&
    Object.values(checkoutConfigShared.payment.processors.midtrans.savePaymentMethods).some((value) => value)
);

export const paypalPaymentMethodEnabledOfCardMethod   = (
    checkoutConfigShared.payment.processors.paypal.enabled
    &&
    !!checkoutConfigShared.payment.processors.paypal.savePaymentMethods?.card
);
export const stripePaymentMethodEnabledOfCardMethod   = (
    checkoutConfigShared.payment.processors.stripe.enabled
    &&
    !!checkoutConfigShared.payment.processors.stripe.savePaymentMethods?.card
);
export const midtransPaymentMethodEnabledOfCardMethod = (
    checkoutConfigShared.payment.processors.midtrans.enabled
    &&
    !!checkoutConfigShared.payment.processors.midtrans.savePaymentMethods?.card
);
// zod:
import {
    z,
}                           from 'zod'

// models:
import {
    type CheckoutStep,
}                           from '@prisma/client'
import {
    type CheckoutDetail,
    type PaymentOption,
}                           from './types'
import {
    ModelIdSchema,
}                           from '../commons'
import {
    ShippingAddressDetailSchema,
    BillingAddressDetailSchema,
}                           from '../shippings'



// schemas:
export const CheckoutStepSchema = z.enum([
    'INFO',
    'SHIPPING',
    'PAYMENT',
    'PENDING',
    'PAID',
]) satisfies z.Schema<CheckoutStep>;



export const PaymentOptionSchema = z.enum([
    'CARD',
    'PAYPAL',
    
    'GOOGLEPAY',
    'APPLEPAY',
    'AMAZONPAY',
    'LINK',
    
    'QRIS',
    'GOPAY',
    'SHOPEEPAY',
    'INDOMARET',
    'ALFAMART',
    
    'MANUAL',
]) satisfies z.Schema<PaymentOption>;



export const CheckoutDetailSchema = z.object({
    // data:
    checkoutStep       : CheckoutStepSchema,
    shippingAddress    : ShippingAddressDetailSchema.nullable(),
    shippingProviderId : ModelIdSchema.nullable(),
    billingAsShipping  : z.boolean(),
    billingAddress     : BillingAddressDetailSchema.nullable(),
    paymentOption      : PaymentOptionSchema.nullable(),
}) satisfies z.Schema<CheckoutDetail>;

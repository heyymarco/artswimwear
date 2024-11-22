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
    type PaymentMethod,
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



export const PaymentMethodSchema = z.enum([
    'card',
    'paypal',
    
    'googlePay',
    'applePay',
    'amazonPay',
    'link',
    
    'qris',
    'gopay',
    'shopeepay',
    'indomaret',
    'alfamart',
    
    'manual',
]) satisfies z.Schema<PaymentMethod>;



export const CheckoutDetailSchema = z.object({
    // data:
    checkoutStep       : CheckoutStepSchema,
    shippingAddress    : ShippingAddressDetailSchema.nullable(),
    shippingProviderId : ModelIdSchema.nullable(),
    billingAsShipping  : z.boolean(),
    billingAddress     : BillingAddressDetailSchema.nullable(),
    paymentMethod      : PaymentMethodSchema.nullable(),
}) satisfies z.Schema<CheckoutDetail>;

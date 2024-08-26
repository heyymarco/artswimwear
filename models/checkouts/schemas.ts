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
    type CheckoutPaymentSession,
}                           from './types'
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



export const CheckoutPaymentSessionSchema = z.object({
    // data:
    paypalSession : z.string().min(1),
    expiresAt     : z.number().finite().nonnegative(), // use number instead of DateTime for easier fetch transport
    refreshAt     : z.number().finite().nonnegative(), // use number instead of DateTime for easier fetch transport
}) satisfies z.Schema<CheckoutPaymentSession>;



export const CheckoutDetailSchema = z.object({
    // data:
    checkoutStep       : CheckoutStepSchema,
    shippingAddress    : ShippingAddressDetailSchema.nullable(),
    shippingProviderId : z.string().min(1).nullable(),
    billingAsShipping  : z.boolean(),
    billingAddress     : BillingAddressDetailSchema.nullable(),
    paymentMethod      : PaymentMethodSchema.nullable(),
    paymentSession     : CheckoutPaymentSessionSchema.nullable(),
}) satisfies z.Schema<CheckoutDetail>;

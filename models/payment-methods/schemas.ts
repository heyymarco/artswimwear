// zod:
import {
    z,
}                           from 'zod'

// models:
import {
    type PaymentMethodProvider,
}                           from '@prisma/client'
import {
    type PaymentMethodDetail,
    type PaymentMethodUpdateRequest,
    type PaymentMethodSetupRequest,
    type PaymentMethodSortRequest,
    type PaymentMethodOfCurrencyRequest,
}                           from './types'
import {
    CurrencySchema,
    EmptyStringSchema,
    ModelIdSchema,
    PublicIdSchema,
    ModelNameSchema,
    
    MutationArgsSchema,
}                           from '../commons'
import {
    PaymentTypeSchema,
}                           from '../orders'
import {
    BillingAddressDetailSchema,
}                           from '../shippings'



export const PaymentMethodDetailSchema = z.object({
    // records:
    id             : ModelIdSchema,
    
    
    
    // data:
    currency       : CurrencySchema,
    
    type           : PaymentTypeSchema.extract(['CARD', 'PAYPAL']),
    brand          : ModelNameSchema,
    identifier     : z.string().trim().min(0).max(50), // EmailSchema
    
    expiresAt      : z.date().nullable(),
    
    billingAddress : BillingAddressDetailSchema.nullable(),
    
    priority       : z.number().finite().nonnegative(),
}) satisfies z.Schema<PaymentMethodDetail>;

export const PaymentMethodUpdateRequestSchema = MutationArgsSchema<Pick<PaymentMethodDetail, 'id'>>(
    PaymentMethodDetailSchema.pick({ id: true })
)
.and(
    z.object({
        vaultToken : PublicIdSchema,
        currency   : CurrencySchema,
    })
) satisfies z.Schema<PaymentMethodUpdateRequest>;



export const PaymentMethodProviderSchema = z.enum([
    'PAYPAL',
    'STRIPE',
    'MIDTRANS',
]) satisfies z.Schema<PaymentMethodProvider>;

export const PaymentMethodSetupRequestSchema = z.object({
    paymentMethodProvider : PaymentMethodProviderSchema,
    cardToken             : z.string().optional(),
    billingAddress        : BillingAddressDetailSchema.nullable(),
    
    id                    : z.union([
        ModelIdSchema,
        EmptyStringSchema,
    ]),
    currency              : CurrencySchema,
}) satisfies z.Schema<PaymentMethodSetupRequest>;



export const PaymentMethodSortRequestSchema = z.object({
    ids : z.array(ModelIdSchema).min(2),
}) satisfies z.Schema<PaymentMethodSortRequest>;



export const PaymentMethodOfCurrencyRequestSchema = z.object({
    currency : CurrencySchema,
}) satisfies z.Schema<PaymentMethodOfCurrencyRequest>;

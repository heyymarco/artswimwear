// zod:
import {
    z,
}                           from 'zod'
import {
    type PaymentMethodDetail,
    type PaymentMethodUpdateRequest,
}                           from './types'
import {
    CurrencySchema,
    ModelIdSchema,
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
    
    type           : PaymentTypeSchema,
    brand          : ModelNameSchema,
    identifier     : z.string().trim().min(0).max(50), // EmailSchema
    
    expiresAt      : z.date().nullable(),
    
    billingAddress : BillingAddressDetailSchema.nullable(),
}) satisfies z.Schema<PaymentMethodDetail>;

export const PaymentMethodUpdateRequestSchema = MutationArgsSchema<Pick<PaymentMethodDetail, 'id'>>(
    PaymentMethodDetailSchema.pick({ id: true })
) satisfies z.Schema<PaymentMethodUpdateRequest>;

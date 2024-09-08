// zod:
import {
    z,
}                           from 'zod'

// models:
import {
    type CustomerDetail,
    type GuestDetail,
    
    type CustomerPreferenceData,
}                           from './types'
import {
    HumanFullNameSchema,
    EmailSchema,
    ImageUrlSchema,
}                           from '../commons'



// schemas:
export const CustomerDetailSchema = z.object({
    // data:
    name     : HumanFullNameSchema,
    email    : EmailSchema,
    image    : ImageUrlSchema.nullable(),
}) satisfies z.Schema<Omit<CustomerDetail, 'id'|'username'>>;



export const GuestDetailSchema = z.object({
    // data:
    name     : HumanFullNameSchema,
    email    : EmailSchema,
}) satisfies z.Schema<Omit<GuestDetail, 'id'>>;



export const CustomerPreferenceDataSchema = z.object({
    // records:
    id           : z.string().min(1),
    
    
    
    // data:
    marketingOpt : z.boolean(),
    timezone     : z.number().int().finite().gte(-24).lte(24),
}) satisfies z.Schema<CustomerPreferenceData>

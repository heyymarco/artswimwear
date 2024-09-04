// zod:
import {
    z,
}                           from 'zod'

// models:
import {
    type CustomerDetail,
    type GuestDetail,
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

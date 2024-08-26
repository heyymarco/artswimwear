// models:
import {
    type ShippingAddressDetail,
    type BillingAddressDetail,
}                           from './types'
import {
    CountrySchema,
}                           from '../commons'

// zod:
import {
    z,
}                           from 'zod'



// schemas:
export const BaseAddressDetailSchema = z.object({
    // data:
    country   : CountrySchema,
    state     : z.string().trim().min(2).max(50),
    city      : z.string().trim().min(2).max(50),
    zip       : z.string().trim().min(2).max(11).nullable(),
    address   : z.string().trim().min(5).max(90),
    
    firstName : z.string().trim().min(2).max(30),
    lastName  : z.string().trim().min(1).max(30),
    phone     : z.string().trim().min(5).max(15),
}) satisfies z.Schema<ShippingAddressDetail & BillingAddressDetail>;

export const ShippingAddressDetailSchema = BaseAddressDetailSchema;
export const BillingAddressDetailSchema  = BaseAddressDetailSchema;

// models:
import {
    type CartDetail,
    type CartItemPreview,
}                           from './types'
import {
    CurrencySchema,
}                           from '../commons'
import {
    CheckoutDetailSchema,
}                           from '../checkouts'

// zod:
import {
    z,
}                           from 'zod'



export const CartItemPreviewSchema = z.object({
    // data:
    quantity   : z.number().int().finite().gte(1),
    
    // relations:
    productId  : z.string().min(1),
    variantIds : z.array(z.string().min(1)),
}) satisfies z.Schema<CartItemPreview>;



export const CartDetailSchema = z.object({
    currency : CurrencySchema,
    items    : z.array(CartItemPreviewSchema),
    checkout : CheckoutDetailSchema.omit({ paymentSession: true }).nullable(),
}) satisfies z.Schema<CartDetail>;

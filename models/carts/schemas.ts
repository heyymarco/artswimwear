// zod:
import {
    z,
}                           from 'zod'

// models:
import {
    type CartDetail,
    type CartItemPreview,
    type CartUpdateRequest,
}                           from './types'
import {
    CurrencySchema,
}                           from '../commons'
import {
    CheckoutDetailSchema,
}                           from '../checkouts'



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



export const CartUpdateRequestSchema = (
    CartDetailSchema.omit({
        // data:
        checkout : true,
    })
    .merge(
        CartDetailSchema.pick({
            // data:
            checkout : true,
        })
        .partial()
    )
) satisfies z.Schema<CartUpdateRequest>;

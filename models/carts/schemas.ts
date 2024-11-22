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
    ModelIdSchema,
    CurrencySchema,
}                           from '../commons'
import {
    CheckoutDetailSchema,
}                           from '../checkouts'



export const CartItemPreviewSchema = z.object({
    // data:
    quantity   : z.number().int().finite().gte(1),
    
    // relations:
    productId  : ModelIdSchema,
    variantIds : z.array(ModelIdSchema),
}) satisfies z.Schema<CartItemPreview>;



export const CartDetailSchema = z.object({
    currency : CurrencySchema,
    items    : z.array(CartItemPreviewSchema),
    checkout : CheckoutDetailSchema.nullable(),
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
    .merge(
        z.object({
            marketingOpt : z.boolean().optional(),
        })
    )
) satisfies z.Schema<CartUpdateRequest>;

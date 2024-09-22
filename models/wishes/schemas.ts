// zod:
import {
    z,
}                           from 'zod'

// models:
import {
    type UpdateWishGroupRequest,
    type DeleteWishGroupRequest,
    
    type GetWishPageRequest,
    type CreateOrUpdateWishRequest,
    type DeleteWishRequest,
}                           from './types'
import {
    EmptyStringSchema,
    ModelIdSchema,
    ModelNameSchema,
}                           from '../commons'



export const UpdateWishGroupRequestSchema = z.object({
    id        : z.union([ModelIdSchema, EmptyStringSchema]),
    name      : ModelNameSchema,
}) satisfies z.Schema<UpdateWishGroupRequest>;

export const DeleteWishGroupRequestSchema = z.object({
    id        : ModelIdSchema,
}) satisfies z.Schema<DeleteWishGroupRequest>;



export const GetWishPageRequestSchema = z.object({
    groupId   : ModelIdSchema/*.nullable()*/.optional(), // remove support for `null`; `string`: get grouped wishes, `undefined`: get all wishes (grouped + ungrouped), `null`: get ungrouped wishes
}) satisfies z.Schema<GetWishPageRequest>;

export const CreateOrUpdateWishRequestSchema = z.object({
    productId : ModelIdSchema,
    groupId   : ModelIdSchema.nullable(),
}) satisfies z.Schema<CreateOrUpdateWishRequest>;

export const DeleteWishRequestSchema = z.object({
    productId : ModelIdSchema,
}) satisfies z.Schema<DeleteWishRequest>;

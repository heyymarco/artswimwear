// zod:
import {
    z,
}                           from 'zod'

// models:
import {
    type UpdateWishGroupRequest,
    type DeleteWishGroupRequest,
    
    type GetWishRequest,
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



export const GetWishRequestSchema = z.object({
    groupId   : ModelIdSchema/*.nullable()*/.optional(), // remove null, we only filter wishes by groupId (string) or get all wishes (undefined)
}) satisfies z.Schema<GetWishRequest>;

export const CreateOrUpdateWishRequestSchema = z.object({
    productId : ModelIdSchema,
    groupId   : ModelIdSchema.nullable().optional(),
}) satisfies z.Schema<CreateOrUpdateWishRequest>;

export const DeleteWishRequestSchema = z.object({
    productId : ModelIdSchema,
}) satisfies z.Schema<DeleteWishRequest>;

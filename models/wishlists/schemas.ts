// zod:
import {
    z,
}                           from 'zod'

// models:
import {
    type UpdateWishlistGroupRequest,
    type DeleteWishlistGroupRequest,
    
    type GetWishlistRequest,
    type CreateOrUpdateWishlistRequest,
    type DeleteWishlistRequest,
}                           from './types'
import {
    EmptyStringSchema,
    ModelIdSchema,
    ModelNameSchema,
}                           from '../commons'



export const UpdateWishlistGroupRequestSchema = z.object({
    id        : z.union([ModelIdSchema, EmptyStringSchema]),
    name      : ModelNameSchema,
}) satisfies z.Schema<UpdateWishlistGroupRequest>;

export const DeleteWishlistGroupRequestSchema = z.object({
    id        : ModelIdSchema,
}) satisfies z.Schema<DeleteWishlistGroupRequest>;



export const GetWishlistRequestSchema = z.object({
    groupId   : ModelIdSchema.nullable().optional(),
}) satisfies z.Schema<GetWishlistRequest>;

export const CreateOrUpdateWishlistRequestSchema = z.object({
    productId : ModelIdSchema,
    groupId   : ModelIdSchema.nullable().optional(),
}) satisfies z.Schema<CreateOrUpdateWishlistRequest>;

export const DeleteWishlistRequestSchema = z.object({
    productId : ModelIdSchema,
}) satisfies z.Schema<DeleteWishlistRequest>;

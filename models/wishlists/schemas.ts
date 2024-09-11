// zod:
import {
    z,
}                           from 'zod'

// models:
import {
    type CreateWishlistGroupRequest,
    type UpdateWishlistGroupRequest,
    type DeleteWishlistGroupRequest,
    
    type GetWishlistRequest,
    type CreateOrUpdateWishlistRequest,
    type DeleteWishlistRequest,
}                           from './types'
import {
    ModelIdSchema,
    ModelNameSchema,
}                           from '../commons'



export const CreateWishlistGroupRequestSchema = z.object({
    name      : ModelNameSchema,
}) satisfies z.Schema<CreateWishlistGroupRequest>;

export const UpdateWishlistGroupRequestSchema = z.object({
    id        : ModelIdSchema,
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

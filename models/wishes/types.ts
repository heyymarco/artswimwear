// models:
import {
    type WishGroup,
    type Wish,
}                           from '@prisma/client'



export interface WishGroupDetail
    extends
        Omit<WishGroup,
            // records:
            |'createdAt'
            
            
            
            // relations:
            |'parentId'
        >
{
}



export interface WishDetail
    extends
        Omit<Wish,
            // records:
            |'id'
            |'updatedAt'
            
            
            
            // relations:
            |'parentId'
            |'groupId'
        >
{
}



export interface UpdateWishGroupRequest
    extends
        Pick<WishGroup,
            // records:
            |'id'
            
            
            
            // data:
            |'name'
        >
{
}

export interface DeleteWishGroupRequest
    extends
        Pick<WishGroup,
            // records:
            |'id'
        >
{
}



export interface GetWishPageRequest
    extends
        Partial<Pick<Wish,
            // relations:
            |'groupId'
        >>
{
    groupId?: string // remove support for `null`; `string`: get grouped wishes, `undefined`: get all wishes (grouped + ungrouped), `null`: get ungrouped wishes
}

export interface CreateOrUpdateWishRequest
    extends
        Pick<Wish,
            // relations:
            |'productId'
        >,
        Pick<Wish,
            // relations:
            |'groupId'
        >
{
}

export interface DeleteWishRequest
    extends
        Pick<Wish,
            // relations:
            |'productId'
        >
{
}

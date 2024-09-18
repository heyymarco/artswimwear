// models:
import {
    type WishGroup,
    type Wish,
}                           from '@prisma/client'



export interface WishGroupDetail
    extends
        Omit<WishGroup,
            // records:
            |'updatedAt'
            
            
            
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



export interface GetWishRequest
    extends
        Partial<Pick<Wish,
            // relations:
            |'groupId'
        >>
{
    groupId ?: string|undefined // remove null, we only filter wishes by groupId (string) or get all wishes (undefined)
}

export interface CreateOrUpdateWishRequest
    extends
        Pick<Wish,
            // relations:
            |'productId'
        >,
        Partial<Pick<Wish,
            // relations:
            |'groupId'
        >>
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

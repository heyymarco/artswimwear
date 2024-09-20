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



export interface GetWishOfGroupPageRequest
    extends
        Pick<Wish,
            // relations:
            |'groupId'
        >
{
    groupId: string // remove null, we only filter wishes by groupId (string)
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

// models:
import {
    type WishlistGroup,
    type Wishlist,
}                           from '@prisma/client'



export interface WishlistGroupDetail
    extends
        WishlistGroup
{
}



export interface WishlistDetail
    extends
        Omit<Wishlist,
            // records:
            |'id'
            |'updatedAt'
            
            
            
            // relations:
            |'parentId'
            |'groupId'
        >
{
}



export interface CreateWishlistGroupRequest
    extends
        Pick<WishlistGroup,
            // data:
            |'name'
        >
{
}

export interface UpdateWishlistGroupRequest
    extends
        Pick<WishlistGroup,
            // records:
            |'id'
            
            
            
            // data:
            |'name'
        >
{
}

export interface DeleteWishlistGroupRequest
    extends
        Pick<WishlistGroup,
            // records:
            |'id'
        >
{
}



export interface GetWishlistRequest
    extends
        Pick<Wishlist,
            // relations:
            |'groupId'
        >
{
}

export interface CreateOrUpdateWishlistRequest
    extends
        Pick<Wishlist,
            // relations:
            |'productId'
        >,
        Partial<Pick<Wishlist,
            // relations:
            |'groupId'
        >>
{
}

export interface DeleteWishlistRequest
    extends
        Pick<Wishlist,
            // relations:
            |'productId'
        >
{
}

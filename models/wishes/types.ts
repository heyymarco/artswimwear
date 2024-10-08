// models:
import {
    type WishGroup,
    type Wish,
}                           from '@prisma/client'
import {
    type Pagination,
}                           from '../commons'
import {
    type ProductPreview,
}                           from '../products'



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
    deleteBoth ?: boolean
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

export interface GetWishPageResponse
    extends
        Pagination<ProductPreview>
{
    wishGroup : WishGroupDetail|undefined
}

export interface CreateOrUpdateWishParam
    extends
        Pick<Wish,
            // relations:
            |'groupId'
        >
{
    productPreview: ProductPreview
}
export interface CreateOrUpdateWishRequest
    extends
        Pick<Wish,
            // relations:
            |'groupId'
        >
{
    productId: ProductPreview['id']
}

export interface DeleteWishRequest
    extends
        Pick<Wish,
            // relations:
            |'productId'
        >
{
}

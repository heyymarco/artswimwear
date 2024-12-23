// models:
import {
    type Cart,
    type CartItem,
}                           from '@prisma/client'
import {
    type CheckoutDetail,
    type CheckoutSession,
}                           from '../checkouts'



export interface CartDetail
    extends
        Omit<Cart,
            // records:
            |'id'
            
            // relations:
            |'parentId'
        >
{
    // data:
    items    : CartItemPreview[]
    checkout : CheckoutDetail|null
}
export interface CartItemPreview
    extends
        Omit<CartItem,
            // records:
            |'id'
            
            // relations:
            |'parentId'
        >
{
}



export interface CartSession
    extends
        Omit<CartDetail,
            |'checkout'
        >
{
    // version control:
    version     ?: number
    
    
    
    // auth:
    hasLoggedIn ?: boolean,
    
    
    
    // states:
    isCartShown  : boolean
}



export interface CartUpdateRequest
    extends
        Omit<CartDetail,
            // data:
            |'checkout' // convert to optional
        >,
        Partial<Pick<CartDetail,
            // data:
            |'checkout' // convert to optional
        >>,
        Partial<Pick<CheckoutSession, 'marketingOpt'>>
{
}

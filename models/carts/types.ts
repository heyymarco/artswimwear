// models:
import {
    type Cart,
    type CartItem,
}                           from '@prisma/client'



export interface CartDetail
    extends
        Omit<Cart,
            // records:
            |'id'
            
            // relations:
            |'parentId'
        >
{
    items : CartItemPreview[]
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
        CartDetail
{
    // version control:
    version     ?: number
    
    
    
    // cart dialogs:
    isCartShown  : boolean
}

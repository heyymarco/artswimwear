// models:
import {
    type Cart,
    type CartItem,
}                           from '@prisma/client'
import {
    type CheckoutDetail,
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
    checkout : Omit<CheckoutDetail, 'paymentSession'>|null
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
    
    
    
    // states:
    isCartShown  : boolean
}



export interface CartUpdateRequest
    extends
        Omit<CartDetail,
            // data:
            'checkout' // convert to optional
        >,
        Partial<Pick<CartDetail,
            // data:
            'checkout' // convert to optional
        >>
{
}

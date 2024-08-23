export interface CartDetail {
    // cart data:
    currency           : string
    items              : CartItem[]
}
export interface CartItem {
    productId   : string
    variantIds  : string[]
    quantity    : number
}

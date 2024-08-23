// models:
import {
    type Checkout,
    type DraftOrdersOnProducts,
}                           from '@prisma/client'

// contexts:
import type {
    // types:
    CartState,
}                           from '@/components/Cart'

// models:
import {
    type ShippingAddressDetail,
    type BillingAddressDetail,
    type PaymentDetail,
}                           from '@/models'

// stores:
import type {
    // types:
    CheckoutState as ReduxCheckoutState,
}                           from '@/store/features/checkout/checkoutSlice'



export interface CheckoutDetail
    extends
        Omit<Checkout,
            // records:
            |'id'
            |'updatedAt'
            
            // relations:
            |'parentId'
        >
{
    paymentMethod : PaymentMethod|null
}



export type PaymentMethod =
    |'card'
    |'paypal'
    
    |'googlePay'
    |'applePay'
    |'amazonPay'
    |'link'
    
    |'qris'
    |'gopay'
    |'shopeepay'
    |'indomaret'
    |'alfamart'
    
    |'manual'

export type TotalShippingCostStatus =
    |'ready'
    |'loading'
    |'obsolete'



export interface DetailedItem
    extends
        Omit<DraftOrdersOnProducts,
            // records:
            |'id'
            
            // data:
            |'price' // renamed to priceConverted
            
            // relations:
            |'parentId'
        >
{
    // readable:
    productName    : string
    variantNames   : string[]
    
    // data:
    priceConverted : DraftOrdersOnProducts['price'] // renamed to priceConverted
}

export interface CreateOrderOptions {
    currency                    : string
    totalCostConverted          : number
    totalProductPriceConverted  : number
    totalShippingCostConverted  : number|null
    
    detailedItems               : DetailedItem[]
    
    hasShippingAddress          : boolean
    shippingAddress             : ShippingAddressDetail
    
    hasBillingAddress          ?: boolean
    billingAddress             ?: BillingAddressDetail|null
}
export interface AuthorizedFundData {
    paymentId     : string
    paymentCode  ?: string
    redirectData ?: string
    expires      ?: Date
}



export interface FinishedOrderState {
    cartItems                 : CartState['cartItems'  ]
    productList               : CartState['productList']
    
    checkoutState             : ReduxCheckoutState
    totalShippingCost         : number|null|undefined
    paymentDetail             : PaymentDetail|null
    
    isShippingAddressRequired : boolean
}



export type BusyState =
    | false // idle
    | 'checkShipping'
    | 'preparePayment'
    | 'transaction'
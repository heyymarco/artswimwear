// models:
import {
    type DraftOrdersOnProducts,
    
    type Checkout,
    type CheckoutPaymentSession,
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
}                           from '../shippings'
import {
    type PaymentDetail,
}                           from '../orders'
import {
    type CustomerOrGuestPreview,
    type CustomerOrGuestPreferenceDetail,
}                           from '../customers'



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
    // data:
    shippingAddress : ShippingAddressDetail|null
    billingAddress  : BillingAddressDetail|null
    paymentMethod   : PaymentMethod|null
    paymentSession  : CheckoutPaymentSessionDetail|null
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



export interface CheckoutPaymentSessionDetail
    extends
        Omit<CheckoutPaymentSession,
            // records:
            |'id'
            
            // relations:
            |'parentId'
        >
{
}



export interface CheckoutSession
    extends
        CheckoutDetail,
        Pick<CustomerOrGuestPreferenceDetail,
            |'marketingOpt'
        >
{
    // version control:
    version           ?: number
    
    
    
    // customer data:
    customerValidation : boolean
    customer           : CustomerOrGuestPreview|undefined
    
    
    
    // shipping data:
    shippingValidation : boolean
    
    
    
    // billing data:
    billingValidation  : boolean
    
    
    
    // payment data:
    paymentValidation  : boolean
}



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
    
    checkoutSession           : CheckoutSession
    totalShippingCost         : number|null|undefined
    paymentDetail             : PaymentDetail|null
    
    isShippingAddressRequired : boolean
}



export type BusyState =
    | false // idle
    | 'checkShipping'
    | 'preparePayment'
    | 'transaction'
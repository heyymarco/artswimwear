// models:
import {
    type DraftOrderItem,
    
    type Checkout,
    // type CheckoutPaymentSession,
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
import {
    type CartDetail,
}                           from '../carts'

// paypal:
import {
    type CreateOrderData as PaypalCreateOrderData,
}                           from '@paypal/paypal-js'



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



export interface CheckoutPaymentSession { // a mock of Prisma's `CheckoutPaymentSession` model
    // data:
    paypalSession : string
    expiresAt     : number // use number instead of DateTime for easier fetch transport
    refreshAt     : number // use number instead of DateTime for easier fetch transport
}
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



export interface FinishedOrderState {
    cartState                 : Pick<CartState, 'items'|'currency'>
    productPreviews           : CartState['productPreviews']
    
    checkoutSession           : CheckoutSession
    totalShippingCost         : number|null|undefined
    paymentDetail             : PaymentDetail|null
    
    isShippingAddressRequired : boolean
}



export type TotalShippingCostStatus =
    |'ready'
    |'loading'
    |'obsolete'



export interface DetailedItem
    extends
        Omit<DraftOrderItem,
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
    priceConverted : DraftOrderItem['price'] // renamed to priceConverted
}

export interface CreateOrderOptions {
    currency                    : string
    totalCostConverted          : number
    totalProductPriceConverted  : number
    totalShippingCostConverted  : number|null
    
    detailedItems               : DetailedItem[]
    
    hasShippingAddress          : boolean
    shippingAddress             : ShippingAddressDetail|null
    
    hasBillingAddress          ?: boolean
    billingAddress             ?: BillingAddressDetail|null
}
export interface AuthorizedFundData {
    paymentId     : string
    paymentCode  ?: string
    redirectData ?: string
    expires      ?: Date
}



export type BusyState =
    | false // idle
    | 'checkShipping'
    | 'preparePayment'
    | 'transaction'



export interface PlaceOrderRequestOptions
    extends
        Omit<Partial<PaypalCreateOrderData>,
            |'paymentSource' // replaced with more options
        >
{
    simulateOrder ?: boolean
    
    paymentSource ?: // replaced with more options
        // manual:
        |'manual'
        
        // paypal:
        |PaypalCreateOrderData['paymentSource']
        
        // stripe:
        |'stripeCard'
        |'stripeExpress'
        
        // midtrans:
        |'midtransCard'|'midtransQris'|'gopay'|'shopeepay'|'indomaret'|'alfamart'
    
    cardToken     ?: string
    captcha       ?: string
}
export interface PlaceOrderRequestBasic
    extends
        Omit<CartDetail,          // cart item(s)
            |'checkout'
        >,
        
        PlaceOrderRequestOptions, // options: pay manually | paymentSource
        
        Partial<Pick<CustomerOrGuestPreferenceDetail,
            |'marketingOpt'       // conditionally required if no simulateOrder
        >>
{
    // customer data:
    customer ?: CustomerOrGuestPreview|undefined // conditionally required if no simulateOrder and not loggedIn (order as guest)
}
export interface PlaceOrderRequestWithShippingAddress
    extends
        Pick<CheckoutDetail,
            |'shippingAddress'
            |'shippingProviderId'
        >
{
}
export interface PlaceOrderRequestWithBillingAddress
    extends
        Pick<CheckoutDetail,
            |'billingAddress'
        >
{
}
export type PlaceOrderRequest =
    |PlaceOrderRequestBasic                                                       // non_physical_product, without_credit_card
    |PlaceOrderRequestWithShippingAddress                                         //     physical_product, without_credit_card
    |PlaceOrderRequestWithBillingAddress                                          // non_physical_product,    with_credit_card
    |(PlaceOrderRequestWithShippingAddress & PlaceOrderRequestWithBillingAddress) //     physical_product,    with_credit_card



export interface PlaceOrderDetail
    extends
        Pick<AuthorizedFundData,
            |'redirectData'
            |'expires'
        >
{
    orderId : string
}



export interface MakePaymentOptions {
    cancelOrder ?: true
}

export interface MakePaymentRequestBasic
    extends
        Omit<MakePaymentOptions, 'cancelOrder'> // options: empty yet
{
    orderId : string
}
export interface MakePaymentRequestWithBillingAddress
    extends
        MakePaymentRequestBasic
{
    // billing data:
    billingAddress      : BillingAddressDetail|null
}
export interface MakePaymentRequestWithCancelation
    extends
        Pick<MakePaymentRequestBasic, 'orderId'>,
        Required<Pick<MakePaymentOptions, 'cancelOrder'>>
{
}
export type MakePaymentRequest =
    |MakePaymentRequestBasic
    |MakePaymentRequestWithBillingAddress
    |MakePaymentRequestWithCancelation



export interface PaymentDeclined {
    error : string
}



export interface ShowOrderRequest {
    orderId : string
}



export interface LimitedStockItem {
    productId   : string
    variantIds  : string[]
    stock       : number
}

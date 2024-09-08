import {
    // types:
    type WysiwygEditorState,
}                           from '@/components/editors/WysiwygEditor/types'

// models:
import {
    type Prisma,
    
    type Payment,
    type PaymentConfirmation,
    type DraftOrder,
    type Order,
    type OrderCurrency,
    type OrdersOnProducts,
    type DraftOrdersOnProducts,
    
    type Shipment,
}                           from '@prisma/client'
import {
    type ShippingAddressDetail,
    type BillingAddressDetail,
}                           from '../shippings'
import {
    type CustomerOrGuestPreview,
    type CustomerDetail,
    type CustomerOrGuestPreferenceDetail,
}                           from '../customers'
import {
    type CartDetail,
}                           from '../carts'
import {
    type CheckoutDetail,
}                           from '../checkouts'

// templates:
import {
    // types:
    type CustomerOrGuestData,
}                           from '@/components/Checkout/templates/orderDataContext'

// paypal:
import {
    type CreateOrderData as PaypalCreateOrderData,
}                           from '@paypal/paypal-js'



// types:
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



export interface DraftOrderDetail
    extends
        Omit<DraftOrder,
            // records:
            |'expiresAt'
            
            // data:
            // |'paymentId'  // required for `commitDraftOrder()`, do NOT omit
            
            // relations:
            // |'customerId' // required for `commitDraftOrder()`, do NOT omit
            // |'guestId'    // required for `commitDraftOrder()`, do NOT omit
        >
{
    // data:
    currency        : OrderCurrencyDetail|null
    shippingAddress : ShippingAddressDetail|null
}



export interface OrderDetail
    extends
        Omit<Order,
            // records:
            |'updatedAt'
            
            // relations:
            |'customerId'
            |'guestId'
        >
{
    // data:
    currency        : OrderCurrencyDetail|null
    shippingAddress : ShippingAddressDetail|null
    payment         : PaymentDetail|null
}

export interface OrderDetailWithOptions
    extends
        OrderDetail
{
    sendConfirmationEmail?: boolean
}



export interface PublicOrderDetail
    extends
        Pick<Order,
            // records:
            |'id'
            |'createdAt'
            
            // data:
            |'shippingCost'
            |'shippingProviderId'
            
            |'orderStatus'
        >
{
    currency            : OrderCurrency['currency']
    
    shippingAddress     : ShippingAddressDetail|null
    
    payment             : Pick<Payment,
        // data:
        |'type'
        |'brand'
        |'identifier'
        |'expiresAt'
        
        |'amount'
    >|null
    paymentConfirmation : Pick<PaymentConfirmation,
        // records:
        |'reportedAt'
        |'reviewedAt'
        
        // data:
        |'amount'
        |'payerName'
        |'paymentDate'
        
        |'originatingBank'
        |'destinationBank'
        
        |'rejectionReason'
    >|null
    
    shipment            : Pick<Shipment,
        // data:
        |'token'
        
        |'carrier'
        |'number'
    >|null
    
    items               : Pick<OrdersOnProducts,
        // data:
        |'price'
        |'quantity'
        
        // relations:
        |'productId'
        |'variantIds'
    >[]
}



export interface OrderCurrencyDetail
    extends
        Omit<OrderCurrency,
            // records:
            |'id'
            
            // relations:
            |'parentId'
        >
{
}



export interface PaymentDetail
    extends
        Omit<Payment,
            // records:
            |'id'
            
            // data:
            |'expiresAt' // converted to optional
            
            // relations:
            |'parentId'
        >
{
    // data:
    expiresAt      ?: Payment['expiresAt'] // converted to optional
    billingAddress ?: BillingAddressDetail|null
    
    paymentId      ?: string // an optional token for make manual_payment
}



export interface CustomerData
    extends
        Pick<CustomerDetail,
            // records:
            |'id'
        >,
        Pick<CustomerOrGuestData,
            |'preference'
        >
{
}



export interface CreateDraftOrderData
    extends
        // bases:
        Omit<CreateOrderDataBasic,
            // extended data:
            |'payment'
            |'paymentConfirmationToken'
        >
{
    // temporary data:
    expiresAt       : Date
    paymentId       : string // redefined paymentId as non_undefined
    
    // extended data:
    customerOrGuest : CustomerData|CustomerOrGuestData // customer|guest data from orders route
}



export interface FindDraftOrderByIdData<TSelect extends Prisma.DraftOrderSelect> {
    orderId     ?: string|null
    paymentId   ?: string|null
    
    orderSelect  : TSelect
}



export interface CreateOrderDataBasic {
    // primary data:
    orderId                  : string
    paymentId                : string|undefined // will be random_auto_generated if undefined
    items                    : Omit<OrdersOnProducts,
        // records:
        |'id'
        
        // relations:
        |'parentId'
    >[]
    currency                 : OrderCurrencyDetail|null
    shippingAddress          : ShippingAddressDetail|null
    shippingCost             : number|null
    shippingProviderId       : string|null
    
    // extended data:
    payment                  : PaymentDetail
    paymentConfirmationToken : string|null
}
export type CreateOrderData =
    &CreateOrderDataBasic
    &(
        |{
            // extended data:
            customerOrGuest  : CustomerData|CustomerOrGuestData // customer|guest data from orders route
        }
        |{
            // extended data:
            customerId       : string|null // customer|guest data from DraftOrder
            guestId          : string|null // customer|guest data from DraftOrder
        }
    )



export interface FindPaymentByIdData {
    paymentId : string
}



export type CommitDraftOrder = Omit<DraftOrderDetail,
    // records:
    |'createdAt'
> & {
    items : Omit<DraftOrdersOnProducts,
        // records:
        |'id'
        
        // relations:
        |'parentId'
    >[]
}
export interface CommitDraftOrderData {
    draftOrder : CommitDraftOrder
    payment    : PaymentDetail
}



export type RevertDraftOrder = Pick<DraftOrderDetail,
    // records:
    |'id'
    
    // data:
    |'orderId'
> & {
    items : Pick<DraftOrdersOnProducts,
        // data:
        |'quantity'
        
        // relations:
        |'productId'
        |'variantIds'
    >[]
}
export interface RevertDraftOrderData {
    draftOrder: RevertDraftOrder
}



export interface FindOrderByIdData<TSelect extends Prisma.OrderSelect> {
    id          ?: string|null
    orderId     ?: string|null
    paymentId   ?: string|null
    
    orderSelect  : TSelect
}



export type CancelOrder = Pick<OrderDetail,
    |'id'
    
    |'orderId'
    
    |'orderStatus'
> & {
    payment : Pick<PaymentDetail,
        |'type'
    >|null
    items : Pick<OrdersOnProducts,
        // data:
        |'quantity'
        
        // relations:
        |'productId'
        |'variantIds'
    >[]
}

export interface CancelOrderData<TSelect extends Prisma.OrderSelect> {
    order              : CancelOrder
    isExpired         ?: boolean
    deleteOrder       ?: boolean
    cancelationReason ?: WysiwygEditorState|null
    
    orderSelect        : TSelect
}



export type CommitOrder = Pick<OrderDetail,
    // records:
    |'id'
>
export interface CommitOrderData {
    order   : CommitOrder
    payment : Pick<PaymentDetail, 'amount'|'fee'> & Partial<Omit<PaymentDetail, 'amount'|'fee'>>
}

import {
    // types:
    type WysiwygEditorState,
}                           from '@/components/editors/WysiwygEditor/types'

// models:
import {
    type Prisma,
    
    type Customer,
    type CustomerPreference,
    type Guest,
    type GuestPreference,
    type Payment,
    type DraftOrder,
    type Order,
    type OrderCurrency,
    type OrdersOnProducts,
    type DraftOrdersOnProducts,
}                           from '@prisma/client'
import {
    type ShippingAddressDetail,
    type BillingAddressDetail,
}                           from '../shippings'

// templates:
import type {
    // types:
    CustomerOrGuestData,
}                           from '@/components/Checkout/templates/orderDataContext'



// types:
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



export type CustomerOrGuest =
    &Pick<CustomerDetail, keyof CustomerDetail & keyof GuestDetail>
    &Pick<GuestDetail   , keyof CustomerDetail & keyof GuestDetail>
export type CustomerOrGuestPreference =
    &Pick<CustomerPreference, keyof CustomerPreference & keyof GuestPreference>
    &Pick<GuestPreference   , keyof CustomerPreference & keyof GuestPreference>
export type CustomerOrGuestPreferenceDetail = Omit<CustomerOrGuestPreference,
    // records:
    |'id'
    
    // relations:
    |'parentId'
>



export interface CustomerDetail
    extends
        Omit<Customer,
            |'createdAt'
            |'updatedAt'
            
            |'emailVerified'
        >
{
    // data:
    username : string|null
}

export interface GuestDetail
    extends
        Omit<Guest,
            |'createdAt'
            |'updatedAt'
            
            |'emailVerified'
        >
{
    // data:
    username : string|null
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
    customerOrGuest : CustomerOrGuestData
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
            customerOrGuest  : CustomerOrGuestData
        }
        |{
            // extended data:
            customerId       : string|null
            guestId          : string|null
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

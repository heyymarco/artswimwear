import type {
    // types:
    WysiwygEditorState,
}                           from '@/components/editors/WysiwygEditor/types'

// models:
import type {
    Prisma,
    
    Customer,
    CustomerPreference,
    Guest,
    GuestPreference,
    Address,
    Payment,
    PaymentConfirmation,
    PreferredCurrency,
    Order,
    OrdersOnProducts,
    DraftOrder,
    DraftOrdersOnProducts,
    ShippingTracking,
}                           from '@prisma/client'

// templates:
import type {
    // types:
    CustomerOrGuestData,
}                           from '@/components/Checkout/templates/orderDataContext'



// types:
export type CustomerOrGuest =
    &Pick<Customer, keyof Customer & keyof Guest>
    &Pick<Guest   , keyof Customer & keyof Guest>
export type CustomerOrGuestPreference =
    &Pick<CustomerPreference, keyof CustomerPreference & keyof GuestPreference>
    &Pick<GuestPreference   , keyof CustomerPreference & keyof GuestPreference>
export type CustomerOrGuestPreferenceData = Omit<CustomerOrGuestPreference,
    // records:
    |'id'
    
    // relations:
    |'customerId'
    |'guestId'
>



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
        |'orderId'
    >[]
    preferredCurrency        : PreferredCurrency|null
    shippingAddress          : Address|null
    shippingCost             : number|null
    shippingProviderId       : string|null
    
    // extended data:
    payment                  : Payment
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



export type CommitDraftOrder = Omit<DraftOrder,
    // records:
    |'createdAt'
> & {
    items : Omit<DraftOrdersOnProducts,
        // records:
        |'id'
        
        // relations:
        |'draftOrderId'
    >[]
}
export interface CommitDraftOrderData {
    draftOrder : CommitDraftOrder
    payment    : Payment
}



export type RevertDraftOrder = Pick<DraftOrder,
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



export type CancelOrder = Pick<Order,
    |'id'
    
    |'orderId'
    
    |'orderStatus'
> & {
    payment : Pick<Payment,
        |'type'
    >
    items : Pick<OrdersOnProducts,
        |'productId'
        |'variantIds'
        
        |'quantity'
    >[]
}

export interface CancelOrderData<TSelect extends Prisma.OrderSelect> {
    order              : CancelOrder
    isExpired         ?: boolean
    deleteOrder       ?: boolean
    cancelationReason ?: WysiwygEditorState|null
    
    orderSelect        : TSelect
}



export type CommitOrder = Pick<Order,
    // records:
    |'id'
>
export interface CommitOrderData {
    order   : CommitOrder
    payment : Pick<Payment, 'amount'|'fee'> & Partial<Omit<Payment, 'amount'|'fee'>>
}

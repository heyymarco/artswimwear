// models:
import type {
    Payment,
    DraftOrdersOnProducts,
}                           from '@prisma/client'

// contexts:
import type {
    // types:
    CartState,
}                           from '@/components/Cart'

// stores:
import type {
    // types:
    CheckoutState as ReduxCheckoutState,
}                           from '@/store/features/checkout/checkoutSlice'



export type CheckoutStep =
    |'info'
    |'shipping'
    |'payment'
    |'pending'
    |'paid'
export type PaymentMethod =
    |'card'
    |'paypal'
    |'qris'
    |'gopay'
    |'shopeepay'
    |'manual'



export type DetailedItem =
    &Omit<DraftOrdersOnProducts, 'id'|'draftOrderId'|'price'>
    &{ productName: string, variantNames: string[], priceConverted: DraftOrdersOnProducts['price'] }

export interface CreateOrderOptions {
    preferredCurrency           : string
    totalCostConverted          : number
    totalProductPriceConverted  : number
    totalShippingCostConverted  : number|null
    
    detailedItems               : DetailedItem[]
    
    hasShippingAddress          : boolean
    shippingFirstName           : string|undefined
    shippingLastName            : string|undefined
    shippingPhone               : string|undefined
    shippingAddress             : string|undefined
    shippingCity                : string|undefined
    shippingZone                : string|undefined
    shippingZip                 : string|undefined
    shippingCountry             : string|undefined
    
    hasBillingAddress          ?: boolean
    billingFirstName           ?: string|undefined
    billingLastName            ?: string|undefined
    billingPhone               ?: string|undefined
    billingAddress             ?: string|undefined
    billingCity                ?: string|undefined
    billingZone                ?: string|undefined
    billingZip                 ?: string|undefined
    billingCountry             ?: string|undefined
}
export interface AuthorizedFundData {
    paymentId     : string
    redirectData ?: string
    expires      ?: Date
}
export interface PaymentDetail
    extends
        Omit<Payment,
            |'billingAddress'
        >
{
}



export interface FinishedOrderState {
    cartItems         : CartState['cartItems'  ]
    productList       : CartState['productList']
    
    checkoutState     : ReduxCheckoutState
    totalShippingCost : number|null|undefined
    paymentDetail     : PaymentDetail
}



export type BusyState =
    | false // idle
    | 'checkShipping'
    | 'transaction'
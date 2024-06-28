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
    |''
    |'card'
    |'paypal'
    |'qris'
    |'gopay'
    |'shopeepay'
    |'indomaret'
    |'alfamart'
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
    shippingCountry             : string|undefined
    shippingState               : string|undefined
    shippingCity                : string|undefined
    shippingZip                 : string|undefined
    shippingAddress             : string|undefined
    shippingFirstName           : string|undefined
    shippingLastName            : string|undefined
    shippingPhone               : string|undefined
    
    hasBillingAddress          ?: boolean
    billingCountry             ?: string|undefined
    billingState               ?: string|undefined
    billingCity                ?: string|undefined
    billingZip                 ?: string|undefined
    billingAddress             ?: string|undefined
    billingFirstName           ?: string|undefined
    billingLastName            ?: string|undefined
    billingPhone               ?: string|undefined
}
export interface AuthorizedFundData {
    paymentId     : string
    paymentCode  ?: string
    redirectData ?: string
    expires      ?: Date
}
export interface PaymentDetail
    extends
        Omit<Payment,
            |'expiresAt'
            |'billingAddress'
        >
{
    paymentId ?: string
    expiresAt ?: Payment['expiresAt']
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
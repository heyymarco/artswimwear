// models:
import type {
    DraftOrdersOnProducts,
}                           from '@prisma/client'



export type DetailedItem =
    &Omit<DraftOrdersOnProducts, 'id'|'draftOrderId'|'price'>
    &{ productName: string, variantNames: string[], priceConverted: DraftOrdersOnProducts['price'] }

export interface CreateOrderOptions {
    preferredCurrency          : string
    totalCostConverted         : number
    totalProductPriceConverted : number
    totalShippingCostConverted : number|null
    
    hasShippingAddress         : boolean
    shippingFirstName          : string|undefined
    shippingLastName           : string|undefined
    shippingPhone              : string|undefined
    shippingAddress            : string|undefined
    shippingCity               : string|undefined
    shippingZone               : string|undefined
    shippingZip                : string|undefined
    shippingCountry            : string|undefined
    
    detailedItems              : DetailedItem[]
}
export interface CaptureFundData {
    paymentSource : any
    paymentAmount : number
    paymentFee    : number
}
// react:
import {
    // react:
    default as React,
}                           from 'react'

// redux:
import type {
    EntityState
}                           from '@reduxjs/toolkit'

// models:
import type {
    CustomerOrGuest,
    CustomerOrGuestPreferenceData,
}                           from '@/models'
import type {
    Product,
    Variant,
    PaymentConfirmation,
    Order,
    OrdersOnProducts,
    ShippingTracking,
}                           from '@prisma/client'

// stores:
import type {
    // types:
    CountryPreview,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from '@/libs/mock-context'
import type {
    // types:
    MatchingShipping,
}                           from '@/libs/shippings'



// contexts:
export type ProductData = Pick<Product, 'name'> & {
    image         : Product['images'][number]|null
    imageBase64  ?: string
    imageId      ?: string
    
    // relations:
    variantGroups : Pick<Variant, 'id'|'name'>[][]
}
export type OrderItemsAndData = Pick<OrdersOnProducts, 'price'|'quantity'|'variantIds'> & {
    product : ProductData|null
}
export type CustomerOrGuestData = Omit<CustomerOrGuest,
    // records:
    |'id'
    |'createdAt'
    |'updatedAt'
> & {
    preference : CustomerOrGuestPreferenceData|null
}
export type OrderAndData = Order & {
    items                : OrderItemsAndData[]
    shippingProvider     : MatchingShipping|null
    customerOrGuest      : CustomerOrGuestData|null
}
export interface OrderDataApi {
    // data:
    order                : OrderAndData
    customerOrGuest      : CustomerOrGuestData|null
    paymentConfirmation  : Pick<PaymentConfirmation, 'token'|'rejectionReason'>|null
    isPaid               : boolean
    shippingTracking     : Pick<ShippingTracking, 'token'|'shippingNumber'>|null
    
    
    
    // relation data:
    countryList          : EntityState<CountryPreview>|undefined
}
const OrderDataContext = createContext<OrderDataApi>({
    order                : undefined as any,
    customerOrGuest      : null,
    paymentConfirmation  : null,
    isPaid               : false,
    shippingTracking     : null,
    
    
    
    // relation data:
    countryList          : undefined,
});



// hooks:
export const useOrderDataContext = () => {
    return useContext(OrderDataContext);
};



// react components:
export interface OrderDataContextProviderProps {
    // data:
    order                : OrderAndData
    customerOrGuest      : CustomerOrGuestData|null
    paymentConfirmation  : Pick<PaymentConfirmation, 'token'|'rejectionReason'>|null
    isPaid               : boolean
    shippingTracking     : Pick<ShippingTracking, 'token'|'shippingNumber'>|null
    
    
    
    // relation data:
    countryList          : EntityState<CountryPreview>|undefined
}
export const OrderDataContextProvider = (props: React.PropsWithChildren<OrderDataContextProviderProps>): JSX.Element|null => {
    // jsx:
    return (
        <OrderDataContext.Provider value={props}>
            {props.children}
        </OrderDataContext.Provider>
    );
};

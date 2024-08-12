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
    OrderDetail,
    
    CountryPreview,
    
    CustomerOrGuest,
    CustomerOrGuestPreferenceDetail,
    
    ShipmentPreview,
}                           from '@/models'
import type {
    Product,
    Variant,
    PaymentConfirmation,
    OrdersOnProducts,
    Shipment,
}                           from '@prisma/client'

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
}                           from '@/libs/shippings/shippings'



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
    
    // data:
    |'username'
> & {
    preference : CustomerOrGuestPreferenceDetail|null
}
export interface OrderAndData
    extends
        Omit<OrderDetail,
            // relations:
            |'items'
            
            |'customer'
            |'guest'
            
            |'paymentConfirmation'
            
            |'shipment'
        >
{
    items                : OrderItemsAndData[]
    shippingProvider     : MatchingShipping|null
    customerOrGuest      : CustomerOrGuestData|null
}
export interface OrderDataApi
    extends
        OrderDataContextProviderProps
{
}
const OrderDataContext = createContext<OrderDataApi>({
    order                : undefined as any,
    customerOrGuest      : null,
    paymentConfirmation  : null,
    isPaid               : false,
    shipment             : null,
    
    
    
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
    paymentConfirmation  : Omit<PaymentConfirmation, 'id'|'parentId'>|null
    isPaid               : boolean
    shipment             : (ShipmentPreview & Pick<Shipment, 'token'>)|null
    
    
    
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

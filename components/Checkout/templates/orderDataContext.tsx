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
    Product,
    ShippingProvider,
    Customer,
    OrdersOnProducts,
    Order,
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
}                           from '../hooks/mock-context'



// contexts:
export type OrderItemsAndData = Pick<OrdersOnProducts, 'price'|'quantity'|'productId'> & {
    product : Pick<Product, 'name'>|null
}
export type OrderAndData = Order & {
    items : OrderItemsAndData[]
}
export interface OrderDataApi {
    // data:
    order              : OrderAndData
    customer           : Omit<Customer, 'id'|'createdAt'|'updatedAt'>|null
    
    
    
    // relation data:
    shippingProvider   : ShippingProvider|null
    
    countryList        : EntityState<CountryPreview>|undefined
}
const OrderDataContext = createContext<OrderDataApi>({
    order              : undefined as any,
    customer           : null,
    
    
    
    // relation data:
    shippingProvider   : null,
    
    countryList        : undefined,
});



// hooks:
export const useOrderDataContext = () => {
    return useContext(OrderDataContext);
};



// react components:
export interface OrderDataContextProviderProps {
    // data:
    order              : OrderAndData
    customer           : Omit<Customer, 'id'|'createdAt'|'updatedAt'>|null
    
    
    
    // relation data:
    shippingProvider   : ShippingProvider|null
    
    countryList        : EntityState<CountryPreview>|undefined
}
export const OrderDataContextProvider = (props: React.PropsWithChildren<OrderDataContextProviderProps>): JSX.Element|null => {
    // jsx:
    return (
        <OrderDataContext.Provider value={props}>
            {props.children}
        </OrderDataContext.Provider>
    );
};

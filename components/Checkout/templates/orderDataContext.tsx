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
import type {
    // types:
    MatchingShipping,
}                           from '@/libs/shippings'



// contexts:
export type ProductData = Pick<Product, 'name'> & {
    image        : Product['images'][number]|null
    imageBase64 ?: string
    imageId     ?: string
}
export type OrderItemsAndData = Pick<OrdersOnProducts, 'price'|'quantity'> & {
    product : ProductData|null
}
export type OrderAndData = Order & {
    items             : OrderItemsAndData[]
    shippingProvider  : MatchingShipping|null
}
export interface OrderDataApi {
    // data:
    order             : OrderAndData
    customer          : Omit<Customer, 'id'|'createdAt'|'updatedAt'>|null
    isPaid            : boolean
    
    
    
    // relation data:
    countryList      ?: EntityState<CountryPreview>|undefined
}
const OrderDataContext = createContext<OrderDataApi>({
    order             : undefined as any,
    customer          : null,
    isPaid            : false,
    
    
    
    // relation data:
    countryList       : undefined,
});



// hooks:
export const useOrderDataContext = () => {
    return useContext(OrderDataContext);
};



// react components:
export interface OrderDataContextProviderProps {
    // data:
    order             : OrderAndData
    customer          : Omit<Customer, 'id'|'createdAt'|'updatedAt'>|null
    isPaid            : boolean
    
    
    
    // relation data:
    countryList      ?: EntityState<CountryPreview>|undefined
}
export const OrderDataContextProvider = (props: React.PropsWithChildren<OrderDataContextProviderProps>): JSX.Element|null => {
    // jsx:
    return (
        <OrderDataContext.Provider value={props}>
            {props.children}
        </OrderDataContext.Provider>
    );
};

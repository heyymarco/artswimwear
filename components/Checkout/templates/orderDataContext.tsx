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
    ShippingProvider,
    Customer,
    OrdersOnProducts,
    Order,
}                           from '@prisma/client'

// stores:
import type {
    // types:
    CountryPreview,
    ProductPreview,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from '../hooks/mock-context'



// contexts:
export type OrderAndItems = Order & {
    items : Pick<OrdersOnProducts, 'price'|'quantity'|'productId'>[]
}
export interface OrderDataApi {
    // data:
    order              : OrderAndItems
    customer           : Omit<Customer, 'id'|'createdAt'|'updatedAt'>|null
    
    
    
    // relation data:
    shippingProvider   : ShippingProvider|null
    
    countryList        : EntityState<CountryPreview>|undefined
    productList        : EntityState<ProductPreview>|undefined
}
const OrderDataContext = createContext<OrderDataApi>({
    order              : undefined as any,
    customer           : null,
    
    
    
    // relation data:
    shippingProvider   : null,
    
    countryList        : undefined,
    productList        : undefined,
});



// hooks:
export const useOrderDataContext = () => {
    return useContext(OrderDataContext);
};



// react components:
export interface OrderDataContextProviderProps {
    // data:
    order              : OrderAndItems
    customer           : Omit<Customer, 'id'|'createdAt'|'updatedAt'>|null
    
    
    
    // relation data:
    shippingProvider   : ShippingProvider|null
    
    countryList        : EntityState<CountryPreview>|undefined
    productList        : EntityState<ProductPreview>|undefined
}
export const OrderDataContextProvider = (props: React.PropsWithChildren<OrderDataContextProviderProps>): JSX.Element|null => {
    // jsx:
    return (
        <OrderDataContext.Provider value={props}>
            {props.children}
        </OrderDataContext.Provider>
    );
};

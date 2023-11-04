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
    Address,
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
export interface OrderDataApi {
    // data:
    order              : Order
    shippingAddress    : Address|null
    shippingCost       : number|null
    customer           : Customer|null
    shippingProvider   : ShippingProvider|null
    items              : Pick<OrdersOnProducts, 'price'|'quantity'|'productId'>[]
    
    
    
    // relation data:
    countryList        : EntityState<CountryPreview>|undefined
    productList        : EntityState<ProductPreview>|undefined
}
const OrderDataContext = createContext<OrderDataApi>({
    order              : undefined as any,
    shippingAddress    : null,
    shippingCost       : null,
    customer           : null,
    shippingProvider   : null,
    items              : [],
    
    
    
    // relation data:
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
    order              : Order
    shippingAddress    : Address|null
    shippingCost       : number|null
    customer           : Customer|null
    shippingProvider   : ShippingProvider|null
    items              : Pick<OrdersOnProducts, 'price'|'shippingWeight'|'quantity'|'productId'>[]
    
    
    
    // relation data:
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

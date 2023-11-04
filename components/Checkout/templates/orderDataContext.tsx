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
export interface OrderDataApi {
    // data:
    order              : Order
    shippingAddress    : Address|null
    customer           : Customer|null
    shippingProvider   : ShippingProvider|null
    
    
    
    // relation data:
    countryList        : EntityState<CountryPreview>|undefined
}
const OrderDataContext = createContext<OrderDataApi>({
    order              : undefined as any,
    shippingAddress    : null,
    customer           : null,
    shippingProvider   : null,
    
    
    
    // relation data:
    countryList        : undefined,
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
    customer           : Customer|null
    shippingProvider   : ShippingProvider|null
    
    
    
    // relation data:
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

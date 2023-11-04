// react:
import {
    // react:
    default as React,
}                           from 'react'

// models:
import type {
    ShippingProvider,
    Customer,
    Address,
}                           from '@prisma/client'

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
    shippingAddress    : Address|null
    customer           : Customer|null
    shippingProvider   : ShippingProvider|null
    
    
    
    // relation data:
    country            : string|undefined
}
const OrderDataContext = createContext<OrderDataApi>({
    shippingAddress    : null,
    customer           : null,
    shippingProvider   : null,
    
    
    
    // relation data:
    country            : undefined,
});



// hooks:
export const useOrderDataContext = () => {
    return useContext(OrderDataContext);
};



// react components:
export interface OrderDataContextProviderProps {
    // data:
    shippingAddress    : Address|null
    customer           : Customer|null
    shippingProvider   : ShippingProvider|null
    
    
    
    // relation data:
    country            : string|undefined
}
export const OrderDataContextProvider = (props: React.PropsWithChildren<OrderDataContextProviderProps>): JSX.Element|null => {
    // jsx:
    return (
        <OrderDataContext.Provider value={props}>
            {props.children}
        </OrderDataContext.Provider>
    );
};

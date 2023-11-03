// react:
import {
    // react:
    default as React,
}                           from 'react'

// models:
import type {
    Customer,
}                           from '@prisma/client'

// internals:
import {
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from '../hooks/mock-context.jsx'



// contexts:
const CustomerContext = createContext<Partial<Customer>>({
});



// hooks:
export const useCustomerContext = () => {
    return useContext(CustomerContext);
};



// react components:
export interface CustomerContextProviderProps {
    // models:
    model : Partial<Customer>
}
export const CustomerContextProvider = (props: React.PropsWithChildren<CustomerContextProviderProps>): JSX.Element|null => {
    // jsx:
    return (
        <CustomerContext.Provider value={props.model}>
            {props.children}
        </CustomerContext.Provider>
    );
};

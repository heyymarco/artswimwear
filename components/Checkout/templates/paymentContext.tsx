// react:
import {
    // react:
    default as React,
}                           from 'react'

import type {
    EntityState
}                           from '@reduxjs/toolkit'

// stores:
import type {
    // types:
    CountryPreview,
}                           from '@/store/features/api/apiSlice'

// models:
import type {
    Address,
    Payment,
}                           from '@prisma/client'

// internals:
import {
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from '../hooks/mock-context.jsx'



// contexts:
export interface PaymentApi {
    // data:
    paymentType       : string|null
    paymentBrand      : string|null
    paymentIdentifier : string|null
    
    billingAddress    : Address|null
    
    
    
    // relation data:
    countryList       : EntityState<CountryPreview>|undefined
}
const PaymentContext = createContext<Partial<PaymentApi>>({
});



// hooks:
export const usePaymentContext = () => {
    return useContext(PaymentContext);
};



// react components:
export interface PaymentContextProviderProps {
    // models:
    model       : Partial<Payment>
    
    
    
    // relation data:
    countryList : EntityState<CountryPreview>|undefined
}
export const PaymentContextProvider = (props: React.PropsWithChildren<PaymentContextProviderProps>): JSX.Element|null => {
    // jsx:
    return (
        <PaymentContext.Provider value={{
            // models:
            ...props.model,
            
            
            
            // relation data:
            countryList  : props.countryList,
        }}>
            {props.children}
        </PaymentContext.Provider>
    );
};

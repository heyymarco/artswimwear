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
    // ShippingProvider,
    Order,
}                           from '@prisma/client'

// internals:
import {
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from '../hooks/mock-context.jsx'
import type {
    // types:
    MatchingShipping,
}                           from '@/libs/shippings'



// contexts:
export interface ShippingApi {
    // data:
    shippingAddress    : Address|null
    shippingCost       : number|null
    shippingProviderId : string|null
    
    
    
    // relation data:
    countryList        : EntityState<CountryPreview>|undefined
    shippingList       : EntityState<MatchingShipping> | undefined
}
const ShippingContext = createContext<Partial<ShippingApi>>({
});



// hooks:
export const useShippingContext = () => {
    return useContext(ShippingContext);
};



// react components:
export interface ShippingContextProviderProps {
    // models:
    model        : Partial<Order>
    
    
    
    // relation data:
    countryList  : EntityState<CountryPreview>|undefined
    shippingList : EntityState<MatchingShipping> | undefined
}
export const ShippingContextProvider = (props: React.PropsWithChildren<ShippingContextProviderProps>): JSX.Element|null => {
    // jsx:
    return (
        <ShippingContext.Provider value={{
            // models:
            ...props.model,
            
            
            
            // relation data:
            countryList  : props.countryList,
            shippingList : props.shippingList,
        }}>
            {props.children}
        </ShippingContext.Provider>
    );
};

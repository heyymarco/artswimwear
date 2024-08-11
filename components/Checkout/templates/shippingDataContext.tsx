// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from '@/libs/mock-context'

// configs:
import type {
    ShippingConfig,
}                           from '@/components/Checkout/types'



// contexts:
export interface ShippingApi
    extends
    ShippingContextProviderProps
{
}
const ShippingContext = createContext<ShippingApi>({
    model : undefined as any,
});



// hooks:
export const useShippingContext = () => {
    return useContext(ShippingContext);
};



// react components:
export interface ShippingContextProviderProps {
    // data:
    model : ShippingConfig
    
    // shipping carrier changes:
    prevShippingCarrier ?: string
    prevShippingNumber  ?: string
}
export const ShippingContextProvider = (props: React.PropsWithChildren<ShippingContextProviderProps>): JSX.Element|null => {
    // jsx:
    return (
        <ShippingContext.Provider value={props}>
            {props.children}
        </ShippingContext.Provider>
    );
};

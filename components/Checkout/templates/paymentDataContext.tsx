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
    PaymentConfigServer,
}                           from '@/components/Checkout/types'



// contexts:
export interface PaymentApi {
    // data:
    model : PaymentConfigServer|undefined
}
const PaymentContext = createContext<PaymentApi>({
    model : undefined,
});



// hooks:
export const usePaymentContext = () => {
    return useContext(PaymentContext);
};



// react components:
export interface PaymentContextProviderProps {
    // data:
    model : PaymentConfigServer
}
export const PaymentContextProvider = (props: React.PropsWithChildren<PaymentContextProviderProps>): JSX.Element|null => {
    // jsx:
    return (
        <PaymentContext.Provider value={props}>
            {props.children}
        </PaymentContext.Provider>
    );
};

// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useMemo,
    useRef,
}                           from 'react'



// hooks:

// states:

//#region payPalCardFieldsState

// contexts:
export interface PayPalCardFieldsState {
    // data:
    signalApprovedOrderIdRef : React.MutableRefObject<((approvedOrderId: string|null) => void) | null>
}

const defaultPayPalCardFieldsStateContext : PayPalCardFieldsState = {
    // data:
    signalApprovedOrderIdRef : { current: null },
}
const PayPalCardFieldsStateContext = createContext<PayPalCardFieldsState>(defaultPayPalCardFieldsStateContext);
PayPalCardFieldsStateContext.displayName  = 'PayPalCardFieldsState';

export const usePayPalCardFieldsState = (): PayPalCardFieldsState => {
    return useContext(PayPalCardFieldsStateContext);
}



// react components:
export interface PayPalCardFieldsStateProps {
}
const PayPalCardFieldsStateProvider = (props: React.PropsWithChildren<PayPalCardFieldsStateProps>): JSX.Element|null => {
    // states:
    const signalApprovedOrderIdRef = useRef<((approvedOrderId: string|null) => void) | null>(null);
    const payPalCardFieldsState = useMemo<PayPalCardFieldsState>(() => ({
        // data:
        signalApprovedOrderIdRef,
    }), [ ]);
    
    
    
    // jsx:
    return (
        <PayPalCardFieldsStateContext.Provider value={payPalCardFieldsState}>
            {props.children}
        </PayPalCardFieldsStateContext.Provider>
    );
};
export {
    PayPalCardFieldsStateProvider,
    PayPalCardFieldsStateProvider as default,
}
//#endregion payPalCardFieldsState

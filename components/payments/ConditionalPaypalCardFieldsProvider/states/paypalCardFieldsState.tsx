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

//#region paypalCardFieldsState

// contexts:
export interface PaypalCardFieldsState {
    // data:
    signalApprovedOrderIdRef : React.MutableRefObject<((approvedOrderId: string|null) => void) | null>
}

const defaultPaypalCardFieldsStateContext : PaypalCardFieldsState = {
    // data:
    signalApprovedOrderIdRef : { current: null },
}
const PaypalCardFieldsStateContext = createContext<PaypalCardFieldsState>(defaultPaypalCardFieldsStateContext);
PaypalCardFieldsStateContext.displayName  = 'PaypalCardFieldsState';

export const usePaypalCardFieldsState = (): PaypalCardFieldsState => {
    return useContext(PaypalCardFieldsStateContext);
}



// react components:
export interface PaypalCardFieldsStateProps {
}
const PaypalCardFieldsStateProvider = (props: React.PropsWithChildren<PaypalCardFieldsStateProps>): JSX.Element|null => {
    // states:
    const signalApprovedOrderIdRef = useRef<((approvedOrderId: string|null) => void) | null>(null);
    const paypalCardFieldsState = useMemo<PaypalCardFieldsState>(() => ({
        // data:
        signalApprovedOrderIdRef,
    }), [ ]);
    
    
    
    // jsx:
    return (
        <PaypalCardFieldsStateContext.Provider value={paypalCardFieldsState}>
            {props.children}
        </PaypalCardFieldsStateContext.Provider>
    );
};
export {
    PaypalCardFieldsStateProvider,
    PaypalCardFieldsStateProvider as default,
}
//#endregion paypalCardFieldsState

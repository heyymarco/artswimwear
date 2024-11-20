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

//#region pay_palCardFieldsState

// contexts:
export interface Pay_palCardFieldsState {
    // data:
    signalApprovedOrderIdRef : React.MutableRefObject<((approvedOrderId: string|null) => void) | null>
}

const defaultPay_palCardFieldsStateContext : Pay_palCardFieldsState = {
    // data:
    signalApprovedOrderIdRef : { current: null },
}
const Pay_palCardFieldsStateContext = createContext<Pay_palCardFieldsState>(defaultPay_palCardFieldsStateContext);
Pay_palCardFieldsStateContext.displayName  = 'Pay_palCardFieldsState';

export const usePay_palCardFieldsState = (): Pay_palCardFieldsState => {
    return useContext(Pay_palCardFieldsStateContext);
}



// react components:
export interface Pay_palCardFieldsStateProps {
}
const Pay_palCardFieldsStateProvider = (props: React.PropsWithChildren<Pay_palCardFieldsStateProps>): JSX.Element|null => {
    // states:
    const signalApprovedOrderIdRef = useRef<((approvedOrderId: string|null) => void) | null>(null);
    const pay_palCardFieldsState = useMemo<Pay_palCardFieldsState>(() => ({
        // data:
        signalApprovedOrderIdRef,
    }), [ ]);
    
    
    
    // jsx:
    return (
        <Pay_palCardFieldsStateContext.Provider value={pay_palCardFieldsState}>
            {props.children}
        </Pay_palCardFieldsStateContext.Provider>
    );
};
export {
    Pay_palCardFieldsStateProvider,
    Pay_palCardFieldsStateProvider as default,
}
//#endregion pay_palCardFieldsState

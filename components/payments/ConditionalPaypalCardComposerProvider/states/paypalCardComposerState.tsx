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

//#region paypalCardComposerState

// contexts:
export interface PaypalCardComposerState {
    // data:
    signalApprovedOrderIdRef : React.MutableRefObject<((approvedOrderId: string|null) => void) | null>
}

const defaultPaypalCardComposerStateContext : PaypalCardComposerState = {
    // data:
    signalApprovedOrderIdRef : { current: null },
}
const PaypalCardComposerStateContext = createContext<PaypalCardComposerState>(defaultPaypalCardComposerStateContext);
PaypalCardComposerStateContext.displayName  = 'PaypalCardComposerState';

export const usePaypalCardComposerState = (): PaypalCardComposerState => {
    return useContext(PaypalCardComposerStateContext);
}



// react components:
export interface PaypalCardComposerStateProps {
}
const PaypalCardComposerStateProvider = (props: React.PropsWithChildren<PaypalCardComposerStateProps>): JSX.Element|null => {
    // states:
    const signalApprovedOrderIdRef = useRef<((approvedOrderId: string|null) => void) | null>(null);
    const paypalCardComposerState = useMemo<PaypalCardComposerState>(() => ({
        // data:
        signalApprovedOrderIdRef,
    }), [ ]);
    
    
    
    // jsx:
    return (
        <PaypalCardComposerStateContext.Provider value={paypalCardComposerState}>
            {props.children}
        </PaypalCardComposerStateContext.Provider>
    );
};
export {
    PaypalCardComposerStateProvider,
    PaypalCardComposerStateProvider as default,
}
//#endregion paypalCardComposerState

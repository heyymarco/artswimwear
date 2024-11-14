// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useMemo,
}                           from 'react'



// hooks:

// states:

//#region payPalCardFieldsState

// contexts:
export interface PayPalCardFieldsState {
    // data:
    approvedOrderId : string|undefined
}

const defaultPayPalCardFieldsStateContext : PayPalCardFieldsState = {
    // data:
    approvedOrderId : undefined,
}
const PayPalCardFieldsStateContext = createContext<PayPalCardFieldsState>(defaultPayPalCardFieldsStateContext);
PayPalCardFieldsStateContext.displayName  = 'PayPalCardFieldsState';

export const usePayPalCardFieldsState = (): PayPalCardFieldsState => {
    return useContext(PayPalCardFieldsStateContext);
}



// react components:
export interface PayPalCardFieldsStateProps
    extends
        PayPalCardFieldsState
{
}
const PayPalCardFieldsStateProvider = (props: React.PropsWithChildren<PayPalCardFieldsStateProps>): JSX.Element|null => {
    // props:
    const {
        // data:
        approvedOrderId,
    } = props;
    
    
    
    // states:
    const payPalCardFieldsState = useMemo<PayPalCardFieldsState>(() => ({
        // data:
        approvedOrderId,
    }), [
        // data:
        approvedOrderId,
    ]);
    
    
    
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

'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from 'react'



// contexts:
const IsInMidtransScriptProviderContext = createContext<boolean>(false);
export const useIsInMidtransScriptProvider = (): boolean => {
    return useContext(IsInMidtransScriptProviderContext);
};
export const IfInMidtransScriptProvider = ({children} : React.PropsWithChildren): JSX.Element|null => {
    // conditions:
    const isInMidtransScriptProvider = useIsInMidtransScriptProvider();
    if (!isInMidtransScriptProvider) return null;
    
    
    
    // jsx:
    return (
        <>
            {children}
        </>
    );
};
export const IsInMidtransScriptProviderContextProvider = ({children} : React.PropsWithChildren): JSX.Element|null => {
    // jsx:
    return (
        <IsInMidtransScriptProviderContext.Provider value={true}>
            {children}
        </IsInMidtransScriptProviderContext.Provider>
    );
};

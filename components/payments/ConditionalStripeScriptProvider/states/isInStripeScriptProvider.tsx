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
const IsInStripeScriptProviderContext = createContext<boolean>(false);
export const useIsInStripeScriptProvider = (): boolean => {
    return useContext(IsInStripeScriptProviderContext);
};
export const IfInStripeScriptProvider = ({children} : React.PropsWithChildren): JSX.Element|null => {
    // conditions:
    const isInStripeScriptProvider = useIsInStripeScriptProvider();
    if (!isInStripeScriptProvider) return null;
    
    
    
    // jsx:
    return (
        <>
            {children}
        </>
    );
};
export const IsInStripeScriptProviderContextProvider = ({children} : React.PropsWithChildren): JSX.Element|null => {
    // jsx:
    return (
        <IsInStripeScriptProviderContext.Provider value={true}>
            {children}
        </IsInStripeScriptProviderContext.Provider>
    );
};

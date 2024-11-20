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
const IsInPaypalScriptProviderContext = createContext<boolean>(false);
export const useIsInPaypalScriptProvider = (): boolean => {
    return useContext(IsInPaypalScriptProviderContext);
};
export const IfInPaypalScriptProvider = ({children} : React.PropsWithChildren): JSX.Element|null => {
    // conditions:
    const isInPaypalScriptProvider = useIsInPaypalScriptProvider();
    if (!isInPaypalScriptProvider) return null;
    
    
    
    // jsx:
    return (
        <>
            {children}
        </>
    );
};
export const IsInPaypalScriptProviderContextProvider = ({children} : React.PropsWithChildren): JSX.Element|null => {
    // jsx:
    return (
        <IsInPaypalScriptProviderContext.Provider value={true}>
            {children}
        </IsInPaypalScriptProviderContext.Provider>
    );
};

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
const IsInPayPalScriptProviderContext = createContext<boolean>(false);
export const useIsInPayPalScriptProvider = (): boolean => {
    return useContext(IsInPayPalScriptProviderContext);
};
export const IfInPayPalScriptProvider = ({children} : React.PropsWithChildren): JSX.Element|null => {
    // conditions:
    const isInPayPalScriptProvider = useIsInPayPalScriptProvider();
    if (!isInPayPalScriptProvider) return null;
    
    
    
    // jsx:
    return (
        <>
            {children}
        </>
    );
};
export const IsInPayPalScriptProviderContextProvider = ({children} : React.PropsWithChildren): JSX.Element|null => {
    // jsx:
    return (
        <IsInPayPalScriptProviderContext.Provider value={true}>
            {children}
        </IsInPayPalScriptProviderContext.Provider>
    );
};

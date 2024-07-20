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
const IsInPayPalHostedFieldsProviderContext = createContext<boolean>(false);
export const useIsInPayPalHostedFieldsProvider = (): boolean => {
    return useContext(IsInPayPalHostedFieldsProviderContext);
}
export const IfInPayPalHostedFieldsProvider = ({children} : React.PropsWithChildren): JSX.Element|null => {
    // conditions:
    const isInPayPalHostedFieldsProvider = useIsInPayPalHostedFieldsProvider();
    if (!isInPayPalHostedFieldsProvider) return null;
    
    
    
    // jsx:
    return (
        <>
            {children}
        </>
    );
};
export const IsInPayPalHostedFieldsProviderContextProvider = ({children} : React.PropsWithChildren): JSX.Element|null => {
    // jsx:
    return (
        <IsInPayPalHostedFieldsProviderContext.Provider value={true}>
            {children}
        </IsInPayPalHostedFieldsProviderContext.Provider>
    );
};

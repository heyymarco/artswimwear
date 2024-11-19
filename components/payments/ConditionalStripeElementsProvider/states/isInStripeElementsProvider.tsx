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
const IsInStripeElementsProviderContext = createContext<boolean>(false);
export const useIsInStripeElementsProvider = (): boolean => {
    return useContext(IsInStripeElementsProviderContext);
};
export const IfInStripeElementsProvider = ({children} : React.PropsWithChildren): JSX.Element|null => {
    // conditions:
    const isInStripeElementsProvider = useIsInStripeElementsProvider();
    if (!isInStripeElementsProvider) return null;
    
    
    
    // jsx:
    return (
        <>
            {children}
        </>
    );
};
export const IsInStripeElementsProviderContextProvider = ({children} : React.PropsWithChildren): JSX.Element|null => {
    // jsx:
    return (
        <IsInStripeElementsProviderContext.Provider value={true}>
            {children}
        </IsInStripeElementsProviderContext.Provider>
    );
};

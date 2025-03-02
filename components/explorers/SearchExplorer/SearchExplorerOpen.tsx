'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// internal components:
import {
    useSearchInterceptState,
}                           from './states/searchInterceptState'



// react components:
const SearchExplorerOpen = (): JSX.Element|null => {
    // states:
    const {
        // states:
        setIsDialogShown,
    } = useSearchInterceptState();
    
    
    
    // effects:
    useEffect(() => {
        setIsDialogShown(true);
    }, []);
    
    
    
    // jsx:
    return null;
};
export {
    SearchExplorerOpen,            // named export for readibility
    SearchExplorerOpen as default, // default export to support React.lazy
}

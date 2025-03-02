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
}                           from './searchInterceptState'



// react components:
const SearchExplorerClose = (): JSX.Element|null => {
    // states:
    const {
        // states:
        setIsDialogShown,
    } = useSearchInterceptState();
    
    
    
    // effects:
    useEffect(() => {
        setIsDialogShown(false);
    }, []);
    
    
    
    // jsx:
    return null;
};
export {
    SearchExplorerClose,            // named export for readibility
    SearchExplorerClose as default, // default export to support React.lazy
}

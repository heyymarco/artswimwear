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
    useSearchInterceptingState,
}                           from './states/searchInterceptingState'



// react components:
const SearchExplorerClose = (): JSX.Element|null => {
    // states:
    const {
        // states:
        setIsDialogShown,
    } = useSearchInterceptingState();
    
    
    
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

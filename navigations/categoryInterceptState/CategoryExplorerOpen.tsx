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
    useCategoryInterceptState,
}                           from './categoryInterceptState'



// react components:
const CategoryExplorerOpen = (): JSX.Element|null => {
    // states:
    const {
        // states:
        setIsDialogShown,
    } = useCategoryInterceptState();
    
    
    
    // effects:
    useEffect(() => {
        setIsDialogShown(true);
    }, []);
    
    
    
    // jsx:
    return null;
};
export {
    CategoryExplorerOpen,            // named export for readibility
    CategoryExplorerOpen as default, // default export to support React.lazy
}

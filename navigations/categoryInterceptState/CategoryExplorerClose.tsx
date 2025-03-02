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
const CategoryExplorerClose = (): JSX.Element|null => {
    // states:
    const {
        // states:
        setIsDialogShown,
    } = useCategoryInterceptState();
    
    
    
    // effects:
    useEffect(() => {
        setIsDialogShown(false);
    }, []);
    
    
    
    // jsx:
    return null;
};
export {
    CategoryExplorerClose,            // named export for readibility
    CategoryExplorerClose as default, // default export to support React.lazy
}

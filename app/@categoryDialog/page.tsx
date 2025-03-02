'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    categoriesPath,
    CategoryExplorerDropdown,
}                           from '@/components/explorers/CategoryExplorer'

// states:
import {
    InterceptDialog,
}                           from '@/navigations/InterceptDialog'
import {
    useCategoryInterceptState,
}                           from '@/navigations/categoryInterceptState'



// react components:
export default function CategoryDialogPage(): JSX.Element|null {
    // states:
    const categoryInterceptState = useCategoryInterceptState();
    
    
    
    // jsx:
    return (
        <InterceptDialog
            // configs:
            interceptPath={categoriesPath}
            
            
            
            // states:
            interceptState={categoryInterceptState}
            
            
            
            // components:
            interceptDialogComponent={
                <CategoryExplorerDropdown />
            }
        />
    );
}

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
    InterceptNavbarDropdown,
}                           from '@/navigations/InterceptNavbarDropdown'
import {
    useCategoryInterceptState,
}                           from '@/navigations/categoryInterceptState'



// react components:
export default function CategoryDialogPage(): JSX.Element|null {
    // states:
    const categoryInterceptState = useCategoryInterceptState();
    
    
    
    // jsx:
    return (
        <InterceptNavbarDropdown
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

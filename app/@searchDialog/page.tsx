'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    searchPath,
    SearchExplorerDropdown,
}                           from '@/components/explorers/SearchExplorer'

// states:
import {
    InterceptNavbarDropdown,
}                           from '@/navigations/InterceptNavbarDropdown'
import {
    useSearchInterceptState,
}                           from '@/navigations/searchInterceptState'



// react components:
export default function SearchDialogPage(): JSX.Element|null {
    // states:
    const searchInterceptState = useSearchInterceptState();
    
    
    
    // jsx:
    return (
        <InterceptNavbarDropdown
            // configs:
            interceptPath={searchPath}
            
            
            
            // states:
            interceptState={searchInterceptState}
            
            
            
            // components:
            interceptDialogComponent={
                <SearchExplorerDropdown />
            }
        />
    );
}

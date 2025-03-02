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
    InterceptDialog,
}                           from '@/navigations/InterceptDialog'
import {
    useSearchInterceptState,
}                           from '@/navigations/searchInterceptState'



// react components:
export default function SearchDialogPage(): JSX.Element|null {
    // states:
    const searchInterceptState = useSearchInterceptState();
    
    
    
    // jsx:
    return (
        <InterceptDialog
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

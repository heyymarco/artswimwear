'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// react:
import {
    // react:
    default as React,
}                           from 'react'

// states:
import {
    SearchExplorerClose,
}                           from '@/navigations/searchInterceptState'



// react components:
export default function SearchCloseIntercept(): JSX.Element|null {
    /*
        handles:
        * SOFT navigation of `/` => CLOSE 'search' dialog.
    */
    
    
    
    // jsx:
    return <SearchExplorerClose />;
}

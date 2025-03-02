'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    SearchExplorerOpen,
}                           from '@/navigations/searchInterceptState'



// react components:
export default function SearchIntercept(): JSX.Element|null {
    /*
        handles:
        * SOFT navigation of `/search` => SHOW <SearchExplorerDropdown>.
    */
    
    
    
    // jsx:
    return <SearchExplorerOpen />;
}

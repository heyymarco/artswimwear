'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    CategoryExplorerClose,
}                           from '@/navigations/categoryInterceptState'



// react components:
export default function CategoryCloseIntercept(): JSX.Element|null {
    /*
        handles:
        * SOFT navigation of `/**` => CLOSE 'category' dialog.
    */
    
    
    
    // jsx:
    return <CategoryExplorerClose />;
}

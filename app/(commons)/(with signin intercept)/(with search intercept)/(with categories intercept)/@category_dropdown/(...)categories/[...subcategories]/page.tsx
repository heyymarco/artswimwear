'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    CategoryExplorerOpen,
}                           from '@/navigations/categoryInterceptState'



// react components:
export default function CategoryIntercept(): JSX.Element|null {
    /*
        handles:
        * SOFT navigation of `/categories/subcategories+` => SHOW <CategoryExplorerDropdown>.
    */
    
    
    
    // jsx:
    return <CategoryExplorerOpen />;
}

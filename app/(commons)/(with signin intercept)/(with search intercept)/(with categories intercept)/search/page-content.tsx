'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // composite-components:
    NavItem,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
import {
    ProductGalleryPage,
}                           from '@/components/views/ProductGalleryPage'
import {
    SearchView,
}                           from '@/components/views/SearchView'



// react components:
export function SearchPageContent(): JSX.Element|null {
    // jsx:
    return (
        <ProductGalleryPage
            // children:
            navItems={
                <>
                    <NavItem active={false}>
                        <Link href='/' prefetch={true}>
                            Home
                        </Link>
                    </NavItem>
                    
                    <NavItem active={true}>
                        <Link href='/search' prefetch={true}>
                            Search
                        </Link>
                    </NavItem>
                </>
            }
        >
            <SearchView />
        </ProductGalleryPage>
    );
}

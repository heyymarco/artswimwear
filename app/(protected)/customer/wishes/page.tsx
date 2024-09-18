// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import type {
    Metadata,
}                           from 'next'

// private components:
import {
    WishPageContent,
}                           from './page-content'

// configs:
import {
    PAGE_WISHLIST_TITLE,
    PAGE_WISHLIST_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_WISHLIST_TITLE,
    description : PAGE_WISHLIST_DESCRIPTION,
}



// react components:
export default function WishPage(): JSX.Element|null {
    // jsx:
    return (
        <WishPageContent />
    );
}

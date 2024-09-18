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
    WishlistPageContent,
}                           from './page-content'

// configs:
import {
    PAGE_ORDER_HISTORY_TITLE,
    PAGE_ORDER_HISTORY_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_ORDER_HISTORY_TITLE,
    description : PAGE_ORDER_HISTORY_DESCRIPTION,
}



// react components:
export default function WishlistPage(): JSX.Element|null {
    // jsx:
    return (
        <WishlistPageContent />
    );
}

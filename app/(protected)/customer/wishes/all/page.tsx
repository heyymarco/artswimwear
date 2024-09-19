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
    WishAllPageContent,
}                           from './page-content'

// configs:
import {
    PAGE_WISH_ALL_TITLE,
    PAGE_WISH_ALL_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_WISH_ALL_TITLE,
    description : PAGE_WISH_ALL_DESCRIPTION,
}



// react components:
export default function WishAllPage(): JSX.Element|null {
    // jsx:
    return (
        <WishAllPageContent />
    );
}

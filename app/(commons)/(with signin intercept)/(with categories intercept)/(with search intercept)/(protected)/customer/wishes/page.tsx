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
    PAGE_WISH_TITLE,
    PAGE_WISH_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_WISH_TITLE,
    description : PAGE_WISH_DESCRIPTION,
}



// react components:
export default function WishPage(): JSX.Element|null {
    // jsx:
    return (
        <WishPageContent />
    );
}

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import type {
    Metadata,
}                           from 'next'

// internal components:
import {
    UnderConstructionBlankPage,
}                           from '@/components/BlankPage'

// configs:
import {
    PAGE_NOTFOUND_TITLE,
    PAGE_NOTFOUND_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_NOTFOUND_TITLE,
    description : PAGE_NOTFOUND_DESCRIPTION,
}



// react components:
export default function NotFoundPage(): JSX.Element|null {
    // jsx:
    return (
        <UnderConstructionBlankPage />
    );
}

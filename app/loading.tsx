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
    LoadingBlankPage,
}                           from '@/components/BlankPage'

// configs:
import {
    PAGE_LOADING_TITLE,
    PAGE_LOADING_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_LOADING_TITLE,
    description : PAGE_LOADING_DESCRIPTION,
}



// react components:
export default function LoadingPage(): JSX.Element|null {
    // jsx:
    return (
        <LoadingBlankPage
            // identifiers:
            key='busy' // avoids re-creating a similar dom during loading transition in different components
        />
    );
}

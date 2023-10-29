'use client' // Error components must be Client Components

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
    ErrorBlankPage,
}                           from '@/components/BlankPage'

// configs:
import {
    PAGE_ERROR_TITLE,
    PAGE_ERROR_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_ERROR_TITLE,
    description : PAGE_ERROR_DESCRIPTION,
}



// react components:
export default function ErrorPage({ reset }: { reset: () => void }): JSX.Element|null {
    // jsx:
    return (
        <ErrorBlankPage
            // handlers:
            onRetry={reset}
        />
    );
}

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
    NotFoundPageContent,
}                           from './not-found-content'

// configs:
import {
    PAGE_404_TITLE,
    PAGE_404_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_404_TITLE,
    description : PAGE_404_DESCRIPTION,
}



// react components:
export default function NotFoundPage() {
    // jsx:
    return (
        <NotFoundPageContent />
    );
}

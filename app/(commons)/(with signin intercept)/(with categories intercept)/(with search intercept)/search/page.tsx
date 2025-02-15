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
    SearchPageContent,
}                           from './page-content'

// configs:
import {
    PAGE_SEARCH_TITLE,
    PAGE_SEARCH_DESCRIPTION,
}                           from '@/website.config'



// configs:
export const fetchCache = 'force-cache';
export const revalidate = false; // never expired



export const metadata: Metadata = {
    title       : PAGE_SEARCH_TITLE,
    description : PAGE_SEARCH_DESCRIPTION,
}



// react components:
export default function SearchPage(): JSX.Element|null {
    // jsx:
    return (
        <SearchPageContent />
    );
}

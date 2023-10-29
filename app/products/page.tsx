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
    ProductListPageContent,
}                           from './page-content'

// configs:
import {
    PAGE_PRODUCTS_TITLE,
    PAGE_PRODUCTS_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_PRODUCTS_TITLE,
    description : PAGE_PRODUCTS_DESCRIPTION,
}



export default function ProductListPage(): JSX.Element|null {
    // jsx:
    return (
        <ProductListPageContent />
    );
}

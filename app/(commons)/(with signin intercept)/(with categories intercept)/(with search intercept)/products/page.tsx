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
    ProductPageContent,
}                           from './page-content'

// configs:
import {
    PAGE_PRODUCTS_TITLE,
    PAGE_PRODUCTS_DESCRIPTION,
}                           from '@/website.config'



// configs:
export const fetchCache = 'force-cache';
export const revalidate = false; // never expired



export const metadata: Metadata = {
    title       : PAGE_PRODUCTS_TITLE,
    description : PAGE_PRODUCTS_DESCRIPTION,
}



// react components:
export default function ProductPage(): JSX.Element|null {
    // jsx:
    return (
        <ProductPageContent />
    );
}

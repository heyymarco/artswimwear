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
    CategoryPageContent,
}                           from './page-content'

// configs:
import {
    PAGE_CATEGORIES_TITLE,
    PAGE_CATEGORIES_DESCRIPTION,
}                           from '@/website.config'



// configs:
export const fetchCache = 'force-cache';
export const revalidate = 1 * 24 * 3600;



export const metadata: Metadata = {
    title       : PAGE_CATEGORIES_TITLE,
    description : PAGE_CATEGORIES_DESCRIPTION,
}



// react components:
export default function CategoryPage({ params: { categories } }: { params: { categories: string[] } }): JSX.Element|null {
    // jsx:
    return (
        <CategoryPageContent
            // params:
            categories={categories}
        />
    );
}

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
    HomePageContent,
}                           from './pageContent'

// configs:
import {
    PAGE_HOME_TITLE,
    PAGE_HOME_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_HOME_TITLE,
    description : PAGE_HOME_DESCRIPTION,
}



export default function HomePage() {
    // jsx:
    return (
        <HomePageContent />
    );
}

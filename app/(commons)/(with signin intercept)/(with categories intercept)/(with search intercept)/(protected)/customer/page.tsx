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
    ProfilePageContent,
}                           from './page-content'

// configs:
import {
    PAGE_CUSTOMER_TITLE,
    PAGE_CUSTOMER_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_CUSTOMER_TITLE,
    description : PAGE_CUSTOMER_DESCRIPTION,
}



// react components:
export default function ProfilePage(): JSX.Element|null {
    // jsx:
    return (
        <ProfilePageContent />
    );
}

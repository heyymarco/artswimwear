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
    PAGE_SIGNIN_TITLE,
    PAGE_SIGNIN_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_SIGNIN_TITLE,
    description : PAGE_SIGNIN_DESCRIPTION,
}



// react components:
export default function ProfilePage(): JSX.Element|null {
    // jsx:
    return (
        <ProfilePageContent />
    );
}

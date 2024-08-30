// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import {
    type Metadata,
}                           from 'next'

// private components:
import {
    SignInPageContent,
}                           from '../page-content'

// configs:
import {
    PAGE_RECOVER_TITLE,
    PAGE_RECOVER_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_RECOVER_TITLE,
    description : PAGE_RECOVER_DESCRIPTION,
}



// react components:
export default function RecoverPage(): JSX.Element|null {
    // jsx:
    return (
        <SignInPageContent defaultSection='recover' />
    );
}

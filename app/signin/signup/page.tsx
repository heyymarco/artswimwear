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
    PAGE_SIGNUP_TITLE,
    PAGE_SIGNUP_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_SIGNUP_TITLE,
    description : PAGE_SIGNUP_DESCRIPTION,
}



// react components:
export default function SignUpPage(): JSX.Element|null {
    // jsx:
    return (
        <SignInPageContent defaultSection='signUp' />
    );
}

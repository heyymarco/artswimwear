// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import {
    type Metadata,
}                           from 'next'

// internal components:
import {
    SignInSwitch,
}                           from '@/components/SignIn'
import {
    SignInShow,
}                           from '@/components/Checkout'

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
export default function SignInIntercept(): JSX.Element|null {
    /*
        handles:
        * SOFT navigation of `/signin` => SHOW 'signIn' dialog and SWITCH to 'signIn' tab.
    */
    
    
    
    // jsx:
    return (
        <>
            <SignInShow backPathname='/checkout' />
            <SignInSwitch section='signIn' />
        </>
    );
}

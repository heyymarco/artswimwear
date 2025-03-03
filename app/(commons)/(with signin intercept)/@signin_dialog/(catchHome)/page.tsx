'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// react:
import {
    // react:
    default as React,
}                           from 'react'

// states:
import {
    SignInClose,
}                           from '@/navigations/signinInterceptState'



// react components:
export default function SignInCloseIntercept(): JSX.Element|null {
    /*
        handles:
        * SOFT navigation of `/` => CLOSE 'signIn' dialog.
    */
    
    
    
    // jsx:
    return <SignInClose />;
}

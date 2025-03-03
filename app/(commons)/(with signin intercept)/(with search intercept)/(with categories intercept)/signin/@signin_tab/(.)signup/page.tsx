'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// react:
import {
    // react:
    default as React,
}                           from 'react'

// states:
import {
    SignInSwitch,
}                           from '@/navigations/signinInterceptState'



// react components:
export default function SignUpIntercept(): JSX.Element|null {
    /*
        handles:
        * SOFT navigation of `/signin/signup` => SWITCH to 'signUp' tab.
    */
    
    
    
    // jsx:
    return (
        <SignInSwitch section='signUp' />
    );
}

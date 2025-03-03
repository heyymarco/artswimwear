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
export default function RecoverIntercept(): JSX.Element|null {
    /*
        handles:
        * SOFT navigation of `/signin/recover` => SWITCH to 'recover' tab.
    */
    
    
    
    // jsx:
    return (
        <SignInSwitch section='recover' />
    );
}

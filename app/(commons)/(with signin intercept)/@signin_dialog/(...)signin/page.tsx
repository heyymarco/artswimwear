'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    SignInSwitch,
}                           from '@/components/SignIn'



// react components:
export default function SignInIntercept(): JSX.Element|null {
    /*
        handles:
        * SOFT navigation of `/signin` => SHOW 'signIn' dialog and SWITCH to 'signIn' tab.
    */
    
    
    
    // jsx:
    return <SignInSwitch section='signIn' showDialog={true} />;
}

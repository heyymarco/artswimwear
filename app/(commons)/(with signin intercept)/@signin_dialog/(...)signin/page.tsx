'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// internal components:
import {
    SignInSwitch,
}                           from '@/components/SignIn'
import {
    useSigninInterceptingState,
}                           from '@/components/SignIn/states/signinInterceptingState'



// react components:
export default function SignInIntercept(): JSX.Element|null {
    /*
        handles:
        * SOFT navigation of `/signin` => SHOW 'signIn' dialog and SWITCH to 'signIn' tab.
    */
    
    
    
    // states:
    const {
        // states:
        setIsShown : setSignInIsShown,
    } = useSigninInterceptingState();
    
    
    
    // effects:
    useEffect(() => {
        // setups:
        setSignInIsShown(true);
        
        
        
        // cleanups:
        return () => {
            setSignInIsShown(false);
        };
    }, []);
    
    
    
    // jsx:
    return <SignInSwitch section='signIn' showDialog={true} />;
}

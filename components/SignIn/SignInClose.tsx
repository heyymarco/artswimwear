'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// internal components:
import {
    useSigninState,
}                           from './states/signinState'



// react components:
const SignInClose = (): JSX.Element|null => {
    // states:
    const {
        // states:
        setIsShown : setSignInIsShown,
    } = useSigninState();
    
    
    
    // effects:
    useEffect(() => {
        setSignInIsShown(false);
    }, []);
    
    
    
    // jsx:
    return null;
};
export {
    SignInClose,            // named export for readibility
    SignInClose as default, // default export to support React.lazy
}

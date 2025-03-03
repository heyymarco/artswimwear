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
    useSigninInterceptState,
}                           from './signinInterceptState'



// react components:
const SignInClose = (): JSX.Element|null => {
    // states:
    const {
        // states:
        setIsDialogShown,
    } = useSigninInterceptState();
    
    
    
    // effects:
    useEffect(() => {
        setIsDialogShown(false);
    }, []);
    
    
    
    // jsx:
    return null;
};
export {
    SignInClose,            // named export for readibility
    SignInClose as default, // default export to support React.lazy
}

'use client'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    useSigninTabState,
}                           from '@/components/SignIn'



// react components:
export default function SignInIntercep(): JSX.Element|null {
    // states:
    const {
        // states:
        setSection,
    } = useSigninTabState();
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        setSection('signIn');
    }, []);
    
    
    
    // jsx:
    return null;
}

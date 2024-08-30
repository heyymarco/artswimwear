'use client'

// next-js:
import {
    usePathname,
}                           from 'next/navigation'

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
    
    
    
    const pathname = usePathname();
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        if (pathname === '/signin') {
            // SOFT NAVIGATION of `/signin` => switch the login tab to 'signIn':
            setSection('signIn');
        }
        else {
            // HARD NAVIGATION of `/signin/any_path` => do not switch the login tab, rely on `<SignInPageContent defaultSection='foo'>`
        } // if
    }, []);
    
    
    
    // jsx:
    return null;
}

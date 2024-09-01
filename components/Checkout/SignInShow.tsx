'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useRef,
}                           from 'react'

// next-js:
import {
    useRouter,
}                           from 'next/navigation'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// contexts:
import {
    useCheckoutState,
}                           from './states/checkoutState'



// react components:
export interface SignInShowProps {
    backPathname : string
}
const SignInShow = (props: SignInShowProps): JSX.Element|null => {
    // props:
    const {
        backPathname,
    } = props;
    
    
    
    // states:
    const {
        // dialogs:
        showSignInDialog,
    } = useCheckoutState();
    
    
    
    // hooks:
    const router = useRouter();
    
    
    
    // effects:
    const hasSignInDialogSetRef = useRef<boolean>(false);
    const showLoginDialog = useEvent((): void => {
        // conditions:
        if (hasSignInDialogSetRef.current) return; // already set_up => ignore
        hasSignInDialogSetRef.current = true;      // mark as set_up
        
        
        
        // actions:
        const cardDialogPromise = showSignInDialog();
        cardDialogPromise.collapseStartEvent().then(() => { // on closing:
            hideLoginDialog();
        });
        cardDialogPromise.then(() => { // on fully closed:
            router.push(backPathname, { scroll: false });
        });
    });
    const hideLoginDialog = useEvent((): void => {
        // conditions:
        if (!hasSignInDialogSetRef.current) return; // already cleaned_up => ignore
        hasSignInDialogSetRef.current = false;      // mark as cleaned_up
        
        
        
        // actions:
        setTimeout(() => {
            router.push(backPathname, { scroll: false });
        }, 0);
    });
    useEffect(() => {
        // setups:
        showLoginDialog();
    }, []);
    
    
    
    // jsx:
    return null;
};
export {
    SignInShow,            // named export for readibility
    SignInShow as default, // default export to support React.lazy
}

'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// next-js:
import {
    type Metadata,
}                           from 'next'
import {
    useRouter,
}                           from 'next/navigation'

// reusable-ui components:
import {
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    SignInDialog,
}                           from '@/components/dialogs/SignInDialog'
import {
    SignInSwitch,
}                           from '@/components/SignIn'

// configs:
import {
    PAGE_SIGNUP_TITLE,
    PAGE_SIGNUP_DESCRIPTION,
}                           from '@/website.config'



// export const metadata: Metadata = {
//     title       : PAGE_SIGNUP_TITLE,
//     description : PAGE_SIGNUP_DESCRIPTION,
// }



// react components:
export default function SignInIntercep(): JSX.Element|null {
    /*
        handles:
        * SOFT navigation of `/signin` => SHOW 'signIn' dialog and SWITCH to 'signIn' tab.
    */
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // hooks:
    const router = useRouter();
    
    
    
    // effects:
    useEffect(() => {
        // setups:
        const cardDialogPromise = showDialog(
            <SignInDialog />
        );
        cardDialogPromise.then(() => {
            router.back();
        });
        
        
        
        // cleanups:
        return () => {
            cardDialogPromise.closeDialog(undefined, 'ui');
        };
    }, []);
    
    
    
    // jsx:
    return (
        <SignInSwitch section='signIn' />
    );
}

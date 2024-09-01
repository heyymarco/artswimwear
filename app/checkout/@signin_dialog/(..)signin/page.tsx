'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// next-js:
// import {
//     type Metadata,
// }                           from 'next'
import {
    useRouter,
}                           from 'next/navigation'

// internal components:
import {
    SignInSwitch,
}                           from '@/components/SignIn'
import {
    useCheckoutState,
}                           from '@/components/Checkout/states/checkoutState'

// configs:
// import {
//     PAGE_SIGNUP_TITLE,
//     PAGE_SIGNUP_DESCRIPTION,
// }                           from '@/website.config'



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
    
    
    
    // states:
    const {
        // dialogs:
        showSignInDialog,
    } = useCheckoutState();
    
    
    
    // hooks:
    const router = useRouter();
    
    
    
    // effects:
    useEffect(() => {
        // setups:
        const cardDialogPromise = showSignInDialog();
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

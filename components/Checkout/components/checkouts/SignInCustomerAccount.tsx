'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// next-js:
import {
    usePathname,
    useRouter,
}                           from 'next/navigation'

// cssfn:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
import {
    SignInDialog,
}                           from '@/components/dialogs/SignInDialog'
import {
    SignInInfo,
}                           from '@/components/SignInInfo'
import {
    SignInGate,
}                           from '@/components/SignInGate'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const SignInCustomerAccount = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // sessions:
    const { data: session } = useSession();
    
    
    
    // states:
    const {
        // dialogs:
        signInDialogExpanded,
        setSignInDialogExpanded,
        setSignInDialogCollapseStart,
        setSignInDialogCollapseEnd,
        showSignInDialog,
    } = useCheckoutState();
    
    
    
    // hooks:
    const pathName = usePathname();
    const router   = useRouter();
    
    
    
    // handlers:
    const handleSignInLinkClick = useEvent((): void => {
        const backPathname      = pathName;
        showSignInDialog()
        .then(() => { // on fully closed:
            router.push(backPathname, { scroll: false });
        });
    });
    
    
    
    // jsx:
    return (
        <>
            {!!session && <SignInInfo theme='success' />}
            <SignInGate
                // handlers:
                onSignIn={handleSignInLinkClick}
                onSignUp={handleSignInLinkClick}
            />
            
            <SignInDialog
                // states:
                expanded={signInDialogExpanded}
                onExpandedChange={setSignInDialogExpanded}
                onCollapseStart={setSignInDialogCollapseStart}
                onCollapseEnd={setSignInDialogCollapseEnd}
            />
        </>
    );
};
export {
    SignInCustomerAccount,
    SignInCustomerAccount as default,
};

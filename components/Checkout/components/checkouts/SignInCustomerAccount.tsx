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
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

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
import {
    type Session,
    SignIn,
}                           from '@/components/SignIn'



// react components:
const SignInCustomerAccount = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // sessions:
    const { data: session } = useSession();
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // hooks:
    const pathName = usePathname();
    const router   = useRouter();
    
    
    
    // handlers:
    const handleSignInLinkClick = useEvent((): void => {
        const backPathname = pathName;
        
        showDialog<false|Session>(
            <SignInDialog
                // components:
                signInComponent={
                    <SignIn<Element>
                        // back to current checkout page after signed in:
                        defaultCallbackUrl={backPathname}
                    />
                }
            />
        )
        .then(() => { // on fully closed:
            router.push(backPathname, { scroll: false }); // go back to unintercepted pathName // do not scroll the page because it restores the unintercepted pathName
        });
    });
    
    
    
    // jsx:
    return (
        <div
            // classes:
            className={styleSheet.signInCustomerSection}
        >
            {!!session && <div className={styleSheet.signInCustomerInfo}>
                <div className={styleSheet.signInCustomerInfoText}>
                    <p>
                        Signed in as:
                    </p>
                </div>
                <SignInInfo theme='success' />
            </div>}
            <SignInGate
                // handlers:
                onSignIn={handleSignInLinkClick}
                onSignUp={handleSignInLinkClick}
            />
        </div>
    );
};
export {
    SignInCustomerAccount,
    SignInCustomerAccount as default,
};

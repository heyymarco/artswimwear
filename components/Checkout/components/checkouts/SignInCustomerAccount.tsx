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

// states:
import {
    useInterceptingRouter,
}                           from '@/navigations/interceptingRouter'

// configs:
import {
    authConfigClient,
}                           from '@/auth.config.client'



// react components:
const SignInCustomerAccount = (): JSX.Element|null => {
    // configs:
    const {
        signIn : {
            path : signInPath,
        }
    } = authConfigClient;
    
    
    
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // sessions:
    const { data: session } = useSession();
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // hooks:
    const mayInterceptedPathname = usePathname();
    const router                 = useRouter();
    
    
    
    // handlers:
    const {
        startIntercept,
    } = useInterceptingRouter();
    const handleSignInLinkClick = useEvent((): void => {
        startIntercept(async (): Promise<boolean> => {
            router.push(signInPath, { scroll: false }); // goto signIn page // do not scroll the page because it triggers the signIn_dialog interceptor
            
            
            
            const shownDialogPromise = showDialog<false|Session>(
                <SignInDialog
                    // components:
                    signInComponent={
                        <SignIn<Element>
                            // back to current page after signed in, so the user can continue the task:
                            defaultCallbackUrl={mayInterceptedPathname}
                        />
                    }
                />
            );
            
            
            
            // on collapsing (starts to close):
            await shownDialogPromise.collapseStartEvent();
            // restore the url:
            return true;
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

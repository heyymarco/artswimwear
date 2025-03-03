'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// internal components:
import {
    SignInDialog,
}                           from '@/components/dialogs/SignInDialog'
import {
    SignIn,
}                           from '@/components/SignIn'

// states:
import {
    InterceptDialog,
}                           from '@/navigations/InterceptDialog'
import {
    useSigninInterceptState,
}                           from '@/navigations/signinInterceptState'

// configs:
import {
    authConfigClient,
}                           from '@/auth.config.client'



// react components:
export default function SigninDialogPage(): JSX.Element|null {
    // states:
    const signinInterceptState = useSigninInterceptState();
    
    
    
    // configs:
    const {
        signIn : {
            path : signInPath,
        }
    } = authConfigClient;
    
    
    
    // refs:
    const lastNonInterceptedPathnameRef = useRef<string>('/');
    
    
    
    // jsx:
    return (
        <InterceptDialog
            // configs:
            interceptPath={signInPath}
            
            
            
            // states:
            interceptState={signinInterceptState}
            lastNonInterceptedPathnameRef={lastNonInterceptedPathnameRef}
            
            
            
            // components:
            interceptDialogComponent={
                <SignInDialog
                    // components:
                    signInComponent={
                        <SignIn<Element>
                            // back to current page after signed in, so the user can continue the task:
                            defaultCallbackUrl={lastNonInterceptedPathnameRef.current}
                        />
                    }
                />
            }
        />
    );
}

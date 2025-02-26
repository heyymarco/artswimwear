'use client'

// react:
import {
    // react:
    default as React,
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

// reusable-ui components:
import {
    Link,
}                           from '@reusable-ui/next-compat-link'
import {
    // simple-components:
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    type SignInProps as HeymarcoSignInProps,
    SignIn as HeymarcoSignIn,
}                           from '@heymarco/next-auth'
export *                    from '@heymarco/next-auth'

// internals:
import {
    useSigninTabState,
}                           from './states/signinTabState'
import {
    loginProviders,
}                           from './loginProviders'
import {
    pathNavigateSignIn,
    pathNavigateSignUp,
    pathNavigateRecover,
    pathNavigateHome,
}                           from './paths'

// states:
import {
    useInterceptingRouter,
}                           from '@/navigations/interceptingRouter'

// configs:
import {
    authConfigClient,
}                           from '@/auth.config.client'
import {
    credentialsConfigClient,
}                           from '@/credentials.config.client'



// react components:
export interface SignInProps<TElement extends Element = HTMLElement>
    extends
        Omit<HeymarcoSignInProps<TElement>,
            // states:
            |'defaultSection'
            |'section'
            |'onSectionChange'
            
            // auths:
            |'authConfigClient'
            |'credentialsConfigClient'
            |'providers'
        >
{
}
const SignIn         = <TElement extends Element = HTMLElement>(props: SignInProps<TElement>): JSX.Element|null => {
    // states:
    const {
        // states:
        section,
        setSection,
    } = useSigninTabState();
    
    
    
    // states:
    const router = useRouter();
    const {
        // actions:
        interceptingPush,
    } = useInterceptingRouter();
    
    
    
    // handlers:
    const handleNavigateSignIn  = useEvent(async (): Promise<void> => {
        (
            // when in intercepting dialog:
            (await interceptingPush(pathNavigateSignIn ))
            ||
            // when in full page:
            router.push(pathNavigateSignIn,  { scroll: false }) // do not scroll the page because it triggers the signIn_tab interceptor
        );
    });
    const handleNavigateSignUp  = useEvent(async (): Promise<void> => {
        (
            // when in intercepting dialog:
            (await interceptingPush(pathNavigateSignUp ))
            ||
            // when in full page:
            router.push(pathNavigateSignUp,  { scroll: false }) // do not scroll the page because it triggers the signUp_tab interceptor
        );
    });
    const handleNavigateRecover = useEvent(async (): Promise<void> => {
        (
            // when in intercepting dialog:
            (await interceptingPush(pathNavigateRecover))
            ||
            // when in full page:
            router.push(pathNavigateRecover, { scroll: false }) // do not scroll the page because it triggers the recover_tab interceptor
        );
    });
    const handleNavigateHome    = useEvent((): void => {
        router.push(pathNavigateHome,    { scroll: true  }); // may scroll the page because it navigates to home page
    });
    
    
    
    // default props:
    const {
        // variants:
        theme = 'primary',
        
        
        
        // components:
        switchSignInButtonComponent = (
            <ButtonIcon icon='account_box' buttonStyle='link' size='sm' iconPosition='end' onClick={handleNavigateSignIn}>
                <Link href={pathNavigateSignIn}  scroll={false}>
                    Already have an account? <strong>Sign In</strong>
                </Link>
            </ButtonIcon>
        ),
        switchSignUpButtonComponent = (
            <ButtonIcon icon='account_box' buttonStyle='link' size='sm' iconPosition='end' onClick={handleNavigateSignUp}>
                <Link href={pathNavigateSignUp}  scroll={false}>
                    Don&apos;t have an account? <strong>Sign Up</strong>
                </Link>
            </ButtonIcon>
        ),
        gotoSignInButtonComponent   = (
            <ButtonIcon icon='arrow_back'  buttonStyle='link' size='sm' onClick={handleNavigateSignIn}>
                <Link href={pathNavigateSignIn}  scroll={false}>
                    Back to Sign In
                </Link>
            </ButtonIcon>
        ),
        gotoRecoverButtonComponent  = (
            <ButtonIcon icon='help_center' buttonStyle='link' size='sm' onClick={handleNavigateRecover}>
                <Link href={pathNavigateRecover} scroll={false}>
                    Forgot Password?
                </Link>
            </ButtonIcon>
        ),
        gotoHomeButtonComponent     = (
            <ButtonIcon icon='home'        buttonStyle='link' size='sm' onClick={handleNavigateHome}>
                <Link href={pathNavigateHome}    scroll={false}>
                    Back to Home
                </Link>
            </ButtonIcon>
        ),
    } = props;
    
    
    
    // jsx:
    return (
        <HeymarcoSignIn
            // other props:
            {...props}
            
            
            
            // variants:
            theme={theme}
            
            
            
            // states:
            section={section}
            onSectionChange={setSection}
            
            
            
            // auths:
            authConfigClient={authConfigClient}
            credentialsConfigClient={credentialsConfigClient}
            providers={loginProviders}
            
            
            
            // components:
            switchSignInButtonComponent = {switchSignInButtonComponent}
            switchSignUpButtonComponent = {switchSignUpButtonComponent}
            gotoSignInButtonComponent   = {gotoSignInButtonComponent  }
            gotoRecoverButtonComponent  = {gotoRecoverButtonComponent }
            gotoHomeButtonComponent     = {gotoHomeButtonComponent    }
        />
    )
};
export {
    SignIn,
    SignIn as default,
};

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

// styles:
import {
    // style sheets:
    useSignInPageStyleSheet,
}                           from './styles/loader'

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
    Main,
    Section,
}                           from '@heymarco/section'
import {
    type SignInProps,
    SignIn,
}                           from '@heymarco/next-auth'

// configs:
import {
    authConfigClient,
}                           from '@/auth.config.client'
import {
    credentialsConfigClient,
}                           from '@/credentials.config.client'

// internals:
import {
    loginProviders,
}                           from './loginProviders'



// utilities:
const pathNavigateSignIn  = '/signin';
const pathNavigateSignUp  = '/signin/signup';
const pathNavigateRecover = '/signin/recover';
const pathNavigateHome    = '/';


// react components:
export interface SignInPageContentProps
    extends
        Pick<SignInProps,
            // states:
            |'defaultSection'
        >
{
}
export function SignInPageContent(props: SignInPageContentProps) {
    // props:
    const {
        defaultSection = 'signIn',
    } = props;
    
    
    
    // styles:
    const styleSheet = useSignInPageStyleSheet();
    
    
    
    // hooks:
    const router = useRouter();
    
    
    
    // handlers:
    const handleNavigateSignIn  = useEvent((): void => {
        // router.push(pathNavigateSignIn,  { scroll: false });
        router.back();
    });
    const handleNavigateSignUp  = useEvent((): void => {
        router.push(pathNavigateSignUp,  { scroll: false });
    });
    const handleNavigateRecover = useEvent((): void => {
        router.push(pathNavigateRecover, { scroll: false });
    });
    const handleNavigateHome    = useEvent((): void => {
        router.push(pathNavigateHome,    { scroll: false });
    });
    
    
    // jsx:
    return (
        <Main className={styleSheet.main}>
            <Section className='fill-self'>
                <SignIn
                    // variants:
                    theme='primary'
                    
                    
                    
                    // states:
                    defaultSection={defaultSection}
                    
                    
                    
                    // auths:
                    authConfigClient={authConfigClient}
                    credentialsConfigClient={credentialsConfigClient}
                    providers={loginProviders}
                    
                    
                    
                    // pages:
                    defaultCallbackUrl='/'
                    
                    
                    
                    // components:
                    switchSignInButtonComponent={
                        <ButtonIcon icon='account_box' buttonStyle='link' size='sm' iconPosition='end' onClick={handleNavigateSignIn}>
                            <Link href={pathNavigateSignIn}  scroll={false}>
                                Already have an account? <strong>Sign In</strong>
                            </Link>
                        </ButtonIcon>
                    }
                    switchSignUpButtonComponent={
                        <ButtonIcon icon='account_box' buttonStyle='link' size='sm' iconPosition='end' onClick={handleNavigateSignUp}>
                            <Link href={pathNavigateSignUp}  scroll={false}>
                                Don&apos;t have an account? <strong>Sign Up</strong>
                            </Link>
                        </ButtonIcon>
                    }
                    gotoSignInButtonComponent={
                        <ButtonIcon icon='arrow_back'  buttonStyle='link' size='sm' onClick={handleNavigateSignIn}>
                            <Link href={pathNavigateSignIn}  scroll={false}>
                                Back to Sign In
                            </Link>
                        </ButtonIcon>
                    }
                    gotoRecoverButtonComponent={
                        <ButtonIcon icon='help_center' buttonStyle='link' size='sm' onClick={handleNavigateRecover}>
                            <Link href={pathNavigateRecover} scroll={false}>
                                Forgot Password?
                            </Link>
                        </ButtonIcon>
                    }
                    gotoHomeButtonComponent={
                        <ButtonIcon icon='home'        buttonStyle='link' size='sm' onClick={handleNavigateHome}>
                            <Link href={pathNavigateHome}    scroll={false}>
                                Back to Home
                            </Link>
                        </ButtonIcon>
                    }
                />
            </Section>
        </Main>
    );
}

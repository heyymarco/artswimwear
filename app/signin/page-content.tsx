'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    // style sheets:
    useSignInPageStyleSheet,
}                           from './styles/loader'

// heymarco components:
import {
    Main,
    Section,
}                           from '@heymarco/section'
import {
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



// react components:
export function SignInPageContent() {
    // styles:
    const styleSheet = useSignInPageStyleSheet();
    
    
    
    // jsx:
    return (
        <Main className={styleSheet.main}>
            <Section className='fill-self'>
                <SignIn
                    // variants:
                    theme='primary'
                    
                    
                    
                    // auths:
                    authConfigClient={authConfigClient}
                    credentialsConfigClient={credentialsConfigClient}
                    providers={loginProviders}
                    
                    
                    
                    // pages:
                    defaultCallbackUrl='/'
                    
                    
                    
                    // components:
                    // gotoHomeButtonComponent={null}
                />
            </Section>
        </Main>
    );
}

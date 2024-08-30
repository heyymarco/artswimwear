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

// internal components:
import {
    SignIn,
}                           from '@/components/SignIn'



// react components:
export function SignInPageContent() {
    // styles:
    const styleSheet = useSignInPageStyleSheet();
    
    
    
    // jsx:
    return (
        <Main className={styleSheet.main}>
            <Section className='fill-self'>
                <SignIn />
            </Section>
        </Main>
    );
}

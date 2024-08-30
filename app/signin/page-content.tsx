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

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco components:
import {
    Main,
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    SigninTabStateProps,
    useSigninTabState,
    
    SignIn,
}                           from '@/components/SignIn'



// react components:
export interface SignInPageContentProps
    extends
        Pick<SigninTabStateProps,
            // states:
            |'defaultSection'
        >
{
}
export function SignInPageContent(props: SignInPageContentProps): JSX.Element|null {
    // props:
    const {
        defaultSection = 'signIn',
    } = props;
    
    
    
    // styles:
    const styleSheet = useSignInPageStyleSheet();
    
    
    
    // states:
    const {
        // states:
        setSection,
    } = useSigninTabState();
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        setSection(defaultSection);
    }, []);
    
    
    
    // jsx:
    return (
        <Main className={styleSheet.main}>
            <Section className='fill-self'>
                <SignIn />
            </Section>
        </Main>
    );
}

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
    SignInInfo,
}                           from '@/components/SignInInfo'
import {
    SignIn,
}                           from '@/components/SignIn'

// states:
import {
    type SigninInterceptState,
    useSigninInterceptState,
}                           from '@/navigations/signinInterceptState'



// react components:
export interface SignInPageContentProps
{
    defaultSection ?: SigninInterceptState['section']
}
export function SignInPageContent(props: SignInPageContentProps): JSX.Element|null {
    // props:
    const {
        defaultSection = 'signIn',
    } = props;
    
    
    
    // styles:
    const styleSheets = useSignInPageStyleSheet();
    
    
    
    // sessions:
    const { data: session } = useSession();
    
    
    
    // states:
    const {
        // states:
        setSection,
    } = useSigninInterceptState();
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        setSection(defaultSection);
    }, []);
    
    
    
    // jsx:
    return (
        <Main className={styleSheets.main}>
            <Section className='fill-self'>
                <div className={styleSheets.content}>
                    {!!session && <aside className={styleSheets.signInUserInfo}>
                        <div className={styleSheets.signInUserInfoText}>
                            <p>
                                Signed in as:
                            </p>
                        </div>
                        <SignInInfo
                            // variants:
                            size='lg'
                            theme='success'
                        />
                    </aside>}
                    
                    <div className={styleSheets.signInUiGroup}>
                        {!!session && <div className={styleSheets.switchUserInfoText}>
                            <p>
                                Not you? Please sign in below:
                            </p>
                        </div>}
                        <SignIn
                            // back to home page after signed in:
                            defaultCallbackUrl='/'
                        />
                    </div>
                </div>
            </Section>
        </Main>
    );
}

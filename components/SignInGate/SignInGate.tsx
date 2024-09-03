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
    useSignInGateStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    type EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    type ContentProps,
    Content,
    useContentStyleSheet,
    
    
    
    // simple-components:
    ButtonIcon,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'



// react components:
export interface SignInGateProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        ContentProps<TElement>
{
    // accessibilities:
    textSignIn ?: React.ReactNode
    textSwitch ?: React.ReactNode
    textSignUp ?: React.ReactNode
    
    
    
    // handlers:
    onSignIn   ?: EventHandler<unknown>
    onSignUp   ?: EventHandler<unknown>
}
const SignInGate = <TElement extends Element = HTMLElement>(props: SignInGateProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // accessibilities:
        textSignIn = <p>Already have an account?</p>,
        textSwitch = <p>Not you?</p>,
        textSignUp = <p>Don&apos;t have an account?</p>,
        
        
        
        // handlers:
        onSignIn,
        onSignUp,
        
        
        
        // other props:
        ...restSignInGateProps
    } = props;
    
    
    
    // styles:
    const contentStyleSheet = useContentStyleSheet();
    const styleSheet        = useSignInGateStyleSheet();
    
    
    
    // sessions:
    const { status: sessionStatus } = useSession();
    
    
    
    // default props:
    const {
        // variants:
        nude      = true,
        
        
        
        // classes:
        mainClass = `${contentStyleSheet.main} ${styleSheet.main}`,
        
        
        
        // other props:
        ...restContentProps
    } = restSignInGateProps;
    
    
    
    // jsx:
    return (
        <Content<TElement>
            // other props:
            {...restContentProps}
            
            
            
            // variants:
            nude={nude}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <section className={styleSheet.signInSection}>
                <div className={styleSheet.signInText}>
                    {(sessionStatus === 'authenticated') ? textSwitch : textSignIn}
                </div>
                <ButtonIcon
                    // appearances:
                    icon='login'
                    
                    
                    
                    // handlers:
                    onClick={onSignIn}
                >
                    <Link href='/signin' scroll={false}>
                        Sign In
                    </Link>
                </ButtonIcon>
            </section>
            <section className={styleSheet.signUpSection}>
                <div className={styleSheet.signUpText}>
                    {textSignUp}
                </div>
                <ButtonIcon
                    // appearances:
                    icon='account_box'
                    iconPosition='end'
                    
                    
                    
                    // variants:
                    buttonStyle='link'
                    size='sm'
                    
                    
                    
                    // handlers:
                    onClick={onSignUp}
                >
                    <Link href='/signin/signup' scroll={false}>
                        Sign Up
                    </Link>
                </ButtonIcon>
            </section>
        </Content>
    );
};
export {
    SignInGate,            // named export for readibility
    SignInGate as default, // default export to support React.lazy
}

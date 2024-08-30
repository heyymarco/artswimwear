'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    SigninTabStateProps,
    useSigninTabState,
}                           from './states/signinTabState'
import {
    IfPath,
}                           from './IfPath'



// react components:
export interface SignInSwitchProps
    extends
        Required<Pick<SigninTabStateProps,
            // states:
            |'section'
        >>
{
    // conditions:
    ifPathname ?: string
}
const SignInSwitch         = (props: SignInSwitchProps): JSX.Element|null => {
    // props:
    const {
        // conditions:
        ifPathname,
        
        
        
        // states:
        section,
    } = props;
    
    
    
    // jsx:
    if (ifPathname !== undefined) return (
        <IfPath ifPathname={ifPathname}>
            <SignInSwitchInternal
                // states:
                section={section}
            />
        </IfPath>
    );
    
    return (
        <SignInSwitchInternal
            // states:
            section={section}
        />
    );
};
const SignInSwitchInternal = (props: Omit<SignInSwitchProps, 'ifPathname'>): JSX.Element|null => {
    // props:
    const {
        // states:
        section,
    } = props;
    
    
    
    // states:
    const {
        // states:
        setSection,
    } = useSigninTabState();
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        setSection(section);
    }, [section]);
    
    
    
    // jsx:
    return null;
};
export {
    SignInSwitch,            // named export for readibility
    SignInSwitch as default, // default export to support React.lazy
}

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
    type SigninInterceptingState,
    useSigninInterceptingState,
}                           from './states/signinInterceptingState'
import {
    IfPath,
}                           from './IfPath'



// react components:
export interface SignInSwitchProps
    extends
        Pick<SigninInterceptingState,
            // states:
            |'section'
        >
{
    // conditions:
    ifPathname ?: string
    
    
    
    // behaviors:
    showDialog ?: boolean
}
const SignInSwitch         = (props: SignInSwitchProps): JSX.Element|null => {
    // props:
    const {
        // conditions:
        ifPathname,
        
        
        
        // behaviors:
        showDialog,
        
        
        
        // states:
        section,
    } = props;
    
    
    
    // jsx:
    if (ifPathname !== undefined) return (
        <IfPath ifPathname={ifPathname}>
            <SignInSwitchInternal
                // behaviors:
                showDialog={showDialog}
                
                
                
                // states:
                section={section}
            />
        </IfPath>
    );
    
    return (
        <SignInSwitchInternal
            // behaviors:
            showDialog={showDialog}
            
            
            
            // states:
            section={section}
        />
    );
};
const SignInSwitchInternal = (props: Omit<SignInSwitchProps, 'ifPathname'>): JSX.Element|null => {
    // props:
    const {
        // behaviors:
        showDialog = false,
        
        
        
        // states:
        section,
    } = props;
    
    
    
    // states:
    const {
        // states:
        setIsDialogShown,
        setSection,
    } = useSigninInterceptingState();
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        if (showDialog) setIsDialogShown(true);
        setSection(section);
    }, [showDialog, section]);
    
    
    
    // jsx:
    return null;
};
export {
    SignInSwitch,            // named export for readibility
    SignInSwitch as default, // default export to support React.lazy
}

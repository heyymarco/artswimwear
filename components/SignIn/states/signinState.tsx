'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useMemo,
}                           from 'react'

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// heymarco components:
import {
    type SignInProps,
    type ControllableSignInSection,
}                           from '@heymarco/next-auth'



// hooks:

// states:

//#region signinState

// contexts:
export interface SigninState
    extends
        Pick<SignInProps,
            // states:
            |'section'
        >
{
    // states:
    setSection : (section: ControllableSignInSection) => void
}

const defaultSigninStateContext : SigninState = {
    // states:
    section    : undefined,
    setSection : () => { throw Error('not in <SigninStateProvider>') },
};
const SigninStateContext = createContext<SigninState>(defaultSigninStateContext);
SigninStateContext.displayName  = 'SigninState';

export const useSigninState = (): SigninState => {
    const signinState = useContext(SigninStateContext);
    if (process.env.NODE_ENV !== 'production') {
        if (signinState === defaultSigninStateContext) {
            console.error('Not in <SigninStateProvider>.');
        } // if
    } // if
    return signinState;
}



// react components:
export interface SigninStateProps
    extends
        Pick<SignInProps,
            // states:
            |'defaultSection'
            |'section'
            |'onSectionChange'
        >
{
}
const SigninStateProvider = (props: React.PropsWithChildren<SigninStateProps>): JSX.Element|null => {
    // props:
    const {
        // states:
        defaultSection  : defaultUncontrollableSection = 'signIn',
        section         : controllableSection,
        onSectionChange : onControllableSectionChange,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // states:
    const {
        value              : section,
        triggerValueChange : setSection,
    } = useControllableAndUncontrollable<ControllableSignInSection>({
        defaultValue       : defaultUncontrollableSection,
        value              : controllableSection,
        onValueChange      : onControllableSectionChange,
    });
    
    
    
    // states:
    const signinState = useMemo<SigninState>(() => ({
        // states:
        section,
        setSection,
    }), [
        // states:
        section,
        setSection,
    ]);
    
    
    
    // jsx:
    return (
        <SigninStateContext.Provider value={signinState}>
            {children}
        </SigninStateContext.Provider>
    );
};
export {
    SigninStateProvider,            // named export for readibility
    SigninStateProvider as default, // default export to support React.lazy
}
//#endregion signinState

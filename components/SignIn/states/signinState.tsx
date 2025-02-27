'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useState,
    useContext,
    useMemo,
}                           from 'react'

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
        Required<Pick<SignInProps,
            // states:
            |'section'
        >>
{
    // states:
    // isShown    : boolean
    // setIsShown : (isShown: boolean) => void
    
    setSection : (section: ControllableSignInSection) => void
}

const noopSetter = () => {};
const defaultSigninStateContext : SigninState = {
    // states:
    // isShown    : false,
    // setIsShown : noopSetter,
    
    section    : 'signIn',
    setSection : noopSetter,
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
{
}
const SigninStateProvider = (props: React.PropsWithChildren<SigninStateProps>): JSX.Element|null => {
    // props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // states:
    // const [isShown, setIsShown] = useState<boolean>(false);
    const [section, setSection] = useState<ControllableSignInSection>('signIn');
    
    
    
    // states:
    const signinState = useMemo<SigninState>(() => ({
        // states:
        // isShown,
        // setIsShown,
        
        section,
        setSection,
    }), [
        // states:
        // isShown,
        // // setIsShown, // stable ref
        
        section,
        // setSection, // stable ref
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

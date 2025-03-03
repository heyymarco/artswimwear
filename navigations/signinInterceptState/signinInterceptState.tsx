'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useState,
    useMemo,
}                           from 'react'

// heymarco components:
import {
    type SignInProps,
    type ControllableSignInSection,
}                           from '@heymarco/next-auth'

// states:
import {
    type InterceptState,
    useInterceptStateProvider,
}                           from '@/navigations/interceptState'



// contexts:
export interface SigninInterceptState
    extends
        // bases:
        InterceptState,
        
        // states:
        Required<Pick<SignInProps,
            // states:
            |'section'
        >>
{
    // states:
    setSection : (section: ControllableSignInSection) => void
}
const SigninInterceptStateContext = createContext<SigninInterceptState|undefined>(undefined);
if (process.env.NODE_ENV !== 'production') SigninInterceptStateContext.displayName  = 'SigninInterceptState';



// hooks:
export const useSigninInterceptState = (): SigninInterceptState => {
    const signinInterceptState = useContext(SigninInterceptStateContext);
    if (signinInterceptState === undefined) throw Error('Not in <SigninInterceptStateProvider>.');
    return signinInterceptState;
}



// react components:
export interface SigninInterceptStateProps
{
}
const SigninInterceptStateProvider = (props: React.PropsWithChildren<SigninInterceptStateProps>): JSX.Element|null => {
    // props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // states:
    const interceptState = useInterceptStateProvider();
    const [section, setSection] = useState<ControllableSignInSection>('signIn');
    
    
    
    // states:
    const signinInterceptState = useMemo<SigninInterceptState>(() => ({
        // bases:
        ...interceptState,
        
        // states:
        section,
        setSection,
    }), [
        // bases:
        interceptState,
        
        // states:
        section,
        // setSection,       // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <SigninInterceptStateContext.Provider value={signinInterceptState}>
            {children}
        </SigninInterceptStateContext.Provider>
    );
};
export {
    SigninInterceptStateProvider,            // named export for readibility
    SigninInterceptStateProvider as default, // default export to support React.lazy
}

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

//#region signinTabState

// contexts:
export interface SigninTabState
    extends
        Pick<SignInProps,
            // states:
            |'section'
        >
{
    // states:
    setSection : (section: ControllableSignInSection) => void
}

const noopCallback = (): void => {};
const SigninTabStateContext = createContext<SigninTabState>({
    // states:
    setSection : noopCallback,
});
SigninTabStateContext.displayName  = 'SigninTabState';

export const useSigninTabState = (): SigninTabState => {
    return useContext(SigninTabStateContext);
}



// react components:
export interface SigninTabStateProps
    extends
        Pick<SignInProps,
            // states:
            |'defaultSection'
            |'section'
            |'onSectionChange'
        >
{
}
const SigninTabStateProvider = (props: React.PropsWithChildren<SigninTabStateProps>): JSX.Element|null => {
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
    const signinTabState = useMemo<SigninTabState>(() => ({
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
        <SigninTabStateContext.Provider value={signinTabState}>
            {children}
        </SigninTabStateContext.Provider>
    );
};
export {
    SigninTabStateProvider,            // named export for readibility
    SigninTabStateProvider as default, // default export to support React.lazy
}
//#endregion signinTabState

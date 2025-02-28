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
    useEffect,
    useRef,
}                           from 'react'

// next-js:
import {
    usePathname,
}                           from 'next/navigation'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    type EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // menu-components:
    type DropdownExpandedChangeEvent,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    type SignInProps,
    type ControllableSignInSection,
}                           from '@heymarco/next-auth'

// internal components:
import {
    CollapsibleSuspense,
}                           from '@/components/CollapsibleSuspense'
import {
    SignInDialog,
}                           from '@/components/dialogs/SignInDialog'
import {
    SignIn,
}                           from '@/components/SignIn'

// states:
import {
    useInterceptingRouter,
}                           from '@/navigations/interceptingRouter'

// configs:
import {
    authConfigClient,
}                           from '@/auth.config.client'



// types:
interface DropdownState {
    expanded       : boolean
    
    closingPromise : Promise<void>
    signalClosing  : () => void
}



// hooks:

// states:

//#region signinInterceptingState

// contexts:
export interface SigninInterceptingState
    extends
        Required<Pick<SignInProps,
            // states:
            |'section'
        >>
{
    // states:
    isShown    : boolean
    setIsShown : (isShown: boolean) => void
    
    setSection : (section: ControllableSignInSection) => void
}

const noopSetter = () => {};
const defaultSigninInterceptingStateContext : SigninInterceptingState = {
    // states:
    isShown    : false,
    setIsShown : noopSetter,
    
    section    : 'signIn',
    setSection : noopSetter,
};
const SigninInterceptingStateContext = createContext<SigninInterceptingState>(defaultSigninInterceptingStateContext);
SigninInterceptingStateContext.displayName  = 'SigninInterceptingState';

export const useSigninInterceptingState = (): SigninInterceptingState => {
    const signinInterceptingState = useContext(SigninInterceptingStateContext);
    if (process.env.NODE_ENV !== 'production') {
        if (signinInterceptingState === defaultSigninInterceptingStateContext) {
            console.error('Not in <SigninInterceptingStateProvider>.');
        } // if
    } // if
    return signinInterceptingState;
}



// react components:
export interface SigninInterceptingStateProps
{
}
const SigninInterceptingStateProvider = (props: React.PropsWithChildren<SigninInterceptingStateProps>): JSX.Element|null => {
    // props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // configs:
    const {
        signIn : {
            path : signInPath,
        }
    } = authConfigClient;
    
    
    
    // states:
    const [isShown, setIsShown] = useState<boolean>(false);
    const [section, setSection] = useState<ControllableSignInSection>('signIn');
    
    const [dropdownState, setDropdownState] = useState<DropdownState|null>(null); // initially no <DropdownUi> was shown
    
    const mayInterceptedPathname     = usePathname();
    const lastNonInterceptedPathname = useRef<string>('/');
    
    // if the pathname is neither the `signInPath` nor its sub-path:
    if (!mayInterceptedPathname.startsWith(signInPath) || !['', '/'].includes(mayInterceptedPathname.slice(signInPath.length, signInPath.length + 1))) {
        // remember the last non-signin pathname:
        lastNonInterceptedPathname.current = mayInterceptedPathname;
    } // if
    
    const {
        // actions:
        interceptingPush,
        
        startIntercept,
    } = useInterceptingRouter();
    
    
    
    // handlers:
    const showDropdownAndWaitUntilClosing = useEvent(async (): Promise<void> => {
        // conditions:
        if (dropdownState) {
            // The <DropdownUi> is already opened => wait until the <DropdownUi> start to close:
            await dropdownState.closingPromise;
            return;
        } // if
        
        
        
        // actions:
        // The <DropdownUi> is not opened => open a new one:
        const { promise: closingPromise, resolve: signalClosing } = Promise.withResolvers<void>();
        const newDropdownState : DropdownState = {
            expanded: true, // initially expanded
            
            closingPromise,
            signalClosing,
        };
        setDropdownState(newDropdownState);
        await closingPromise; // wait until the <DropdownUi> start to close
    });
    const closeDropdown                   = useEvent((): void => {
        // mutate to collapsed state:
        setDropdownState((current) => {
            if (!current) return null; // no state => noting to mutate
            if (!current.expanded) return current; // already collapsed => nothing to mutate
            
            return {
                ...current,
                expanded : false, // set to collapsed
            };
        });
    });
    const handleExpandedChange            = useEvent<EventHandler<DropdownExpandedChangeEvent<unknown>>>(async ({ expanded }) => {
        // conditions:
        if (expanded) return; // only interested of collapsed event, ignores expanded event
        
        
        
        // actions:
        closeDropdown(); // the <DropdownUi> request to close => close the <DropdownUi>
    });
    const handleCollapseStart             = useEvent<EventHandler<void>>(() => {
        dropdownState?.signalClosing(); // notify that the <DropdownUi> start to close
        setDropdownState(null); // remove the <DropdownUi>'s state
    });
    
    
    
    // effects:
    
    // Shows/Hides the dialog:
    const isShownRef = useRef<boolean>(isShown);
    useEffect(() => {
        // conditions:
        if (isShownRef.current === isShown) return; // already the same => ignore
        isShownRef.current = isShown;               // sync
        
        
        
        // actions:
        if (isShown) {
            // open the dialog:
            startIntercept(async (): Promise<boolean> => {
                // interceptingPush(signInPath); // goto signIn page
                
                
                
                // show the dialog and wait until begin to close:
                await showDropdownAndWaitUntilClosing();
                
                
                
                // update the state:
                setIsShown(false);
                
                // restore the url manually:
                interceptingPush(lastNonInterceptedPathname.current);
                return false;
            });
        }
        else {
            // close the dialog:
            closeDropdown();
        } // if
    }, [isShown]);
    
    
    
    // states:
    const signinInterceptingState = useMemo<SigninInterceptingState>(() => ({
        // states:
        isShown,
        setIsShown,
        
        section,
        setSection,
    }), [
        // states:
        isShown,
        // setIsShown, // stable ref
        
        section,
        // setSection, // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <SigninInterceptingStateContext.Provider value={signinInterceptingState}>
            {children}
            
            <CollapsibleSuspense>
                <SignInDialog
                    // states:
                    expanded={dropdownState?.expanded ?? false}
                    onExpandedChange={handleExpandedChange}
                    onCollapseStart={handleCollapseStart}
                    
                    
                    
                    // components:
                    signInComponent={
                        <SignIn<Element>
                            // back to current page after signed in, so the user can continue the task:
                            defaultCallbackUrl={lastNonInterceptedPathname.current}
                        />
                    }
                />
            </CollapsibleSuspense>
        </SigninInterceptingStateContext.Provider>
    );
};
export {
    SigninInterceptingStateProvider,            // named export for readibility
    SigninInterceptingStateProvider as default, // default export to support React.lazy
}
//#endregion signinInterceptingState

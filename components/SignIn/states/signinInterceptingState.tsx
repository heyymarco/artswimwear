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
    // dialog-components:
    type ModalExpandedChangeEvent,
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
interface DialogState {
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
    
    const [dialogState, setDialogState] = useState<DialogState|null>(null); // initially no <DialogUi> was shown
    
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
    const showDialogAndWaitUntilClosing = useEvent(async (): Promise<void> => {
        // conditions:
        if (dialogState) {
            // The <DialogUi> is already opened => wait until the <DialogUi> start to close:
            await dialogState.closingPromise;
            return;
        } // if
        
        
        
        // actions:
        // The <DialogUi> is not opened => open a new one:
        const { promise: closingPromise, resolve: signalClosing } = Promise.withResolvers<void>();
        const newDialogState : DialogState = {
            expanded: true, // initially expanded
            
            closingPromise,
            signalClosing,
        };
        setDialogState(newDialogState);
        await closingPromise; // wait until the <DialogUi> start to close
    });
    const closeDialog                   = useEvent((): void => {
        // mutate to collapsed state:
        setDialogState((current) => {
            if (!current) return null; // no state => noting to mutate
            if (!current.expanded) return current; // already collapsed => nothing to mutate
            
            return {
                ...current,
                expanded : false, // set to collapsed
            };
        });
    });
    const handleExpandedChange          = useEvent<EventHandler<ModalExpandedChangeEvent<unknown>>>(async ({ expanded }) => {
        // conditions:
        if (expanded) return; // only interested of collapsed event, ignores expanded event
        
        
        
        // actions:
        closeDialog(); // the <DialogUi> request to close => close the <DialogUi>
    });
    const handleCollapseStart           = useEvent<EventHandler<void>>(() => {
        dialogState?.signalClosing(); // notify that the <DialogUi> start to close
        setDialogState(null); // remove the <DialogUi>'s state
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
                await showDialogAndWaitUntilClosing();
                
                
                
                // update the state:
                setIsShown(false);
                
                // restore the url manually:
                interceptingPush(lastNonInterceptedPathname.current);
                return false;
            });
        }
        else {
            // close the dialog:
            closeDialog();
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
                    expanded={dialogState?.expanded ?? false}
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

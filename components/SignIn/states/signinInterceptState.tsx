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
    useInterceptRouter,
}                           from '@/navigations/interceptRouter'

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



// contexts:
export interface SigninInterceptState
    extends
        Required<Pick<SignInProps,
            // states:
            |'section'
        >>
{
    // states:
    isDialogShown    : boolean
    setIsDialogShown : (isDialogShown: boolean) => void
    
    setSection       : (section: ControllableSignInSection) => void
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
    
    
    
    // configs:
    const {
        signIn : {
            path : signInPath,
        }
    } = authConfigClient;
    
    
    
    // states:
    const [isDialogShown, setIsDialogShown] = useState<boolean>(false);
    const [section      , setSection      ] = useState<ControllableSignInSection>('signIn');
    
    const [dialogState  , setDialogState  ] = useState<DialogState|null>(null); // initially no <DialogUi> was shown
    
    const mayInterceptedPathname     = usePathname();
    const lastNonInterceptedPathname = useRef<string>('/');
    
    // if the pathname is neither the `signInPath` nor its sub-path:
    if ((
        // the pathname is not the escaped path:
        (!mayInterceptedPathname.startsWith('/_/'))
        &&
        // the pathname is not the `signInPath`:
        (!mayInterceptedPathname.startsWith(signInPath) || !['', '/'].includes(mayInterceptedPathname.slice(signInPath.length, signInPath.length + 1))))
    ) {
        // remember the last non-signin pathname:
        lastNonInterceptedPathname.current = mayInterceptedPathname;
    } // if
    
    const {
        // actions:
        interceptPush,
        
        startIntercept,
    } = useInterceptRouter();
    
    
    
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
    const prevIsDialogShownRef = useRef<boolean>(isDialogShown);
    useEffect(() => {
        // conditions:
        if (prevIsDialogShownRef.current === isDialogShown) return; // already the same => ignore
        prevIsDialogShownRef.current = isDialogShown;               // sync
        
        
        
        // actions:
        if (isDialogShown) {
            // open the dialog:
            startIntercept(async (): Promise<boolean> => {
                // interceptPush(signInPath); // goto signIn page
                
                
                
                // show the dialog and wait until begin to close:
                await showDialogAndWaitUntilClosing();
                
                
                
                // update the state:
                setIsDialogShown(false);
                
                // restore the url manually:
                interceptPush(lastNonInterceptedPathname.current);
                return false;
            });
        }
        else {
            // close the dialog:
            closeDialog();
        } // if
    }, [isDialogShown]);
    
    
    
    // states:
    const signinInterceptState = useMemo<SigninInterceptState>(() => ({
        // states:
        isDialogShown,
        setIsDialogShown,
        
        section,
        setSection,
    }), [
        // states:
        isDialogShown,
        // setIsDialogShown, // stable ref
        
        section,
        // setSection,       // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <SigninInterceptStateContext.Provider value={signinInterceptState}>
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
        </SigninInterceptStateContext.Provider>
    );
};
export {
    SigninInterceptStateProvider,            // named export for readibility
    SigninInterceptStateProvider as default, // default export to support React.lazy
}

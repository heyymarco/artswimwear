'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
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
    type ModalProps,
    type ModalExpandedChangeEvent,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    CollapsibleSuspense,
}                           from '@/components/CollapsibleSuspense'

// states:
import {
    type DialogInterceptState,
}                           from '@/navigations/dialogInterceptState'
import {
    useInterceptRouter,
}                           from '@/navigations/interceptRouter'

// internals:
import {
    type DialogState,
}                           from './types'



// hooks:
export interface InterceptDialogComponentProps
    extends
        // bases:
        ModalProps<Element, ModalExpandedChangeEvent<boolean>>
{
}
export interface InterceptDialogProps
{
    // configs:
    interceptPath                  : string
    
    
    
    // states:
    interceptState                 : DialogInterceptState
    lastNonInterceptedPathnameRef ?: React.MutableRefObject<string>
    
    
    
    // components:
    interceptDialogComponent       : React.ReactElement<InterceptDialogComponentProps>
}
const InterceptDialog = (props: InterceptDialogProps): JSX.Element|null => {
    // refs:
    const lastNonInterceptedPathnameRefInternal = useRef<string>('/');
    
    
    
    // props:
    const {
        // configs:
        interceptPath,
        
        
        
        // states:
        interceptState,
        lastNonInterceptedPathnameRef = lastNonInterceptedPathnameRefInternal,
        
        
        
        // components:
        interceptDialogComponent,
    } = props;
    
    
    
    // states:
    const {
        // states:
        isDialogShown,
        setIsDialogShown,
    } = interceptState;
    
    const [dialogState, setDialogState] = useState<DialogState|null>(null); // initially no <DialogUi> was shown
    
    const mayInterceptedPathname        = usePathname();
    
    // if the pathname is neither the `interceptPath` nor its sub-path:
    if (
        // the pathname is not the escaped path:
        (!mayInterceptedPathname.startsWith('/_/'))
        &&
        // the pathname is not the `interceptPath` path:
        (!mayInterceptedPathname.startsWith(interceptPath) || !['', '/'].includes(mayInterceptedPathname.slice(interceptPath.length, interceptPath.length + 1)))
    ) {
        // remember the last non-`interceptPath` path:
        lastNonInterceptedPathnameRef.current = mayInterceptedPathname;
    } // if
    
    const {
        // actions:
        interceptPush,
        
        startIntercept,
    } = useInterceptRouter();
    
    
    
    // handlers:
    const showDialogAndWaitUntilClosing = useEvent(async (): Promise<boolean|undefined> => {
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
            
            hasData : false,     // initially no data
            data    : undefined, // initially no data
        };
        setDialogState(newDialogState);
        await closingPromise; // wait until the <DialogUi> start to close
        return newDialogState.data;
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
    const handleExpandedChange          = useEvent<EventHandler<ModalExpandedChangeEvent<boolean>>>(async ({ expanded, data }) => {
        // conditions:
        if (expanded) return; // only interested of collapsed event, ignores expanded event
        
        
        
        // actions:
        closeDialog(); // the <DialogUi> request to close => close the <DialogUi>
        if (dialogState && !dialogState.hasData) {
            dialogState.data    = data; // update the data
            dialogState.hasData = true; // mark as has data
        } // if
    });
    const handleCollapseStart           = useEvent<EventHandler<void>>(() => {
        dialogState?.signalClosing(); // notify that the <DialogUi> start to close
        setDialogState(null);         // remove the <DialogUi>'s state
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
                // interceptPush(interceptPath); // goto `interceptPath` page
                
                
                
                // show the dialog and wait until begin to close:
                const handled = await showDialogAndWaitUntilClosing();
                
                
                
                // update the state:
                setIsDialogShown(false);
                
                // restore the url manually if not handled:
                if (handled !== true) interceptPush(lastNonInterceptedPathnameRef.current);
                return false;
            });
        }
        else {
            // close the dialog:
            closeDialog();
        } // if
    }, [isDialogShown]);
    
    
    
    // jsx:
    return (
        <CollapsibleSuspense>
            {React.cloneElement<InterceptDialogComponentProps>(interceptDialogComponent,
                // props:
                {
                    // states:
                    expanded          : dialogState?.expanded ?? false,
                    onExpandedChange  : handleExpandedChange,
                    onCollapseStart   : handleCollapseStart,
                },
            )}
        </CollapsibleSuspense>
    );
};
export {
    InterceptDialog,            // named export for readibility
    InterceptDialog as default, // default export to support React.lazy
}

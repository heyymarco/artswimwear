'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
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
    type DropdownProps,
    
    
    
    // dialog-components:
    type ModalExpandedChangeEvent,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    CollapsibleSuspense,
}                           from '@/components/CollapsibleSuspense'

// states:
import {
    useInterceptingRouter,
}                           from '@/navigations/interceptingRouter'



// types:
interface DialogState {
    expanded       : boolean
    
    closingPromise : Promise<void>
    signalClosing  : () => void
    
    hasData        : boolean
    data           : boolean|undefined
}



// contexts:
export interface InterceptingState
{
    // refs:
    navbarRef               : React.MutableRefObject<HTMLElement|null>
    menuRef                 : React.MutableRefObject<HTMLElement|null>
    
    
    
    // states:
    isDesktopLayout         : boolean
    setIsDesktopLayout      : (isDesktopLayout: boolean) => void
    
    isNavbarListExpanded    : boolean
    setIsNavbarListExpanded : (isNavbarListExpanded: boolean) => void
    
    isDialogShown           : boolean
    setIsDialogShown        : (isDialogShown: boolean) => void
}

const noopSetter = () => {};
export const defaultInterceptingStateContext : InterceptingState = {
    // refs:
    navbarRef               : { current: null },
    menuRef                 : { current: null },
    
    
    
    // states:
    isDesktopLayout         : false,
    setIsDesktopLayout      : noopSetter,
    
    isNavbarListExpanded    : false,
    setIsNavbarListExpanded : noopSetter,
    
    isDialogShown           : false,
    setIsDialogShown        : noopSetter,
};



export interface InterceptingDialogComponentProps
    extends
        // bases:
        DropdownProps<Element, DropdownExpandedChangeEvent<boolean>>
{
    // appearances:
    mobileLayout ?: boolean
}
export interface InterceptingStateProps {
    // configs:
    interceptingPath : string
    
    
    
    // components:
    interceptingDialogComponent : React.ReactElement<InterceptingDialogComponentProps>
}
export const useInterceptingState = (props: InterceptingStateProps) => {
    // props:
    const {
        // configs:
        interceptingPath,
        
        
        
        // components:
        interceptingDialogComponent,
    } = props;
    
    
    
    // refs:
    const navbarRef = useRef<HTMLElement|null>(null);
    const menuRef   = useRef<HTMLElement|null>(null);
    
    
    
    // states:
    const [isDesktopLayout     , setIsDesktopLayout     ] = useState<boolean>(false);
    const [isNavbarListExpanded, setIsNavbarListExpanded] = useState<boolean>(false);
    
    const [isDialogShown       , setIsDialogShown       ] = useState<boolean>(false);
    
    const [dialogState         , setDialogState         ] = useState<DialogState|null>(null); // initially no <DialogUi> was shown
    
    const mayInterceptedPathname     = usePathname();
    const lastNonInterceptedPathname = useRef<string>('/');
    
    // if the pathname is neither the `interceptingPath` nor its sub-path:
    if (
        // the pathname is not the escaped path:
        (!mayInterceptedPathname.startsWith('/_/'))
        &&
        // the pathname is not the `interceptingPath` path:
        (!mayInterceptedPathname.startsWith(interceptingPath) || !['', '/'].includes(mayInterceptedPathname.slice(interceptingPath.length, interceptingPath.length + 1)))
    ) {
        // remember the last non-`interceptingPath` path:
        lastNonInterceptedPathname.current = mayInterceptedPathname;
    } // if
    
    const {
        // actions:
        interceptingPush,
        
        startIntercept,
    } = useInterceptingRouter();
    
    
    
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
                // interceptingPush(interceptingPath); // goto `interceptingPath` page
                
                
                
                // show the dialog and wait until begin to close:
                const handled = await showDialogAndWaitUntilClosing();
                
                
                
                // update the state:
                setIsDialogShown(false);
                
                // restore the url manually if not handled:
                if (handled !== true) interceptingPush(lastNonInterceptedPathname.current);
                return false;
            });
        }
        else {
            // close the dialog:
            closeDialog();
        } // if
    }, [isDialogShown]);
    
    // Closes the shown <DialogUi> when on transition between desktop <==> mobile:
    const prevIsDesktopLayoutRef = useRef<boolean>(isDesktopLayout);
    useEffect(() => {
        // conditions:
        if (prevIsDesktopLayoutRef.current === isDesktopLayout) return; // no diff => ignore
        prevIsDesktopLayoutRef.current = isDesktopLayout; // sync
        
        
        
        // actions:
        closeDialog();
    }, [isDesktopLayout]);
    
    // Closes the shown <DialogUi> when <Navbar>'s list collapsed:
    const prevIsNavbarListExpandedRef = useRef<boolean>(isNavbarListExpanded);
    useEffect(() => {
        // conditions:
        if (prevIsNavbarListExpandedRef.current === isNavbarListExpanded) return; // no diff => ignore
        prevIsNavbarListExpandedRef.current = isNavbarListExpanded; // sync
        if (isNavbarListExpanded) return; // only interested on collapsed event
        
        
        
        // actions:
        closeDialog();
    }, [isNavbarListExpanded]);
    
    
    
    // states:
    const interceptingState = useMemo<InterceptingState>(() => ({
        // refs:
        navbarRef,
        menuRef,
        
        
        
        // states:
        isDesktopLayout,
        setIsDesktopLayout,
        
        isNavbarListExpanded,
        setIsNavbarListExpanded,
        
        isDialogShown,
        setIsDialogShown,
    }), [
        // refs:
        // navbarRef,               // stable ref
        // menuRef,                 // stable ref
        
        
        
        // states:
        isDesktopLayout,
        // setIsDesktopLayout,      // stable ref
        
        isNavbarListExpanded,
        // setIsNavbarListExpanded, // stable ref
        
        isDialogShown,
        // setIsDialogShown,        // stable ref
    ]);
    
    
    
    // jsx:
    const interceptingDialog = (
        <CollapsibleSuspense>
            {React.cloneElement<InterceptingDialogComponentProps>(interceptingDialogComponent,
                // props:
                {
                    // appearances:
                    mobileLayout      : !isDesktopLayout,
                    
                    
                    
                    // variants:
                    // theme          : 'primary'
                    
                    
                    
                    // states:
                    expanded          : dialogState?.expanded ?? false,
                    onExpandedChange  : handleExpandedChange,
                    onCollapseStart   : handleCollapseStart,
                    
                    
                    
                    // floatable:
                    floatingStrategy  : 'fixed', // prevents the influence by browser's scrollbar
                    floatingOn        : (
                        isDesktopLayout
                        ? menuRef                // on desktop: shows the <DropdownUi> on the bottom of <NavbarMenuDropdown>
                        : navbarRef              // on mobile : shows the <DropdownUi> on the bottom of <Navbar>
                    ),
                    floatingPlacement : (
                        isDesktopLayout
                        ? 'bottom-end'           // on desktop: shows the <DropdownUi> on the bottom of <NavbarMenuDropdown>
                        : 'bottom-start'         // on mobile : shows the <DropdownUi> on the bottom of <Navbar>
                    ),
                    orientation       : (
                        isDesktopLayout
                        ? 'block'                // on desktop: vertically   (top  to bottom) shows the <DropdownUi> on the bottom of <NavbarMenuDropdown>
                        : 'inline'               // on mobile : horizontally (left to  right) shows the <DropdownUi> on the bottom of <Navbar>
                    ),
                    
                    
                    
                    // auto focusable:
                    restoreFocusOn    : (
                        isDesktopLayout
                        ? menuRef                // on desktop: restores focus to <NavbarMenuDropdown>
                        : navbarRef              // on mobile: restores focus to <Navbar>
                    ),
                },
            )}
        </CollapsibleSuspense>
    );
    
    
    
    // api:
    return {
        interceptingState,
        interceptingDialog,
    };
};

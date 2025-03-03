'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // menu-components:
    type DropdownExpandedChangeEvent,
    type DropdownProps,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// states:
import {
    type NavbarDropdownInterceptState,
}                           from '@/navigations/navbarDropdownInterceptState'
import {
    type InterceptDialogProps,
    InterceptDialog,
}                           from '@/navigations/InterceptDialog'



// hooks:
export interface InterceptNavbarDropdownComponentProps
    extends
        // bases:
        DropdownProps<Element, DropdownExpandedChangeEvent<boolean>>
{
    // appearances:
    mobileLayout ?: boolean
}
export interface InterceptNavbarDropdownProps
    extends
        // bases:
        InterceptDialogProps
{
    // states:
    interceptState                 : NavbarDropdownInterceptState
    
    
    
    // components:
    interceptDialogComponent       : React.ReactElement<InterceptNavbarDropdownComponentProps>
}
const InterceptNavbarDropdown = (props: InterceptNavbarDropdownProps): JSX.Element|null => {
    // states:
    const {
        // refs:
        navbarRef,
        menuRef,
        
        
        
        // states:
        isDesktopLayout,
        
        isNavbarListExpanded,
        
        setIsDialogShown,
    } = props.interceptState;
    
    
    
    // handlers:
    const closeDialog = useEvent((): void => {
        // actions:
        setIsDialogShown(false);
    });
    
    
    
    // effects:
    
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
    
    
    
    // jsx:
    return (
        <InterceptDialog
            // rest props:
            {...props}
            
            
            
            // components:
            interceptDialogComponent={
                React.cloneElement<InterceptNavbarDropdownComponentProps>(props.interceptDialogComponent,
                    // props:
                    {
                        // appearances:
                        mobileLayout      : !isDesktopLayout,
                        
                        
                        
                        // floatable:
                        floatingStrategy  : 'fixed', // prevents the influence by browser's scrollbar
                        floatingOn        : (
                            isDesktopLayout
                            ? menuRef                // on desktop : dropdown  the <DropdownUi> on the bottom of <NavItem>
                            : navbarRef              // on mobile  : dropright the <DropdownUi> on the bottom of <Navbar>
                        ),
                        floatingPlacement : (
                            isDesktopLayout
                            ? 'bottom'               // on desktop : dropdown  the <DropdownUi> on the bottom of <NavItem>
                            : 'bottom-start'         // on mobile  : dropright the <DropdownUi> on the bottom of <Navbar>
                        ),
                        orientation       : (
                            isDesktopLayout
                            ? 'block'                // on desktop : dropdown  the <DropdownUi> on the bottom of <NavItem>
                            : 'inline'               // on mobile  : dropright the <DropdownUi> on the bottom of <Navbar>
                        ),
                        
                        
                        
                        // auto focusable:
                        restoreFocusOn    : (
                            isDesktopLayout
                            ? menuRef                // on desktop : restores focus to <NavItem>
                            : navbarRef              // on mobile  : restores focus to <Navbar>
                        ),
                    },
                )
            }
        />
    );
};
export {
    InterceptNavbarDropdown,            // named export for readibility
    InterceptNavbarDropdown as default, // default export to support React.lazy
}

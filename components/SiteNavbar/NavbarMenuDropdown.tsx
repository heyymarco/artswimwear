'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // composite-components:
    NavItemProps,
    NavItem,
    useNavbarState,
    
    
    
    // menu-components:
    type DropdownExpandedChangeEvent,
    type DropdownProps,
    
    
    
    // utility-components:
    PromiseDialog,
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// states:
import {
    usePageInterceptState,
}                           from '@/states/pageInterceptState'



// react components:
export interface NavbarMenuDropdownUiProps
    extends
        // bases:
        DropdownProps<Element, DropdownExpandedChangeEvent<boolean>>
{
    // appearances:
    mobileLayout ?: boolean
}
export interface NavbarMenuDropdownProps
    extends
        // bases:
        NavItemProps
{
    // components:
    dropdownUiComponent : React.ReactElement<NavbarMenuDropdownUiProps>
}
const NavbarMenuDropdown = (props: NavbarMenuDropdownProps): JSX.Element|null => {
    // props:
    const {
        // components:
        dropdownUiComponent,
        
        
        
        // handlers:
        onClick,
        
        
        
        // other props:
        ...restNavbarMenuDropdownProps
    } = props;
    
    
    
    // states:
    const {
        // refs:
        navbarRef,
        
        
        
        // states:
        navbarExpanded : isDesktopLayout,
        listExpanded,
        
        
        
        // handlers:
        toggleList,
    } = useNavbarState();
    
    
    
    // refs:
    const menuRef = useRef<HTMLElement|null>(null);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    const [shownDropdown, setShownDropdown] = useState<PromiseDialog<any>|null>(null);
    
    
    
    // handlers:
    const {
        startIntercept,
    } = usePageInterceptState();
    const handleClickInternal = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        if (event.defaultPrevented) return; // already handled => ignore
        event.preventDefault();             // prevents the `href='/target-path'` to HARD|SOFT navigate
        event.stopPropagation();            // prevents the <Navbar> from auto collapsing, we'll collapse the <Navbar> manually
        
        
        
        if (shownDropdown) {
            shownDropdown.closeDialog(undefined);
        }
        else {
            //#region a fix for categories page interceptor
            // intercepts all_pages/** => show <DropdownUi>:
            startIntercept(async (backPathname): Promise<boolean> => {
                if (!listExpanded) toggleList(false); // collapse the <Navbar> manually
                
                
                
                const shownDropdownPromise = showDialog<boolean>(
                    React.cloneElement<NavbarMenuDropdownUiProps>(dropdownUiComponent,
                        // props:
                        {
                            // appearances:
                            mobileLayout      : !isDesktopLayout,
                            
                            
                            
                            // variants:
                            // theme          : 'primary'
                            
                            
                            
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
                    )
                );
                setShownDropdown(shownDropdownPromise);
                
                // on collapsed (has been closed):
                if (!isDesktopLayout) {
                    shownDropdownPromise.collapseEndEvent().then(() => {
                        toggleList(false); // collapse the <Navbar> manually
                    });
                } // if
                
                
                
                // on collapsing (start to close):
                const { data } = await shownDropdownPromise.collapseStartEvent();
                setShownDropdown(null);
                // when the dropdown closed without the user clicking the menu item => restore the url, otherwise keeps the changed url
                return (data !== true);
            });
            //#endregion a fix for categories page interceptor
        } // if
    });
    const handleClick = useMergeEvents(
        // preserves the original `onClick` from `props`:
        onClick,
        
        
        
        // actions:
        handleClickInternal,
    );
    
    
    
    // effects:
    // closes the shown <DropdownUi> when on transition between desktop <==> mobile:
    const prevIsDesktopLayoutRef = useRef<boolean>(isDesktopLayout);
    useEffect(() => {
        // conditions:
        if (prevIsDesktopLayoutRef.current === isDesktopLayout) return; // no diff => ignore
        prevIsDesktopLayoutRef.current = isDesktopLayout; // sync
        
        
        
        // actions:
        shownDropdown?.closeDialog(undefined);
    }, [isDesktopLayout]);
    
    // closes the shown <DropdownUi> when <Navbar>'s list collapsed:
    const prevListExpandedRef = useRef<boolean>(listExpanded);
    useEffect(() => {
        // conditions:
        if (prevListExpandedRef.current === listExpanded) return; // no diff => ignore
        prevListExpandedRef.current = listExpanded; // sync
        if (listExpanded) return; // only interested on collapsed event
        
        
        
        // actions:
        shownDropdown?.closeDialog(undefined);
    }, [listExpanded]);
    
    
    
    // default props:
    const {
        // states:
        active   = (shownDropdown ? true : undefined), // force as active if the menu is shown
        
        
        
        // other props:
        ...restNavItemProps
    } = restNavbarMenuDropdownProps satisfies NoForeignProps<typeof restNavbarMenuDropdownProps, NavItemProps>;
    
    
    
    // jsx:
    return (
        <NavItem
            // other props:
            {...restNavItemProps}
            
            
            
            // refs:
            elmRef={menuRef}
            
            
            
            // states:
            active={active}
            
            
            
            // handlers:
            onClick={handleClick}
        />
    );
};
export {
    NavbarMenuDropdown,
    NavbarMenuDropdown as default,
}
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
    type EventHandler,
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
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    DropdownWithDelay,
}                           from './DropdownWithDelay'

// states:
import {
    usePageInterceptState,
}                           from '@/states/pageInterceptState'



// types:
interface DropdownState {
    expanded       : boolean
    
    closingPromise : Promise<void>
    signalClosing  : () => void
    
    data           : boolean|undefined
}



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
    
    const [dropdownState, setDropdownState] = useState<DropdownState|null>(null); // initially no <DropdownUi> was shown
    
    
    
    // refs:
    const menuRef = useRef<HTMLElement|null>(null);
    
    
    
    // handlers:
    const showDropdownAndWaitUntilClosing = useEvent(async (): Promise<boolean|undefined> => {
        // conditions:
        if (dropdownState) {
            // The <DropdownUi> is already opened => wait until the <DropdownUi> start to close:
            await dropdownState.closingPromise;
            return dropdownState.data;
        } // if
        
        
        
        // actions:
        // The <DropdownUi> is not opened => open a new one:
        const { promise: closingPromise, resolve: signalClosing } = Promise.withResolvers<void>();
        const newDropdownState : DropdownState = {
            expanded: true, // initially expanded
            
            closingPromise,
            signalClosing,
            
            data: undefined, // initially no data
        };
        setDropdownState(newDropdownState);
        await closingPromise; // wait until the <DropdownUi> start to close
        return newDropdownState.data;
    });
    const hideDropdown                 = useEvent((): void => {
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
    const handleExpandedChange         = useEvent<EventHandler<DropdownExpandedChangeEvent<boolean>>>(({ expanded, data }) => {
        if (dropdownState) dropdownState.data = data; // update to the latest data
        if (!expanded) hideDropdown(); // the <DropdownUi> request to hide => hide the <DropdownUi>
    });
    const handleCollapseStart          = useEvent<EventHandler<void>>(() => {
        dropdownState?.signalClosing(); // notify that the <DropdownUi> start to close
    });
    const handleCollapseEnd            = useEvent<EventHandler<void>>(() => {
        dropdownState?.signalClosing(); // notify that the <DropdownUi> start to close (a redundant procedure in case of the `handleCollapseStart` was not invoked)
        setDropdownState(null); // remove the <DropdownUi>'s state and force not to render the <DropdownUi>
        
        
        
        // In mobile mode => after the <DropdownUi> is fully closed => close the <Navbar>'s list too:
        if (!isDesktopLayout) {
            toggleList(false); // collapse the <Navbar> manually
        } // if
    });
    
    const {
        startIntercept,
    } = usePageInterceptState();
    const handleClickInternal = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        if (event.defaultPrevented) return; // already handled => ignore
        event.preventDefault();             // prevents the `href='/target-path'` to HARD|SOFT navigate
        event.stopPropagation();            // prevents the <Navbar> from auto collapsing, we'll collapse the <Navbar> manually
        
        
        
        if (dropdownState) {
            // The <DropdownUi> is already opened => hide the <DropdownUi>
            hideDropdown();
        }
        else {
            //#region a fix for categories page interceptor
            // intercepts all_pages/** => show <DropdownUi>:
            startIntercept(async (backPathname): Promise<boolean> => {
                const data = await showDropdownAndWaitUntilClosing();
                
                
                
                // when the dropdown begin to close without the user clicking the menu item => restore the url, otherwise keeps the changed url
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
        hideDropdown();
    }, [isDesktopLayout]);
    
    // closes the shown <DropdownUi> when <Navbar>'s list collapsed:
    const prevListExpandedRef = useRef<boolean>(listExpanded);
    useEffect(() => {
        // conditions:
        if (prevListExpandedRef.current === listExpanded) return; // no diff => ignore
        prevListExpandedRef.current = listExpanded; // sync
        if (listExpanded) return; // only interested on collapsed event
        
        
        
        // actions:
        hideDropdown();
    }, [listExpanded]);
    
    
    
    // default props:
    const {
        // states:
        active = (dropdownState ? true : undefined), // force as active if the menu is shown
        
        
        
        // other props:
        ...restNavItemProps
    } = restNavbarMenuDropdownProps satisfies NoForeignProps<typeof restNavbarMenuDropdownProps, NavItemProps>;
    
    
    
    // jsx:
    return (
        <>
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
            
            {!!dropdownState && <DropdownWithDelay
                // components:
                dropdownUiComponent={
                    React.cloneElement<NavbarMenuDropdownUiProps>(dropdownUiComponent,
                        // props:
                        {
                            // appearances:
                            mobileLayout      : !isDesktopLayout,
                            
                            
                            
                            // variants:
                            // theme          : 'primary'
                            
                            
                            
                            // states:
                            expanded          : dropdownState.expanded,
                            onExpandedChange  : handleExpandedChange,
                            onCollapseStart   : handleCollapseStart,
                            onCollapseEnd     : handleCollapseEnd,
                            
                            
                            
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
                }
            />}
        </>
    );
};
export {
    NavbarMenuDropdown,
    NavbarMenuDropdown as default,
}
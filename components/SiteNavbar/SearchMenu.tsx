'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// next-js:
import {
    useRouter,
}                           from 'next/navigation'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    
    
    
    // composite-components:
    type NavItemProps,
    NavItem,
    useNavbarState,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components
// reusable-ui components:
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
import {
    searchPath,
}                           from '@/components/explorers/SearchExplorer/configs'
import {
    useSearchInterceptState,
}                           from '@/components/explorers/SearchExplorer/states/searchInterceptState'
import {
    PrefetchKind,
    PrefetchRouter,
}                           from '@/components/prefetches/PrefetchRouter'



// react components:
export interface SearchMenuProps
    extends
        // bases:
        NavItemProps
{
}
const SearchMenu = (props: SearchMenuProps): JSX.Element|null => {
    // states:
    const {
        // refs:
        navbarRef : getNavbarRef,
        
        
        
        // states:
        navbarExpanded : isDesktopLayout,
        listExpanded,
        
        
        
        // handlers:
        toggleList,
    } = useNavbarState();
    
    const {
        // refs:
        navbarRef : setNavbarRef,
        menuRef,
        
        
        
        // states:
        setIsDesktopLayout,
        setIsNavbarListExpanded,
        
        isDialogShown,
        setIsDialogShown,
    } = useSearchInterceptState();
    
    const router = useRouter();
    
    
    
    // handlers:
    const handleClick = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        // actions:
        event.preventDefault();  // prevents the `href='/target-path'` to HARD|SOFT navigate
        event.stopPropagation(); // prevents the <Navbar> from auto collapsing, we'll collapse the <Navbar> manually
        if (!isDialogShown) {
            router.push(searchPath, { scroll: false }); // goto search page // do not scroll the page because it triggers the search_dropdown interceptor
        }
        else {
            setIsDialogShown(false); // close the search menu
        } // if
    });
    
    
    
    // effects:
    
    // Sync the <Navbar>'s ref with the <DropdownUi> ref:
    setNavbarRef.current = getNavbarRef.current;
    
    // Sync the <Navbar>'s layout with the <DropdownUi> state:
    useEffect(() => {
        setIsDesktopLayout(isDesktopLayout);
        setIsNavbarListExpanded(listExpanded);
    }, [isDesktopLayout, listExpanded]);
    
    // In mobile mode => after the <DropdownUi> is fully closed => close the <Navbar>'s list too:
    useEffect(() => {
        // conditions:
        if (isDialogShown  ) return; // only interested in the <DropdownUi> close event
        if (isDesktopLayout) return; // only interested in mobile layout
        
        
        
        // actions:
        toggleList(false); // collapse the <Navbar> manually
    }, [isDialogShown]);
    
    
    
    // default props:
    const {
        // children:
        children   = (
            <Link
                // data:
                href='/search'
                
                
                
                // behaviors:
                prefetch={false} // NEVER prefetch because the search page is NEVER reached (by soft navigation)
            >
                <span>
                    <Icon icon='search' size='lg' /> Search
                </span>
            </Link>
        ),
    } = props satisfies NoForeignProps<typeof props, NavItemProps>;
    
    
    
    // jsx:
    return (
        <>
            <NavItem
                // other props:
                {...props}
                
                
                
                // refs:
                elmRef={menuRef}
                
                
                
                // states:
                active={
                    isDialogShown
                    ? true
                    : undefined
                }
                
                
                
                // handlers:
                onClick={handleClick}
            >
                {children}
            </NavItem>
            
            {/* PREFETCH for displaying the search PAGE: */}
            <PrefetchRouter
                // data:
                href='/search'
                prefetchKind={PrefetchKind.FULL}
            />
        </>
    );
};
export {
    SearchMenu,
    SearchMenu as default,
}
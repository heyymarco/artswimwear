'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import {
    usePathname,
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
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components
// reusable-ui components:
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
import {
    SearchExplorerDropdown,
}                           from '@/components/explorers/SearchExplorer'
import {
    type NavbarMenuDropdownProps,
    NavbarMenuDropdown,
}                           from '@/components/SiteNavbar/NavbarMenuDropdown'

// states:
import {
    usePageInterceptState,
}                           from '@/states/pageInterceptState'



// react components:
export interface SearchMenuProps
    extends
        // bases:
        Omit<NavbarMenuDropdownProps,
            // components:
            |'dropdownUiComponent'
        >
{
}
const SearchMenu = (props: SearchMenuProps): JSX.Element|null => {
    // states:
    const pathname = usePathname();
    const {
        originPathname,
    } = usePageInterceptState();
    const nonInterceptingPathname = (originPathname ?? pathname);
    
    
    
    // handlers:
    const handleClick = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        console.log({
            pathname,
            originPathname,
            nonInterceptingPathname,
        });
        if (nonInterceptingPathname === '/search') event.preventDefault(); // not having categories => ignore => do not intercept with category menu => just directly displaying products page
    });
    
    
    
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
    } = props satisfies NoForeignProps<typeof props, Omit<NavbarMenuDropdownProps, 'dropdownUiComponent'>>;
    
    
    
    // jsx:
    return (
        <NavbarMenuDropdown
            // other props:
            {...props}
            
            
            
            // components:
            dropdownUiComponent={
                <SearchExplorerDropdown />
            }
            
            
            
            // handlers:
            onClick={handleClick}
        >
            {children}
        </NavbarMenuDropdown>
    );
};
export {
    SearchMenu,
    SearchMenu as default,
}
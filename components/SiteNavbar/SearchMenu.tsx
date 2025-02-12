'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

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
    // hooks:
    useCartState,
}                           from '@/components/Cart'



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
    // default props:
    const {
        // children:
        children   = <span>
            <Icon icon='search' size='lg' /> Search
        </span>,
    } = props satisfies NoForeignProps<typeof props, Omit<NavbarMenuDropdownProps, 'dropdownUiComponent'>>;
    
    
    
    // states:
    const cartState = useCartState();
    
    
    
    // jsx:
    return (
        <NavbarMenuDropdown
            // other props:
            {...props}
            
            
            
            // components:
            dropdownUiComponent={
                <SearchExplorerDropdown cartState={cartState} />
            }
        >
            {children}
        </NavbarMenuDropdown>
    );
};
export {
    SearchMenu,
    SearchMenu as default,
}
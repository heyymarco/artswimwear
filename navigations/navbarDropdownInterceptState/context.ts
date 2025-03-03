// react:
import {
    // react:
    type default as React,
}                           from 'react'

// states:
import {
    type DialogInterceptState,
}                           from '@/navigations/dialogInterceptState'



// contexts:
export interface NavbarDropdownInterceptState
    extends
        // bases:
        DialogInterceptState
{
    // refs:
    navbarRef               : React.MutableRefObject<HTMLElement|null>
    menuRef                 : React.MutableRefObject<HTMLElement|null>
    
    
    
    // states:
    isDesktopLayout         : boolean
    setIsDesktopLayout      : (isDesktopLayout: boolean) => void
    
    isNavbarListExpanded    : boolean
    setIsNavbarListExpanded : (isNavbarListExpanded: boolean) => void
}

// react:
import {
    // react:
    type default as React,
}                           from 'react'



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

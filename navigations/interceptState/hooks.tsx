'use client'

// react:
import {
    // hooks:
    useState,
    useMemo,
    useRef,
}                           from 'react'

// internals:
import {
    type InterceptState,
}                           from './context'



// hooks:
export const useInterceptStateProvider = () => {
    // refs:
    const navbarRef = useRef<HTMLElement|null>(null);
    const menuRef   = useRef<HTMLElement|null>(null);
    
    
    
    // states:
    const [isDesktopLayout     , setIsDesktopLayout     ] = useState<boolean>(false);
    const [isNavbarListExpanded, setIsNavbarListExpanded] = useState<boolean>(false);
    
    const [isDialogShown       , setIsDialogShown       ] = useState<boolean>(false);
    
    
    
    // states:
    const interceptState = useMemo<InterceptState>(() => ({
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
    
    
    
    // api:
    return interceptState;
};

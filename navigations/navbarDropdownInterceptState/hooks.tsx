'use client'

// react:
import {
    // hooks:
    useState,
    useMemo,
    useRef,
}                           from 'react'

// states:
import {
    useDialogInterceptStateProvider,
}                           from '@/navigations/dialogInterceptState'

// internals:
import {
    type NavbarDropdownInterceptState,
}                           from './context'



// hooks:
export const useNavbarDropdownInterceptStateProvider = () => {
    // refs:
    const navbarRef = useRef<HTMLElement|null>(null);
    const menuRef   = useRef<HTMLElement|null>(null);
    
    
    
    // states:
    const dialogInterceptState = useDialogInterceptStateProvider();
    const [isDesktopLayout     , setIsDesktopLayout     ] = useState<boolean>(false);
    const [isNavbarListExpanded, setIsNavbarListExpanded] = useState<boolean>(false);
    
    
    
    // states:
    const navbarDropdownInterceptState = useMemo<NavbarDropdownInterceptState>(() => ({
        // bases:
        ...dialogInterceptState,
        
        
        
        // refs:
        navbarRef,
        menuRef,
        
        
        
        // states:
        isDesktopLayout,
        setIsDesktopLayout,
        
        isNavbarListExpanded,
        setIsNavbarListExpanded,
    }), [
        // bases:
        dialogInterceptState,
        
        
        
        // refs:
        // navbarRef,               // stable ref
        // menuRef,                 // stable ref
        
        
        
        // states:
        isDesktopLayout,
        // setIsDesktopLayout,      // stable ref
        
        isNavbarListExpanded,
        // setIsNavbarListExpanded, // stable ref
    ]);
    
    
    
    // api:
    return navbarDropdownInterceptState;
};

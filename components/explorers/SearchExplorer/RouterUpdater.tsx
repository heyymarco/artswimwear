'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// next-js:
import {
    usePathname,
    useRouter,
}                           from 'next/navigation'

// configs:
import {
    searchPath,
}                           from './configs'



// react components:
export interface RouterUpdaterProps {
    // handlers:
    onClose ?: ((navigated: boolean) => void)   
}
const RouterUpdater = (props: RouterUpdaterProps): JSX.Element|null => {
    // props:
    const {
        // handlers:
        onClose,
    } = props;
    
    
    
    // effects:
    
    // Set the pathname to '/search':
    const pathname     = usePathname();
    const router       = useRouter();
    const hasSyncedRef = useRef<boolean>(false);
    useEffect(() => {
        // conditions:
        if (hasSyncedRef.current) return; // already synced => ignore
        hasSyncedRef.current = true;      // sync
        
        
        
        // actions:
        const newPathname = searchPath;
        if (newPathname.toLowerCase() !== pathname.toLowerCase()) {
            router.push(newPathname, { scroll: false }); // change the pathName for accessibility reason // do not scroll the page because it just change the pathName for accessibility reason
        } // if
    }, [pathname]);
    
    // Closes the dropdown if the `pathname` exits from '/search':
    const hasOpenedRef = useRef<boolean>(false);
    useEffect(() => {
        // conditions:
        const isInDropdown = pathname.startsWith(searchPath) && ['', '/'].includes(pathname.slice(searchPath.length, searchPath.length + 1)); // determines if the `pathname` is exact '/search' or sub '/search/**'
        if (!hasOpenedRef.current) { // only interested if the pathname is never entered to '/search'
            if (isInDropdown) hasOpenedRef.current = true; // mark ever entered to '/search'
            return; // returns earlier
        } // if
        
        
        
        // actions:
        if (!isInDropdown) { // the `pathname` exits from '/search/**'
            onClose?.(true);
        } // if
    }, [pathname]);
    
    
    
    // jsx:
    return null;
};
export {
    RouterUpdater,
    RouterUpdater as default,
}

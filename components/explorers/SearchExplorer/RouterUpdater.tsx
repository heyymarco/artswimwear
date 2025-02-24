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

// states:
import {
    usePageInterceptState,
}                           from '@/states/pageInterceptState'

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
    
    // Set the mayInterceptedPathname to '/search':
    const mayInterceptedPathname = usePathname();
    const router                 = useRouter();
    const hasSyncedRef           = useRef<boolean>(false);
    useEffect(() => {
        // conditions:
        if (hasSyncedRef.current) return; // already synced => ignore
        hasSyncedRef.current = true;      // sync
        
        
        
        // actions:
        const newPathname = searchPath;
        if (newPathname.toLowerCase() !== mayInterceptedPathname.toLowerCase()) {
            router.push(newPathname, { scroll: false }); // change the pathName for accessibility reason // do not scroll the page because it just change the pathName for accessibility reason
        } // if
    }, [mayInterceptedPathname]);
    
    // Closes the dropdown if the `nonInterceptedPathname` exits from '/search':
    const {
        nonInterceptedPathname,
    } = usePageInterceptState();
    const hasOpenedRef = useRef<boolean>(false);
    useEffect(() => {
        // conditions:
        const isInDropdown = nonInterceptedPathname.startsWith(searchPath) && ['', '/'].includes(nonInterceptedPathname.slice(searchPath.length, searchPath.length + 1)); // determines if the `nonInterceptedPathname` is exact '/search' or sub '/search/**'
        if (!hasOpenedRef.current) { // only interested if the nonInterceptedPathname is never entered to '/search'
            if (isInDropdown) hasOpenedRef.current = true; // mark ever entered to '/search'
            return; // returns earlier
        } // if
        
        
        
        // actions:
        if (!isInDropdown) { // the `nonInterceptedPathname` exits from '/search/**'
            onClose?.(true);
        } // if
    }, [nonInterceptedPathname]);
    
    
    
    // jsx:
    return null;
};
export {
    RouterUpdater,
    RouterUpdater as default,
}

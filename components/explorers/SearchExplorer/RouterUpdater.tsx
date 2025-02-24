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
    
    // Closes the dropdown if the `nonInterceptingPathname` exits from '/search':
    const {
        nonInterceptingPathname,
    } = usePageInterceptState();
    const hasOpenedRef = useRef<boolean>(false);
    useEffect(() => {
        // conditions:
        const isInDropdown = nonInterceptingPathname.startsWith(searchPath) && ['', '/'].includes(nonInterceptingPathname.slice(searchPath.length, searchPath.length + 1)); // determines if the `nonInterceptingPathname` is exact '/search' or sub '/search/**'
        if (!hasOpenedRef.current) { // only interested if the nonInterceptingPathname is never entered to '/search'
            if (isInDropdown) hasOpenedRef.current = true; // mark ever entered to '/search'
            return; // returns earlier
        } // if
        
        
        
        // actions:
        if (!isInDropdown) { // the `nonInterceptingPathname` exits from '/search/**'
            onClose?.(true);
        } // if
    }, [nonInterceptingPathname]);
    
    
    
    // jsx:
    return null;
};
export {
    RouterUpdater,
    RouterUpdater as default,
}

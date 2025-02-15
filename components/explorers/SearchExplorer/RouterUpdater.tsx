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
const RouterUpdater = (): JSX.Element|null => {
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
            router.push(newPathname, { scroll: false }); // intercept the url
        } // if
    }, [pathname]);
    
    
    
    // jsx:
    return null;
};
export {
    RouterUpdater,
    RouterUpdater as default,
}

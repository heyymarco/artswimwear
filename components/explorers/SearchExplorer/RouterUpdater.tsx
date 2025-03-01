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
}                           from 'next/navigation'

// states:
import {
    useInterceptingRouter,
}                           from '@/navigations/interceptingRouter'

// configs:
import {
    searchPath,
}                           from './configs'



// react components:
const RouterUpdater = (): JSX.Element|null => {
    // states:
    const mayInterceptedPathname = usePathname();
    const {
        // actions:
        interceptingPush,
    } = useInterceptingRouter();
    
    
    
    // effects:
    
    // Set the mayInterceptedPathname to '/search':
    const hasSyncedRef           = useRef<boolean>(false);
    useEffect(() => {
        // conditions:
        if (hasSyncedRef.current) return; // already synced => ignore
        hasSyncedRef.current = true;      // sync
        
        
        
        // actions:
        const newPathname = searchPath;
        if (newPathname.toLowerCase() !== mayInterceptedPathname.toLowerCase()) {
            interceptingPush(newPathname); // change the pathName for accessibility reason
        } // if
    }, [mayInterceptedPathname]);
    
    
    
    // jsx:
    return null;
};
export {
    RouterUpdater,
    RouterUpdater as default,
}

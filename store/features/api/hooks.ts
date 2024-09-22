'use client'

// react:
import {
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// internals:
import {
    apiSlice,
}                           from './apiSlice'
import {
    // hooks:
    useAppDispatch,
}                           from '../../hooks'



// hooks:
export const useSignedInCacheRefresh = () => {
    // stores:
    const dispatch = useAppDispatch();
    
    
    
    // sessions:
    const { data: session } = useSession();
    const isSignedIn = !!session;
    const prefIsSignedInRef = useRef<boolean>(isSignedIn);
    useEffect(() => {
        // conditions:
        if (prefIsSignedInRef.current === isSignedIn) return; // no diff => ignore
        prefIsSignedInRef.current = isSignedIn; // sync
        
        
        
        // actions:
        dispatch(apiSlice.util.invalidateTags(['Product'])); // a ProductPreview contains wished property that depens on SignedIn state, so we need to invalidate the caches of ProductPreview
    }, [isSignedIn]);
};

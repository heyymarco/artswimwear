'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import {
    useRouter,
}                           from 'next/navigation'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    type EventHandler,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    type ImplementedPrefetchProps,
    Prefetch,
}                           from '@/components/prefetches/Prefetch'



// react components:
export enum PrefetchKind {
    AUTO      = 'auto',
    FULL      = 'full',
    TEMPORARY = 'temporary',
}
export interface PrefetchRouterProps
    extends
        // bases:
        ImplementedPrefetchProps
{
    // data:
    href          : string
    prefetchKind ?: PrefetchKind
}
const PrefetchRouter = (props: PrefetchRouterProps): JSX.Element|null => {
    // props:
    const {
        // data:
        href,
        prefetchKind,
        
        
        
        // other props:
        ...restPrefetchProps
    } = props;
    
    
    
    // routes:
    const router = useRouter();
    
    
    
    // handlers:
    const handlePrefetch = useEvent<EventHandler<void>>(() => {
        router.prefetch(href, (prefetchKind !== undefined) ? { kind: prefetchKind } : undefined);
    });
    
    
    
    // jsx:
    return (
        <Prefetch
            // other props:
            {...restPrefetchProps}
            
            
            
            // handlers:
            onPrefetch={handlePrefetch}
        />
    )
};
export {
    PrefetchRouter,
    PrefetchRouter as default,
}

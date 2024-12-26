'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

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

// stores:
import {
    // hooks:
    useLazyGetProductDetail,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface PrefetchProductDetailProps
    extends
        // bases:
        ImplementedPrefetchProps
{
    // data:
    path : string
}
const PrefetchProductDetail = (props: PrefetchProductDetailProps): JSX.Element|null => {
    // props:
    const {
        // data:
        path,
        
        
        
        // other props:
        ...restPrefetchProps
    } = props;
    
    
    
    // apis:
    const [prefetchProductDetail] = useLazyGetProductDetail();
    
    
    
    // handlers:
    const handlePrefetch = useEvent<EventHandler<void>>(() => {
        prefetchProductDetail(path, /* preferCacheValue: */true);
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
    PrefetchProductDetail,
    PrefetchProductDetail as default,
}

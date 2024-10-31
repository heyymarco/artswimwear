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
    usePrefetchCategoryDetail,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface PrefetchCategoryDetailProps
    extends
        // bases:
        ImplementedPrefetchProps
{
    // data:
    categoryPath : string[]
}
const PrefetchCategoryDetail = (props: PrefetchCategoryDetailProps): JSX.Element|null => {
    // props:
    const {
        // data:
        categoryPath,
        
        
        
        // other props:
        ...restPrefetchProps
    } = props;
    
    
    
    // apis:
    const prefetchCategoryDetail = usePrefetchCategoryDetail();
    
    
    
    // handlers:
    const handlePrefetch = useEvent<EventHandler<void>>(() => {
        prefetchCategoryDetail(categoryPath);
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
    PrefetchCategoryDetail,
    PrefetchCategoryDetail as default,
}

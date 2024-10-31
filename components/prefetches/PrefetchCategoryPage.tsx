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

// models:
import {
    type CategoryPreview,
}                           from '@/models'

// stores:
import {
    // hooks:
    usePrefetchCategoryPage,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    subPerPage,
}                           from '@/components/explorers/CategoryExplorer/configs'



// react components:
export interface PrefetchCategoryPageProps
    extends
        // bases:
        ImplementedPrefetchProps
{
    // data:
    model : CategoryPreview|null
}
const PrefetchCategoryPage = (props: PrefetchCategoryPageProps): JSX.Element|null => {
    // props:
    const {
        // data:
        model,
        
        
        
        // other props:
        ...restPrefetchProps
    } = props;
    
    
    
    // apis:
    const prefetchCategoryPage = usePrefetchCategoryPage();
    
    
    
    // handlers:
    const handlePrefetch = useEvent<EventHandler<void>>(() => {
        prefetchCategoryPage({
            page    : 0,
            perPage : subPerPage,
            parent  : model?.id ?? null,
        });
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
    PrefetchCategoryPage,
    PrefetchCategoryPage as default,
}

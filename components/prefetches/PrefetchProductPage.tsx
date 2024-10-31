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
import {
    type PaginationStateProps,
}                           from '@/components/explorers/Pagination'

// models:
import {
    type Model,
}                           from '@/models'

// stores:
import {
    // hooks:
    usePrefetchProductPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface PrefetchProductPageProps
    extends
        // bases:
        ImplementedPrefetchProps,
        
        // states:
        Pick<PaginationStateProps<Model>,
            // states:
            |'initialPageNum'
        >,
        Required<Pick<PaginationStateProps<Model>,
            // states:
            |'initialPerPage'
        >>
{
    // data:
    categoryPath ?: string[]|null
}
const PrefetchProductPage = (props: PrefetchProductPageProps): JSX.Element|null => {
    // props:
    const {
        // data:
        categoryPath   = null,
        
        
        
        // states:
        initialPageNum = 0,
        initialPerPage,
        
        
        
        // other props:
        ...restPrefetchProps
    } = props;
    
    
    
    // apis:
    const prefetchCategoryPage = usePrefetchProductPage();
    
    
    
    // handlers:
    const handlePrefetch = useEvent<EventHandler<void>>(() => {
        prefetchCategoryPage({
            page         : initialPageNum,
            perPage      : initialPerPage,
            categoryPath : categoryPath ?? undefined,
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
    PrefetchProductPage,
    PrefetchProductPage as default,
}

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
    type ImplementedPrefetchModelPageProps,
    PrefetchModelPage,
}                           from '@/components/prefetches/PrefetchModelPage'

// models:
import {
    type PaginationArgs,
}                           from '@/models'

// stores:
import {
    // hooks:
    useLazyGetProductPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface PrefetchProductPageProps
    extends
        // bases:
        ImplementedPrefetchModelPageProps
{
    // data:
    categoryPath ?: string[]|null
}
const PrefetchProductPage = (props: PrefetchProductPageProps): JSX.Element|null => {
    // props:
    const {
        // data:
        categoryPath = null,
        
        
        
        // other props:
        ...restPrefetchModelPageProps
    } = props;
    
    
    
    // apis:
    const [prefetchProductPage] = useLazyGetProductPage();
    
    
    
    // handlers:
    const handlePrefetch = useEvent<EventHandler<PaginationArgs>>((paginationArgs) => {
        prefetchProductPage({
            ...paginationArgs,
            categoryPath : categoryPath ?? undefined,
        });
    });
    
    
    
    // jsx:
    return (
        <PrefetchModelPage
            // other props:
            {...restPrefetchModelPageProps}
            
            
            
            // handlers:
            onPrefetch={handlePrefetch}
        />
    )
};
export {
    PrefetchProductPage,
    PrefetchProductPage as default,
}

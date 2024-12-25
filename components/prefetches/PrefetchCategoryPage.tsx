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
    type CategoryPreview,
}                           from '@/models'

// stores:
import {
    // hooks:
    useLazyGetCategoryPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface PrefetchCategoryPageProps
    extends
        // bases:
        ImplementedPrefetchModelPageProps
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
        ...restPrefetchModelPageProps
    } = props;
    
    
    
    // apis:
    const [prefetchCategoryPage] = useLazyGetCategoryPage();
    
    
    
    // handlers:
    const handlePrefetch = useEvent<EventHandler<PaginationArgs>>((paginationArgs) => {
        prefetchCategoryPage({
            ...paginationArgs,
            parent  : model?.id ?? null,
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
    PrefetchCategoryPage,
    PrefetchCategoryPage as default,
}

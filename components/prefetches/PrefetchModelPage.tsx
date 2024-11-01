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
    type PaginationArgs,
}                           from '@/models'



// react components:
export interface PrefetchModelPageProps
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
    // handlers:
    onPrefetch : EventHandler<PaginationArgs>
}
const PrefetchModelPage = (props: PrefetchModelPageProps): JSX.Element|null => {
    // props:
    const {
        // states:
        initialPageNum = 0,
        initialPerPage,
        
        
        
        // handlers:
        onPrefetch,
        
        
        
        // other props:
        ...restPrefetchProps
    } = props;
    
    
    
    // handlers:
    const handlePrefetch = useEvent<EventHandler<void>>(() => {
        onPrefetch({
            page    : initialPageNum,
            perPage : initialPerPage,
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
    PrefetchModelPage,
    PrefetchModelPage as default,
}



export interface ImplementedPrefetchModelPageProps
    extends
        // bases
        Omit<PrefetchModelPageProps,
            // handlers:
            |'onPrefetch'
        >
{
}

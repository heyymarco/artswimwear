'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    usePaginationNavStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    
    
    
    // composite-components:
    PaginationProps,
    Pagination,
    NavPrevItem,
    NavNextItem,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    LoadingBar,
}                           from '@heymarco/loading-bar'

// internal components:
import {
    usePaginationState,
}                           from '@/components/explorers/Pagination'

// internals:
import type {
    Model,
}                           from '@/libs/types'



// react components:
export interface PaginationNavProps<TElement extends Element = HTMLElement>
    extends
        PaginationProps<TElement>
{
}
const PaginationNav = <TModel extends Model, TElement extends Element = HTMLElement>(props: PaginationNavProps<TElement>): JSX.Element|null => {
    // styles:
    const styleSheets = usePaginationNavStyleSheet();
    
    
    
    // states:
    const {
        // states:
        page,
        setPage,
        
        perPage,
        
        
        
        // data:
        data,
        isFetching,
        isError,
    } = usePaginationState<TModel>();
    const pages       = Math.ceil((data?.total ?? 0) / perPage);
    const isDataEmpty = !!data && !data.total;
    
    
    
    // handlers:
    const handleNavigatePrev = useEvent((): void => {
        setPage(1); // goto first page
    });
    const handleNavigateNext = useEvent((): void => {
        setPage(pages); // goto last page
    });
    
    
    
    // default props:
    const {
        // paginations:
        itemsLimit = 20,
        
        
        
        // variants:
        size       = 'sm',
        
        
        
        // accessibilities:
        enabled    = !isDataEmpty,
        
        
        
        // components:
        prevItems  = <NavPrevItem
            // handlers:
            onClick={handleNavigatePrev}
        />,
        nextItems  = <NavNextItem
            // handlers:
            onClick={handleNavigateNext}
        />,
        
        
        
        // children:
        children = <>
            {!data && <ListItem actionCtrl={false} nude={true}><LoadingBar className={styleSheets.loadingBar}
                nude={true}
                running={isFetching}
                theme={isError ? 'danger' : undefined}
            /></ListItem>}
            
            {[...Array(pages)].map((_, index) =>
                <ListItem
                    key={index}
                    
                    active={(index + 1) === page}
                    onClick={() => setPage(index + 1)}
                >
                    {index + 1}
                </ListItem>
            )}
        </>,
        
        
        
        
        // other props:
        ...restPaginationControlProps
    } = props;
    
    
    
    // jsx:
    return (
        <Pagination<TElement>
            // other props:
            {...restPaginationControlProps}
            
            
            
            // paginations:
            itemsLimit={itemsLimit}
            
            
            
            // variants:
            size={size}
            
            
            
            // accessibilities:
            enabled={enabled}
            
            
            
            // components:
            prevItems={prevItems}
            nextItems={nextItems}
        >
            {children}
        </Pagination>
    );
};
export {
    PaginationNav,
    PaginationNav as default,
}

'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeRefs,
    type TimerPromise,
    useSetTimeout,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    
    
    
    // composite-components:
    Group,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'
import {
    TextEditor,
}                           from '@heymarco/text-editor'

// internal components:
import {
    PaginationStateProvider,
}                           from '@/components/explorers/Pagination'

// private components:
import {
    SearchResultGallery,
}                           from './SearchResultGallery'

// models:
import {
    // types:
    type ProductPreview,
}                           from '@/models'

// states:
import {
    useSearchExplorerState,
}                           from './states/searchExplorerState'



// react components:
export interface SearchExplorerQueryProps
{
    // refs:
    searchInputRef ?: React.Ref<HTMLInputElement> // setter ref
    
    
    
    // handlers:
    onNavigate     ?: ((url: string) => void) | null|undefined
}
const SearchExplorerQuery = (props: SearchExplorerQueryProps): JSX.Element|null => {
    // props:
    const {
        // refs:
        searchInputRef,
        
        
        
        // handlers:
        onNavigate,
    } = props;
    
    
    
    // refs:
    const searchInputRefInternal = useRef<HTMLInputElement|null>(null);
    const mergedSearchInputRef   = useMergeRefs(
        // preserves the original `searchInputRef` from `props`:
        searchInputRef,
        
        
        
        searchInputRefInternal,
    );
    
    
    
    // states:
    const {
        query,
        setQuery,
        
        search,
        
        pageNum,
        setPageNum,
        perPage,
        setPerPage,
        
        _useSearchProducts,
    } = useSearchExplorerState();
    
    
    
    // utilities:
    const setTimeoutAsync = useSetTimeout();
    
    
    
    // handlers:
    const delayedSearch = useRef<TimerPromise<boolean>|null>(null);
    const handleSearchChange = useEvent<EditorChangeEventHandler<string>>((newQuery) => {
        delayedSearch.current?.abort();
        setQuery(newQuery);
        
        
        
        (delayedSearch.current = setTimeoutAsync(1000)).then((isDone) => {
            // conditions:
            if (!isDone) return; // the component was unloaded before the timer runs => do nothing
            
            
            
            // actions:
            search();
        });
    });
    const handleSubmitButtonClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        searchInputRefInternal.current?.focus();
    });
    
    
    
    // jsx:
    return (
        <>
            <form className='search' action={search}>
                <Group theme='primary'>
                    <TextEditor type='search' placeholder='Search' className='fluid' name='query' elmRef={mergedSearchInputRef} value={query} onChange={handleSearchChange} />
                    <ButtonIcon className='solid' icon='search' type='submit' onClick={handleSubmitButtonClick} />
                </Group>
            </form>
            <PaginationStateProvider<ProductPreview>
                // data:
                useGetModelPage={_useSearchProducts}
                
                
                
                // states:
                pageNum={pageNum}
                setPageNum={setPageNum}
                perPage={perPage}
                setPerPage={setPerPage}
            >
                <SearchResultGallery
                    // handlers:
                    onNavigate={onNavigate}
                />
            </PaginationStateProvider>
        </>
    );
};
export {
    SearchExplorerQuery,
    SearchExplorerQuery as default,
}

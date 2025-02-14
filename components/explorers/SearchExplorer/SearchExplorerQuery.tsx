'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
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
    type PaginationStateProps,
    PaginationStateProvider,
}                           from '@/components/explorers/Pagination'

// private components:
import {
    SearchResultGallery,
}                           from './SearchResultGallery'

// stores:
import {
    // hooks:
    useSearchProducts,
}                           from '@/store/features/api/apiSlice'

// models:
import {
    // types:
    type PaginationArgs,
    
    type ProductPreview,
    
    
    
    // defaults:
    defaultSearchProductPerPage,
}                           from '@/models'



// hooks:
const useUseSearchProducts = () => {
    // states:
    const [pageNum, setPageNum] = useState<number>(0);
    const [perPage, setPerPage] = useState<number>(defaultSearchProductPerPage);
    const [doSearch, modelApi] = useSearchProducts();
    const [query, setQuery] = useState<string>('');
    const isQueryValid = (query.trim().length >= 2);
    
    
    
    // handlers:
    const searchNext = useEvent((resetPageNum: boolean = false): void => {
        // conditions:
        if (!isQueryValid) {
            modelApi.reset();
            return;
        } // if
        
        
        
        if (resetPageNum) setPageNum(0); // reset to the first page each time the user do the search
        doSearch({
            query,
            page : resetPageNum ? 0 : pageNum, // reset to the first page each time the user do the search
            perPage,
        });
    });
    const search = useEvent((): void => {
        searchNext(true);
    });
    
    
    
    // effects:
    
    // Runs the search everytime the pageNum or perPage changes:
    useEffect(() => {
        // actions:
        searchNext();
    }, [pageNum, perPage]);
    
    
    
    // api:
    return {
        query,
        
        setQuery,
        search,
        
        pageNum,
        setPageNum,
        perPage,
        setPerPage,
        
        _useSearchProducts : (arg: PaginationArgs): ReturnType<PaginationStateProps<ProductPreview>['useGetModelPage']> => {
            if (pageNum !== arg.page   ) setPageNum(arg.page);
            if (perPage !== arg.perPage) setPerPage(arg.perPage);
            
            return {
                ...modelApi,
                refetch : search,
            };
        },
    };
};



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
    
    
    
    // stores:
    const {
        query,
        setQuery,
        
        search,
        
        pageNum,
        setPageNum,
        perPage,
        setPerPage,
        
        _useSearchProducts
    } = useUseSearchProducts();
    
    
    
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

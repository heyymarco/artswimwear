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

// styles:
import {
    useSearchExplorerStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    type TimerPromise,
    useSetTimeout,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
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
import {
    PaginationGallery,
}                           from '@/components/explorers/PaginationGallery'
import {
    ProductCard,
    EmptyProductCard,
}                           from '@/components/views/ProductCard'

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
    
    // Resets the search result everytime the isQueryValid changes:
    // useEffect(() => {
    //     // conditions:
    //     if (isQueryValid) return; // the query is valid => no need to reset
    //     
    //     
    //     
    //     // actions:
    //     modelApi.reset();
    // }, [isQueryValid]);
    
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
    
    
    
    // styles:
    const styles = useSearchExplorerStyleSheet();
    
    
    
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
    const handleItemClick = useEvent<React.MouseEventHandler<HTMLAnchorElement>>((event) => {
        onNavigate?.(event.currentTarget.href);
    });
    
    
    
    // jsx:
    return (
        <>
            <form className='search' action={search}>
                <Group theme='primary'>
                    <TextEditor type='search' className='fluid' name='query' elmRef={searchInputRef} value={query} onChange={handleSearchChange} />
                    <ButtonIcon className='solid' icon='search' type='submit' />
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
                <PaginationGallery<ProductPreview>
                    // appearances:
                    autoHidePagination={true}
                    showPaginationTop={false}
                    
                    
                    
                    // classes:
                    className='results'
                    
                    
                    
                    // accessibilities:
                    textEmpty='No results found.'
                    scrollable={true}
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Basic className={styles.gallery} />
                    }
                    modelEmptyComponent={
                        <EmptyProductCard
                            // accessibilities:
                            emptyText='No results found.'
                        />
                    }
                    modelPreviewComponent={
                        <ProductCard
                            // data:
                            model={undefined as any}
                            
                            
                            
                            // handlers:
                            onClick={handleItemClick}
                        />
                    }
                />
            </PaginationStateProvider>
        </>
    );
};
export {
    SearchExplorerQuery,
    SearchExplorerQuery as default,
}

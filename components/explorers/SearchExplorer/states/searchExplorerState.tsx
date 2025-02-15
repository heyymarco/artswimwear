// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useMemo,
    useState,
    useEffect,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    type EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    type PaginationStateProps,
}                           from '@/components/explorers/Pagination'

// models:
import {
    // types:
    type CategoryParentInfo,
}                           from '@/models'

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
    const [query, setQuery]     = useState<string>('');
    const isQueryValid          = (query.trim().length >= 2);
    
    const [pageNum, setPageNum] = useState<number>(0);
    const [perPage, setPerPage] = useState<number>(defaultSearchProductPerPage);
    
    const [doSearch, modelApi]  = useSearchProducts();
    const data = modelApi.data;
    
    
    
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
    const search     = useEvent((): void => {
        searchNext(true);
    });
    
    
    
    
    // stable api object:
    const apiRef = useRef<ReturnType<PaginationStateProps<ProductPreview>['useGetModelPage']>>({
        ...modelApi,
        refetch : search,
    });
    apiRef.current.data = data;
    
    
    
    // stable callbacks:
    const _useSearchProducts = useEvent((arg: PaginationArgs): ReturnType<PaginationStateProps<ProductPreview>['useGetModelPage']> => {
        if (pageNum !== arg.page   ) setPageNum(arg.page);
        if (perPage !== arg.perPage) setPerPage(arg.perPage);
        
        return apiRef.current;
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
        data,
        
        _useSearchProducts,
    };
};



// states:

//#region searchExplorerState

// utilities:
export const rootParentCategories : CategoryParentInfo[] = [];
export const noopCallback = () => {};



// contexts:
export interface SearchExplorerState
    extends
        // states:
        ReturnType<typeof useUseSearchProducts>
{
}

const noopSetter : EventHandler<unknown> = () => {};
const defaultSearchExplorerStateContext : SearchExplorerState = {
    // states:
    query              : '',
    setQuery           : noopSetter,
    
    search             : noopSetter as SearchExplorerState['search'],
    
    pageNum            : 0,
    setPageNum         : noopSetter,
    perPage            : defaultSearchProductPerPage,
    setPerPage         : noopSetter,
    data               : undefined,
    
    
    
    // api:
    _useSearchProducts : noopSetter as SearchExplorerState['_useSearchProducts'],
}
const SearchExplorerStateContext = createContext<SearchExplorerState>(defaultSearchExplorerStateContext);
SearchExplorerStateContext.displayName  = 'SearchExplorerState';

export const useSearchExplorerState = (): SearchExplorerState => {
    return useContext(SearchExplorerStateContext);
}



// react components:
export interface SearchExplorerStateProps
{
}
const SearchExplorerStateProvider = (props: React.PropsWithChildren<SearchExplorerStateProps>): JSX.Element|null => {
    // props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // states:
    const {
        // states:
        query,
        setQuery,
        
        search,
        
        pageNum,
        setPageNum,
        perPage,
        setPerPage,
        data,
        
        
        
        // api:
        _useSearchProducts,
    } = useUseSearchProducts();
    
    
    
    // states:
    const searchExplorerState = useMemo<SearchExplorerState>(() => ({
        // states:
        query,
        setQuery,              // stable ref
        
        search,                // stable ref
        
        pageNum,
        setPageNum,            // stable ref
        perPage,
        setPerPage,            // stable ref
        data,
        
        
        
        // api:
        _useSearchProducts,    // stable ref
    }), [
        // states:
        query,
        // setQuery,           // stable ref
        
        // search,             // stable ref
        
        pageNum,
        // setPageNum,         // stable ref
        perPage,
        // setPerPage,         // stable ref
        data,
        
        
        
        // api:
        // _useSearchProducts, // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <SearchExplorerStateContext.Provider value={searchExplorerState}>
            {children}
        </SearchExplorerStateContext.Provider>
    );
};
export {
    SearchExplorerStateProvider,
    SearchExplorerStateProvider as default,
}

export interface ForwardSearchExplorerStateProviderProps {
    // states:
    searchExplorerState: SearchExplorerState
}
export const ForwardSearchExplorerStateProvider = (props:React.PropsWithChildren<ForwardSearchExplorerStateProviderProps>) => {
    // props:
    const {
        // states:
        searchExplorerState,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // jsx:
    return (
        <SearchExplorerStateContext.Provider value={searchExplorerState}>
            {children}
        </SearchExplorerStateContext.Provider>
    )
};
//#endregion searchExplorerState

'use client'

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
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    type EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// models:
import {
    type PaginationArgs,
    type Pagination,
    type Model,
}                           from '@/libs/types'


// hooks:

// states:

//#region paginationExplorerState

// contexts:
export interface UseGetModelPage<TModel extends Model>
{
    // data:
    data       ?: Pagination<TModel>
    isLoading   : boolean
    isFetching  : boolean
    isError     : boolean
    refetch     : () => void
}

export interface PaginationExplorerState<TModel extends Model>
    extends
        // apis:
        UseGetModelPage<TModel>
{
    // states:
    page       : number
    setPage    : EventHandler<number>
    
    perPage    : number
    setPerPage : EventHandler<number>
}

const noopSetter : EventHandler<unknown> = () => {};
const PaginationExplorerStateContext = createContext<PaginationExplorerState<any>>({
    // states:
    page       : 1,
    setPage    : noopSetter,
    
    perPage    : 20,
    setPerPage : noopSetter,
    
    
    
    // data:
    data       : undefined,
    isLoading  : false,
    isFetching : false,
    isError    : false,
    refetch    : () => {}
});
PaginationExplorerStateContext.displayName  = 'PaginationExplorerState';

export const usePaginationExplorerState = <TModel extends Model>(): PaginationExplorerState<TModel> => {
    return useContext(PaginationExplorerStateContext);
}



// react components:
export interface PaginationExplorerStateProps<TModel extends Model> {
    // states:
    initialPage     ?: number
    initialPerPage  ?: number
    
    
    
    // data:
    useGetModelPage  : (arg: PaginationArgs) => UseGetModelPage<TModel>
}
const PaginationExplorerStateProvider = <TModel extends Model>(props: React.PropsWithChildren<PaginationExplorerStateProps<TModel>>): JSX.Element|null => {
    // props:
    const {
        // states:
        initialPage    = 1,
        initialPerPage = 20,
        
        
        
        // data:
        useGetModelPage,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // states:
    const [page   , setPage   ] = useState<number>(initialPage);
    const [perPage, setPerPage] = useState<number>(initialPerPage);
    
    const {
        data,
        
        isFetching,
        isLoading,
        isError,
        
        refetch,
    } = useGetModelPage({ page, perPage });
    const paginationExplorerState = useMemo<PaginationExplorerState<TModel>>(() => ({
        // states:
        page,
        setPage,                  // stable ref
        
        perPage,
        setPerPage,               // stable ref
        
        
        
        // data:
        data,
        
        isFetching,
        isLoading,
        isError,
        
        refetch,
    }), [
        // states:
        page,
        // setPage,               // stable ref
        
        perPage,
        // setPerPage,            // stable ref
        
        
        
        // data:
        data,
        
        isFetching,
        isLoading,
        isError,
        
        refetch,
    ]);
    
    
    
    // jsx:
    return (
        <PaginationExplorerStateContext.Provider value={paginationExplorerState}>
            {children}
        </PaginationExplorerStateContext.Provider>
    );
};
export {
    PaginationExplorerStateProvider,            // named export for readibility
    PaginationExplorerStateProvider as default, // default export to support React.lazy
}
//#endregion paginationExplorerState

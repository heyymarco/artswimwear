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

//#region paginationState

// contexts:
export type UseGetModelPage<TModel extends Model> = (arg: PaginationArgs) => UseGetModelPageApi<TModel>
export interface UseGetModelPageApi<TModel extends Model> {
    // data:
    data       ?: Pagination<TModel>
    isLoading   : boolean
    isFetching  : boolean
    isError     : boolean
    refetch     : () => void
}

export interface PaginationState<TModel extends Model>
    extends
        // apis:
        UseGetModelPageApi<TModel>
{
    // states:
    page       : number
    setPage    : EventHandler<number>
    
    perPage    : number
    setPerPage : EventHandler<number>
}

const noopSetter : EventHandler<unknown> = () => {};
const PaginationStateContext = createContext<PaginationState<any>>({
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
PaginationStateContext.displayName  = 'PaginationState';

export const usePaginationState = <TModel extends Model>(): PaginationState<TModel> => {
    return useContext(PaginationStateContext);
}



// react components:
export interface PaginationStateProps<TModel extends Model> {
    // states:
    initialPage     ?: number
    initialPerPage  ?: number
    
    
    
    // data:
    useGetModelPage  : UseGetModelPage<TModel>
}
const PaginationStateProvider = <TModel extends Model>(props: React.PropsWithChildren<PaginationStateProps<TModel>>): JSX.Element|null => {
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
    const paginationState = useMemo<PaginationState<TModel>>(() => ({
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
        <PaginationStateContext.Provider value={paginationState}>
            {children}
        </PaginationStateContext.Provider>
    );
};
export {
    PaginationStateProvider,            // named export for readibility
    PaginationStateProvider as default, // default export to support React.lazy
}



export type InterceptEventHandler<TModel extends Model> = (state: PaginationState<TModel>) => PaginationState<TModel>;
export interface InterceptPaginationStateProps<TModel extends Model> {
    onIntercept : InterceptEventHandler<TModel>
}
export const InterceptPaginationStateProvider = <TModel extends Model>(props: React.PropsWithChildren<InterceptPaginationStateProps<TModel>>): JSX.Element|null => {
    // props:
    const {
        // states:
        onIntercept,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // states:
    const paginationState = usePaginationState<TModel>();
    const {
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
    } = onIntercept(paginationState);
    const interceptedPaginationState = useMemo<PaginationState<TModel>>(() => ({
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
        <PaginationStateContext.Provider value={interceptedPaginationState}>
            {children}
        </PaginationStateContext.Provider>
    );
};
//#endregion paginationState

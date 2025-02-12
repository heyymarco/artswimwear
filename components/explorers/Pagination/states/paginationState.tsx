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
import {
    type Draft,
    produce,
}                           from 'immer'

// reusable-ui core:
import {
    // react helper hooks:
    type EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// models:
import {
    type Model,
    type Pagination,
    type PaginationArgs,
}                           from '@/models'


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
    pageNum    : number
    setPageNum : EventHandler<number>
    
    perPage    : number
    setPerPage : EventHandler<number>
}

const noopSetter : EventHandler<unknown> = () => {};
const PaginationStateContext = createContext<PaginationState<any>>({
    // states:
    pageNum    : 0,
    setPageNum : noopSetter,
    
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
    initialPageNum  ?: number
    initialPerPage  ?: number
    pageNum         ?: number
    setPageNum      ?: React.Dispatch<React.SetStateAction<number>>
    perPage         ?: number
    setPerPage      ?: React.Dispatch<React.SetStateAction<number>>
    
    
    
    // data:
    useGetModelPage  : UseGetModelPage<TModel>
}
const PaginationStateProvider = <TModel extends Model>(props: React.PropsWithChildren<PaginationStateProps<TModel>>): JSX.Element|null => {
    // props:
    const {
        // states:
        initialPageNum = 0,
        initialPerPage = 20,
        
        
        
        // data:
        useGetModelPage,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // states:
    const [pageNumInternal, setPageNumInternal] = useState<number>(initialPageNum);
    const [perPageInternal, setPerPageInternal] = useState<number>(initialPerPage);
    
    
    
    // props:
    const {
        // states:
        pageNum    = pageNumInternal,
        setPageNum = setPageNumInternal,
        perPage    = perPageInternal,
        setPerPage = setPerPageInternal,
    } = props;
    
    
    
    const {
        data,
        
        isFetching,
        isLoading,
        isError,
        
        refetch,
    } = useGetModelPage({ page: pageNum, perPage });
    const paginationState = useMemo<PaginationState<TModel>>(() => ({
        // states:
        pageNum,
        setPageNum,               // stable ref
        
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
        pageNum,
        // setPageNum,            // stable ref
        
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



export type InterceptEventHandler<TModel extends Model> = (state: Draft<PaginationState<TModel>>) => Draft<PaginationState<TModel>> | void | undefined;
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
        pageNum,
        setPageNum,               // stable ref
        
        perPage,
        setPerPage,               // stable ref
        
        
        
        // data:
        data,
        
        isFetching,
        isLoading,
        isError,
        
        refetch,
    } = produce(paginationState, onIntercept);
    const interceptedPaginationState = useMemo<PaginationState<TModel>>(() => ({
        // states:
        pageNum,
        setPageNum,               // stable ref
        
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
        pageNum,
        // setPageNum,            // stable ref
        
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

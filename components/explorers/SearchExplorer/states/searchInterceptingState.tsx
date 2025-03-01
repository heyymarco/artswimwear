'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from 'react'

// internal components:
import {
    SearchExplorerDropdown,
}                           from '../SearchExplorerDropdown'
import {
    searchPath,
}                           from '../configs'

// states:
import {
    type InterceptingState,
    defaultInterceptingStateContext,
    useInterceptingState,
}                           from '@/navigations/interceptingState'



// hooks:

// states:

//#region searchInterceptingState

// contexts:
const SearchInterceptingStateContext = createContext<InterceptingState>(defaultInterceptingStateContext);
SearchInterceptingStateContext.displayName  = 'SearchInterceptingState';

export const useSearchInterceptingState = (): InterceptingState => {
    const searchInterceptingState = useContext(SearchInterceptingStateContext);
    if (process.env.NODE_ENV !== 'production') {
        if (searchInterceptingState === defaultInterceptingStateContext) {
            console.error('Not in <SearchInterceptingStateProvider>.');
        } // if
    } // if
    return searchInterceptingState;
}



// react components:
export interface SearchInterceptingStateProps
{
}
const SearchInterceptingStateProvider = (props: React.PropsWithChildren<SearchInterceptingStateProps>): JSX.Element|null => {
    // props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // states:
    const {
        interceptingState,
        interceptingDialog,
    } = useInterceptingState({
        interceptingPath            : searchPath,
        interceptingDialogComponent : <SearchExplorerDropdown />,
    });
    
    
    
    // jsx:
    return (
        <SearchInterceptingStateContext.Provider value={interceptingState}>
            {children}
            
            {interceptingDialog}
        </SearchInterceptingStateContext.Provider>
    );
};
export {
    SearchInterceptingStateProvider,            // named export for readibility
    SearchInterceptingStateProvider as default, // default export to support React.lazy
}
//#endregion searchInterceptingState

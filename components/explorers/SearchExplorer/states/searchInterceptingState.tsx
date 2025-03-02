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
    useInterceptingStateProvider,
}                           from '@/navigations/interceptingState'



// contexts:
const SearchInterceptingStateContext = createContext<InterceptingState|undefined>(undefined);
if (process.env.NODE_ENV !== 'production') SearchInterceptingStateContext.displayName  = 'SearchInterceptingState';



// hooks:
export const useSearchInterceptingState = (): InterceptingState => {
    const searchInterceptingState = useContext(SearchInterceptingStateContext);
    if (searchInterceptingState === undefined) throw Error('Not in <SearchInterceptingStateProvider>.');
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
    } = useInterceptingStateProvider({
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

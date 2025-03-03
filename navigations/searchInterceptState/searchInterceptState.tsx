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

// states:
import {
    type NavbarDropdownInterceptState,
    useNavbarDropdownInterceptStateProvider,
}                           from '@/navigations/navbarDropdownInterceptState'



// contexts:
const SearchInterceptStateContext = createContext<NavbarDropdownInterceptState|undefined>(undefined);
if (process.env.NODE_ENV !== 'production') SearchInterceptStateContext.displayName  = 'SearchInterceptState';



// hooks:
export const useSearchInterceptState = (): NavbarDropdownInterceptState => {
    const searchInterceptState = useContext(SearchInterceptStateContext);
    if (searchInterceptState === undefined) throw Error('Not in <SearchInterceptStateProvider>.');
    return searchInterceptState;
}



// react components:
export interface SearchInterceptStateProps
{
}
const SearchInterceptStateProvider = (props: React.PropsWithChildren<SearchInterceptStateProps>): JSX.Element|null => {
    // props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // states:
    const interceptState = useNavbarDropdownInterceptStateProvider();
    
    
    
    // jsx:
    return (
        <SearchInterceptStateContext.Provider value={interceptState}>
            {children}
        </SearchInterceptStateContext.Provider>
    );
};
export {
    SearchInterceptStateProvider,            // named export for readibility
    SearchInterceptStateProvider as default, // default export to support React.lazy
}

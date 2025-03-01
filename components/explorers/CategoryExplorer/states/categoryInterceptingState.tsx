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
    CategoryExplorerDropdown,
}                           from '../CategoryExplorerDropdown'
import {
    categoriesPath,
}                           from '../configs'

// states:
import {
    type InterceptingState,
    defaultInterceptingStateContext,
    useInterceptingState,
}                           from '@/navigations/interceptingState'



// hooks:

// states:

//#region categoryInterceptingState

// contexts:
const CategoryInterceptingStateContext = createContext<InterceptingState>(defaultInterceptingStateContext);
CategoryInterceptingStateContext.displayName  = 'CategoryInterceptingState';

export const useCategoryInterceptingState = (): InterceptingState => {
    const categoryInterceptingState = useContext(CategoryInterceptingStateContext);
    if (process.env.NODE_ENV !== 'production') {
        if (categoryInterceptingState === defaultInterceptingStateContext) {
            console.error('Not in <CategoryInterceptingStateProvider>.');
        } // if
    } // if
    return categoryInterceptingState;
}



// react components:
export interface CategoryInterceptingStateProps
{
}
const CategoryInterceptingStateProvider = (props: React.PropsWithChildren<CategoryInterceptingStateProps>): JSX.Element|null => {
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
        interceptingPath            : categoriesPath,
        interceptingDialogComponent : <CategoryExplorerDropdown />,
    });
    
    
    
    // jsx:
    return (
        <CategoryInterceptingStateContext.Provider value={interceptingState}>
            {children}
            
            {interceptingDialog}
        </CategoryInterceptingStateContext.Provider>
    );
};
export {
    CategoryInterceptingStateProvider,            // named export for readibility
    CategoryInterceptingStateProvider as default, // default export to support React.lazy
}
//#endregion categoryInterceptingState

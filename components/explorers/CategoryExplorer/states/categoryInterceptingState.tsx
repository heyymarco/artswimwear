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
    useInterceptingStateProvider,
}                           from '@/navigations/interceptingState'



// contexts:
const CategoryInterceptingStateContext = createContext<InterceptingState|undefined>(undefined);
if (process.env.NODE_ENV !== 'production') CategoryInterceptingStateContext.displayName  = 'CategoryInterceptingState';



// hooks:
export const useCategoryInterceptingState = (): InterceptingState => {
    const categoryInterceptingState = useContext(CategoryInterceptingStateContext);
    if (categoryInterceptingState === undefined) throw Error('Not in <CategoryInterceptingStateProvider>.');
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
    } = useInterceptingStateProvider({
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

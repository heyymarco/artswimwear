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
    type InterceptState,
    useInterceptStateProvider,
}                           from '@/navigations/interceptState'



// contexts:
const CategoryInterceptStateContext = createContext<InterceptState|undefined>(undefined);
if (process.env.NODE_ENV !== 'production') CategoryInterceptStateContext.displayName  = 'CategoryInterceptState';



// hooks:
export const useCategoryInterceptState = (): InterceptState => {
    const categoryInterceptState = useContext(CategoryInterceptStateContext);
    if (categoryInterceptState === undefined) throw Error('Not in <CategoryInterceptStateProvider>.');
    return categoryInterceptState;
}



// react components:
export interface CategoryInterceptStateProps
{
}
const CategoryInterceptStateProvider = (props: React.PropsWithChildren<CategoryInterceptStateProps>): JSX.Element|null => {
    // props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // states:
    const interceptState = useInterceptStateProvider();
    
    
    
    // jsx:
    return (
        <CategoryInterceptStateContext.Provider value={interceptState}>
            {children}
        </CategoryInterceptStateContext.Provider>
    );
};
export {
    CategoryInterceptStateProvider,            // named export for readibility
    CategoryInterceptStateProvider as default, // default export to support React.lazy
}

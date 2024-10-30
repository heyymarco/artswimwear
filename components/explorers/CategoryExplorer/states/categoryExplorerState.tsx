// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useMemo,
}                           from 'react'
import {
    type Updater,
}                           from 'use-immer'

// models:
import {
    // types:
    type CategoryParentInfo,
}                           from '@/models'



// hooks:

// states:

//#region categoryExplorerState

// utilities:
export const rootParentCategories : CategoryParentInfo[] = [];
export const noopCallback = () => {};



// contexts:
export interface CategoryExplorerState {
    // states:
    parentCategories    : CategoryParentInfo[]
    setParentCategories : Updater<CategoryParentInfo[]>
    
    restoreIndex        : number
    setRestoreIndex     : (restoreIndex: number) => void
    
    
    
    // handlers:
    onNavigate          : ((url: string) => void) | null|undefined
}

const defaultCategoryExplorerStateContext : CategoryExplorerState = {
    // states:
    parentCategories    : rootParentCategories,
    setParentCategories : noopCallback,
    
    restoreIndex        : 0,
    setRestoreIndex     : noopCallback,
    
    
    
    // handlers:
    onNavigate          : undefined,
}
const CategoryExplorerStateContext = createContext<CategoryExplorerState>(defaultCategoryExplorerStateContext);
CategoryExplorerStateContext.displayName  = 'CategoryExplorerState';

export const useCategoryExplorerState = (): CategoryExplorerState => {
    return useContext(CategoryExplorerStateContext);
}



// react components:
export interface CategoryExplorerStateProps
    extends
        Partial<CategoryExplorerState>
{
}
const CategoryExplorerStateProvider = (props: React.PropsWithChildren<CategoryExplorerStateProps>): JSX.Element|null => {
    const {
        // states:
        parentCategories    : defaultParentCategories,
        setParentCategories : defaultSetParentCategories,
        
        restoreIndex        : defaultRestoreIndex,
        setRestoreIndex     : defaultSetRestoreIndex,
        
        
        
        // handlers:
        onNavigate          : defaultOnNavigate,
    } = useCategoryExplorerState();
    
    
    
    // props:
    const {
        // states:
        parentCategories    = defaultParentCategories,
        setParentCategories = defaultSetParentCategories,
        
        restoreIndex        = defaultRestoreIndex,
        setRestoreIndex     = defaultSetRestoreIndex,
        
        
        
        // handlers:
        onNavigate          = defaultOnNavigate,
    } = props;
    
    
    
    // states:
    const categoryExplorerState = useMemo<CategoryExplorerState>(() => ({
        // states:,
        parentCategories,
        setParentCategories,
        
        restoreIndex,
        setRestoreIndex,
        
        
        
        // handlers:
        onNavigate,
    }), [
        // states:,
        parentCategories,
        setParentCategories,
        
        restoreIndex,
        setRestoreIndex,
        
        
        
        // handlers:
        onNavigate,
    ]);
    
    
    
    // jsx:
    return (
        <CategoryExplorerStateContext.Provider value={categoryExplorerState}>
            {props.children}
        </CategoryExplorerStateContext.Provider>
    );
};
export {
    CategoryExplorerStateProvider,
    CategoryExplorerStateProvider as default,
}
//#endregion categoryExplorerState

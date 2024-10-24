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
    type CategoryPreview,
}                           from '@/models'



// hooks:

// states:

//#region categoryExplorerState

// types:
export interface ParentCategoryInfo {
    category : CategoryPreview
    index    : number
}



// contexts:
export interface CategoryExplorerState {
    // states:
    parentCategories    : ParentCategoryInfo[]
    setParentCategories : Updater<ParentCategoryInfo[]>
    
    restoreIndex        : number
    setRestoreIndex     : (restoreIndex: number) => void
}

const noopCallback = () => {};
const defaultCategoryExplorerStateContext : CategoryExplorerState = {
    // states:
    parentCategories    : [],
    setParentCategories : noopCallback,
    
    restoreIndex        : 0,
    setRestoreIndex     : noopCallback,
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
    } = useCategoryExplorerState();
    
    
    
    // props:
    const {
        // states:
        parentCategories    = defaultParentCategories,
        setParentCategories = defaultSetParentCategories,
        
        restoreIndex        = defaultRestoreIndex,
        setRestoreIndex     = defaultSetRestoreIndex,
    } = props;
    
    
    
    // states:
    const categoryExplorerState = useMemo<CategoryExplorerState>(() => ({
        // states:,
        parentCategories,
        setParentCategories,
        
        restoreIndex,
        setRestoreIndex,
    }), [
        // states:,
        parentCategories,
        setParentCategories,
        
        restoreIndex,
        setRestoreIndex,
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

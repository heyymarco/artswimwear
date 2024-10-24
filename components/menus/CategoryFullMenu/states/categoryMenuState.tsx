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

//#region categoryMenuState

// types:
export interface ParentCategoryInfo {
    category : CategoryPreview
    index    : number
}



// contexts:
export interface CategoryMenuState {
    // states:
    parentCategories    : ParentCategoryInfo[]
    setParentCategories : Updater<ParentCategoryInfo[]>
}

const noopCallback = () => {};
const defaultCategoryMenuStateContext : CategoryMenuState = {
    // states:
    parentCategories    : [],
    setParentCategories : noopCallback,
}
const CategoryMenuStateContext = createContext<CategoryMenuState>(defaultCategoryMenuStateContext);
CategoryMenuStateContext.displayName  = 'CategoryMenuState';

export const useCategoryMenuState = (): CategoryMenuState => {
    return useContext(CategoryMenuStateContext);
}



// react components:
export interface CategoryMenuStateProps
    extends
        Partial<CategoryMenuState>
{
}
const CategoryMenuStateProvider = (props: React.PropsWithChildren<CategoryMenuStateProps>): JSX.Element|null => {
    const {
        // states:
        parentCategories    : defaultParentCategories,
        setParentCategories : defaultSetParentCategories,
    } = useCategoryMenuState();
    
    
    
    // props:
    const {
        // states:
        parentCategories    = defaultParentCategories,
        setParentCategories = defaultSetParentCategories,
    } = props;
    
    
    
    // states:
    const categoryMenuState = useMemo<CategoryMenuState>(() => ({
        // states:,
        parentCategories,
        setParentCategories,
    }), [
        // states:,
        parentCategories,
        setParentCategories,
    ]);
    
    
    
    // jsx:
    return (
        <CategoryMenuStateContext.Provider value={categoryMenuState}>
            {props.children}
        </CategoryMenuStateContext.Provider>
    );
};
export {
    CategoryMenuStateProvider,
    CategoryMenuStateProvider as default,
}
//#endregion categoryMenuState

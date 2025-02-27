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
    // appearances:
    mobileLayout        : boolean
    showRootSection     : boolean
    
    
    
    // states:
    parentCategories    : CategoryParentInfo[]
    setParentCategories : Updater<CategoryParentInfo[]>
    
    restoreIndex        : number
    setRestoreIndex     : (restoreIndex: number) => void
    
    
    
    // handlers:
    onNavigate          : ((url: string) => void)        | null|undefined
    onClose             : ((navigated: boolean) => void) | null|undefined
}

const defaultCategoryExplorerStateContext : CategoryExplorerState = {
    // appearances:
    mobileLayout        : true,
    showRootSection     : true,
    
    
    
    // states:
    parentCategories    : rootParentCategories,
    setParentCategories : noopCallback,
    
    restoreIndex        : 0,
    setRestoreIndex     : noopCallback,
    
    
    
    // handlers:
    onNavigate          : undefined,
    onClose             : undefined,
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
        // appearances:
        mobileLayout        : defaultMobileLayout,
        showRootSection     : defaultShowRootSection,
        
        
        
        // states:
        parentCategories    : defaultParentCategories,
        setParentCategories : defaultSetParentCategories,
        
        restoreIndex        : defaultRestoreIndex,
        setRestoreIndex     : defaultSetRestoreIndex,
        
        
        
        // handlers:
        onNavigate          : defaultOnNavigate,
        onClose             : defaultOnClose,
    } = useCategoryExplorerState();
    
    
    
    // props:
    const {
        // appearances:
        mobileLayout        = defaultMobileLayout,
        showRootSection     = defaultShowRootSection,
        
        
        
        // states:
        parentCategories    = defaultParentCategories,
        setParentCategories = defaultSetParentCategories,
        
        restoreIndex        = defaultRestoreIndex,
        setRestoreIndex     = defaultSetRestoreIndex,
        
        
        
        // handlers:
        onNavigate          = defaultOnNavigate,
        onClose             = defaultOnClose,
    } = props;
    
    
    
    // states:
    const categoryExplorerState = useMemo<CategoryExplorerState>(() => ({
        // appearances:
        mobileLayout,
        showRootSection,
        
        
        
        // states:
        parentCategories,
        setParentCategories,
        
        restoreIndex,
        setRestoreIndex,
        
        
        
        // handlers:
        onNavigate,
        onClose,
    }), [
        // appearances:
        mobileLayout,
        showRootSection,
        
        
        
        // states:
        parentCategories,
        setParentCategories,
        
        restoreIndex,
        setRestoreIndex,
        
        
        
        // handlers:
        onNavigate,
        onClose,
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

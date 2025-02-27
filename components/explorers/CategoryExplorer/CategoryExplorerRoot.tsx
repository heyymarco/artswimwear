'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// styles:
import {
    useCategoryExplorerStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    List,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    usePaginationState,
}                           from '@/components/explorers/Pagination'
import {
    CategoryCard,
}                           from '@/components/views/CategoryCard'

// private components:
import {
    CategoryExplorerList,
}                           from './CategoryExplorerList'

// models:
import {
    // types:
    type ModelSelectEventHandler,
    
    type CategoryPreview,
    type CategoryParentInfo,
}                           from '@/models'

// internals:
import {
    // utilities:
    rootParentCategories,
    
    
    
    // states:
    useCategoryExplorerState,
    
    
    
    // react components:
    CategoryExplorerStateProvider,
}                           from './states/categoryExplorerState'



// react components:
const CategoryExplorerRoot = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCategoryExplorerStyleSheet();
    
    
    
    // states:
    const {
        // states:
        parentCategories,
        setParentCategories,
        setRestoreIndex,
    } = useCategoryExplorerState();
    
    const {
        // data:
        data : rootData,
    } = usePaginationState<CategoryPreview>();
    
    const selectedRootOrDefault : CategoryParentInfo|null = (
        // the first selected category is the selected_root_category:
        parentCategories.at(0)
        
        ??
        
        // the first item in data is the default selected_root_category:
        (() : CategoryParentInfo|null => {
            if (!rootData) return null;
            const index    = 0;
            const category = Object.values(rootData.entities).at(index);
            if (!category) return null;
            return { category, index };
        })()
        
        ??
        
        // not found:
        null
    );
    
    
    
    // effects:
    // sets the initial root category when the data is ready:
    useEffect(() => {
        // conditions:
        if (parentCategories.length) return; // already set -or- replaced
        if (!selectedRootOrDefault) return;  // the data is not ready => nothing to set
        
        
        
        // actions:
        setParentCategories([selectedRootOrDefault]); // set the initial root category
        setRestoreIndex(0); // reset the pagination index of child categories
    }, [parentCategories, selectedRootOrDefault]);
    
    
    
    // handlers:
    const handleModelSelect = useEvent<ModelSelectEventHandler<CategoryPreview>>(({ model }) => {
        setParentCategories([{ category: model, index: 0 }]); // set the selected root category
        setRestoreIndex(0); // reset the pagination index of child categories
    });
    
    
    
    // jsx:
    return (
        <CategoryExplorerStateProvider
            // states:
            parentCategories={rootParentCategories}
        >
            <CategoryExplorerList
                // classes:
                className={styleSheet.listGallery}
                
                
                
                // components:
                listComponent={<List listStyle='flat' />}
                modelPreviewComponent={
                    <CategoryCard
                        // data:
                        model={undefined as any}
                        
                        
                        
                        // handlers:
                        selectedModel={selectedRootOrDefault?.category ?? null}
                        onModelSelect={handleModelSelect}
                    />
                }
            />
        </CategoryExplorerStateProvider>
    );
};
export {
    CategoryExplorerRoot,
    CategoryExplorerRoot as default,
}

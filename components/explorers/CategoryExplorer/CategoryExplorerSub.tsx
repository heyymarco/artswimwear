'use client'

// react:
import {
    // react:
    default as React,
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
    // base-components:
    Generic,
    
    
    
    // simple-components:
    ButtonIcon,
    
    
    
    // layout-components:
    List,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    type EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    type PaginationStateProps,
    PaginationStateProvider,
    usePaginationState,
}                           from '@/components/explorers/Pagination'
import {
    CategoryCard,
    // VoidCategoryCard,
}                           from '@/components/views/CategoryCard'

// private components:
import {
    CategoryExplorerGallery,
}                           from './CategoryExplorerGallery'

// models:
import {
    // types:
    type CategoryPreview,
    type CategoryParentInfo,
}                           from '@/models'

// internals:
import {
    // states:
    useCategoryExplorerState,
}                           from './states/categoryExplorerState'

// hooks:
import {
    useUseGetSubCategoryPage,
}                           from './hooks'

// configs:
import {
    subPerPage,
}                           from './configs'



// react components:
const CategoryExplorerSub = (): JSX.Element|null => {
    // states:
    const {
        // states:
        parentCategories,
        restoreIndex,
    } = useCategoryExplorerState();
    
    const {
        // data:
        data : rootData,
    } = usePaginationState<CategoryPreview>();
    
    const selectedParentOrDefault : CategoryParentInfo|null = (
        // the last selected category is the displayed_category's_parent:
        parentCategories.at(-1)
        
        ??
        
        // the first item in data is the default displayed_category's_parent:
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
    
    
    
    // jsx:
    if (!selectedParentOrDefault) return null;
    return (
        <CategoryExplorerSubConditional
            // identifiers:
            key={selectedParentOrDefault.category.id} // when switched to "different" selectedParent, the "state" should be "cleared"
            
            
            
            // data:
            rootCategory={selectedParentOrDefault.category}
            initialPage={(parentCategories.length >= 1) ? Math.floor(restoreIndex / subPerPage) : undefined}
        />
    );
};
export {
    CategoryExplorerSub,
    CategoryExplorerSub as default,
}



interface CategoryExplorerSubConditionalProps
    extends
        // bases:
        Pick<PaginationStateProps<CategoryPreview>,
            // states:
            |'initialPage'
        >
{
    // data:
    rootCategory: CategoryPreview
}
const CategoryExplorerSubConditional = (props: CategoryExplorerSubConditionalProps): JSX.Element|null => {
    // props:
    const {
        // data:
        rootCategory,
        initialPage,
    } = props;
    
    
    
    // hooks:
    const _useGetSubCategoryPage = useUseGetSubCategoryPage(rootCategory.id);
    
    
    
    // jsx:
    return (
        <PaginationStateProvider<CategoryPreview>
            // states:
            initialPage={initialPage}
            initialPerPage={subPerPage}
            
            
            
            // data:
            useGetModelPage={_useGetSubCategoryPage}
        >
            <CategoryExplorerSubInternal />
        </PaginationStateProvider>
    );
};
const CategoryExplorerSubInternal = (): JSX.Element|null => {
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
        // states:
        page,
        perPage,
        
        
        
        // data:
        data,
    } = usePaginationState<CategoryPreview>();
    
    
    
    // handlers:
    const handleBack = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        setParentCategories((draft): void => {
            // conditions:
            if (!draft.length) return; // the root category is not yet selected or loaded => ignore
            
            
            
            // actions:
            const prevCategoryInfo = draft.pop();
            setRestoreIndex(prevCategoryInfo?.index ?? 0); // restore the pagination index of child categories
        });
    });
    const handleSelect = useEvent<EditorChangeEventHandler<CategoryPreview>>((model) => {
        setParentCategories((draft): void => {
            // conditions:
            if (!draft.length) return; // the root category is not yet selected or loaded => ignore
            
            
            
            // actions:
            draft.push({
                category : model,
                index    : (page * perPage) + ((): number => {
                    if (!data) return 0;
                    const itemIndex = data.entities.findIndex(({id: searchId}) => (searchId === model.id));
                    if (itemIndex < 0) return 0;
                    return itemIndex;
                })()
            });
        });
        setRestoreIndex(0); // reset the pagination index of child categories
    });
    
    
    
    // jsx:
    return (
        <>
            <div className={styleSheet.nav}>
                {(parentCategories.length >= 2) && <ButtonIcon
                    // appearances:
                    icon='arrow_back'
                    
                    
                    
                    // variants:
                    theme='primary'
                    buttonStyle='link'
                    mild={false}
                    
                    
                    
                    // handlers:
                    onClick={handleBack}
                >
                    Back
                </ButtonIcon>}
            </div>
            
            <CategoryExplorerGallery
                // classes:
                className={styleSheet.subExpl}
                
                
                
                // components:
                galleryComponent={<Generic className='flat' />}
                // modelVoidComponent={<VoidCategoryCard />}
                modelPreviewComponent={
                    <CategoryCard
                        // data:
                        model={undefined as any}
                        
                        
                        
                        // handlers:
                        onModelSelect={handleSelect}
                    />
                }
            />
        </>
    );
};

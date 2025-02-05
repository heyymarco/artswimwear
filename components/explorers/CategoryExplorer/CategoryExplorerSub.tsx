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
    CloseButton,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    type PaginationStateProps,
    PaginationStateProvider,
    usePaginationState,
}                           from '@/components/explorers/Pagination'
import {
    CategoryCard,
    // VoidCategoryCard,
    EmptyCategoryCard,
}                           from '@/components/views/CategoryCard'

// private components:
import {
    CategoryExplorerGallery,
}                           from './CategoryExplorerGallery'

// models:
import {
    // types:
    type ModelSelectEventHandler,
    
    type CategoryPreview,
    type CategoryParentInfo,
    
    
    
    // defaults:
    defaultSubCategoryPerPage,
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



// react components:
export interface CategoryExplorerSubProps {
    // configs:
    /**
     * The minimum depth the current category can go up to parent categories.
     * Set to 0 to allow the user to go up to the root category.
     * Set to 1 to allow the user to go up to the first nested category.
     */
    minDepth ?: number
}
const CategoryExplorerSub = (props: CategoryExplorerSubProps): JSX.Element|null => {
    // props:
    const minDepth = (props.minDepth ?? 0);
    
    
    
    // states:
    const {
        // states:
        parentCategories,
        restoreIndex,
    } = useCategoryExplorerState();
    
    /*
     * immediateParent:
     * The immediate parent category of the current category.
     * Hierarchy: root_parent_category > parent_level_1_category > parent_level_2_category > ... > immediate_parent_category > current_category
     */
    const immediateParent : CategoryParentInfo|null|undefined = (
        (parentCategories.length >= minDepth)
        
        // If the number of parent categories meets or exceeds minDepth, select the immediate parent:
        ? (parentCategories.at(-1) ?? null)
        
        // If the number of parent categories is less than minDepth, the parent categories are invalid, hence immediateParent is undefined:
        : undefined
    );
    
    
    
    // jsx:
    if (immediateParent === undefined) return null; // do not render invalid component
    return (
        <CategoryExplorerSubConditional
            // other props:
            {...props}
            
            
            
            // identifiers:
            key={immediateParent?.category.id ?? null} // when switched to DIFFERENT `immediateParent`, the STATE should be CLEARED
            
            
            
            // data:
            parentCategory={immediateParent?.category ?? null}
            
            
            
            // states:
            initialPageNum={
                (parentCategories.length >= minDepth)
                
                // restores the initialPageNum if the_parents_deep SATISFIES minDepth:
                ? Math.floor(restoreIndex / defaultSubCategoryPerPage)
                
                // otherwise not defined:
                : undefined
            }
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
        CategoryExplorerSubProps,
        
        // states:
        Pick<PaginationStateProps<CategoryPreview>,
            // states:
            |'initialPageNum'
        >
{
    // data:
    parentCategory: CategoryPreview|null
}
const CategoryExplorerSubConditional = (props: CategoryExplorerSubConditionalProps): JSX.Element|null => {
    // props:
    const {
        // data:
        parentCategory,
        
        
        
        // states:
        initialPageNum,
        
        
        
        // other props:
        ...restCategoryExplorerSubProps
    } = props;
    
    
    
    // hooks:
    const _useGetSubCategoryPage = useUseGetSubCategoryPage(parentCategory?.id ?? null);
    
    
    
    // jsx:
    return (
        <PaginationStateProvider<CategoryPreview>
            // states:
            initialPageNum={initialPageNum}
            initialPerPage={defaultSubCategoryPerPage}
            
            
            
            // data:
            useGetModelPage={_useGetSubCategoryPage}
        >
            <CategoryExplorerSubInternal
                // other props:
                {...restCategoryExplorerSubProps}
            />
        </PaginationStateProvider>
    );
};



interface CategoryExplorerSubInternalProps
    extends
        // bases:
        CategoryExplorerSubProps
{
}
const CategoryExplorerSubInternal = (props: CategoryExplorerSubInternalProps): JSX.Element|null => {
    // props:
    const {
        // configs:
        minDepth = 0,
    } = props;
    
    
    
    // styles:
    const styleSheet = useCategoryExplorerStyleSheet();
    
    
    
    // states:
    const {
        // appearances:
        mobileLayout,
        
        
        
        // states:
        parentCategories,
        setParentCategories,
        setRestoreIndex,
        
        
        
        // handlers:
        onClose,
    } = useCategoryExplorerState();
    
    const {
        // states:
        page,
        perPage,
        
        
        
        // data:
        data,
    } = usePaginationState<CategoryPreview>();
    
    
    
    // handlers:
    const handleNavigateBack   = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        setParentCategories((draft): void => {
            // conditions:
            if ((draft.length - 1 /* back to one_step */) < minDepth) return; // PREVENTS the_parents_deep BELOW the minDepth
            
            
            
            // actions:
            const prevCategoryInfo = draft.pop();
            
            
            
            // a side effect (maybe called twice but it's ok):
            setRestoreIndex(prevCategoryInfo?.index ?? 0); // restore the pagination index of child categories
        });
    });
    const handleCategorySelect = useEvent<ModelSelectEventHandler<CategoryPreview>>(({ model }) => {
        setParentCategories((draft): void => {
            // conditions:
            if (draft.length < minDepth) return; // ABORT the operation if the_parents_deep DOESNT_SATISFY minDepth
            
            
            
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
            
            
            
            // a side effect (maybe called twice but it's ok):
            setRestoreIndex(0); // reset the pagination index of child categories
        });
    });
    
    
    
    // jsx:
    const canBack = ((parentCategories.length - 1 /* back to one_step */) >= minDepth); // PREVENTS the_parents_deep BELOW the minDepth
    return (
        <>
            <div className={styleSheet.nav}>
                {(canBack || mobileLayout) && <ButtonIcon
                    // appearances:
                    icon='arrow_back'
                    
                    
                    
                    // variants:
                    theme='primary'
                    buttonStyle='link'
                    mild={false}
                    
                    
                    
                    // classes:
                    className='back'
                    
                    
                    
                    // handlers:
                    onClick={canBack ? handleNavigateBack : (onClose ?? undefined)}
                >
                    Back
                </ButtonIcon>}
                
                {!mobileLayout && <CloseButton
                    // variants:
                    theme='primary'
                    mild={true}
                    
                    
                    
                    // classes:
                    className='close'
                    
                    
                    
                    // handlers:
                    onClick={onClose ?? undefined}
                />}
            </div>
            
            <CategoryExplorerGallery
                // classes:
                className={`${styleSheet.listGallery} ${styleSheet.subGallery}`}
                
                
                
                // components:
                galleryComponent={<Generic className='flat' />}
                // modelVoidComponent={<VoidCategoryCard />}
                modelEmptyComponent={<EmptyCategoryCard />}
                modelPreviewComponent={
                    <CategoryCard
                        // data:
                        model={undefined as any}
                        
                        
                        
                        // handlers:
                        onModelSelect={handleCategorySelect}
                    />
                }
            />
        </>
    );
};

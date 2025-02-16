'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'
import {
    useImmer,
}                           from 'use-immer'

// next-js:
import {
    usePathname,
}                           from 'next/navigation'

// styles:
import {
    useCategoryExplorerStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    GenericProps,
    Generic,
    
    
    
    // base-content-components:
    Container,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    usePaginationState,
    PaginationStateProvider,
}                           from '@/components/explorers/Pagination'
import {
    PrefetchCategoryPage,
}                           from '@/components/prefetches/PrefetchCategoryPage'

// private components:
import {
    RouterUpdater,
}                           from './RouterUpdater'
import {
    CategoryExplorerRoot,
}                           from './CategoryExplorerRoot'
import {
    CategoryExplorerSub,
}                           from './CategoryExplorerSub'

// models:
import {
    // types:
    type CategoryPreview,
    type CategoryParentInfo,
    type CategoryPreviewPagination,
    
    
    
    // defaults:
    defaultRootCategoryPerPage,
    defaultSubCategoryPerPage,
}                           from '@/models'

// internals:
import {
    // utilities:
    rootParentCategories,
    noopCallback,
    
    
    
    // states:
    useCategoryExplorerState,
    
    
    
    // react components:
    type CategoryExplorerStateProps,
    CategoryExplorerStateProvider,
}                           from './states/categoryExplorerState'

// hooks:
import {
    useGetRootCategoryPage,
}                           from './hooks'

// stores:
import {
    // hooks:
    useGetCategoryDetail,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface CategoryExplorerProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<GenericProps<TElement>,
            // children:
            |'children' // already defined internally
        >,
        
        // <div>:
        Pick<React.HTMLAttributes<TElement>,
            // accessibilities:
            |'tabIndex'
        >,
        
        // states:
        Pick<CategoryExplorerStateProps,
            // appearances:
            |'mobileLayout'
            |'showRootSection'
            
            // handlers:
            |'onNavigate'
            |'onClose'
        >
{
}
const CategoryExplorer = <TElement extends Element = HTMLElement>(props: CategoryExplorerProps<TElement>): JSX.Element|null => {
    // states:
    const pathname = usePathname();
    const [initialCategories] = useState<string[]|null>(() => {
        // conditions:
        if (!(/^\/categories($|\/)/i).test(pathname)) return null; // OUTSIDE the `/categories/**` path => no selected category
        
        
        
        let tailPathname = pathname.slice('/categories'.length);
        if (tailPathname[0] === '/') tailPathname = tailPathname.slice(1);
        const categories = !tailPathname ? null : tailPathname.split('/'); // INSIDE the `/categories/**` path => USE current pathname to restore the last selected category
        return categories;
    });
    
    
    
    // jsx:
    if (!initialCategories?.length) {
        // shows the categories WITHOUT initial selection:
        return (
            <CategoryExplorerInternal<TElement>
                // other props:
                {...props satisfies NoForeignProps<typeof props, CategoryExplorerInternalProps<TElement>>}
            />
        );
    } // if
    
    // shows the categories WITH|WITHOUT initial selection:
    return (
        <CategoryExplorerConditional<TElement>
            // other props:
            {...props satisfies NoForeignProps<typeof props, Omit<CategoryExplorerConditionalProps<TElement>, 'initialCategories'>>}
            
            
            
            // data:
            initialCategories={initialCategories}
        />
    );
};
export {
    CategoryExplorer,
    CategoryExplorer as default,
}



interface CategoryExplorerConditionalProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        CategoryExplorerProps<TElement>
{
    // data:
    initialCategories : string[]
}
const CategoryExplorerConditional = <TElement extends Element = HTMLElement>(props: CategoryExplorerConditionalProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // data:
        initialCategories,
        
        
        
        // other props:
        ...restCategoryExplorerProps
    } = props;
    
    
    
    // stores:
    const { data: categoryDetail } = useGetCategoryDetail(initialCategories);
    const [{initialSelectedCategories, initialRestoreIndex}] = useState<{ initialSelectedCategories: CategoryParentInfo[]|null, initialRestoreIndex: number|undefined }>(() => {
        // conditions:
        if (!categoryDetail) return { initialSelectedCategories: null, initialRestoreIndex: 0 }; // the data is not ready => ignore
        
        
        
        // computes:
        const {
            parents : ancestorToRootParents,
            index,
        } = categoryDetail;
        return {
            initialSelectedCategories : (
                (ancestorToRootParents.length === 0)
                
                // if the categoryDetail is a root category => select itself to preserve the current_selected_root_category:
                ? [{
                    category : {
                        ...categoryDetail,
                        image : categoryDetail.images?.[0] ?? undefined,
                    },
                    index    : index,
                } satisfies CategoryParentInfo]
                
                // otherwise select the parents:
                : ancestorToRootParents.toReversed() // reverse from ancestorToRootParents to rootToAncestorParents
            ),
            initialRestoreIndex       : (
                (ancestorToRootParents.length === 0)
                
                // if the categoryDetail is a root category => no initial selected parent for the <CategoryExplorerSub>:
                ? undefined
                
                // otherwise select the index of categoryDetail:
                : index
            ),
        };
    }); // we use `useState` instead of `useMemo`, so when the data is ready AFTER that, the initial preserved data is not changed, to avoid user confusion
    
    
    
    // jsx:
    // the data is LOADING|ERROR => shows the categories WITHOUT initial selection:
    if (!initialSelectedCategories) {
        // shows the categories WITHOUT initial selection:
        return (
            <CategoryExplorerInternal<TElement>
                // other props:
                {...restCategoryExplorerProps}
            />
        );
    } // if
    
    // the data is READY => shows the categories WITH initial selection:
    return (
        <CategoryExplorerInternal<TElement>
            // other props:
            {...restCategoryExplorerProps}
            
            
            
            // data:
            initialSelectedCategories={initialSelectedCategories}
            initialRestoreIndex={initialRestoreIndex}
        />
    );
};



interface CategoryExplorerInternalProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        CategoryExplorerProps<TElement>
{
    // data:
    initialSelectedCategories ?: CategoryParentInfo[]
    initialRestoreIndex       ?: number
}
const CategoryExplorerInternal = <TElement extends Element = HTMLElement>(props: CategoryExplorerInternalProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // data:
        initialSelectedCategories = [],
        initialRestoreIndex       = 0,
        
        
        
        // appearances:
        mobileLayout,
        showRootSection,
        
        
        
        // handlers:
        onNavigate,
        onClose,
        
        
        
        // other props:
        ...restCategoryExplorerInternal2Props
    } = props;
    
    
    
    // states:
    const [parentCategories, setParentCategories] = useImmer<CategoryParentInfo[]>(initialSelectedCategories);
    const [restoreIndex    , setRestoreIndex    ] = useState<number>(initialRestoreIndex);
    
    
    
    // jsx:
    return (
        <CategoryExplorerStateProvider
            // states:
            parentCategories    = {parentCategories   }
            setParentCategories = {setParentCategories}
            
            restoreIndex        = {restoreIndex   }
            setRestoreIndex     = {setRestoreIndex}
            
            
            
            // appearances:
            mobileLayout={mobileLayout}
            showRootSection={showRootSection}
            
            
            
            // handlers:
            onNavigate={onNavigate}
            onClose={onClose}
        >
            <PaginationStateProvider<CategoryPreview>
                // states:
                initialPageNum={parentCategories.length ? Math.floor(parentCategories[0].index / defaultRootCategoryPerPage) : undefined}
                initialPerPage={defaultRootCategoryPerPage}
                
                
                
                // data:
                useGetModelPage={useGetRootCategoryPage}
            >
                <CategoryExplorerInternal2
                    // other props:
                    {...restCategoryExplorerInternal2Props satisfies NoForeignProps<typeof restCategoryExplorerInternal2Props, CategoryExplorerInternal2Props<TElement>>}
                />
            </PaginationStateProvider>
        </CategoryExplorerStateProvider>
    );
};



interface CategoryExplorerInternal2Props<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<CategoryExplorerProps<TElement>,
            // appearances:
            |'mobileLayout'
            |'showRootSection'
            
            // handlers:
            |'onNavigate'
            |'onClose'
        >
{
}
const CategoryExplorerInternal2 = <TElement extends Element = HTMLElement>(props: CategoryExplorerInternal2Props<TElement>): JSX.Element|null => {
    // states:
    const {
        // appearances:
        mobileLayout,
        showRootSection : showRootSectionIfPossible,
        
        
        
        // states:
        parentCategories,
    } = useCategoryExplorerState();
    
    const { data: categoryPreviewPaginationRaw } = usePaginationState<CategoryPreview>();
    const categoryPreviewPagination = categoryPreviewPaginationRaw as CategoryPreviewPagination|undefined;
    const {
        has2ndLevelCategories = false,
    } = categoryPreviewPagination ?? {};
    const showRootSection = showRootSectionIfPossible && !mobileLayout && has2ndLevelCategories;
    
    
    
    // props:
    const {
        // accessibilities:
        tabIndex  = 0,
        
        
        
        // other props:
        ...restCategoryExplorerInternal2Props
    } = props;
    
    
    
    // styles:
    const styleSheet = useCategoryExplorerStyleSheet();
    
    
    
    // default props:
    const {
        // classes:
        mainClass = `${styleSheet.main} ${mobileLayout ? 'mobile' : ''}`,
        
        
        
        // other props:
        ...restGenericProps
    } = restCategoryExplorerInternal2Props satisfies NoForeignProps<typeof restCategoryExplorerInternal2Props, GenericProps<TElement>>;
    
    
    
    // jsx:
    return (
        <>
            {/* PREFETCH for displaying the ANCESTOR(S) AND PARENT categories (except the root category): */}
            {parentCategories.slice(showRootSection ? 1 /* skip the root parent category */ : 0 /* select all parent categories */).map(({ category: subcategory, index: restoreIndex }, index) =>
                // PREFETCH for preserving the sub category CACHES:
                <PrefetchCategoryPage
                    // identifiers:
                    key={subcategory.id ?? index}
                    
                    
                    
                    // refs:
                    subjectRef={null} // always prefetch
                    
                    
                    
                    // data:
                    model={subcategory}
                    
                    
                    
                    // states:
                    initialPageNum={Math.floor(restoreIndex / defaultSubCategoryPerPage)}
                    initialPerPage={defaultSubCategoryPerPage}
                />
            )}
            
            <CategoryExplorerStateProvider
                // states:
                // when no 2nd_level_categories => force to always having EMPTY `parentCategories` and IGNORE `setParentCategories`
                // otherwise keeps both `parentCategories` and `setParentCategories` unchanged
                parentCategories    = {!has2ndLevelCategories ? rootParentCategories : undefined}
                setParentCategories = {!has2ndLevelCategories ? noopCallback         : undefined}
            >
                <Generic<TElement>
                    // other props:
                    {...restGenericProps}
                    
                    
                    
                    // accessibilities:
                    // @ts-ignore
                    tabIndex={tabIndex}
                    
                    
                    
                    // classes:
                    mainClass={mainClass}
                >
                    <RouterUpdater />
                    
                    
                    
                    {showRootSection && <Container className={styleSheet.root} theme='primaryAlt'>
                        <CategoryExplorerRoot />
                    </Container>}
                    <Container className={`${styleSheet.sub} ${showRootSection ? '' : styleSheet.rootMergeSub} ${mobileLayout ? 'mobile' : ''}`} theme='primaryAlt' mild={false}>
                        <CategoryExplorerSub
                            // configs:
                            minDepth={
                                showRootSection
                                ? 1 // when navigate `back`, do not reaches `root` category
                                : 0
                            }
                        />
                    </Container>
                </Generic>
            </CategoryExplorerStateProvider>
        </>
    );
}

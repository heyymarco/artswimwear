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
    PaginationStateProvider,
}                           from '@/components/explorers/Pagination'

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
}                           from '@/models'

// internals:
import {
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

// configs:
import {
    rootPerPage,
}                           from './configs'



// react components:
export interface CategoryExplorerProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<GenericProps<TElement>,
            // children:
            |'children' // already defined internally
        >,
        
        // <div>:
        Omit<React.HTMLAttributes<TElement>,
            // semantics:
            |'role' // we redefined [role] in <Generic>
        >,
        
        // handlers:
        Pick<CategoryExplorerStateProps,
            |'onNavigate'
        >
{
}
const CategoryExplorer = (props: CategoryExplorerProps): JSX.Element|null => {
    // states:
    const pathname = usePathname();
    const [initialCategories] = useState<string[]|undefined>(() => {
        let tailPathname = pathname.slice('/categories'.length);
        if (tailPathname[0] === '/') tailPathname = tailPathname.slice(1);
        const categories = !tailPathname ? undefined : tailPathname.split('/');
        return categories;
    });
    
    
    
    // jsx:
    // INSIDE the `/categories/**` path => TRY to show the categories WITH initial selection:
    if (initialCategories) return (
        <CategoryExplorerWithInitial
            // other props:
            {...props}
            
            
            
            // data:
            initialCategories={initialCategories}
        />
    );
    
    // OUTSIDE the `/categories/**` path => shows the categories WITHOUT initial selection:
    return (
        <CategoryExplorerInternal
            // other props:
            {...props}
        />
    );
};
export {
    CategoryExplorer,
    CategoryExplorer as default,
}



export interface CategoryExplorerWithInitialProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        CategoryExplorerProps<TElement>
{
    // data:
    initialCategories: string[]
}
const CategoryExplorerWithInitial = <TElement extends Element = HTMLElement>(props: CategoryExplorerWithInitialProps<TElement>): JSX.Element|null => {
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
                
                // if the categoryDetail is a root category => select itself:
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
        return (
            <CategoryExplorerInternal
                // other props:
                {...props}
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
    
    
    
    // appearances:
    showRootSection           ?: boolean
}
const CategoryExplorerInternal = <TElement extends Element = HTMLElement>(props: CategoryExplorerInternalProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // data:
        initialSelectedCategories = [],
        initialRestoreIndex       = 0,
        
        
        
        // appearances:
        showRootSection           = false,
        
        
        
        // other props:
        ...restCategoryExplorerProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useCategoryExplorerStyleSheet();
    
    
    
    // states:
    const [parentCategories, setParentCategories] = useImmer<CategoryParentInfo[]>(initialSelectedCategories);
    const [restoreIndex    , setRestoreIndex    ] = useState<number>(initialRestoreIndex);
    
    
    
    // default props:
    const {
        // accessibilities:
        tabIndex  = 0,
        
        
        
        // classes:
        mainClass = styleSheet.main,
        
        
        
        // handlers:
        onNavigate,
        
        
        
        // other props:
        ...restGenericProps
    } = restCategoryExplorerProps;
    
    
    
    // jsx:
    return (
        <Generic<TElement>
            // other props:
            {...restGenericProps}
            
            
            
            // accessibilities:
            // @ts-ignore
            tabIndex={tabIndex}
            
            
            
            // classes:
            mainClass={mainClass}
        >
            <CategoryExplorerStateProvider
                // states:
                parentCategories={parentCategories}
                setParentCategories={setParentCategories}
                
                restoreIndex={restoreIndex}
                setRestoreIndex={setRestoreIndex}
                
                
                
                // handlers:
                onNavigate={onNavigate}
            >
                <RouterUpdater />
                
                
                
                {/*
                    Place the <PaginationStateProvider> for root data here,
                    so it can be accessed by both <CategoryExplorerRoot> and <CategoryExplorerSub>
                */}
                <PaginationStateProvider<CategoryPreview>
                    // states:
                    initialPage={parentCategories.length ? Math.floor(parentCategories[0].index / rootPerPage) : undefined}
                    initialPerPage={rootPerPage}
                    
                    
                    
                    // data:
                    useGetModelPage={useGetRootCategoryPage}
                >
                    {showRootSection && <Container className={styleSheet.root} theme='primaryAlt'>
                        <CategoryExplorerRoot />
                    </Container>}
                    <Container className={`${styleSheet.sub} ${showRootSection ? '' : styleSheet.rootMergeSub}`} theme='primaryAlt' mild={false}>
                        <CategoryExplorerSub
                            // configs:
                            minDepth={
                                showRootSection
                                ? 1 // when navigate `back`, do not reaches `root` category
                                : 0
                            }
                        />
                    </Container>
                </PaginationStateProvider>
            </CategoryExplorerStateProvider>
        </Generic>
    );
};

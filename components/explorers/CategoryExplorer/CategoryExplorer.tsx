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

// styles:
import {
    useCategoryFullMenuStyleSheet,
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
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetCategoryPage as _useGetCategoryPage,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    // types:
    type ParentCategoryInfo,
    
    
    
    // react components:
    CategoryExplorerStateProvider,
}                           from './states/categoryExplorerState'

// hooks:
import {
    useGetRootCategoryPage,
}                           from './hooks'

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
        >
{
}
const CategoryExplorer = (props: CategoryExplorerProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCategoryFullMenuStyleSheet();
    
    
    
    // states:
    const [parentCategories, setParentCategories] = useImmer<ParentCategoryInfo[]>([]);
    const [restoreIndex    , setRestoreIndex    ] = useState<number>(0);
    
    
    
    // default props:
    const {
        // accessibilities:
        tabIndex  = 0,
        
        
        
        // classes:
        mainClass = styleSheet.main,
        
        
        
        // other props:
        ...restGenericProps
    } = props;
    
    
    
    // jsx:
    return (
        <Generic
            // other props:
            {...restGenericProps}
            
            
            
            // accessibilities:
            // @ts-ignore
            tabIndex={tabIndex}
            
            
            
            // classes:
            mainClass={mainClass}
        >
            <Container className={styleSheet.rootBefore} theme='primaryAlt' />
            <div
                // classes:
                className={styleSheet.body}
            >
                <CategoryExplorerStateProvider
                    // states:
                    parentCategories={parentCategories}
                    setParentCategories={setParentCategories}
                    
                    restoreIndex={restoreIndex}
                    setRestoreIndex={setRestoreIndex}
                >
                    {/*
                        Place the <PaginationStateProvider> for root data here,
                        so it can be accessed by both <CategoryExplorerRoot> and <CategoryExplorerSub>
                    */}
                    <PaginationStateProvider<CategoryPreview>
                        // states:
                        initialPerPage={rootPerPage}
                        
                        
                        
                        // data:
                        useGetModelPage={useGetRootCategoryPage}
                    >
                        <RouterUpdater />
                        <Container className={styleSheet.root} theme='primaryAlt'>
                            <CategoryExplorerRoot />
                        </Container>
                        <Container className={styleSheet.sub} theme='primaryAlt' mild={false}>
                            <CategoryExplorerSub />
                        </Container>
                    </PaginationStateProvider>
                </CategoryExplorerStateProvider>
            </div>
            <Container className={styleSheet.subAfter} theme='primaryAlt' mild={false} />
        </Generic>
    );
};
export {
    CategoryExplorer,
    CategoryExplorer as default,
}

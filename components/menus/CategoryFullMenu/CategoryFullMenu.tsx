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
    // base-content-components:
    Container,
    
    
    
    // menu-components:
    DropdownProps,
    Dropdown,
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
    CategoryMenuStateProvider,
}                           from './states/categoryMenuState'

// hooks:
import {
    useGetRootCategoryPage,
}                           from './hooks'

// configs:
import {
    rootPerPage,
}                           from './configs'



// react components:
export interface CategoryFullMenuProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<DropdownProps<TElement>,
            // children:
            |'children' // already defined internally
        >
{
}
const CategoryFullMenu = (props: CategoryFullMenuProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCategoryFullMenuStyleSheet();
    
    
    
    // states:
    const [parentCategories, setParentCategories] = useImmer<ParentCategoryInfo[]>([]);
    const [restoreIndex    , setRestoreIndex    ] = useState<number>(0);
    
    
    
    // default props:
    const {
        // other props:
        ...restDropdownProps
    } = props;
    
    
    
    // jsx:
    return (
        <Dropdown
            // other props:
            {...restDropdownProps}
            
            
            
            // classes:
            className={`${styleSheet.categoryFullMenuDropdown} ${props.className}`}
        >
            <div
                // accessibilities:
                // @ts-ignore
                tabIndex={0}
                
                
                
                // classes:
                className={styleSheet.main}
            >
                <Container className={styleSheet.rootBefore} theme='primaryAlt' />
                <div
                    // classes:
                    className={styleSheet.body}
                >
                    <CategoryMenuStateProvider
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
                    </CategoryMenuStateProvider>
                </div>
                <Container className={styleSheet.subAfter} theme='primaryAlt' mild={false} />
            </div>
        </Dropdown>
    );
};
export {
    CategoryFullMenu,
    CategoryFullMenu as default,
}

'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'
import {
    useImmer,
}                           from 'use-immer'

// next-js:
import {
    usePathname,
    useRouter,
}                           from 'next/navigation'

// styles:
import {
    useCategoryFullMenuStyleSheet,
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
    BasicProps,
    Basic,
    
    
    
    // base-content-components:
    Container,
    
    
    
    // simple-components:
    ButtonIcon,
    
    
    
    // layout-components:
    ListProps,
    List,
    
    
    
    // menu-components:
    DropdownProps,
    Dropdown,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    type EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    PaginationStateProvider,
    usePaginationState,
}                           from '@/components/explorers/Pagination'
import {
    type PaginationListProps,
    PaginationList,
}                           from '@/components/explorers/PaginationList'
import {
    type PaginationGalleryProps,
    PaginationGallery,
}                           from '@/components/explorers/PaginationGallery'
import {
    type CategoryViewProps,
    CategoryView,
}                           from '@/components/views/CategoryView'

// stores:
import {
    // hooks:
    useGetCategoryPage,
}                           from '@/store/features/api/apiSlice'

// models:
import {
    // types:
    type PaginationArgs,
    type CategoryPreview,
}                           from '@/models'

// internals:
import {
    // states:
    useCategoryMenuState,
    
    
    
    // react components:
    CategoryMenuStateProvider,
}                           from './states/categoryMenuState'



// configs:
const categoriesPath = '/categories';



// hooks:
const useGetRootCategoryPage = (arg: PaginationArgs) => {
    return useGetCategoryPage({
        ...arg,
        parent : null,
    });
};
const useUseGetSubCategoryPage = (parentCategory: string) => {
    return (arg: PaginationArgs) => {
        return useGetCategoryPage({
            ...arg,
            parent : parentCategory,
        });
    };
};



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
    const [parentCategories, setParentCategories] = useImmer<CategoryPreview[]>([]);
    
    
    
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
                    >
                        {/*
                            Place the <PaginationStateProvider> for root data here,
                            so it can be accessed by both <CategoryExplorerRoot> and <CategoryExplorerSub>
                        */}
                        <PaginationStateProvider<CategoryPreview>
                            // states:
                            initialPerPage={10}
                            
                            
                            
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



const RouterUpdater = (): JSX.Element|null => {
    // states:
    const {
        // states:
        parentCategories,
    } = useCategoryMenuState();
    
    
    
    // effects:
    // sync the pathname to the path of selected category:
    const pathname                = usePathname();
    const router                  = useRouter();
    const prevParentCategoriesRef = useRef<CategoryPreview[]>(parentCategories);
    useEffect(() => {
        // conditions:
        if (prevParentCategoriesRef.current === parentCategories) return; // already the same => ignore
        const prevParentCategories = prevParentCategoriesRef.current;
        prevParentCategoriesRef.current = parentCategories;               // sync
        if (!parentCategories.length) return; // the root category is not yet selected or loaded => ignore
        
        
        
        // actions:
        const oldPathname = `${categoriesPath}/${prevParentCategories.map(({path}) => path).join('/')}`;
        const newPathname = `${categoriesPath}/${parentCategories.map(({path}) => path).join('/')}`;
        if (newPathname.toLowerCase() !== pathname) {
            if ((prevParentCategories.length === (parentCategories.length + 1)) && ((): boolean => { // if a back action detected
                for (let index = 0, maxIndex = parentCategories.length - 1; index <= maxIndex; index++) {
                    if (parentCategories[index] !== prevParentCategories[index]) return false;
                } // for
                return (pathname.toLowerCase() === oldPathname.toLowerCase());
            })()) {
                router.back();
            }
            else {
                router.push(newPathname);
            } // if
        } // if
    }, [parentCategories, pathname]);
    
    
    
    // jsx:
    return null;
}



const CategoryExplorerRoot = (): JSX.Element|null => {
    // states:
    const {
        // states:
        parentCategories,
        setParentCategories,
    } = useCategoryMenuState();
    
    const {
        // data:
        data : rootData,
    } = usePaginationState<CategoryPreview>();
    
    const selectedRootOrDefault : CategoryPreview|null = (
        parentCategories.at(0)
        ??
        (rootData ? Object.values(rootData.entities)?.[0] : null)
        ??
        null
    );
    
    
    
    // effects:
    // sets the initial root category when the data is ready:
    useEffect(() => {
        // conditions:
        if (parentCategories.length) return; // already set -or- replaced
        if (!selectedRootOrDefault) return;  // the data is not ready => nothing to set
        
        
        
        // actions:
        setParentCategories(() => [selectedRootOrDefault]); // set the initial root category
    }, [parentCategories, selectedRootOrDefault]);
    
    
    
    // handlers:
    const handleSelect = useEvent<EditorChangeEventHandler<CategoryPreview>>((model) => {
        setParentCategories(() => [model]); // set the selected root category
    });
    
    
    
    // jsx:
    if (!selectedRootOrDefault) return null;
    return (
        <CategoryExplorerList
            // components:
            listComponent={<List listStyle='flat' />}
            modelPreviewComponent={
                <CategoryView
                    // data:
                    model={undefined as any}
                    
                    
                    
                    // handlers:
                    selectedModel={selectedRootOrDefault}
                    onModelSelect={handleSelect}
                />
            }
        />
    );
};
const CategoryExplorerSub = (): JSX.Element|null => {
    // states:
    const {
        // states:
        parentCategories,
    } = useCategoryMenuState();
    
    const {
        // data:
        data : rootData,
    } = usePaginationState<CategoryPreview>();
    
    const selectedParentOrDefault : CategoryPreview|null = (
        parentCategories.at(-1)
        ??
        (rootData ? Object.values(rootData.entities)?.[0] : null)
        ??
        null
    );
    
    
    
    // jsx:
    if (!selectedParentOrDefault) return null;
    return (
        <CategoryExplorerSubInternal rootCategory={selectedParentOrDefault} />
    );
}
const CategoryExplorerSubInternal = ({rootCategory}: {rootCategory: CategoryPreview}): JSX.Element|null => {
    // styles:
    const styleSheet = useCategoryFullMenuStyleSheet();
    
    
    
    // hooks:
    const _useGetSubCategoryPage = useUseGetSubCategoryPage(rootCategory.id);
    
    
    
    // states:
    const {
        // states:
        parentCategories,
        setParentCategories,
    } = useCategoryMenuState();
    
    
    
    // handlers:
    const handleBack = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        setParentCategories((draft) => {
            // conditions:
            if (!draft.length) return; // the root category is not yet selected or loaded => ignore
            
            
            
            // actions:
            draft.pop();
        });
    });
    const handleSelect = useEvent<EditorChangeEventHandler<CategoryPreview>>((model) => {
        setParentCategories((draft) => {
            // conditions:
            if (!draft.length) return; // the root category is not yet selected or loaded => ignore
            
            
            
            // actions:
            draft.push(model);
        });
    });
    
    
    
    // jsx:
    return (
        <PaginationStateProvider<CategoryPreview>
            // states:
            initialPerPage={10}
            
            
            
            // data:
            useGetModelPage={_useGetSubCategoryPage}
        >
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
                listComponent={<List listStyle='flat' mild={false} />}
                modelPreviewComponent={
                    <CategoryView
                        // data:
                        model={undefined as any}
                        
                        
                        
                        // handlers:
                        onModelSelect={handleSelect}
                    />
                }
                
                
                
                // components:
                galleryComponent={<Generic className='flat' />}
            />
        </PaginationStateProvider>
    );
};



interface CategoryExplorerBaseProps
    extends
        // bases:
        Omit<(PaginationListProps<CategoryPreview> & PaginationGalleryProps<CategoryPreview>),
            // accessibilities:
            |'createItemText'
            
            // components:
            |'modelCreateComponent'
            |'modelPreviewComponent'
            |'moreButtonComponent'
            
            // handlers:
            |'onModelCreate'
        >,
        Partial<Pick<(PaginationListProps<CategoryPreview> & PaginationGalleryProps<CategoryPreview>),
            |'modelPreviewComponent'
        >>
{
    // components:
    paginationBaseComponent : React.ReactComponentElement<any, (PaginationListProps<CategoryPreview> | PaginationGalleryProps<CategoryPreview>)>
}
const CategoryExplorerBase = (props: CategoryExplorerBaseProps): JSX.Element|null => {
    // props:
    const {
        // components:
        paginationBaseComponent,
        
        
        
        // other props:
        ...restCategoryExplorerBaseProps
    } = props;
    
    
    
    // default props:
    const {
        // appearances:
        showPaginationTop     = false,
        autoHidePagination    = true,
        
        
        
        // accessibilities:
        textEmpty             = 'Collection is empty',
        
        
        
        // components:
        bodyComponent         = (<Basic nude={true} theme='inherit' mild='inherit' /> as React.ReactComponentElement<any, BasicProps<Element>>),
        listComponent         = (<List listStyle='flat' />                            as React.ReactComponentElement<any, ListProps<Element>>),
        modelPreviewComponent = (<CategoryView
            // data:
            model={undefined as any}
        />                                                                            as React.ReactComponentElement<any, CategoryViewProps>),
        
        
        
        // other props:
        ...restPaginationBaseProps
    } = restCategoryExplorerBaseProps;
    
    
    
    // jsx:
    return (
        React.cloneElement<(PaginationListProps<CategoryPreview> | PaginationGalleryProps<CategoryPreview>)>(paginationBaseComponent,
            // props:
            {
                // other props:
                ...restPaginationBaseProps,
                
                
                
                // appearances:
                showPaginationTop,
                autoHidePagination,
                
                
                
                // accessibilities:
                textEmpty,
                
                
                
                // components:
                bodyComponent,
                listComponent,
                modelPreviewComponent,
            },
        )
    );
};

interface CategoryExplorerListProps
    extends
        // bases:
        Omit<CategoryExplorerBaseProps,
            // components:
            |'paginationBaseComponent'
        >,
        Omit<PaginationListProps<CategoryPreview>,
            // components:
            |'modelPreviewComponent'
        >
{
}
const CategoryExplorerList = (props: CategoryExplorerListProps): JSX.Element|null => {
     // jsx:
    return (
        <CategoryExplorerBase
            // other props:
            {...props}
            
            
            
            // components:
            paginationBaseComponent={
                <PaginationList<CategoryPreview>
                    modelPreviewComponent={undefined as any}
                />
            }
        />
    );
};

interface CategoryExplorerGalleryProps
    extends
        // bases:
        Omit<CategoryExplorerBaseProps,
            // components:
            |'paginationBaseComponent'
        >,
        Omit<PaginationGalleryProps<CategoryPreview>,
            // components:
            |'modelPreviewComponent'
        >
{
}
const CategoryExplorerGallery = (props: CategoryExplorerGalleryProps): JSX.Element|null => {
     // jsx:
    return (
        <CategoryExplorerBase
            // other props:
            {...props}
            
            
            
            // components:
            paginationBaseComponent={
                <PaginationGallery<CategoryPreview>
                    modelPreviewComponent={undefined as any}
                />
            }
        />
    );
};

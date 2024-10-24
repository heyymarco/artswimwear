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
    type PaginationStateProps,
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
    useGetCategoryPage as _useGetCategoryPage,
}                           from '@/store/features/api/apiSlice'

// models:
import {
    // types:
    type PaginationArgs,
    type CategoryPreview,
}                           from '@/models'

// internals:
import {
    // types:
    type ParentCategoryInfo,
    
    
    
    // states:
    useCategoryMenuState,
    
    
    
    // react components:
    CategoryMenuStateProvider,
}                           from './states/categoryMenuState'



// configs:
const categoriesPath = '/categories';
const rootPerPage    = 3;
const subPerPage     = 3;



// hooks:
const useGetRootCategoryPage = (arg: PaginationArgs) => {
    return useGetCategoryPage({
        ...arg,
        parent : null,
    });
};
const useUseGetSubCategoryPage = (parentCategory: string) => {
    return (arg: PaginationArgs) => {
        return _useGetCategoryPage({
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
    const [parentCategories, setParentCategories] = useImmer<ParentCategoryInfo[]>([]);
    
    
    
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
    const prevParentCategoriesRef = useRef<ParentCategoryInfo[]>(parentCategories);
    useEffect(() => {
        // conditions:
        if (prevParentCategoriesRef.current === parentCategories) return; // already the same => ignore
        const prevParentCategories = prevParentCategoriesRef.current;
        prevParentCategoriesRef.current = parentCategories;               // sync
        if (!parentCategories.length) return; // the root category is not yet selected or loaded => ignore
        
        
        
        // actions:
        const oldPathname = `${categoriesPath}/${prevParentCategories.map(({category: {path}}) => path).join('/')}`;
        const newPathname = `${categoriesPath}/${parentCategories.map(({category: {path}}) => path).join('/')}`;
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
                router.push(newPathname, { scroll: false }); // intercept the url
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
    
    const selectedRootOrDefault : ParentCategoryInfo|null = (
        // the first selected category is the selected_root_category:
        parentCategories.at(0)
        
        ??
        
        // the first item in data is the default selected_root_category:
        (() : ParentCategoryInfo|null => {
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
    }, [parentCategories, selectedRootOrDefault]);
    
    
    
    // handlers:
    const handleSelect = useEvent<EditorChangeEventHandler<CategoryPreview>>((model) => {
        setParentCategories([{ category: model, index: 0 }]); // set the selected root category
    });
    
    
    
    // jsx:
    return (
        <CategoryExplorerList
            // components:
            listComponent={<List listStyle='flat' />}
            modelPreviewComponent={
                <CategoryView
                    // data:
                    model={undefined as any}
                    
                    
                    
                    // handlers:
                    selectedModel={selectedRootOrDefault?.category ?? null}
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
    
    const selectedParentOrDefault : ParentCategoryInfo|null = (
        // the last selected category is the displayed_category's_parent:
        parentCategories.at(-1)
        
        ??
        
        // the first item in data is the default displayed_category's_parent:
        (() : ParentCategoryInfo|null => {
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
            initialPage={selectedParentOrDefault.index % subPerPage}
        />
    );
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
    const styleSheet = useCategoryFullMenuStyleSheet();
    
    
    
    // states:
    const {
        // states:
        parentCategories,
        setParentCategories,
    } = useCategoryMenuState();
    
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
            draft.pop();
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
        </>
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

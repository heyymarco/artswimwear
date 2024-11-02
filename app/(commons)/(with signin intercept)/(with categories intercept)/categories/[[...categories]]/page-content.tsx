'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useCategoryListPageStyleSheet,
}                           from './styles/loader'

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // composite-components:
    NavItem,
    Nav,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    WideGalleryPage,
}                           from '@/components/pages/WideGalleryPage'
import {
    PageLoading,
}                           from '@/components/PageLoading'
import {
    PageError,
}                           from '@/components/PageError'
import {
    PaginationStateProvider,
    usePaginationState,
}                           from '@/components/explorers/Pagination'
import {
    PaginationGallery,
}                           from '@/components/explorers/PaginationGallery'
import {
    ProductCard,
}                           from '@/components/views/ProductCard'

// private components:
import {
    UninterceptedLink,
}                           from './UninterceptedLink'

// models:
import {
    // types:
    type PaginationArgs,
    
    type ProductPreview,
    type CategoryPreview,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetProductPage as _useGetProductPage,
    useGetCategoryDetail,
}                           from '@/store/features/api/apiSlice'

// states:
import {
    usePageInterceptState,
}                           from '@/states/pageInterceptState'



// hooks:
const useUseGetProductPageOfCategory = (categoryPath: string[]|undefined) => {
    return (arg: PaginationArgs) => {
        return _useGetProductPage({
            ...arg,
            categoryPath,
        });
    };
};



// react components:
export function CategoryPageContent({ categories: categoriesRaw }: { categories?: string[] }): JSX.Element|null {
    // states:
    const {
        originPathname,
    } = usePageInterceptState();
    const categories = (
        originPathname
        ? ((): string[]|undefined => {
            let tailPathname = originPathname.slice('/categories'.length);
            if (tailPathname[0] === '/') tailPathname = tailPathname.slice(1);
            const categories = !tailPathname ? undefined : tailPathname.split('/');
            return categories;
        })()
        : categoriesRaw
    );
    
    
    
    // stores:
    const _useGetProductPageOfCategory = useUseGetProductPageOfCategory(categories);
    
    
    
    // jsx:
    return (
        <PaginationStateProvider<ProductPreview>
            // data:
            useGetModelPage={_useGetProductPageOfCategory}
        >
            { !categories?.length && <CategoryPageContentHome />}
            {!!categories?.length && <CategoryPageContentSub categories={categories} />}
        </PaginationStateProvider>
    );
}
function CategoryPageContentHome(): JSX.Element|null {
    // jsx:
    return (
        <CategoryPageContentInternal />
    );
}
function CategoryPageContentSub({ categories }: { categories: string[] }): JSX.Element|null {
    // stores:
    const { data: categoryDetail } = useGetCategoryDetail(categories);
    const parentsAndSelf : Omit<CategoryPreview, 'image'|'hasSubcategories'>[] = !categoryDetail ? [] : [
        ...(categoryDetail.parents.toReversed().map(({category}) => category) ?? []),
        categoryDetail,
    ];
    
    
    
    // jsx:
    return (
        <CategoryPageContentInternal
            // data:
            parentsAndSelf={parentsAndSelf}
        />
    );
}
function CategoryPageContentInternal({ parentsAndSelf = [] }: { parentsAndSelf?: Omit<CategoryPreview, 'image'|'hasSubcategories'>[] }): JSX.Element|null {
    // styles:
    const styleSheet = useCategoryListPageStyleSheet();
    
    
    
    // stores:
    const {
        data,
        isLoading: isLoadingAndNoData,
        isError,
        refetch,
    } = usePaginationState<ProductPreview>();
    const isErrorAndNoData = isError && !data;
    
    
    
    // jsx:
    if (isLoadingAndNoData) return <PageLoading />;
    if (isErrorAndNoData  ) return <PageError onRetry={refetch} />;
    return (
        <WideGalleryPage theme='primary'>
            <Section
                // classes:
                className={styleSheet.nav}
            >
                <Nav
                    // variants:
                    listStyle='breadcrumb'
                    orientation='inline'
                >
                    <NavItem active={!parentsAndSelf.length}>
                        <UninterceptedLink href='/categories' uninterceptedHref='/_/categories' prefetch={true}>
                            All products
                        </UninterceptedLink>
                    </NavItem>
                    
                    {parentsAndSelf.map(({ name }, index, array) => {
                        const categoryHref = `/categories/${array.slice(0, index + 1).map(({path}) => path).join('/')}`;
                        return (
                            <NavItem
                                // identifiers:
                                key={index}
                                
                                
                                
                                // states:
                                active={index === (array.length - 1)}
                            >
                                <UninterceptedLink href={categoryHref} uninterceptedHref={`/_${categoryHref}`} prefetch={true}>
                                    {name}
                                </UninterceptedLink>
                            </NavItem>
                        );
                    })}
                </Nav>
            </Section>
            
            <Section
                // classes:
                className={styleSheet.gallery}
            >
                <PaginationGallery<ProductPreview>
                    // appearances:
                    autoHidePagination={true}
                    
                    
                    
                    // accessibilities:
                    textEmpty='The product collection is empty'
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Basic nude={true} />
                    }
                    modelPreviewComponent={
                        <ProductCard
                            // data:
                            model={undefined as any}
                        />
                    }
                />
            </Section>
        </WideGalleryPage>
    );
}

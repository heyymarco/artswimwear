'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // composite-components:
    NavItem,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
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
    EmptyProductCard,
}                           from '@/components/views/ProductCard'
import {
    ProductGalleryPage,
}                           from '@/components/views/ProductGalleryPage'

// private components:
import {
    UninterceptedLink,
}                           from './UninterceptedLink'
import {
    NavItemWithPrefetch,
}                           from './NavItemWithPrefetch'

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
    useInterceptingRouter,
}                           from '@/navigations/interceptingRouter'



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
    } = useInterceptingRouter();
    const categories = (
        originPathname
        
        // when in intercepting pathname, extract the categories info from `originPathname`:
        ? ((): string[]|undefined => {
            let tailPathname = originPathname.slice('/categories'.length);
            if (tailPathname[0] === '/') tailPathname = tailPathname.slice(1);
            const categories = !tailPathname ? undefined : tailPathname.split('/');
            return categories;
        })()
        
        // when in normal pathname, extract the categories info from `props.categories`:
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
        <ProductGalleryPage
            // children:
            navItems={
                <>
                    <NavItem active={false}>
                        <Link href='/' prefetch={true}>
                            Home
                        </Link>
                    </NavItem>
                    
                    <NavItemWithPrefetch categoryPath={null} active={!parentsAndSelf.length}>
                        <UninterceptedLink href='/categories' uninterceptedHref='/_/categories' prefetch={true}>
                            All Products
                        </UninterceptedLink>
                    </NavItemWithPrefetch>
                    
                    {parentsAndSelf.map(({ name }, index, array) => {
                        const categoryHref = `/categories/${array.slice(0, index + 1).map(({path}) => path).join('/')}`;
                        return (
                            <NavItemWithPrefetch
                                // identifiers:
                                key={index}
                                
                                
                                
                                // data:
                                categoryPath={array.slice(0, index + 1).map(({path}) => path)}
                                
                                
                                
                                // states:
                                active={index === (array.length - 1)}
                            >
                                <UninterceptedLink href={categoryHref} uninterceptedHref={`/_${categoryHref}`} prefetch={true}>
                                    {name}
                                </UninterceptedLink>
                            </NavItemWithPrefetch>
                        );
                    })}
                </>
            }
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
                modelEmptyComponent={
                    <EmptyProductCard
                        // accessibilities:
                        emptyText='There are no products on this category.'
                    />
                }
                modelPreviewComponent={
                    <ProductCard
                        // data:
                        model={undefined as any}
                    />
                }
            />
        </ProductGalleryPage>
    );
}

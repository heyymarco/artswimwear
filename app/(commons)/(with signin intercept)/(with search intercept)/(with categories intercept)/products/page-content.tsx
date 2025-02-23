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

// models:
import {
    // types:
    type ProductPreview,
    
    
    
    // defaults:
    defaultProductPerPage,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetProductPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export function ProductPageContent(): JSX.Element|null {
    // jsx:
    return (
        <PaginationStateProvider<ProductPreview>
            // data:
            useGetModelPage={useGetProductPage}
            
            
            
            // states:
            initialPerPage={defaultProductPerPage}
        >
            <ProductPageContentInternal />
        </PaginationStateProvider>
    );
}
function ProductPageContentInternal(): JSX.Element|null {
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
                    
                    <NavItem active={true}>
                        <Link href='/products' prefetch={true}>
                            All Products
                        </Link>
                    </NavItem>
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
                        emptyText='There are no products.'
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

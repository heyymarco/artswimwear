'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useProductListPageStyleSheet,
}                           from './styles/loader'

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // composite-components:
    NavItem,
    Nav,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

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
    EmptyProductCard,
}                           from '@/components/views/ProductCard'

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
    // styles:
    const styleSheet = useProductListPageStyleSheet();
    
    
    
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
                    <NavItem active={false}>
                        <Link href='/' prefetch={true}>
                            Home
                        </Link>
                    </NavItem>
                    
                    <NavItem active={true}>
                        <Link href='/products' prefetch={true}>
                            Products
                        </Link>
                    </NavItem>
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
                    modelEmptyComponent={
                        <EmptyProductCard />
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

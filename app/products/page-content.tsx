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

// heymarco components:
import {
    GenericSection,
    Main,
}                           from '@heymarco/section'

// internal components:
import {
    LoadingBlankPage,
    ErrorBlankPage,
}                           from '@/components/BlankPage'
import {
    ProductCard,
}                           from '@/components/views/ProductCard'

// stores:
import {
    // hooks:
    useGetProductList,
}                           from '@/store/features/api/apiSlice'



// react components:
export function ProductListPageContent(): JSX.Element|null {
    // styles:
    const styleSheet = useProductListPageStyleSheet();
    
    
    
    // apis:
    const {data: productList, isLoading: isProductLoading, isError: isProductError, refetch} = useGetProductList();
    
    const isPageLoading = isProductLoading;
    const hasData       = (!!productList);
    const isPageError   = (!isPageLoading && (isProductError)) || !hasData /* considered as error if no data */;
    // const isPageReady   = !isPageLoading && !isPageError;
    
    
    
    // jsx:
    if (isPageLoading) return (
        <LoadingBlankPage
            // identifiers:
            key='busy' // avoids re-creating a similar dom during loading transition in different components
        />
    );
    if (isPageError)   return (
        <ErrorBlankPage
            // handlers:
            onRetry={refetch}
        />
    );
    return (
        <Main
            // classes:
            className={styleSheet.main}
        >
            <GenericSection
                // classes:
                className={styleSheet.list}
            >
                {
                    Object.values(productList.entities)
                    .filter((product): product is Exclude<typeof product, undefined> => !!product)
                    .map((product) =>
                        <ProductCard
                            // identifiers:
                            key={product.id}
                            
                            
                            
                            // data:
                            model={product}
                        />
                    )
                }
            </GenericSection>
        </Main>
    );
}

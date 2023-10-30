'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

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

// private components:
import {
    ProductItem,
}                           from './ProductItem'

// stores:
import {
    // hooks:
    useGetProductList,
}                           from '@/store/features/api/apiSlice'



// styles:
const useProductListPageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./page-styles')
, { id: 'mfvzha989y' });
import './page-styles';



// react components:
export function ProductListPageContent(): JSX.Element|null {
    // styles:
    const styleSheet = useProductListPageStyleSheet();
    
    
    
    // apis:
    const {data: productList, isLoading: isProductLoading, isError: isProductError, refetch} = useGetProductList();
    
    const isPageLoading = isProductLoading;
    const isPageError   = isProductError || !productList;
    // const hasData       = (!!productList);
    // const isPageReady   = !isPageLoading && !isPageError && hasData;
    
    
    
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
                    Object.values(productList?.entities)
                    .filter((product): product is Exclude<typeof product, undefined> => !!product)
                    .map((product) =>
                        <ProductItem
                            // identifiers:
                            key={product.id}
                            
                            
                            
                            // data:
                            product={product}
                        />
                    )
                }
            </GenericSection>
        </Main>
    );
}

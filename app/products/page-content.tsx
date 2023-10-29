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
    const {data: productList, isLoading: isLoadingProduct, isError: isErrorProduct, refetch} = useGetProductList();
    
    const isLoadingPage = isLoadingProduct;
    const isErrorPage   = isErrorProduct || !productList;
    // const isReadyPage   = !isLoadingPage && !isErrorPage;
    
    
    
    // jsx:
    if (isLoadingPage) return (
        <LoadingBlankPage />
    );
    if (isErrorPage)   return (
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

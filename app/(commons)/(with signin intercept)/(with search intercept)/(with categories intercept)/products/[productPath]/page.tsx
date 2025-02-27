// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import type {
    Metadata,
    ResolvingMetadata,
}                           from 'next'

// private components:
import {
    ProductDetailPageContent,
}                           from './page-content'

// stores:
import {
    store,
}                           from '@/store/store'
import {
    apiSlice,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    PAGE_PRODUCT_TITLE,
    PAGE_PRODUCT_DESCRIPTION,
}                           from '@/website.config'



// configs:
export const fetchCache = 'force-cache';
export const revalidate = false; // never expired



interface MetadataProps {
    params : { productPath: string }
}

export async function generateMetadata(props: MetadataProps, parent: ResolvingMetadata): Promise<Metadata> {
    // read route params
    const productPath = props.params.productPath;
    try {
        const product = await store.dispatch(apiSlice.endpoints.getProductDetail.initiate(productPath)).unwrap();
        return {
            title       : PAGE_PRODUCT_TITLE.replace('{{TheProductName}}', product?.name ?? ''),
            description : PAGE_PRODUCT_DESCRIPTION.replace('{{TheProductExcerpt}}', product?.excerpt ?? ''),
            keywords    : product.keywords,
        };
    }
    catch (error: any) {
        console.log({error});
        throw error;
    } // try
}



// react components:
export default function ProductDetailPage({ params: { productPath } }: { params: { productPath: string } }): JSX.Element|null {
    // jsx:
    return (
        <ProductDetailPageContent
            // params:
            productPath={productPath}
        />
    );
}

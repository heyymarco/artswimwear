import Head from 'next/head'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.scss'

import { GenericSection, Main } from '@heymarco/section'
import { Busy } from '@reusable-ui/components'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'
import { ProductPreview, useGetProductList, usePrefetchProductDetail } from '@/store/features/api/apiSlice'
import { formatCurrency } from '@/libs/formatters'
import { Image } from '@heymarco/image'
import Link from 'next/link'
import { PAGE_PRODUCTS_TITLE, PAGE_PRODUCTS_DESCRIPTION } from '@/website.config'
import { resolveMediaUrl } from '@/libs/mediaStorage.client'
import { useEffect, useRef } from 'react'



// const inter = Inter({ subsets: ['latin'] })
const useProductListStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'@/styles/productList')
, { id: 'prod-list' });



interface ProductItemProps {
    product : ProductPreview
}
const ProductItem = ({product}: ProductItemProps) => {
    const articleRef = useRef<HTMLDivElement|null>(null);
    const prefetchProductDetail = usePrefetchProductDetail();
    useEffect(() => {
        const articleElm = articleRef.current;
        if (!articleElm) return;
        
        
        
        const observer = new IntersectionObserver((entries) => {
            if (!entries[0]?.isIntersecting) return;
            
            
            
            observer.disconnect();
            prefetchProductDetail(product.path);
        }, {
            root      : null, // defaults to the browser viewport
            threshold : 0.5,
        });
        observer.observe(articleElm);
        
        
        
        return () => {
            observer.disconnect();
        };
    }, []);
    
    
    
    // jsx:
    return (
        <article ref={articleRef} key={product.id}>
            <Image
                className='prodImg'
                
                alt={product.name ?? ''}
                src={resolveMediaUrl(product.image)}
                sizes='414px'
            />
            <header>
                <h2 className='name h6'>
                    {product.name}
                </h2>
                <span className='price h6'>
                    {formatCurrency(product.price)}
                </span>
            </header>
            <Link href={`/products/${product.path}`} />
        </article>
    );
}
export default function ProductList() {
    const styles = useProductListStyleSheet();
    const {data: productList, isLoading, isError} = useGetProductList();
    return (
        <>
            <Head>
                <title>{PAGE_PRODUCTS_TITLE}</title>
                <meta name='description' content={PAGE_PRODUCTS_DESCRIPTION} />
            </Head>
            <Main nude={true}>
                <GenericSection className={`${styles.list} ${(isLoading || isError || !productList) ? 'loading' : ''}`} theme='secondary'>
                    {
                        isLoading
                        ? <Busy theme='primary' size='lg' />
                        : (isError || !productList)
                        ? <p>Oops, an error occured!</p>
                        : Object.values(productList?.entities).filter((product): product is Exclude<typeof product, undefined> => !!product).map((product) =>
                            <ProductItem key={product.id} product={product} />
                        )
                    }
                </GenericSection>
            </Main>
        </>
    )
}

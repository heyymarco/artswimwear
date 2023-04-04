import Head from 'next/head'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.scss'

import { GenericSection, Main } from '@heymarco/section'
import { Busy } from '@reusable-ui/components'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'
import { useGetProductList } from '@/store/features/api/apiSlice'
import { formatCurrency } from '@/libs/formatters'
import { Image } from '@heymarco/image'
import Link from 'next/link'
import { PAGE_PRODUCTS_TITLE, PAGE_PRODUCTS_DESCRIPTION } from '@/website.config'



// const inter = Inter({ subsets: ['latin'] })
const useProductListStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'@/styles/productList')
, { id: 'prod-list' });



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
                            <article key={product._id}>
                                <Image
                                    className='prodImg'
                                    
                                    alt={product.name ?? ''}
                                    src={product.image ? `/products/${product.name}/${product.image}` : undefined}
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
                        )
                    }
                </GenericSection>
            </Main>
        </>
    )
}

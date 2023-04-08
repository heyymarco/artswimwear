import Head from 'next/head'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.scss'

import { Section, Main } from '@heymarco/section'

import { Busy, ButtonIcon, Carousel, Nav, NavItem } from '@reusable-ui/components'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'
import { useGetProductDetail } from '@/store/features/api/apiSlice'
import { formatCurrency } from '@/libs/formatters'
import { Image } from '@heymarco/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { useState } from 'react'
import { addToCart } from '@/store/features/cart/cartSlice'
import { useDispatch } from 'react-redux'
import { QuantityInput } from '@heymarco/quantity-input'
import { PAGE_PRODUCT_TITLE, PAGE_PRODUCT_DESCRIPTION } from '@/website.config'



// const inter = Inter({ subsets: ['latin'] })
const useProductDetailStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'@/styles/productDetail')
, { id: 'prod-dtl' });



export default function ProductDetail() {
    const styles = useProductDetailStyleSheet();
    const router = useRouter();
    const {data: product, isLoading, isError} = useGetProductDetail(router.query.productPath as any ?? '');
    const [addProductQty, setAddProductQty] = useState(1);
    const dispatch = useDispatch();
    
    
    
    return (
        <>
            <Head>
                <title>{PAGE_PRODUCT_TITLE.replace('{{TheProductName}}', product?.name ?? '')}</title>
                <meta name='description' content={PAGE_PRODUCT_DESCRIPTION.replace('{{TheProductExcerpt}}', product?.excerpt ?? product?.description ?? '')} />
            </Head>
            <Main nude={true}>
                <Section className={`${styles.prodDtl} ${(isLoading || isError || !product) ? 'loading' : ''}`} theme='secondary'>
                    {
                        isLoading
                        ? <Busy theme='primary' size='lg' />
                        : (isError || !product)
                        ? <p>Oops, an error occured!</p>
                        : <>
                            <section className='nav'>
                                <Nav orientation='inline' theme='primary' listStyle='breadcrumb'>
                                    <NavItem end><Link href='/'>Home</Link></NavItem>
                                    <NavItem end><Link href='/products'>Products</Link></NavItem>
                                    {!!product.path && <NavItem end><Link href={`/products/${product.path}`} >{product.name}</Link></NavItem>}
                                </Nav>
                            </section>
                            <section className='images'>
                                <Carousel className='slides' size='lg' theme='primary'>
                                    {product.images?.map((img: string, index: number) =>
                                        <Image
                                            key={index}
                                            
                                            alt={`image #${index + 1} of ${product.name}`}
                                            src={`/products/${product.name}/${img}`}
                                            sizes='100vw'
                                            
                                            priority={true}
                                        />
                                    )}
                                </Carousel>
                            </section>
                            <section className='addToCart'>
                                <h1 className='name h4'>
                                    {product.name}
                                </h1>
                                <span className='price h5'>
                                    {formatCurrency(product.price)}
                                </span>
                                <p style={{marginBlockEnd: 0}}>
                                    Quantity:
                                </p>
                                <QuantityInput theme='primary' className='ctrlQty' min={1} value={addProductQty} onChange={(event) => setAddProductQty(event.target.valueAsNumber)} />
                                <p>
                                    <ButtonIcon icon='add_shopping_cart' size='lg' gradient={true} theme='primary' className='ctrlAction' onClick={() => dispatch(addToCart({productId: product._id, quantity: addProductQty}))}>Add to cart</ButtonIcon>
                                </p>
                            </section>
                            {!!product.description && <section className='desc'>
                                <ReactMarkdown>
                                    {product.description}
                                </ReactMarkdown>
                            </section>}
                        </>
                    }
                </Section>
            </Main>
        </>
    )
}

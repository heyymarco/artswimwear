'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    
    
    
    // status-components:
    Busy,
    
    
    
    // composite-components:
    NavItem,
    Nav,
    Carousel,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// heymarco components:
import {
    Section,
    Main,
}                           from '@heymarco/section'
import {
    Image,
}                           from '@heymarco/image'
import {
    QuantityInput,
}                           from '@heymarco/quantity-input'

// internal components:
import {
    WysiwygEditorState,
    WysiwygViewer,
}                           from '@/components/WysiwygEditor'

// internals:
import {
    useCartState,
}                           from '@/components/Cart/states/cartState'

// stores:
import {
    useGetProductDetail,
}                           from '@/store/features/api/apiSlice'

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



const useProductDetailStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'ihi965eoyu' });
import './pageStyles';



// react components:
export function ProductDetailPageContent({ productPath }: { productPath: string }) {
    // styles:
    const styles = useProductDetailStyleSheet();
    
    
    
    // states:
    const {
        // actions:
        addProductToCart,
    } = useCartState();
    
    const [addProductQty, setAddProductQty] = useState(1);
    
    
    
    // apis:
    const {data: productDetail, isLoading: isLoadingProduct, isError: isErrorProduct} = useGetProductDetail(productPath as any ?? '');
    
    const isLoadingPage =                    isLoadingProduct;
    const isErrorPage   = !isLoadingPage && (isErrorProduct);
    const isReadyPage   = !isLoadingPage && (!!productDetail);
    
    
    
    // handlers:
    const handleQuantityChange = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {valueAsNumber}}) => {
        setAddProductQty(valueAsNumber);
    });
    const handleBuyButtonClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        // conditions:
        if (!isReadyPage) return; // the page is not fully loaded => ignore
        
        
        
        // actions:
        addProductToCart(productDetail.id, addProductQty);
    });
    
    
    
    // jsx:
    return (
        <Main nude={true}>
            <Section
                // variants:
                theme='secondary'
                
                
                
                // classes:
                className={`${styles.prodDtl} ${(isLoadingPage || isErrorPage || !productDetail) ? 'loading' : ''}`}
            >
                {
                    isLoadingPage
                    ? <Busy theme='primary' size='lg' />
                    : (isErrorPage || !productDetail)
                    ? <p>Oops, an error occured!</p>
                    : <>
                        <section
                            // classes:
                            className='nav'
                        >
                            <Nav
                                // variants:
                                theme='primary'
                                listStyle='breadcrumb'
                                orientation='inline'
                            >
                                <NavItem end>
                                    <Link href='/'>
                                        Home
                                    </Link>
                                </NavItem>
                                
                                <NavItem end>
                                    <Link href='/products'>
                                        Products
                                    </Link>
                                </NavItem>
                                
                                {!!productDetail.path && <NavItem end>
                                    <Link href={`/products/${productDetail.path}`} >
                                        {productDetail.name}
                                    </Link>
                                </NavItem>}
                            </Nav>
                        </section>
                        <section
                            // classes:
                            className='images'
                        >
                            <Carousel
                                // variants:
                                size='lg'
                                theme='primary'
                                
                                
                                
                                // classes:
                                className='slides'
                            >
                                {productDetail.images?.map((image: string, index: number) =>
                                    <Image
                                        // identifiers:
                                        key={index}
                                        
                                        
                                        
                                        // appearances:
                                        alt={`image #${index + 1} of ${productDetail.name}`}
                                        src={resolveMediaUrl(image)}
                                        sizes='100vw'
                                        
                                        priority={true}
                                    />
                                )}
                            </Carousel>
                        </section>
                        <section
                            // classes:
                            className='addToCart'
                        >
                            <h1
                                // classes:
                                className='name h4'
                            >
                                {productDetail.name}
                            </h1>
                            <span
                                // classes:
                                className='price h5'
                            >
                                {formatCurrency(productDetail.price)}
                            </span>
                            
                            <p style={{marginBlockEnd: 0}}>
                                Quantity:
                            </p>
                            <QuantityInput
                                // variants:
                                theme='primary'
                                
                                
                                
                                // classes:
                                className='ctrlQty'
                                
                                
                                
                                // values:
                                value={addProductQty}
                                
                                
                                
                                // validations:
                                min={1}
                                max={99}
                                
                                
                                
                                // handlers:
                                onChange={handleQuantityChange}
                            />
                            
                            <p>
                                <ButtonIcon
                                    // appearances:
                                    icon='add_shopping_cart'
                                    
                                    
                                    
                                    // variants:
                                    size='lg'
                                    theme='primary'
                                    gradient={true}
                                    
                                    
                                    
                                    // classes:
                                    className='ctrlAction'
                                    
                                    
                                    
                                    // handlers:
                                    onClick={handleBuyButtonClick}
                                >
                                    Add to cart
                                </ButtonIcon>
                            </p>
                        </section>
                        
                        {!!productDetail.description && <WysiwygViewer
                            // classes:
                            className='desc'
                            
                            
                            
                            // values:
                            value={(productDetail.description ?? undefined) as unknown as WysiwygEditorState|undefined}
                        />}
                    </>
                }
            </Section>
        </Main>
    );
}

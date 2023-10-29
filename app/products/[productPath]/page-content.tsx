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
    LoadingBlankPage,
    ErrorBlankPage,
}                           from '@/components/BlankPage'
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



// styles:
const useProductDetailPageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./page-styles')
, { id: 'ihi965eoyu' });
import './page-styles';



// react components:
export function ProductDetailPageContent({ productPath }: { productPath: string }): JSX.Element|null {
    // styles:
    const styleSheet = useProductDetailPageStyleSheet();
    
    
    
    // states:
    const {
        // actions:
        addProductToCart,
    } = useCartState();
    
    const [addProductQty, setAddProductQty] = useState(1);
    
    
    
    // apis:
    const {data: productDetail, isLoading: isLoadingProduct, isError: isErrorProduct} = useGetProductDetail(productPath as any ?? '');
    
    const isLoadingPage = isLoadingProduct;
    const isErrorPage   = isErrorProduct || !productDetail;
    const isReadyPage   = !isLoadingPage && !isErrorPage;
    
    
    
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
    if (isLoadingPage) return <LoadingBlankPage />;
    if (isErrorPage)   return <ErrorBlankPage />;
    return (
        <Main
            // classes:
            className={styleSheet.main}
        >
            <Section
                // classes:
                className={styleSheet.nav}
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
            </Section>
            
            <Section
                // classes:
                className={styleSheet.gallery}
            >
                <Carousel
                    // variants:
                    size='lg'
                    theme='primary'
                    
                    
                    
                    // classes:
                    className={styleSheet.slides}
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
            </Section>
            
            <Section
                // classes:
                className={styleSheet.actions}
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
                
                <p
                    // classes:
                    className={styleSheet.paraQty}
                >
                    Quantity:
                </p>
                <QuantityInput
                    // variants:
                    theme='primary'
                    
                    
                    
                    // classes:
                    className={styleSheet.ctrlQty}
                    
                    
                    
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
                        className={styleSheet.ctrlAction}
                        
                        
                        
                        // handlers:
                        onClick={handleBuyButtonClick}
                    >
                        Add to cart
                    </ButtonIcon>
                </p>
            </Section>
            
            {!!productDetail.description && <Section
                    // classes:
                    className={styleSheet.desc}
            >
                <WysiwygViewer
                    // variants:
                    nude={true}
                    
                    
                    
                    // values:
                    value={(productDetail.description ?? undefined) as unknown as WysiwygEditorState|undefined}
                />
            </Section>}
        </Main>
    );
}

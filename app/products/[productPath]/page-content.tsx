'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'
import {
    ImmerReducer,
    useImmerReducer,
}                           from 'use-immer'

// styles:
import {
    useProductDetailPageStyleSheet,
}                           from './styles/loader'

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
}                           from '@/components/editors/WysiwygEditor'
import {
    SelectVariantEditor,
}                           from '@/components/editors/SelectVariantEditor'

// internals:
import {
    useCartState,
}                           from '@/components/Cart/states/cartState'

// models:
import type {
    ProductVariantDetail,
    ProductVariantGroupDetail,
}                           from '@/models'

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



// utilities:
type ProductVariantsState = (ProductVariantDetail['id']|null)[];
type SetVariant  = { type: 'set' , payload: { groupIndex: number, productVariantId: ProductVariantDetail['id']|null } }
type InitVariant = { type: 'init', payload: ProductVariantGroupDetail[] }
const selectedProductVariantsReducer : ImmerReducer<ProductVariantsState, InitVariant|SetVariant> = (draftState, action) => {
    switch (action.type) {
        case 'init':
            return (
                action.payload
                .map(({productVariants}) =>
                    productVariants[0]?.id ?? null
                )
            );
            break;
        case 'set':
            draftState[action.payload.groupIndex]  = action.payload.productVariantId;
            break;
    } // switch
}
const selectedProductVariantsInitializer = (productVariantGroups: ProductVariantGroupDetail[]|undefined): ProductVariantsState => {
    if (!productVariantGroups?.length) return [];
    return (
        productVariantGroups
        .map(({productVariants}) =>
            productVariants[0]?.id ?? null
        )
    );
}



// react components:
export function ProductDetailPageContent({ productPath }: { productPath: string }): JSX.Element|null {
    // styles:
    const styleSheet = useProductDetailPageStyleSheet();
    
    
    
    // apis:
    const {data: productDetail, isLoading: isProductLoading, isError: isProductError, refetch} = useGetProductDetail(productPath as any ?? '');
    
    const isPageLoading = isProductLoading;
    const hasData       = (!!productDetail);
    const isPageError   = (!isPageLoading && (isProductError)) || !hasData /* considered as error if no data */;
    const isPageReady   = !isPageLoading && !isPageError;
    
    
    
    // states:
    const {
        // actions:
        addProductToCart,
    } = useCartState();
    
    const [productQty, setProductQty] = useState<number>(1);
    const [selectedProductVariants, setSelectedProductVariants] = useImmerReducer(selectedProductVariantsReducer, productDetail?.productVariantGroups, selectedProductVariantsInitializer);
    
    
    
    // handlers:
    const handleQuantityChange = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {valueAsNumber}}) => {
        setProductQty(valueAsNumber);
    });
    const handleBuyButtonClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        // conditions:
        if (!isPageReady) return; // the page is not fully loaded => ignore
        
        
        
        // actions:
        addProductToCart(productDetail.id, productQty);
    });
    
    
    
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
    if (!selectedProductVariants.length) {
        setSelectedProductVariants({
            type    : 'init',
            payload : productDetail.productVariantGroups,
        });
    } // if
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
                            sizes='266px' // ((25*16) - (1*2)) * (2/3) = 266
                            
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
                    className={styleSheet.label}
                >
                    Quantity:
                </p>
                <QuantityInput
                    // variants:
                    theme='primary'
                    
                    
                    
                    // classes:
                    className={styleSheet.ctrlQty}
                    
                    
                    
                    // values:
                    value={productQty}
                    
                    
                    
                    // validations:
                    min={1}
                    max={99}
                    
                    
                    
                    // handlers:
                    onChange={handleQuantityChange}
                />
                
                <p
                    // classes:
                    className={styleSheet.label}
                >
                    Select variant:
                </p>
                <div className={styleSheet.variants}>
                    {productDetail.productVariantGroups.map(({name, productVariants}, groupIndex) =>
                        <SelectVariantEditor
                            // identifiers:
                            key={groupIndex}
                            
                            
                            
                            // data:
                            models={productVariants}
                            
                            
                            
                            // variants:
                            theme='primary'
                            
                            
                            
                            // values:
                            nullable={false}
                            value={selectedProductVariants[groupIndex]}
                            onChange={(newValue) => setSelectedProductVariants({
                                type    : 'set',
                                payload : {
                                    groupIndex,
                                    productVariantId: newValue,
                                },
                            })}
                        />
                    )}
                </div>
                
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

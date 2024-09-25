'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
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
import {
    CurrencyDisplay,
}                           from '@/components/CurrencyDisplay'
import {
    ButtonWishOfId,
}                           from '@/components/buttons/ButtonWishOfId'

// internals:
import {
    useCartState,
}                           from '@/components/Cart/states/cartState'

// models:
import {
    type ProductDetail,
    type VariantDetail,
    
    type CartItemPreview,
}                           from '@/models'

// stores:
import {
    useGetProductDetail,
}                           from '@/store/features/api/apiSlice'

// utilities:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// utilities:
type VariantsState = (VariantDetail['id']|null)[];
type SetVariant  = { type: 'set' , payload: { groupIndex: number, variantId: VariantDetail['id']|null } }
interface InitVariantArg {
    productDetail : ProductDetail|undefined
    cartItems     : CartItemPreview[]
}
type InitVariant = { type: 'init', payload: InitVariantArg }
const selectedVariantsReducer : ImmerReducer<VariantsState|undefined, InitVariant|SetVariant> = (draftState, action) => {
    switch (action.type) {
        case 'init':
            return selectedVariantsInitializer(action.payload);
            break;
        case 'set':
            if (draftState === undefined) {
                const newDraftState : VariantsState = [];
                newDraftState[action.payload.groupIndex]  = action.payload.variantId;
                return newDraftState;
            } else {
                draftState[action.payload.groupIndex]  = action.payload.variantId;
            } // if
            break;
    } // switch
}
const selectedVariantsInitializer = (initVariantArg: InitVariantArg): VariantsState|undefined => {
    const {
        productDetail,
        cartItems,
    } = initVariantArg;
    
    
    
    const existingProductInCart = !productDetail ? undefined : (
        cartItems
        .findLast(({productId}) =>
            (productId === productDetail.id)
        )
    );
    if (existingProductInCart !== undefined) return existingProductInCart.variantIds;
    
    
    
    if (productDetail !== undefined) return productDetail.variantGroups.map(({variants}) =>
        variants[0]?.id ?? null
    );
    
    
    
    return undefined; // defaults to uninitialized
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
        // cart data:
        items: cartItems,
        
        
        
        // actions:
        addProductToCart,
        changeProductFromCart,
        showCart,
    } = useCartState();
    
    const [productQty, setProductQty] = useState<number>(1);
    const [selectedVariants, setSelectedVariants] = useImmerReducer(
        selectedVariantsReducer,
        { productDetail, cartItems },
        selectedVariantsInitializer
    );
    
    const existingItemInCart = (
        (
            !!productDetail
            &&
            (selectedVariants !== undefined)
            &&
            selectedVariants.every((selectedVariant): selectedVariant is Exclude<typeof selectedVariant, null> =>
                (selectedVariant !== null)
            )
        )
        ? (
            cartItems
            .findLast(({productId, variantIds}) =>
                (productId === productDetail.id)
                &&
                (variantIds.length === selectedVariants.length)
                &&
                variantIds.every((variantId) =>
                    selectedVariants.includes(variantId)
                )
            )
        )
        : undefined
    );
    const prevExistingItemInCart = useRef<CartItemPreview|undefined>(existingItemInCart);
    if (prevExistingItemInCart.current !== existingItemInCart) {
        prevExistingItemInCart.current = existingItemInCart; // track changes
        
        
        
        if (!existingItemInCart) {
            if (productQty !== 1) setProductQty(1); // reset
        } // if
    } // if
    
    
    
    // handlers:
    const handleQuantityChange = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {valueAsNumber: quantity}}) => {
        if (existingItemInCart) {
            changeProductFromCart(existingItemInCart.productId, existingItemInCart.variantIds, quantity);
        } else {
            setProductQty(quantity);
        } // if
    });
    const handleBuyButtonClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        // conditions:
        if (!isPageReady) return; // the page is not fully loaded => ignore
        if (selectedVariants === undefined) return; // variants state is not already initialized
        if (selectedVariants.some((selectedVariant) => (selectedVariant === null))) return; // a/some variants are not selected
        
        
        
        // actions:
        if (existingItemInCart) {
            showCart();
        } else {
            addProductToCart(productDetail.id, selectedVariants as string[], productQty);
            if (productQty !== 1) setProductQty(1); // reset
        } // if
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
    if (selectedVariants === undefined) {
        setSelectedVariants({
            type    : 'init',
            payload : { productDetail, cartItems },
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
                    <CurrencyDisplay amount={productDetail.price} />
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
                    value={!!existingItemInCart ? existingItemInCart.quantity : productQty}
                    
                    
                    
                    // validations:
                    min={1}
                    max={99}
                    
                    
                    
                    // handlers:
                    onChange={handleQuantityChange}
                />
                
                {(selectedVariants !== undefined) && (selectedVariants.length > 0) && <>
                    <p
                        // classes:
                        className={styleSheet.label}
                    >
                        Select variant:
                    </p>
                    <div className={styleSheet.variants}>
                        {productDetail.variantGroups.map(({name, variants}, groupIndex) =>
                            <SelectVariantEditor
                                // identifiers:
                                key={groupIndex}
                                
                                
                                
                                // data:
                                models={variants}
                                
                                
                                
                                // variants:
                                theme='primary'
                                
                                
                                
                                // values:
                                nullable={false}
                                value={selectedVariants[groupIndex]}
                                onChange={(newValue) => setSelectedVariants({
                                    type    : 'set',
                                    payload : {
                                        groupIndex,
                                        variantId: newValue,
                                    },
                                })}
                            />
                        )}
                    </div>
                </>}
                
                <p className={styleSheet.paraAction}>
                    <ButtonIcon
                        // appearances:
                        icon={!!existingItemInCart ? 'shopping_cart' : 'add_shopping_cart'}
                        
                        
                        
                        // variants:
                        size='lg'
                        theme={!!existingItemInCart ? 'success' : 'primary'}
                        gradient={!!existingItemInCart ? false : true}
                        
                        
                        
                        // handlers:
                        onClick={handleBuyButtonClick}
                    >
                        {!!existingItemInCart ? 'Already in Cart' : 'Add to Cart'}
                    </ButtonIcon>
                </p>
                <p className={styleSheet.paraAction}>
                    <ButtonWishOfId
                        // data:
                        productId={productDetail.id}
                        
                        
                        
                        // variants:
                        outlined={true}
                        buttonStyle='regular'
                    >
                        Wishlist
                    </ButtonWishOfId>
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

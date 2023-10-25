'use client'

import { default as React, useRef } from 'react'
import { ButtonIcon, CardBody, CardHeader, CloseButton, Group, List, ListItem, useDialogMessage } from '@reusable-ui/components'

import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, selectCartItems, setCartItemQuantity, showCart } from '@/store/features/cart/cartSlice'
import { QuantityInput } from '@heymarco/quantity-input'
import { useGetPriceList, useGetProductList } from '@/store/features/api/apiSlice'
import { LoadingBar } from '@heymarco/loading-bar'
import { formatCurrency } from '@/libs/formatters'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'
import { Image } from '@heymarco/image'
import { useRouter } from 'next/navigation'
import { resolveMediaUrl } from '@/libs/mediaStorage.client'
import { useMountedFlag } from '@reusable-ui/core'



export const useCartBarStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'@/styles/cartBar')
, { id: 'cart-bar' });



export const CartBarContent = () => {
    const styles = useCartBarStyleSheet();
    const cartItems   = useSelector(selectCartItems);
    const hasCart = !!cartItems.length;
    const dispatch = useDispatch();
    const {data: priceList, isLoading: isLoading1, isError: isError1} = useGetPriceList();
    const {data: productList, isLoading: isLoading2, isError: isError2} = useGetProductList();
    const isLoading = isLoading1 || isLoading2;
    const isError = isError1 || isError2;
    const isCartDataReady = hasCart && !!priceList && !!productList;
    const router = useRouter();
    
    
    
    const totalProductPrice = (isCartDataReady || undefined) && cartItems.reduce((accum, {productId, quantity}) => {
        const product = productList?.entities?.[productId];
        if (!product) return accum;
        const {price} = product;
        
        
        
        return accum + (price * quantity);
    }, 0);
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    const { showMessage } = useDialogMessage();
    const cartBodyRef     = useRef<HTMLElement|null>(null);
    const confirmAndDelete = async (productId: string): Promise<boolean> => {
        // conditions:
        if (
            (await showMessage<'yes'|'no'>({
                theme    : 'warning',
                size     : 'sm',
                title    : <h1>Delete Confirmation</h1>,
                message  : <p>
                    Are you sure to remove product:<br />
                    <strong>{productList?.entities?.[productId]?.name ?? 'UNKNOWN PRODUCT'}</strong><br />from the cart?
                </p>,
                options  : {
                    yes  : <ButtonIcon icon='check'          theme='primary'>Yes</ButtonIcon>,
                    no   : <ButtonIcon icon='not_interested' theme='secondary' autoFocus={true}>No</ButtonIcon>,
                },
                viewport : cartBodyRef,
            }))
            !==
            'yes'
        ) return false;
        if (!isMounted.current) return false; // the component was unloaded before awaiting returned => do nothing
        
        
        
        // actions:
        dispatch(removeFromCart({ productId }));
        return true;
    };
    
    
    
    return (
        <>
            <CardHeader>
                <h1 className={`h5 ${styles.cartListTitle}`}>
                    My Shopping Cart
                </h1>
                <CloseButton onClick={() => dispatch(showCart(false))} />
            </CardHeader>
            <CardBody className={styles.cartBody} elmRef={cartBodyRef}>
                <List className={styles.cartList} theme='secondary' mild={false}>
                    <ListItem className={styles.cartTitle} theme='primary'>Order List</ListItem>
                    
                    {!hasCart && <ListItem enabled={false}>--- the cart is empty ---</ListItem>}
                    
                    {hasCart && (isLoading || isError || !priceList || !productList) && <ListItem>
                        {isLoading && <LoadingBar theme='primary' />}
                        {isError && <p>Oops, an error occured!</p>}
                    </ListItem>}
                    
                    {isCartDataReady && cartItems.map(({productId, quantity}) => {
                        // fn props:
                        const product          = productList?.entities?.[productId];
                        const productUnitPrice = product?.price;
                        const isProductDeleted = !product;
                        
                        
                        
                        // jsx:
                        return (
                            <ListItem key={productId} className={styles.productPreview}
                                theme = {isProductDeleted ? 'danger' : undefined}
                                mild  = {isProductDeleted ?  false   : undefined}
                            >
                                <h2 className='title h6'>{product?.name}</h2>
                                <Image
                                    className='prodImg'
                                    
                                    alt={product?.name ?? ''}
                                    src={resolveMediaUrl(product?.image)}
                                    sizes='64px'
                                />
                                <Group
                                    // variants:
                                    size='sm'
                                    theme='primary'
                                    
                                    
                                    
                                    // classes:
                                    className='quantity'
                                    
                                    
                                    
                                    // accessibilities:
                                    title='Quantity'
                                >
                                    <ButtonIcon
                                        // appearances:
                                        icon='delete'
                                        
                                        
                                        
                                        // accessibilities:
                                        title='remove from cart'
                                        
                                        
                                        
                                        // handlers:
                                        onClick={() => confirmAndDelete(productId)}
                                    />
                                    <QuantityInput
                                        // accessibilities:
                                        enabled={!isProductDeleted}
                                        
                                        
                                        
                                        // values:
                                        value={quantity}
                                        onChange={({target:{valueAsNumber}}) => {
                                            if (valueAsNumber > 0) {
                                                dispatch(setCartItemQuantity({
                                                    productId : productId,
                                                    quantity  : valueAsNumber,
                                                }));
                                            }
                                            else {
                                                confirmAndDelete(productId);
                                            } // if
                                        }}
                                        
                                        
                                        
                                        // validations:
                                        min={0}
                                        max={99}
                                    />
                                </Group>
                                <p className='subPrice'>
                                    { isProductDeleted && <>This product was removed before you purcase it</>}
                                    {!isProductDeleted && <>
                                        Subtotal price: <span className='currency'>{formatCurrency(productUnitPrice ? (productUnitPrice * quantity) : undefined)}</span>
                                    </>}
                                </p>
                            </ListItem>
                        );
                    })}
                    
                    {isCartDataReady && <ListItem theme='primary'>
                        <p className='currencyBlock'>
                            Subtotal products: <span className='currency'>
                                {formatCurrency(totalProductPrice)}
                            </span>
                        </p>
                    </ListItem>}
                </List>
                <p className={styles.shippingInfo}>Tax included and <u>shipping calculated</u> at checkout.</p>
                <ButtonIcon enabled={isCartDataReady} icon={(hasCart && !isCartDataReady) ? 'busy' : 'shopping_bag'} theme='primary' size='lg' gradient={true} onClick={() => {
                    dispatch(showCart(false));
                    router.push('/checkout');
                }}>
                    Place My Order
                </ButtonIcon>
            </CardBody>
        </>
    )
};

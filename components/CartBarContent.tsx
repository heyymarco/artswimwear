import { ButtonIcon, CardBody, CardHeader, CloseButton, Group, List, ListItem } from '@reusable-ui/components';

import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, selectCartItems, setCartItemQuantity, showCart } from '@/store/features/cart/cartSlice';
import QuantityInput from './QuantityInput';
import { useGetPriceListQuery, useGetProductListQuery } from '@/store/features/api/apiSlice';
import LoadingBar from './LoadingBar';
import { formatCurrency } from '@/libs/formatters';
import { dynamicStyleSheets } from '@cssfn/cssfn-react';
import ImageWithFallback from './ImageWithFallback';



const useCartBarStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'@/styles/cartBar')
, { id: 'cart-bar' });



export const CartBarContent = () => {
    const styles = useCartBarStyleSheet();
    const cartItems   = useSelector(selectCartItems);
    const hasCart = !!cartItems.length;
    const dispatch = useDispatch();
    const {data: priceList, isLoading: isLoading1, isError: isError1} = useGetPriceListQuery();
    const {data: productList, isLoading: isLoading2, isError: isError2} = useGetProductListQuery();
    const isCartDataReady = hasCart && !!priceList && !!productList;
    
    
    
    return (
        <>
            <CardHeader>
                <h1 className={`h5 ${styles.cartWindowTitle}`}>
                    My Shopping Cart
                </h1>
                <CloseButton onClick={() => dispatch(showCart(false))} />
            </CardHeader>
            <CardBody className={styles.cartBody}>
                <List className={styles.cartList} theme='secondary' mild={false}>
                    <ListItem className={styles.cartTitle} theme='primary'>Cart List:</ListItem>
                    
                    {!hasCart && <ListItem enabled={false}>--- the cart is empty ---</ListItem>}
                    
                    {hasCart && (isLoading1 || isLoading2 || isError1 || isError2 || !priceList || !productList) && <ListItem>
                        {(isLoading1 || isLoading2) && <LoadingBar theme='primary' />}
                        {(isError1 || isError2) && <p>Oops, an error occured!</p>}
                    </ListItem>}
                    
                    {isCartDataReady && cartItems.map((item) => {
                        const productUnitPrice = priceList?.entities?.[item.productId]?.price ?? undefined;
                        const product = productList?.entities?.[item.productId];
                        return (
                            <ListItem key={item.productId} className={styles.productEntry}>
                                <h2 className='title h6'>{product?.name}</h2>
                                <figure>
                                    <ImageWithFallback alt={product?.name ?? ''} src={product?.image ? `/products/${product?.name}/${product?.image}` : undefined} fill={true} sizes='64px' />
                                </figure>
                                <Group className='quantity' title='Quantity' theme='primary' size='sm'>
                                    <ButtonIcon icon='delete' title='remove from cart' onClick={() => dispatch(removeFromCart({ productId: item.productId }))} />
                                    <QuantityInput min={0} max={99} value={item.quantity} onChange={(event) => dispatch(setCartItemQuantity({ productId: item.productId, quantity: event.target.valueAsNumber}))} />
                                </Group>
                                <p className='subPrice'>Subtotal price: {formatCurrency(productUnitPrice ? (productUnitPrice * item.quantity) : undefined)}</p>
                            </ListItem>
                        );
                    })}
                    
                    {isCartDataReady && <ListItem theme='primary'>
                        <p>
                            Total price: {formatCurrency(cartItems.reduce((accum, item) => {
                                const productUnitPrice = priceList?.entities?.[item.productId]?.price ?? undefined;
                                if (!productUnitPrice) return accum;
                                return accum + (productUnitPrice * item.quantity);
                            }, 0))}
                        </p>
                    </ListItem>}
                </List>
                <p className={styles.shippingInfo}>Tax included and <u>shipping calculated</u> at checkout.</p>
                <ButtonIcon enabled={isCartDataReady} icon='shopping_bag' theme='primary' size='lg' gradient={true}>Place My Order</ButtonIcon>
            </CardBody>
        </>
    )
};
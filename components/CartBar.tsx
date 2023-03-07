import { ButtonIcon, CardBody, CardHeader, CloseButton, Group, List, ListItem, ModalSide } from '@reusable-ui/components';

import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, selectCartItems, selectCartTotalQuantity, selectIsCartShown, setCartItemQuantity, showCart } from '@/store/features/cart/cartSlice';
import QuantityInput from './QuantityInput';
import { useGetPriceListQuery } from '@/store/features/api/apiSlice';
import LoadingBar from './LoadingBar';
import { formatCurrency } from '@/libs/formatters';



export const CartBar = () => {
    const isCartShown = useSelector(selectIsCartShown);
    const cartItems   = useSelector(selectCartItems);
    const hasCart = !!cartItems.length;
    const dispatch = useDispatch();
    const {data: priceList, isLoading, isError} = useGetPriceListQuery();
    
    
    
    return (
        <ModalSide theme='primary' modalSideStyle='inlineEnd' expanded={isCartShown} onExpandedChange={(event) => dispatch(showCart(event.expanded))}>
            <CardHeader>
                <h1 className='h5' style={{margin: 0}}>
                    My Shopping Cart
                </h1>
                <CloseButton onClick={() => dispatch(showCart(false))} />
            </CardHeader>
            <CardBody>
                <List theme='secondary' mild={false}>
                    <ListItem theme='primary'>Cart List:</ListItem>
                    
                    {!hasCart && <ListItem enabled={false}>--- the cart is empty ---</ListItem>}
                    
                    {hasCart && (isLoading || isError || !priceList) && <ListItem>
                        {isLoading && <LoadingBar />}
                        {isError && <p>Oops, an error occured!</p>}
                    </ListItem>}
                    
                    {cartItems.map((item, index) => {
                        const productUnitPrice = priceList?.entities?.[item.productId]?.price ?? undefined;
                        return (
                            <ListItem key={index}>
                                <h2 className='name h6'>{item.productId}</h2>
                                <p style={{display: 'inline', marginInlineEnd: '1rem'}}>Quantity:</p>
                                <Group theme='primary' size='sm'>
                                    <ButtonIcon icon='delete' title='remove from cart' onClick={() => dispatch(removeFromCart({ productId: item.productId }))} />
                                    <QuantityInput min={0} max={99} value={item.quantity} onChange={(event) => dispatch(setCartItemQuantity({ productId: item.productId, quantity: event.target.valueAsNumber}))} />
                                </Group>
                                <p>Subtotal price: {productUnitPrice ? formatCurrency(productUnitPrice * item.quantity) : '-'}</p>
                            </ListItem>
                        );
                    })}
                    
                    {hasCart  && <ListItem theme='primary'>
                        <p>
                            Total price: $$$.
                        </p>
                    </ListItem>}
                </List>
            </CardBody>
        </ModalSide>
    )
};
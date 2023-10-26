import { ModalSide } from '@reusable-ui/components';

import { useDispatch, useSelector } from 'react-redux'
import { selectIsCartShown, showCart } from '@/store/features/cart/cartSlice';
import { CartBarContent } from './CartBarContent'

// internals:
import {
    useCartBarStyleSheet,
}                           from './styles/loader'



export const CartBar = () => {
    const styles = useCartBarStyleSheet();
    
    
    
    const isCartShown = useSelector(selectIsCartShown);
    const dispatch = useDispatch();
    
    
    
    return (
        <ModalSide className={styles.cartWindow} theme='primary' modalSideStyle='inlineEnd' expanded={isCartShown} onExpandedChange={(event) => dispatch(showCart(event.expanded))} lazy={true}>
            <CartBarContent />
        </ModalSide>
    )
};

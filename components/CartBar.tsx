import { ModalSide } from '@reusable-ui/components';

import { useDispatch, useSelector } from 'react-redux'
import { selectIsCartShown, showCart } from '@/store/features/cart/cartSlice';
import { CartBarContent } from './CartBarContent';



export const CartBar = () => {
    const isCartShown = useSelector(selectIsCartShown);
    const dispatch = useDispatch();
    
    
    
    return (
        <ModalSide theme='primary' modalSideStyle='inlineEnd' expanded={isCartShown} onExpandedChange={(event) => dispatch(showCart(event.expanded))} lazy={true}>
            <CartBarContent />
        </ModalSide>
    )
};

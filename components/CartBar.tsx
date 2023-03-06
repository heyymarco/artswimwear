import { CardBody, CardHeader, CloseButton, ModalSide } from '@reusable-ui/components';

import { useDispatch, useSelector } from 'react-redux'
import { selectIsCartShown, showCart } from '@/store/features/cart/cartSlice';



export const CartBar = () => {
    const isCartShown = useSelector(selectIsCartShown);
    const dispatch = useDispatch();
    
    
    
    return (
        <ModalSide theme='primary' modalSideStyle='inlineEnd' expanded={isCartShown} onExpandedChange={(event) => dispatch(showCart(event.expanded))}>
            <CardHeader>
                <h1 className='h5' style={{margin: 0}}>
                    My Shopping Cart
                </h1>
                <CloseButton onClick={() => dispatch(showCart(false))} />
            </CardHeader>
            <CardBody>
                <p>
                    Lorem ipsum dolor sit amet
                    <br />
                    consectetur adipisicing elit.
                </p>
                <p>
                    Explicabo aut deserunt nulla
                    <br />
                    iusto quod a est debitis.
                </p>
            </CardBody>
        </ModalSide>
    )
};
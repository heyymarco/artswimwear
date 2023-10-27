'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'

// internals:
import {
    useCartState,
}                           from '../../states/cartState'



// react components:
const ViewSubtotalCart = (): JSX.Element|null => {
    // states:
    const {
        // cart data:
        totalProductPrice,
    } = useCartState();
    
    
    
    // jsx:
    return (
        <>
            <hr />
            
            <p className='currencyBlock'>
                Subtotal <span className='currency'>
                    {formatCurrency(totalProductPrice)}
                </span>
            </p>
        </>
    );
};
export {
    ViewSubtotalCart,
    ViewSubtotalCart as default,
};

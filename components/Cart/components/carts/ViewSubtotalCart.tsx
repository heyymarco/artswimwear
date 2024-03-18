'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    CurrencyDisplay,
}                           from '@/components/CurrencyDisplay'

// internals:
import {
    useCartState,
}                           from '../../states/cartState'



// react components:
const ViewSubtotalCart = (): JSX.Element|null => {
    // states:
    const {
        // states:
        isCartReady,
        
        
        
        // cart data:
        totalProductPrice,
    } = useCartState();
    
    
    
    // jsx:
    if (!isCartReady) return null;
    return (
        <p className='currencyBlock'>
            <span>Subtotal</span>
            
            <span className='currency'>
                <CurrencyDisplay convertAmount={false} amount={totalProductPrice} />
            </span>
        </p>
    );
};
export {
    ViewSubtotalCart,
    ViewSubtotalCart as default,
};

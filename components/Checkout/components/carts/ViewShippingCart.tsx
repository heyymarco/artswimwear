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

// contexts:
import {
    useCartState,
}                           from '@/components/Cart/states/cartState'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewShippingCart = (): JSX.Element|null => {
    // contexts:
    const {
        // cart data:
        hasPhysicalProduct,
    } = useCartState();
    
    const {
        // states:
        isCheckoutReady,
        
        
        
        // shipping data:
        shippingProvider,
        totalShippingCost,
    } = useCheckoutState();
    
    
    
    // jsx:
    if (!isCheckoutReady)    return null;
    if (!hasPhysicalProduct) return null; // unknown -or- not_physical_product => nothing to display
    return (
        <p className='currencyBlock'>
            <span>Shipping</span>
            
            <span className='currency'>
                {
                    (shippingProvider !== undefined)
                    ? <CurrencyDisplay amount={totalShippingCost} />
                    : 'calculated at next step'
                }
            </span>
        </p>
    );
};
export {
    ViewShippingCart,
    ViewShippingCart as default,
};

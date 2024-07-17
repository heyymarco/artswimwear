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
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewShippingCart = (): JSX.Element|null => {
    // contexts:
    const {
        // states:
        isCheckoutReady,
        
        
        
        // shipping data:
        shippingProvider,
        totalShippingCost,
    } = useCheckoutState();
    
    
    
    // jsx:
    if (!isCheckoutReady)           return null;
    if (totalShippingCost === null) return null; // not_physical_product => nothing to display
    if ((totalShippingCost === undefined) && (shippingProvider !== undefined)) return null; // unknown_kind_product -and- has shippingProvider selected => something error => nothing to display
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

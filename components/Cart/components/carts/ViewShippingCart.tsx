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
export interface ViewShippingCartProps {
    // data:
    totalShippingCost ?: number|null|undefined
}
const ViewShippingCart = (props: ViewShippingCartProps): JSX.Element|null => {
    // rest props:
    const {
        // data:
        totalShippingCost,
    } = props;
    
    
    
    // states:
    const {
        // states:
        isCartReady,
        hasPhysicalProduct,
    } = useCartState();
    const isNotShippingSelected = (totalShippingCost === undefined);
    
    
    
    // jsx:
    if (!isCartReady)        return null;
    if (!hasPhysicalProduct) return null; // unknown -or- not_physical_product => nothing to display
    return (
        <p className='currencyBlock'>
            <span>Shipping</span>
            
            <span className='currency'>
                {
                    !isNotShippingSelected
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

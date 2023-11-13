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
    } = useCartState();
    const hasPhysicalProduct    = (totalShippingCost !== null);
    const isNotShippingSelected = (totalShippingCost === undefined);
    
    
    
    // jsx:
    if (!isCartReady)        return null;
    if (!hasPhysicalProduct) return null;
    return (
        <p className='currencyBlock'>
            <span>Shipping</span>
            
            <span className='currency'>
                {
                    !isNotShippingSelected
                    ? formatCurrency(totalShippingCost)
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

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

// configs:
import {
    commerceConfig,
}                           from '@/commerce.config'



// react components:
export interface ViewTotalCartProps {
    // data:
    totalShippingCost ?: number|null|undefined
}
const ViewTotalCart = (props: ViewTotalCartProps): JSX.Element|null => {
    // rest props:
    const {
        // data:
        totalShippingCost,
    } = props;
    
    
    
    // states:
    const {
        // states:
        isCartReady,
        
        
        
        // cart data:
        totalProductPrice,
    } = useCartState();
    const isNotShippingSelected = (totalShippingCost === undefined);
    
    
    
    // jsx:
    if (!isCartReady) return null;
    return (
        <p className='currencyBlock totalCost'>
            <span>Total</span>
            
            <span className='currency'>
                {
                    !isNotShippingSelected
                    ? <>
                        {formatCurrency(totalProductPrice + (totalShippingCost ?? 0))}
                        {' '}
                        <span>{commerceConfig.defaultCurrency}</span>
                    </>
                    : 'calculated at next step'
                }
            </span>
        </p>
    );
};
export {
    ViewTotalCart,
    ViewTotalCart as default,
};

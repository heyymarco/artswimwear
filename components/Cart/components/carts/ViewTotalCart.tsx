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
        
        
        
        // accessibilities:
        currency,
        
        
        
        // cart data:
        productPriceParts,
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
                        <CurrencyDisplay amount={[...productPriceParts, totalShippingCost]} />
                        {' '}
                        <span>{currency}</span>
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

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
    COMMERCE_CURRENCY,
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
        // cart data:
        totalProductPrice,
    } = useCartState();
    const isPhysicalProduct     = (totalShippingCost !== null);
    const isNotShippingSelected = (totalShippingCost === undefined);
    
    
    
    // jsx:
    return (
        <>
            <hr />
            
            <p className='currencyBlock'>
                Subtotal <span className='currency'>
                    {formatCurrency(totalProductPrice)}
                </span>
            </p>
            
            {isPhysicalProduct && <p className='currencyBlock'>
                Shipping <span className='currency'>
                    {
                        !isNotShippingSelected
                        ? formatCurrency(totalShippingCost)
                        : 'calculated at next step'
                    }
                </span>
            </p>}
            
            <hr />
            
            <p className='currencyBlock totalCost'>
                Total <span className='currency'>
                    {
                        !isNotShippingSelected
                        ? <>
                            {formatCurrency(totalProductPrice + (totalShippingCost ?? 0))}
                            {' '}
                            <span>{COMMERCE_CURRENCY}</span>
                        </>
                        : 'calculated at next step'
                    }
                </span>
            </p>
        </>
    );
};
export {
    ViewTotalCart,
    ViewTotalCart as default,
};

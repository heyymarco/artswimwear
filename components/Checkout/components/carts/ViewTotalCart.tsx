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
const ViewTotalCart = (): JSX.Element|null => {
    // states:
    const {
        // accessibilities:
        currency,
        
        
        
        // cart data:
        productPriceParts,
    } = useCartState();
    
    const {
        // states:
        isCheckoutReady,
        
        
        
        // shipping data:
        isShippingAddressRequired,
        shippingProvider,
        totalShippingCost,
    } = useCheckoutState();
    
    
    
    // jsx:
    if (!isCheckoutReady) return null;
    return (
        <p className='currencyBlock totalCost'>
            <span>Total</span>
            
            <span className='currency'>
                {
                    (!isShippingAddressRequired || (shippingProvider !== undefined))
                    ? <>
                        <CurrencyDisplay amount={(productPriceParts === undefined) ? undefined : [...productPriceParts, totalShippingCost]} />
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

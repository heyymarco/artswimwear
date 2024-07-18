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
                    (!isShippingAddressRequired /* not_physical_product */ || (shippingProvider !== undefined) /* physical_product && have selected shippingProvider */)
                    
                    // not_physical_product : displays the subTotal + null shippingCost
                    // physical_product     : displays the subTotal + selected shippingCost
                    ? <>
                        <CurrencyDisplay amount={(productPriceParts === undefined) ? undefined : [...productPriceParts, totalShippingCost]} />
                        {' '}
                        <span>{currency}</span>
                    </>
                    
                    // physical_product: requires selected shippingProvider to display the (subTotal + shippingCost):
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

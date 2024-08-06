'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // status-components:
    Busy,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

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
        checkoutStep,
        isCheckoutReady,
        
        
        
        // shipping data:
        isShippingAddressRequired,
        shippingProvider,
        totalShippingCost,
        totalShippingCostStatus,
    } = useCheckoutState();
    
    
    
    // jsx:
    if (!isCheckoutReady) return null;
    
    const hasValidSelectedShippingIfAny = (
        (
            !isShippingAddressRequired       // not_physical_product
            ||
            (shippingProvider !== undefined) // physical_product && have selected shippingProvider
        )
        &&
        (checkoutStep !== 'info')            // when in `info` page, ignore the selected shippingProvider
    );
    
    return (
        <p className='currencyBlock totalCost'>
            <span>Total</span>
            
            <span className='currency'>
                {!hasValidSelectedShippingIfAny && <>
                    {/* physical_product: requires selected shippingProvider to display the (subTotal + shippingCost) */}
                    calculated at next step
                </>}
                
                {hasValidSelectedShippingIfAny && <>
                    {(totalShippingCostStatus === 'loading' ) && <Busy />}
                    {(totalShippingCostStatus === 'obsolete') && <span className='txt-sec'>unknown</span>}
                    
                    {/* not_physical_product : displays the subTotal + null shippingCost */}
                    {/* physical_product     : displays the subTotal + selected shippingCost */}
                    {(totalShippingCostStatus === 'ready'   ) && <>
                        <CurrencyDisplay amount={(productPriceParts === undefined) ? undefined : [...productPriceParts, totalShippingCost]} />
                        {' '}
                        <span>{currency}</span>
                    </>}
                </>}
            </span>
        </p>
    );
};
export {
    ViewTotalCart,
    ViewTotalCart as default,
};

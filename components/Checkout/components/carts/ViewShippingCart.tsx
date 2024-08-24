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
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewShippingCart = (): JSX.Element|null => {
    // contexts:
    const {
        // states:
        checkoutStep,
        isCheckoutReady,
        
        
        
        // shipping data:
        isShippingAddressRequired,
        shippingProviderId,
        totalShippingCost,
        totalShippingCostStatus,
    } = useCheckoutState();
    
    
    
    // jsx:
    if (!isCheckoutReady)           return null;
    if (!isShippingAddressRequired) return null; // not_physical_product => no need to display the selected shippingCost
    
    const hasValidSelectedShippingIfAny = (
        (shippingProviderId !== null) // physical_product && have selected shippingProvider
        &&
        (checkoutStep !== 'INFO')     // when in `info` page, ignore the selected shippingProvider
    );
    
    return (
        <p className='currencyBlock'>
            <span>Shipping</span>
            
            <span className='currency'>
                {!hasValidSelectedShippingIfAny && <>
                    {/* physical_product: requires selected shippingProvider to display the shippingCost */}
                    calculated at next step
                </>}
                
                {hasValidSelectedShippingIfAny && <>
                    {(totalShippingCostStatus === 'loading' ) && <Busy />}
                    {(totalShippingCostStatus === 'obsolete') && <span className='txt-sec'>unknown</span>}
                    
                    {/* not_physical_product : never happened */}
                    {/* physical_product     : displays the selected shippingCost */}
                    {(totalShippingCostStatus === 'ready'   ) && <CurrencyDisplay amount={totalShippingCost} />}
                </>}
            </span>
        </p>
    );
};
export {
    ViewShippingCart,
    ViewShippingCart as default,
};

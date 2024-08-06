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
        isCheckoutReady,
        
        
        
        // shipping data:
        isShippingAddressRequired,
        shippingProvider,
        totalShippingCost,
        totalShippingCostStatus,
    } = useCheckoutState();
    
    
    
    // jsx:
    if (!isCheckoutReady)           return null;
    if (!isShippingAddressRequired) return null; // not_physical_product => no need to display the selected shippingCost
    return (
        <p className='currencyBlock'>
            <span>Shipping</span>
            
            <span className='currency'>
                {(totalShippingCostStatus === 'loading') && <Busy />}
                {(totalShippingCostStatus === 'obsolete') && <span className='txt-sec'>unknown</span>}
                
                {(totalShippingCostStatus === 'ready') && <>
                    {
                        (shippingProvider !== undefined) /* physical_product && have selected shippingProvider */
                        
                        // not_physical_product : never displayed
                        // physical_product     : displays the selected shippingCost
                        ? <CurrencyDisplay amount={totalShippingCost} />
                        
                        // physical_product: requires selected shippingProvider to display the shippingCost:
                        : 'calculated at next step'
                    }
                </>}
            </span>
        </p>
    );
};
export {
    ViewShippingCart,
    ViewShippingCart as default,
};

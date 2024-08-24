'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewShippingMethod = (): JSX.Element|null => {
    // states:
    const {
        // shipping data:
        isShippingAddressRequired,
        
        shippingProviderId,
        
        
        
        // relation data:
        shippingList,
    } = useCheckoutState();
    const selectedShipping = shippingList?.entities?.[shippingProviderId ?? ''];
    
    
    
    // jsx:
    if (!isShippingAddressRequired) return null;
    return (
        <>
            <span
                // classes:
                className='shippingProvider'
            >
                {selectedShipping?.name}
            </span>
            
            {!!selectedShipping?.eta && <span
                // classes:
                className='eta txt-sec'
            >
                (estimate: {selectedShipping.eta.min}{(selectedShipping.eta.max > selectedShipping.eta.min) ? <>-{selectedShipping.eta.max}</> : null} day{(selectedShipping.eta.min > 1) ? 's' : ''} after dispatched from our warehouse)
            </span>}
        </>
    );
};
export {
    ViewShippingMethod,
    ViewShippingMethod as default,
};

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
        shippingProvider,
        
        
        
        // relation data:
        shippingList,
    } = useCheckoutState();
    const selectedShipping = shippingList?.entities?.[shippingProvider ?? ''];
    
    
    
    // jsx:
    return (
        <>
            <span
                // classes:
                className='shippingProvider'
            >
                {selectedShipping?.name}
            </span>
            
            {!!selectedShipping?.estimate && <span
                // classes:
                className='shippingEstimate txt-sec'
            >
                (estimate: {selectedShipping?.estimate} after dispatched from our warehouse)
            </span>}
        </>
    );
};
export {
    ViewShippingMethod,
    ViewShippingMethod as default,
};

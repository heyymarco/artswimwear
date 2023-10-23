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
            {`${selectedShipping?.name}${!selectedShipping?.estimate ? '' : ` - ${selectedShipping?.estimate}`}`}
        </>
    );
};
export {
    ViewShippingMethod,
    ViewShippingMethod as default,
};

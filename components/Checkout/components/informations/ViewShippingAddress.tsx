'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewShippingAddress = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // shipping data:
        isShippingAddressRequired,
        
        shippingAddress,
        
        
        
        // relation data:
        countryList,
    } = useCheckoutState();
    
    
    
    // jsx:
    if (!isShippingAddressRequired) return null;
    if (!shippingAddress) return null;
    return (
        <>
            <p>
                <span className={styleSheet.data}>{shippingAddress.firstName} {shippingAddress.lastName} ({shippingAddress.phone})</span>
            </p>
            <p>
                <span className={styleSheet.data}>{`${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} (${shippingAddress.zip}), ${countryList?.entities?.[shippingAddress.country]?.name}`}</span>
            </p>
        </>
    );
};
export {
    ViewShippingAddress,
    ViewShippingAddress as default,
};

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
        
        shippingCountry,
        shippingState,
        shippingCity,
        shippingZip,
        shippingAddress,
        
        shippingFirstName,
        shippingLastName,
        shippingPhone,
        
        
        
        // relation data:
        countryList,
    } = useCheckoutState();
    
    
    
    // jsx:
    if (!isShippingAddressRequired) return null;
    return (
        <>
            <p>
                <span className={styleSheet.data}>{shippingFirstName} {shippingLastName} ({shippingPhone})</span>
            </p>
            <p>
                <span className={styleSheet.data}>{`${shippingAddress}, ${shippingCity}, ${shippingState} (${shippingZip}), ${countryList?.entities?.[shippingCountry ?? '']?.name}`}</span>
            </p>
        </>
    );
};
export {
    ViewShippingAddress,
    ViewShippingAddress as default,
};

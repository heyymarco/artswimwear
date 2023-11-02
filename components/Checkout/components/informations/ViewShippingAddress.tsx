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
        shippingFirstName,
        shippingLastName,
        
        shippingPhone,
        
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        
        
        // relation data:
        countryList,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <p>
                <span className={styleSheet.data}>{shippingFirstName} {shippingLastName} ({shippingPhone})</span>
            </p>
            <p>
                <span className={styleSheet.data}>{`${shippingAddress}, ${shippingCity}, ${shippingZone} (${shippingZip}), ${countryList?.entities?.[shippingCountry ?? '']?.name}`}</span>
            </p>
        </>
    );
};
export {
    ViewShippingAddress,
    ViewShippingAddress as default,
};

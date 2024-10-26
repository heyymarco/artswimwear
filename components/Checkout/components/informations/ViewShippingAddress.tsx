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

// others:
import {
    Country,
}                           from 'country-state-city'



// react components:
const ViewShippingAddress = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // shipping data:
        isShippingAddressRequired,
        
        shippingAddress,
    } = useCheckoutState();
    
    
    
    // jsx:
    if (!isShippingAddressRequired) return null;
    if (!shippingAddress) return null;
    const {
        country,
        state,
        city,
        zip,
        address,
        
        firstName,
        lastName,
        phone,
    } = shippingAddress;
    return (
        <>
            <p>
                <span className={styleSheet.data}>{firstName} {lastName} ({phone})</span>
            </p>
            <p>
                <span className={styleSheet.data}>
                    {address}, {city}, {state} ({zip}), {Country.getCountryByCode(country)?.name ?? country}
                </span>
            </p>
        </>
    );
};
export {
    ViewShippingAddress,
    ViewShippingAddress as default,
};

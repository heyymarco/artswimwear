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

// stores:
import {
    // hooks:
    useGetCountryList,
}                           from '@/store/features/api/apiSlice'



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
    
    
    
    // stores:
    const {data: countryList}  = useGetCountryList();
    
    
    
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
                <span className={styleSheet.data}>{`${address}, ${city}, ${state} (${zip}), ${countryList?.entities?.[country]?.name ?? country}`}</span>
            </p>
        </>
    );
};
export {
    ViewShippingAddress,
    ViewShippingAddress as default,
};

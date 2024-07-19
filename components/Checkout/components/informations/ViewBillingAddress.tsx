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
const ViewBillingAddress = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // shipping data:
        shippingAddress,
        
        
        
        // billing data:
        isBillingAddressRequired,
        
        billingAsShipping,
        
        billingAddress,
    } = useCheckoutState();
    
    const finalBillingAddress = billingAsShipping ? shippingAddress : billingAddress;
    
    
    
    // stores:
    const {data: countryList}  = useGetCountryList();
    
    
    
    // jsx:
    if (!isBillingAddressRequired) return null;
    if (!finalBillingAddress) return null;
    const {
        country,
        state,
        city,
        zip,
        address,
        
        firstName,
        lastName,
        phone,
    } = finalBillingAddress;
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
    ViewBillingAddress,
    ViewBillingAddress as default,
};

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

// states:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'
import {
    useTransactionState,
}                           from '@/components/payments/states'

// others:
import {
    Country,
}                           from 'country-state-city'



// react components:
const ViewBillingAddress = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // billing data:
        isBillingAddressRequired,
    } = useCheckoutState();
    
    const {
        billingAddress,
    } = useTransactionState();
    
    
    
    // jsx:
    if (!isBillingAddressRequired) return null;
    if (!billingAddress) return null;
    const {
        country,
        state,
        city,
        zip,
        address,
        
        firstName,
        lastName,
        phone,
    } = billingAddress;
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
    ViewBillingAddress,
    ViewBillingAddress as default,
};

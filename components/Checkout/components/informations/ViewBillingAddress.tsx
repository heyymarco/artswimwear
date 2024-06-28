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
        
        
        
        // relation data:
        countryList,
    } = useCheckoutState();
    
    const finalBillingAddress = billingAsShipping ? shippingAddress : billingAddress;
    
    
    
    // jsx:
    if (!isBillingAddressRequired) return null;
    if (!finalBillingAddress) return null;
    return (
        <>
            <p>
                <span className={styleSheet.data}>{finalBillingAddress.firstName} {finalBillingAddress.lastName} ({finalBillingAddress.phone})</span>
            </p>
            <p>
                <span className={styleSheet.data}>{`${finalBillingAddress.address}, ${finalBillingAddress.city}, ${finalBillingAddress.state} (${finalBillingAddress.zip}), ${countryList?.entities?.[finalBillingAddress.country]?.name}`}</span>
            </p>
        </>
    );
};
export {
    ViewBillingAddress,
    ViewBillingAddress as default,
};

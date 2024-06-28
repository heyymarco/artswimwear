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
        shippingCountry,
        shippingState,
        shippingCity,
        shippingZip,
        shippingAddress,
        
        shippingFirstName,
        shippingLastName,
        shippingPhone,
        
        
        
        // billing data:
        isBillingAddressRequired,
        
        billingAsShipping,
        
        billingCountry,
        billingState,
        billingCity,
        billingZip,
        billingAddress,
        
        billingFirstName,
        billingLastName,
        billingPhone,
        
        
        
        // relation data:
        countryList,
    } = useCheckoutState();
    
    const finalBillingCountry    = billingAsShipping ? shippingCountry   : billingCountry;
    const finalBillingState      = billingAsShipping ? shippingState     : billingState;
    const finalBillingCity       = billingAsShipping ? shippingCity      : billingCity;
    const finalBillingZip        = billingAsShipping ? shippingZip       : billingZip;
    const finalBillingAddress    = billingAsShipping ? shippingAddress   : billingAddress;
    
    const finalBillingFirstName  = billingAsShipping ? shippingFirstName : billingFirstName;
    const finalBillingLastName   = billingAsShipping ? shippingLastName  : billingLastName;
    const finalBillingPhone      = billingAsShipping ? shippingPhone     : billingPhone;
    
    
    
    // jsx:
    if (!isBillingAddressRequired) return null;
    return (
        <>
            <p>
                <span className={styleSheet.data}>{finalBillingFirstName} {finalBillingLastName} ({finalBillingPhone})</span>
            </p>
            <p>
                <span className={styleSheet.data}>{`${finalBillingAddress}, ${finalBillingCity}, ${finalBillingState} (${finalBillingZip}), ${countryList?.entities?.[finalBillingCountry ?? '']?.name}`}</span>
            </p>
        </>
    );
};
export {
    ViewBillingAddress,
    ViewBillingAddress as default,
};

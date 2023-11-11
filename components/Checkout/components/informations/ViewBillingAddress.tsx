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
        shippingFirstName,
        shippingLastName,
        
        shippingPhone,
        
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        
        
        // billing data:
        isBillingRequired,
        
        billingAsShipping,
        
        billingFirstName,
        billingLastName,
        
        billingPhone,
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
        
        
        
        // relation data:
        countryList,
    } = useCheckoutState();
    
    const finalBillingFirstName  = billingAsShipping ? shippingFirstName : billingFirstName;
    const finalBillingLastName   = billingAsShipping ? shippingLastName  : billingLastName;
    
    const finalBillingPhone      = billingAsShipping ? shippingPhone     : billingPhone;
    
    const finalBillingAddress    = billingAsShipping ? shippingAddress   : billingAddress;
    const finalBillingCity       = billingAsShipping ? shippingCity      : billingCity;
    const finalBillingZone       = billingAsShipping ? shippingZone      : billingZone;
    const finalBillingZip        = billingAsShipping ? shippingZip       : billingZip;
    const finalBillingCountry    = billingAsShipping ? shippingCountry   : billingCountry;
    
    
    
    // jsx:
    if (!isBillingRequired) return null;
    return (
        <>
            <p>
                <span className={styleSheet.data}>{finalBillingFirstName} {finalBillingLastName} ({finalBillingPhone})</span>
            </p>
            <p>
                <span className={styleSheet.data}>{`${finalBillingAddress}, ${finalBillingCity}, ${finalBillingZone} (${finalBillingZip}), ${countryList?.entities?.[finalBillingCountry ?? '']?.name}`}</span>
            </p>
        </>
    );
};
export {
    ViewBillingAddress,
    ViewBillingAddress as default,
};

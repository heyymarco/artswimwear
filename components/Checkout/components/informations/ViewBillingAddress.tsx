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
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        
        
        // billing data:
        billingAsShipping,
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
        
        
        
        // relation data:
        countryList,
    } = useCheckoutState();
    
    const finalBillingAddress    = billingAsShipping ? shippingAddress : billingAddress;
    const finalBillingCity       = billingAsShipping ? shippingCity    : billingCity;
    const finalBillingZone       = billingAsShipping ? shippingZone    : billingZone;
    const finalBillingZip        = billingAsShipping ? shippingZip     : billingZip;
    const finalBillingCountry    = billingAsShipping ? shippingCountry : billingCountry;
    
    
    
    // jsx:
    return (
        <>
            <span className={styleSheet.data}>{`${finalBillingAddress}, ${finalBillingCity}, ${finalBillingZone} (${finalBillingZip}), ${countryList?.entities?.[finalBillingCountry ?? '']?.name}`}</span>
        </>
    );
};
export {
    ViewBillingAddress,
    ViewBillingAddress as default,
};

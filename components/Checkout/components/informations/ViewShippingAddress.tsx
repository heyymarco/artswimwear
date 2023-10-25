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
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // shipping data:
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
            <span className={styles.data}>{`${shippingAddress}, ${shippingCity}, ${shippingZone} (${shippingZip}), ${countryList?.entities?.[shippingCountry ?? '']?.name}`}</span>
        </>
    );
};
export {
    ViewShippingAddress,
    ViewShippingAddress as default,
};

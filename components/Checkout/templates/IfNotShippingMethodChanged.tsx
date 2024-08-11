// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // hooks:
    useShippingContext,
}                           from './shippingDataContext'
import {
    // hooks:
    useOrderDataContext,
}                           from './orderDataContext'



// react components:
export const IfNotShippingMethodChanged = (props: React.PropsWithChildren<{}>): React.ReactNode => {
    // contexts:
    const {
        // data:
        prevShippingTracking,
    } = useShippingContext();
    
    const {
        // data:
        order : {
            shippingAddress,
        },
        shippingTracking,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!shippingAddress) return null; // no shipping address => non_physical_product => ignore
    if (!shippingTracking) return null; // not already shipped => ignore
    
    const isShippingMethodChanged : boolean = (
        (prevShippingTracking !== undefined) // do not detect changes if `prevShippingTracking` not provider for comparison
        &&
        (prevShippingTracking.shippingCarrier?.trim().toLowerCase() !== shippingTracking.shippingCarrier?.trim().toLowerCase()) // detect shipping carrier name changes
        &&
        (prevShippingTracking.shippingNumber?.trim() !== shippingTracking.shippingNumber?.trim()) // detect shipping tracking number changes
    );
    
    if (isShippingMethodChanged) return null; // is changed => ignore
    return props.children;
};

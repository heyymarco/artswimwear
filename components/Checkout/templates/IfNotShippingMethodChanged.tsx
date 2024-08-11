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
        prevShipment,
    } = useShippingContext();
    
    const {
        // data:
        order : {
            shippingAddress,
        },
        shipment,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!shippingAddress) return null; // no shipping address => non_physical_product => ignore
    if (!shipment) return null; // not already shipped => ignore
    
    const isShippingMethodChanged : boolean = (
        (prevShipment !== undefined) // do not detect changes if `prevShipment` not provider for comparison
        &&
        (prevShipment.carrier?.trim().toLowerCase() !== shipment.carrier?.trim().toLowerCase()) // detect shipping carrier name changes
        &&
        (prevShipment.number?.trim() !== shipment.number?.trim()) // detect shipping tracking number changes
    );
    
    if (isShippingMethodChanged) return null; // is changed => ignore
    return props.children;
};

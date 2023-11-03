// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // hooks:
    useShippingContext,
}                           from './shippingContext.js'



// react components:

const ShippingAddress = (): React.ReactNode => {
    // contexts:
    const {
        // shipping data:
        shippingAddress : address,
        
        
        
        // relation data:
        countryList,
    } = useShippingContext();
    
    
    
    // jsx:
    if (!address) return null;
    const {
        // shipping data:
        firstName : shippingFirstName,
        lastName  : shippingLastName,
        
        phone     : shippingPhone,
        
        address   : shippingAddress,
        city      : shippingCity,
        zone      : shippingZone,
        zip       : shippingZip,
        country   : shippingCountry,
    } = address;
    return (
        <>
            <p>
                {shippingFirstName} {shippingLastName} ({shippingPhone})
            </p>
            <p>
                {`${shippingAddress}, ${shippingCity}, ${shippingZone} (${shippingZip}), ${countryList?.entities?.[shippingCountry ?? '']?.name}`}
            </p>
        </>
    );
};
const ShippingMethod = (): React.ReactNode => {
    // contexts:
    const {
        // shipping data:
        shippingProviderId,
        
        
        
        // relation data:
        shippingList,
    } = useShippingContext();
    
    
    
    // jsx:
    if (!shippingProviderId) return null;
    const selectedShipping = shippingList?.entities?.[shippingProviderId ?? ''];
    return (
        <>
            <p>
            {`${selectedShipping?.name}${!selectedShipping?.estimate ? '' : ` - ${selectedShipping?.estimate}`}`}
            </p>
        </>
    );
};


export interface ShippingInfoProps {
    // accessibilities:
    title    ?: React.ReactNode
    readOnly ?: boolean
}
const ShippingInfo = (props: ShippingInfoProps): React.ReactNode => {
    // rest props:
    const {
        // accessibilities:
        title = 'Shipping Info',
    } = props;
    
    
    
    // jsx:
    return (
        <table>
            {!!title && <thead>
                <tr>
                    <th colSpan={3}>
                        {title}
                    </th>
                </tr>
            </thead>}
            
            <tbody>
                <tr>
                    <th>Ship To</th>
                    <td><ShippingAddress /></td>
                </tr>
                
                <tr>
                    <th>Ship By</th>
                    <td><ShippingMethod /></td>
                </tr>
            </tbody>
        </table>
    );
};

export const Shipping = {
    Address : ShippingAddress,
    Method  : ShippingMethod,
    Info    : ShippingInfo,
};

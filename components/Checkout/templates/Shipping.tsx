// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // hooks:
    useOrderDataContext,
}                           from './orderDataContext'



// react components:

const ShippingAddress = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        shippingAddress : address,
        
        
        
        // relation data:
        countryList,
    } = useOrderDataContext();
    
    
    
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
        // data:
        shippingProvider,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!shippingProvider) return null;
    return (
        <>
            <p>
            {`${shippingProvider.name}${!shippingProvider.estimate ? '' : ` - ${shippingProvider.estimate}`}`}
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

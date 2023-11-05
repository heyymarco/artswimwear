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
        order : {
            shippingAddress : address,
        },
        
        
        
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
        order : {
            shippingProvider,
        },
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
        <table
            // styles:
            style={{
                // layouts:
                tableLayout: 'auto',
                
                
                
                // borders:
                borderCollapse: 'collapse',
                
                
                
                // typos:
                color: 'currentcolor',
            }}
        >
            {!!title && <thead>
                <tr>
                    <th colSpan={3}
                        // styles:
                        style={{
                            // positions:
                            verticalAlign : 'middle',
                            
                            
                            
                            // sizes:
                            boxSizing  : 'content-box',
                            // inlineSize : '4em', // not supported by GMail
                            width      : '4em',
                            
                            
                            
                            // spacings:
                            // paddingInlineEnd : '1.5em', // not supported by GMail
                            paddingRight     : '1.5em',
                            
                            
                            
                            // typos:
                            fontSize   : '1rem',
                            fontWeight : 'bold',
                            textAlign  : 'end',
                        }}
                    >
                        {title}
                    </th>
                </tr>
            </thead>}
            
            <tbody>
                <tr>
                    <th
                        // styles:
                        style={{
                            // positions:
                            verticalAlign : 'middle',
                            
                            
                            
                            // sizes:
                            boxSizing  : 'content-box',
                            // inlineSize : '4em', // not supported by GMail
                            width      : '4em',
                            
                            
                            
                            // spacings:
                            // paddingInlineEnd : '1.5em', // not supported by GMail
                            paddingRight     : '1.5em',
                            
                            
                            
                            // typos:
                            fontSize   : '1rem',
                            fontWeight : 'bold',
                            textAlign  : 'end',
                        }}
                    >Ship To</th>
                    <td><ShippingAddress /></td>
                </tr>
                
                <tr>
                    <th
                        // styles:
                        style={{
                            // positions:
                            verticalAlign : 'middle',
                            
                            
                            
                            // sizes:
                            boxSizing  : 'content-box',
                            // inlineSize : '4em', // not supported by GMail
                            width      : '4em',
                            
                            
                            
                            // spacings:
                            // paddingInlineEnd : '1.5em', // not supported by GMail
                            paddingRight     : '1.5em',
                            
                            
                            
                            // typos:
                            fontSize   : '1rem',
                            fontWeight : 'bold',
                            textAlign  : 'end',
                        }}
                    >Ship By</th>
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

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import * as styles          from '@/components/Checkout/templates/styles'

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
            <p style={styles.paragraphFirst}>
                {shippingFirstName} {shippingLastName} ({shippingPhone})
            </p>
            
            <p style={styles.paragraphLast}>
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
            <p
                // styles:
                style={{
                    // layouts:
                    ...styles.paragraphBase,
                    display       : 'flex',
                    flexDirection : 'row',
                    flexWrap      : 'nowrap',
                    
                    
                    
                    // spacings:
                    columnGap     : '0.5em',
                }}
            >
                {shippingProvider.name}
                
                {!!shippingProvider.estimate && <span style={styles.textSmall}>
                        (estimate: {shippingProvider.estimate} after dispatched from our warehouse)
                </span>}
            </p>
        </>
    );
};


export interface ShippingInfoProps {
    // styles:
    style    ?: React.CSSProperties
    
    
    
    // accessibilities:
    title    ?: React.ReactNode
    readOnly ?: boolean
}
const ShippingInfo = (props: ShippingInfoProps): React.ReactNode => {
    // rest props:
    const {
        // styles:
        style,
        
        
        
        // accessibilities:
        title = 'Shipping Info',
    } = props;
    
    
    
    // jsx:
    return (
        <table
            // styles:
            style={{
                ...styles.tableInfo,
                ...style,
            }}
        >
            {!!title && <thead>
                <tr>
                    <th colSpan={2} style={styles.tableTitleCenter}>
                        {title}
                    </th>
                </tr>
            </thead>}
            
            <tbody>
                <tr style={styles.tableRowSeparator}>
                    <th style={styles.tableTitleSide}>
                        Ship To
                    </th>
                    <td style={styles.tableContentSide}>
                        <ShippingAddress />
                    </td>
                </tr>
                
                <tr>
                    <th style={styles.tableTitleSide}>
                        Ship By
                    </th>
                    <td style={styles.tableContentSide}>
                        <ShippingMethod />
                    </td>
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

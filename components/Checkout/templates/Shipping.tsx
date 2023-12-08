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
    useBusinessContext,
}                           from './businessDataContext'
import {
    // hooks:
    useShippingContext,
}                           from './shippingDataContext'
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
                    display   : 'flex',
                    
                    
                    
                    // spacings:
                    columnGap : '0.5em',
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
const ShippingNumber = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        shippingTracking,
    } = useOrderDataContext();
    const shippingTrackingNumber = shippingTracking?.shippingNumber;
    
    
    
    // jsx:
    if (!shippingTracking) return null;
    return (
        <>
            <p style={styles.paragraphBase}>
                {shippingTrackingNumber}
            </p>
        </>
    );
};
const ShippingTrackingUrl = (): string|null => {
    // contexts:
    const {
        // data:
        model : business,
    } = useBusinessContext();
    
    const {
        // data:
        model,
    } = useShippingContext();
    
    const {
        // data:
        shippingTracking,
    } = useOrderDataContext();
    const shippingTrackingToken = shippingTracking?.token;
    
    
    
    const baseUrl                      = business?.url;
    const relativeTrackingUrl          = model?.trackingUrl;
    const absoluteTrackingUrl          = `${relativeTrackingUrl?.startsWith('/') ? baseUrl : ''}${relativeTrackingUrl}`;
    const absoluteTrackingUrlWithToken = `${absoluteTrackingUrl}?token=${encodeURIComponent(shippingTrackingToken ?? '')}`;
    
    
    
    // jsx:
    return (
        absoluteTrackingUrlWithToken
    );
};
const ShippingTrackingLink = (): React.ReactNode => {
    const url = ShippingTrackingUrl();
    
    
    
    // jsx:
    if (!url) return null;
    return (
        <a href={url}>
            {url}
        </a>
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
        title,
    } = props;
    
    
    
    // contexts:
    const {
        // data:
        shippingTracking,
    } = useOrderDataContext();
    const hasShippingTrackingNumber = !!shippingTracking?.shippingNumber;
    
    
    
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
                <tr>
                    <th
                        // styles:
                        style={{
                            // layouts:
                            ...(title ? null : styles.borderTopSide        ),
                            ...(title ? null : styles.tableTitleSideFirst  ),
                            ...styles.tableTitleSide,
                        }}
                    >
                        Ship To
                    </th>
                    <td
                        // styles:
                        style={{
                            // layouts:
                            ...(title ? null : styles.borderTopSide        ),
                            ...(title ? null : styles.tableContentSideFirst),
                            ...styles.tableContentSide,
                        }}
                    >
                        <ShippingAddress />
                    </td>
                </tr>
                
                <tr>
                    <th style={hasShippingTrackingNumber ? styles.tableTitleSide   : styles.tableTitleSideLast}>
                        Ship By
                    </th>
                    <td style={hasShippingTrackingNumber ? styles.tableContentSide : styles.tableContentSideLast}>
                        <ShippingMethod />
                    </td>
                </tr>
                
                {hasShippingTrackingNumber && <tr>
                    <th style={styles.tableTitleSideLast}>
                        Shipping Tracking Number
                    </th>
                    <td style={styles.tableContentSideLast}>
                        <ShippingNumber />
                    </td>
                </tr>}
            </tbody>
        </table>
    );
};

export const Shipping = {
    Address      : ShippingAddress,
    Method       : ShippingMethod,
    Info         : ShippingInfo,
    Number       : ShippingNumber,
    TrackingUrl  : ShippingTrackingUrl,
    TrackingLink : ShippingTrackingLink,
};

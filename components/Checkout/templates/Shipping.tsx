// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import * as styles          from './styles'
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
            shippingAddress,
        },
        
        
        
        // relation data:
        countryList,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!shippingAddress) return null; // no shipping address => non_physical_product => ignore
    
    const {
        country,
        state,
        city,
        zip,
        address,
        
        firstName,
        lastName,
        phone,
    } = shippingAddress;
    
    return (
        <>
            <p style={styles.paragraphFirst}>
                {firstName} {lastName} ({phone})
            </p>
            
            <p style={styles.paragraphLast}>
                {`${address}, ${city}, ${state} (${zip}), ${countryList?.entities?.[country]?.name ?? country}`}
            </p>
        </>
    );
};
const ShippingMethod = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            shippingAddress,
            shippingProvider,
        },
        shippingTracking,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!shippingAddress) return null; // no shipping address => non_physical_product => ignore
    
    const isShipped       = !!shippingTracking; // determine if already shipped
    const shippingCarrier = isShipped ? shippingTracking.shippingCarrier : shippingProvider?.name;
    const shippingEta     = isShipped ? shippingTracking.shippingEta     : shippingProvider?.eta;
    
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
                {shippingCarrier || null}
                
                {!!shippingEta && <span style={styles.textSmall}>
                    (estimate: {shippingEta.min}{(shippingEta.max > shippingEta.min) ? <>-{shippingEta.max}</> : null} day{(shippingEta.min > 1) ? 's' : ''} after dispatched from our warehouse)
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
    
    
    
    // jsx:
    if (!shippingTracking) return null; // not already shipped => ignore
    
    return (
        <>
            <p style={styles.paragraphBase}>
                {shippingTracking.shippingNumber}
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
    
    
    
    // jsx:
    if (!shippingTracking) return null; // not already shipped => ignore
    
    const baseUrl                      = business?.url;
    const relativeTrackingUrl          = model.trackingUrl;
    const absoluteTrackingUrl          = `${relativeTrackingUrl?.startsWith('/') ? baseUrl : ''}${relativeTrackingUrl}`;
    const absoluteTrackingUrlWithToken = `${absoluteTrackingUrl}?token=${encodeURIComponent(shippingTracking.token)}`;
    
    return (
        absoluteTrackingUrlWithToken
    );
};
const ShippingTrackingLink = (): React.ReactNode => {
    const url = ShippingTrackingUrl();
    
    
    
    // jsx:
    if (!url) return null; // not already shipped => ignore
    
    return (
        <a href={url}>
            {url}
        </a>
    );
};


export interface ShippingInfoProps {
    // styles:
    style ?: React.CSSProperties
    
    
    
    // accessibilities:
    title ?: React.ReactNode
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
        order : {
            shippingAddress,
        },
        shippingTracking,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!shippingAddress) return null; // no shipping address => non_physical_product => ignore
    
    const isShipped       = !!shippingTracking; // determine if already shipped
    
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
                    <th style={isShipped ? styles.tableTitleSide   : styles.tableTitleSideLast}>
                        Ship By
                    </th>
                    <td style={isShipped ? styles.tableContentSide : styles.tableContentSideLast}>
                        <ShippingMethod />
                    </td>
                </tr>
                
                {isShipped && <tr>
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

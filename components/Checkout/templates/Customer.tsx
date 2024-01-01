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

const CustomerName = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        customer,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!customer) return null;
    return (
        customer.name ?? null
    );
};
const CustomerEmail = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        customer,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!customer) return null;
    return (
        customer.email ?? null
    );
};


export interface CustomerInfoProps {
    // styles:
    style    ?: React.CSSProperties
    
    
    
    // accessibilities:
    title    ?: React.ReactNode
    readOnly ?: boolean
}
const CustomerInfo = (props: CustomerInfoProps): React.ReactNode => {
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
        customer,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!customer) return null;
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
                            ...styles.tableTitleSideLast,
                        }}
                    >
                        Account
                    </th>
                    <td
                        // styles:
                        style={{
                            // layouts:
                            ...(title ? null : styles.borderTopSide        ),
                            ...(title ? null : styles.tableContentSideFirst),
                            ...styles.tableContentSideLast,
                            display   : 'flex',
                            
                            
                            
                            // spacings:
                            columnGap : '0.5em',
                        }}
                    >
                        <CustomerEmail />
                        
                        <span style={styles.textSmall}>
                            (<CustomerName />)
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export const Customer = {
    Name  : CustomerName,
    Email : CustomerEmail,
    Info  : CustomerInfo,
};

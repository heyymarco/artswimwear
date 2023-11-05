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
        customer.nickName ?? null
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
    // accessibilities:
    title    ?: React.ReactNode
    readOnly ?: boolean
}
const CustomerInfo = (props: CustomerInfoProps): React.ReactNode => {
    // rest props:
    const {
        // accessibilities:
        title = 'Customer Info',
    } = props;
    
    
    
    // contexts:
    const {
        // data:
        customer,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!customer) return null;
    return (
        <table style={styles.tableReset}>
            {!!title && <thead>
                <tr>
                    <th colSpan={2} style={styles.tableTitleCenter}>
                        {title}
                    </th>
                </tr>
            </thead>}
            
            <tbody>
                <tr>
                    <th style={styles.tableTitleSide}>
                        Account
                    </th>
                    <td>
                        {customer.email}<span style={styles.secondaryText}> ({customer.nickName})</span>
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

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import * as styles          from './styles'
import {
    // hooks:
    useOrderDataContext,
}                           from './orderDataContext'



// react components:

const CustomerName = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        customerOrGuest,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!customerOrGuest) return null;
    return (
        customerOrGuest.name ?? null
    );
};
const CustomerEmail = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        customerOrGuest,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!customerOrGuest) return null;
    return (
        customerOrGuest.email ?? null
    );
};


export interface CustomerInfoProps {
    // styles:
    style ?: React.CSSProperties
    
    
    
    // accessibilities:
    title ?: React.ReactNode
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
        customerOrGuest,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!customerOrGuest) return null;
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

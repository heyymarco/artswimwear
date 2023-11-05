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
                    >Account</th>
                    <td>
                        {customer.email} ({customer.nickName})
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

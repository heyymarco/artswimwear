// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // hooks:
    useCustomerContext,
}                           from './customerContext.js'



// react components:

const CustomerName = (): React.ReactNode => {
    // contexts:
    const model = useCustomerContext();
    
    
    
    // jsx:
    return (
        model.nickName ?? null
    );
};
const CustomerEmail = (): React.ReactNode => {
    // contexts:
    const model = useCustomerContext();
    
    
    
    // jsx:
    return (
        model.email ?? null
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
    const model = useCustomerContext();
    
    
    
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
                    <th>Account</th>
                    <td>
                        {model.email} ({model.nickName})
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export const Customer = {
    Name  : CustomerName,
    Email : CustomerEmail,
    Info : CustomerInfo,
};

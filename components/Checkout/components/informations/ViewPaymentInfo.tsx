'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    ViewPaymentMethod,
}                           from '../informations/ViewPaymentMethod'
import {
    ViewBillingAddress,
}                           from '../informations/ViewBillingAddress'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
export interface ViewPaymentInfoProps {
    // accessibilities:
    title ?: React.ReactNode
}
const ViewPaymentInfo = (props: ViewPaymentInfoProps): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        title = 'Payment Info',
    } = props;
    
    
    
    // states:
    const {
        // billing data:
        isBillingRequired,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <table>
            {!!title && <thead>
                <tr>
                    <th colSpan={2}>
                        {title}
                    </th>
                </tr>
            </thead>}
            
            <tbody>
                <tr>
                    <th>Payment Method</th>
                    <td
                        // classes:
                        className='paymentInfo'
                    >
                        <ViewPaymentMethod />
                    </td>
                </tr>
                
                {isBillingRequired && <tr>
                    <th>Billing Address</th>
                    <td><ViewBillingAddress /></td>
                </tr>}
            </tbody>
        </table>
    );
};
export {
    ViewPaymentInfo,
    ViewPaymentInfo as default,
};

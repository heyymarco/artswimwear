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
        isBillingAddressRequired,
        
        
        
        // payment data:
        paymentMethod,
    } = useCheckoutState();
    const isPaid = (paymentMethod !== 'manual');
    
    
    
    // jsx:
    if (!isPaid) return null;
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
                        className='paymentMethod'
                    >
                        <ViewPaymentMethod />
                    </td>
                </tr>
                
                {isBillingAddressRequired && <tr>
                    <th>Billing Address</th>
                    <td
                        // classes:
                        className='billingAddress'
                    ><ViewBillingAddress /></td>
                </tr>}
            </tbody>
        </table>
    );
};
export {
    ViewPaymentInfo,
    ViewPaymentInfo as default,
};

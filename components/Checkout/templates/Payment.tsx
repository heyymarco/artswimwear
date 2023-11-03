// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // hooks:
    usePaymentContext,
}                           from './paymentContext.js'



// react components:

const BillingAddress = (): React.ReactNode => {
    // contexts:
    const {
        // billing data:
        billingAddress : address,
        
        
        
        // relation data:
        countryList,
    } = usePaymentContext();
    
    
    
    // jsx:
    if (!address) return null;
    const {
        // billing data:
        firstName : billingFirstName,
        lastName  : billingLastName,
        
        phone     : billingPhone,
        
        address   : billingAddress,
        city      : billingCity,
        zone      : billingZone,
        zip       : billingZip,
        country   : billingCountry,
    } = address;
    return (
        <>
            <p>
                {billingFirstName} {billingLastName} ({billingPhone})
            </p>
            <p>
                {`${billingAddress}, ${billingCity}, ${billingZone} (${billingZip}), ${countryList?.entities?.[billingCountry ?? '']?.name}`}
            </p>
        </>
    );
};
const PaymentMethod = (): React.ReactNode => {
    // contexts:
    const {
        // payment data:
        paymentType,
        paymentBrand,
        paymentIdentifier,
    } = usePaymentContext();
    
    
    
    // jsx:
    return (
        <>
            {
                !!paymentBrand
                ? <img
                    // appearances:
                    alt={paymentBrand}
                    src={`/brands/${paymentBrand}.svg`}
                    width={42}
                    height={26}
                />
                : (paymentType?.toUpperCase() ?? paymentType)
            }
            
            {!!paymentIdentifier && <span>
                ({paymentIdentifier})
            </span>}
        </>
    );
};


export interface PaymentInfoProps {
    // accessibilities:
    title    ?: React.ReactNode
    readOnly ?: boolean
}
const PaymentInfo = (props: PaymentInfoProps): React.ReactNode => {
    // rest props:
    const {
        // accessibilities:
        title = 'Payment Info',
    } = props;
    
    
    
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
                    <td><PaymentMethod /></td>
                </tr>
                
                <tr>
                    <th>Billing Address</th>
                    <td><BillingAddress /></td>
                </tr>
            </tbody>
        </table>
    );
};

export const Payment = {
    BillingAddress : BillingAddress,
    Method         : PaymentMethod,
    Info           : PaymentInfo,
};

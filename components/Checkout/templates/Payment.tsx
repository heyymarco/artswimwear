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

const BillingAddress = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            payment : {
                billingAddress : address,
            },
        },
        
        
        
        // relation data:
        countryList,
    } = useOrderDataContext();
    
    
    
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
        // data:
        order : {
            payment : {
                // payment data:
                type       : paymentType,
                brand      : paymentBrand,
                identifier : paymentIdentifier,
            },
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    return (
        <>
            {
                !!paymentBrand
                ? <>{paymentBrand}</>
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
        <table
            // styles:
            style={{
                // layouts:
                tableLayout: 'auto',
                
                
                
                // borders:
                borderCollapse: 'collapse',
                
                
                
                // typos:
                color: 'initial',
            }}
        >
            {!!title && <thead>
                <tr>
                    <th colSpan={2}
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
                    >Payment Method</th>
                    <td><PaymentMethod /></td>
                </tr>
                
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
                    >Billing Address</th>
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

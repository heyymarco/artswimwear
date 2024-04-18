'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewPaymentMethod = (): JSX.Element|null => {
    // states:
    const {
        // payment data:
        paymentType,
        paymentBrand,
        paymentIdentifier,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            {
                (!!paymentBrand && ['amex', 'discover', 'jcb', 'maestro', 'mastercard', 'paypal', 'visa'].includes(paymentBrand.toLowerCase()))
                ? <Image
                    // appearances:
                    alt={paymentBrand}
                    src={`/brands/${paymentBrand.toLowerCase()}.svg`}
                    width={42}
                    height={26}
                    
                    
                    
                    // classes:
                    className='paymentProvider'
                />
                : (paymentBrand?.toUpperCase() || paymentType)
            }
            
            {!!paymentIdentifier && <span
                // classes:
                className='paymentIdentifier txt-sec'
            >
                ({paymentIdentifier})
            </span>}
        </>
    );
};
export {
    ViewPaymentMethod,
    ViewPaymentMethod as default,
};

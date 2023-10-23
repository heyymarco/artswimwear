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
    // context:
    // TODO: replace payment api with finish checkout state
    const {makePaymentApi} = useCheckoutState();
    
    
    
    // apis:
    const [, {data: payment}] = makePaymentApi;
    const paymentMethod = payment?.paymentMethod;
    const type          = paymentMethod?.type;
    const brand         = paymentMethod?.brand || undefined;
    const identifier    = paymentMethod?.identifier;
    
    
    
    // jsx:
    return (
        <>
            {
                !!brand
                ? <Image
                    // appearances:
                    alt={brand}
                    src={`/brands/${brand}.svg`}
                    width={42}
                    height={26}
                    
                    
                    
                    // classes:
                    className='paymentProvider'
                />
                : (type?.toUpperCase() ?? type)
            }
            
            {!!identifier && <span
                // classes:
                className='paymentIdentifier'
            >
                ({identifier})
            </span>}
        </>
    );
};
export {
    ViewPaymentMethod,
    ViewPaymentMethod as default,
};

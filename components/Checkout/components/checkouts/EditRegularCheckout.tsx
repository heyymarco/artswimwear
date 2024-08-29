'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    EditCustomerAccount,
}                           from './EditCustomerAccount'
import {
    EditShippingAddress,
}                           from './EditShippingAddress'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const EditRegularCheckout = (): JSX.Element|null => {
    // states:
    const {
        // shipping data:
        isShippingAddressRequired,
        
        
        
        // sections:
        customerInfoSectionRef,
        shippingAddressSectionRef,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <Section
                // refs:
                elmRef={customerInfoSectionRef}
                
                
                
                // classes:
                className='contact'
                
                
                
                // accessibilities:
                title='Contact Information'
            >
                <EditCustomerAccount />
            </Section>
            
            {isShippingAddressRequired && <Section
                // refs:
                elmRef={shippingAddressSectionRef}
                
                
                
                // accessibilities:
                title='Shipping Address'
            >
                <EditShippingAddress />
            </Section>}
        </>
    );
};;
export {
    EditRegularCheckout,
    EditRegularCheckout as default,
};

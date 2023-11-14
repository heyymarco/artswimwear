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
import {
    EditCustomerAccount,
}                           from './EditCustomerAccount'
import {
    EditShippingAddress,
}                           from './EditShippingAddress'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const EditRegularCheckout = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // shipping data:
        isShippingAddressRequired,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <Section
                // classes:
                className='contact'
                
                
                
                // accessibilities:
                title='Contact Information'
            >
                <EditCustomerAccount />
            </Section>
            
            {isShippingAddressRequired && <Section
                // classes:
                className={styleSheet.address}
                
                
                
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

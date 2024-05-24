'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // menu-components:
    Collapse,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    EditPaymentMethod,
}                           from './EditPaymentMethod'
import {
    EditBillingAddress,
}                           from './EditBillingAddress'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const EditPaymentAndBillingAddress = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // billing data:
        isBillingAddressRequired,
        
        
        
        // sections:
        billingAddressSectionRef,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <Collapse
                // classes:
                className='collapse'
                
                
                
                // behaviors:
                // lazy={true} // causes collapsing animation error
                
                
                
                // states:
                expanded={isBillingAddressRequired}
            >
                <Section
                    // refs:
                    elmRef={billingAddressSectionRef}
                    
                    
                    
                    // accessibilities:
                    title='Billing Address'
                >
                    <p>
                        Enter the address that matches your card&apos;s billing address.
                    </p>
                    
                    <EditBillingAddress />
                </Section>
            </Collapse>
            
            <Section
                // accessibilities:
                title='Payment Method'
            >
                <EditPaymentMethod />
            </Section>
        </>
    );
};
export {
    EditPaymentAndBillingAddress,
    EditPaymentAndBillingAddress as default,
};

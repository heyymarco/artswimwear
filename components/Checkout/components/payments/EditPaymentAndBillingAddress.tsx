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
}                           from '../payments/EditPaymentMethod'
import {
    EditBillingAddress,
}                           from '../payments/EditBillingAddress'

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
            <Section
                // classes:
                className={styleSheet.paymentMethod}
                
                
                
                // accessibilities:
                title='Payment Method'
            >
                <EditPaymentMethod />
            </Section>
            
            <Collapse
                // classes:
                className='collapse'
                
                
                
                // behaviors:
                lazy={true}
                
                
                
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
                        Select the address that matches your card or payment method.
                    </p>
                    
                    <EditBillingAddress />
                </Section>
            </Collapse>
        </>
    );
};
export {
    EditPaymentAndBillingAddress,
    EditPaymentAndBillingAddress as default,
};

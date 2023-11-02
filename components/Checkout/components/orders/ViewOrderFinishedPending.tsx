'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // notification-components:
    Alert,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    ViewCustomer,
}                           from '../informations/ViewCustomer'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewOrderFinishedPending = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // customer data:
        customerEmail,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <Section>
                <Alert
                    // variants:
                    theme='success'
                    
                    
                    
                    // states:
                    expanded={true}
                    
                    
                    
                    // components:
                    controlComponent={<React.Fragment />}
                >
                    <p className='h5'>
                        Your order has been confirmed.
                    </p>
                    <p>
                        You&apos;ll receive a confirmation email with your order number shortly.
                    </p>
                    <p>
                        Please <strong>follow the payment instructions</strong> sent to your email: <strong className={styleSheet.data}>{customerEmail}</strong>.
                    </p>
                </Alert>
            </Section>
            
            <Section
                // semantics:
                tag='aside'
                
                
                
                // classes:
                className={styleSheet.info}
            >
                <ViewCustomer />
            </Section>
        </>
    );
};
export {
    ViewOrderFinishedPending,
    ViewOrderFinishedPending as default,
};

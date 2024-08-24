'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewCustomerContact = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // customer data:
        customer,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <span
                // classes:
                className={`customerEmail ${styleSheet.data}`}
            >
                {customer?.email}
            </span>
            
            <span
                // classes:
                className={`customerName txt-sec ${styleSheet.data}`}
            >
                ({customer?.name})
            </span>
        </>
    );
};
export {
    ViewCustomerContact,
    ViewCustomerContact as default,
};

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
        customerNickName,
        customerEmail,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <span
                // classes:
                className={`customerEmail ${styleSheet.data}`}
            >
                {customerEmail}
            </span>
            
            <span
                // classes:
                className={`customerName txt-sec ${styleSheet.data}`}
            >
                ({customerNickName})
            </span>
        </>
    );
};
export {
    ViewCustomerContact,
    ViewCustomerContact as default,
};

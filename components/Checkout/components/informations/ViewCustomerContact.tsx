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
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // customer data:
        customerNickName,
        customerEmail,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <span className={styles.data}>{customerEmail}</span> (<span className={styles.data}>{customerNickName}</span>)
        </>
    );
};
export {
    ViewCustomerContact,
    ViewCustomerContact as default,
};

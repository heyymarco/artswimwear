'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// internal components:
import {
    SignInInfo,
}                           from '@/components/SignInInfo'

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
    
    
    
    // sessions:
    const { status: sessionStatus } = useSession();
    
    
    
    // jsx:
    // for sign in as customer => shows customer info:
    if (sessionStatus === 'authenticated') return (
        <SignInInfo size='sm' nude={true} />
    );
    
    // for sign in as guest => shows guest info:
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

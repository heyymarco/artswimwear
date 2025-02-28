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

// cssfn:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'

// internal components:
import {
    SignInInfo,
}                           from '@/components/SignInInfo'
import {
    SignInGate,
}                           from '@/components/SignInGate'



// react components:
const SignInCustomerAccount = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // sessions:
    const { data: session } = useSession();
    
    
    
    // jsx:
    return (
        <div
            // classes:
            className={styleSheet.signInCustomerSection}
        >
            {!!session && <div className={styleSheet.signInCustomerInfo}>
                <div className={styleSheet.signInCustomerInfoText}>
                    <p>
                        Signed in as:
                    </p>
                </div>
                <SignInInfo theme='success' />
            </div>}
            <SignInGate />
        </div>
    );
};
export {
    SignInCustomerAccount,
    SignInCustomerAccount as default,
};

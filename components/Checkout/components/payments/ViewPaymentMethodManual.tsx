'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    PortalToNavCheckoutSection,
}                           from '../navigations/PortalToNavCheckoutSection'
import {
    ButtonPaymentManual,
}                           from '../payments/ButtonPaymentManual'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewPaymentMethodManual = (): JSX.Element|null => {
    // states:
    const {
        // payment data:
        paymentMethod,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <p>
                Pay manually via <strong>bank transfer</strong>.
            </p>
            <p>
                We&apos;ll send <em>payment instructions</em> to your (billing) email after you&apos;ve <em>finished the order</em>.
            </p>
            
            {(paymentMethod === 'manual') && <PortalToNavCheckoutSection>
                <ButtonPaymentManual />
            </PortalToNavCheckoutSection>}
        </>
    );
};
export {
    ViewPaymentMethodManual,
    ViewPaymentMethodManual as default,
};

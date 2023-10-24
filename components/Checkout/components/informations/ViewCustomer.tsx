'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // an accessibility management system:
    AccessibilityProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    ViewCustomerContact,
}                           from '../informations/ViewCustomerContact'
import {
    ViewShippingAddress,
}                           from '../informations/ViewShippingAddress'
import {
    ViewShippingMethod,
}                           from '../informations/ViewShippingMethod'
import {
    ViewPaymentMethod,
}                           from '../informations/ViewPaymentMethod'
import {
    ViewBillingAddress,
}                           from '../informations/ViewBillingAddress'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewCustomer = (): JSX.Element|null => {
    // states:
    const {
        // states:
        isBusy,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <AccessibilityProvider
            // accessibilities:
            enabled={!isBusy}
        >
            <table>
                <thead>
                    <tr>
                        <th colSpan={2}>
                            Customer Information
                        </th>
                    </tr>
                </thead>
                
                <tbody>
                    <tr>
                        <th>Contact</th>
                        <td><ViewCustomerContact /></td>
                    </tr>
                    
                    <tr>
                        <th>Shipping Address</th>
                        <td><ViewShippingAddress /></td>
                    </tr>
                    
                    <tr>
                        <th>Shipping Method</th>
                        <td><ViewShippingMethod /></td>
                    </tr>
                    
                    <tr>
                        <th>Payment Method</th>
                        <td><ViewPaymentMethod /></td>
                    </tr>
                    
                    <tr>
                        <th>Billing Address</th>
                        <td><ViewBillingAddress /></td>
                    </tr>
                </tbody>
            </table>
        </AccessibilityProvider>
    );
};
export {
    ViewCustomer,
    ViewCustomer as default,
};

'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

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



// react components:
const ViewCustomer = (): JSX.Element|null => {
    // jsx:
    return (
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
    );
};
export {
    ViewCustomer,
    ViewCustomer as default,
};

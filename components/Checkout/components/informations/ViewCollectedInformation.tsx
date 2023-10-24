'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    ViewCustomerContact,
}                           from '../informations/ViewCustomerContact'
import {
    ViewShippingAddress,
}                           from '../informations/ViewShippingAddress'
import {
    ViewShippingMethod,
}                           from '../informations/ViewShippingMethod'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewCollectedInformation = (): JSX.Element|null => {
    // states:
    const {
        // states:
        checkoutStep,
        
        
        
        // actions:
        gotoStepInformation,
        gotoStepShipping,
    } = useCheckoutState();
    
    
    
    // handlers:
    const handleGotoContactInfo      = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        gotoStepInformation(/* focusTo: */'contactInfo');
    });
    const handleGotoShippingAddress  = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        gotoStepInformation(/* focusTo: */'shippingAddress');
    });
    const handleGotoShippingProvider = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        gotoStepShipping();
    });
    
    
    
    // jsx:
    return (
        <table>
            <tbody>
                <tr>
                    <th>Contact</th>
                    <td><ViewCustomerContact /></td>
                    <td>
                        <EditButton onClick={handleGotoContactInfo} />
                    </td>
                </tr>
                
                <tr>
                    <th>Ship To</th>
                    <td><ViewShippingAddress /></td>
                    <td>
                        <EditButton onClick={handleGotoShippingAddress} />
                    </td>
                </tr>
                
                {(checkoutStep !== 'shipping') && <tr>
                    <th>Method</th>
                    <td><ViewShippingMethod /></td>
                    <td>
                        <EditButton onClick={handleGotoShippingProvider} />
                    </td>
                </tr>}
            </tbody>
        </table>
    );
};
export {
    ViewCollectedInformation,
    ViewCollectedInformation as default,
};

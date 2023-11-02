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

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
export interface ViewCustomerInfoProps {
    // accessibilities:
    title    ?: React.ReactNode
    readOnly ?: boolean
}
const ViewCustomerInfo = (props: ViewCustomerInfoProps): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        title    = 'Customer Info',
        readOnly = false,
    } = props;
    
    
    
    // states:
    const {
        // actions:
        gotoStepInformation,
    } = useCheckoutState();
    
    
    
    // handlers:
    const handleGotoContactInfo      = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        gotoStepInformation(/* focusTo: */'contactInfo');
    });
    
    
    
    // jsx:
    return (
        <table>
            {!!title && <thead>
                <tr>
                    <th colSpan={3}>
                        {title}
                    </th>
                </tr>
            </thead>}
            
            <tbody>
                <tr>
                    <th>Account</th>
                    <td><ViewCustomerContact /></td>
                    {!readOnly && <td>
                        <EditButton onClick={handleGotoContactInfo} />
                    </td>}
                </tr>
            </tbody>
        </table>
    );
};
export {
    ViewCustomerInfo,
    ViewCustomerInfo as default,
};

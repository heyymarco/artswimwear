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
    ViewShippingAddress,
}                           from './ViewShippingAddress'
import {
    ViewShippingMethod,
}                           from './ViewShippingMethod'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
export interface ViewShippingInfoProps {
    // accessibilities:
    title    ?: React.ReactNode
    readOnly ?: boolean
}
const ViewShippingInfo = (props: ViewShippingInfoProps): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        title    = 'Shipping Info',
        readOnly = false,
    } = props;
    
    
    
    // states:
    const {
        // states:
        checkoutStep,
        
        
        
        // shipping data:
        isShippingAddressRequired,
        
        
        
        // actions:
        gotoStepInformation,
        gotoStepShipping,
    } = useCheckoutState();
    
    
    
    // handlers:
    const handleGotoShippingAddress  = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        gotoStepInformation(/* focusTo: */'shippingAddress');
    });
    const handleGotoShippingProvider = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        gotoStepShipping();
    });
    
    
    
    // jsx:
    if (!isShippingAddressRequired) return null;
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
                    <th>Ship To</th>
                    <td><ViewShippingAddress /></td>
                    {!readOnly && <td>
                        <EditButton onClick={handleGotoShippingAddress} />
                    </td>}
                </tr>
                
                {(checkoutStep !== 'shipping') && <tr>
                    <th>Ship By</th>
                    <td
                        // classes:
                        className='shippingMethod'
                    >
                        <ViewShippingMethod />
                    </td>
                    {!readOnly && <td>
                        <EditButton onClick={handleGotoShippingProvider} />
                    </td>}
                </tr>}
            </tbody>
        </table>
    );
};
export {
    ViewShippingInfo,
    ViewShippingInfo as default,
};

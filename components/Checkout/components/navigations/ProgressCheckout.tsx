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

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    List,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ProgressCheckout = (): JSX.Element|null => {
    // states:
    const {
        // states:
        checkoutProgress,
        
        isDesktop,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <AccessibilityProvider
            // accessibilities:
            enabled={true}         // always enabled
            inheritEnabled={false} // always enabled
        >
            <List
                // variants:
                size='sm'
                theme={!isDesktop ? 'secondary' : 'primary'}
                outlined={!isDesktop}
                listStyle='breadcrumb'
                orientation='inline'
            >
                <ListItem active={checkoutProgress >= 0}>Information</ListItem>
                <ListItem active={checkoutProgress >= 1}>Shipping</ListItem>
                <ListItem active={checkoutProgress >= 2}>Payment</ListItem>
            </List>
        </AccessibilityProvider>
    );
};
export {
    ProgressCheckout,
    ProgressCheckout as default,
}

'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

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
    );
};
export {
    ProgressCheckout,
    ProgressCheckout as default,
}

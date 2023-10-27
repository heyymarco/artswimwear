'use client'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

import {
    // dialog-components:
    ModalExpandedChangeEvent,
    ModalSide,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    EditCart,
}                           from './components/carts/EditCart'
import {
    ViewSubtotalCart,
}                           from './components/carts/ViewSubtotalCart'

// internals:
import {
    useCartStyleSheet,
}                           from './styles/loader'
import {
    useCartState,
}                           from './states/cartState'



// react components:
export const CartDialog = () => {
    // styles:
    const styles = useCartStyleSheet();
    
    
    
    // states:
    const {
        // states:
        isCartShown,
        
        
        
        // actions:
        hideCart,
    } = useCartState();
    
    
    
    // handlers:
    const handleExpandedChange = useEvent<EventHandler<ModalExpandedChangeEvent> >(({expanded}) => {
        // conditions:
        if (expanded) return; // only interested of collapsed event
        
        
        
        // actions:
        hideCart();
    });
    
    
    
    // jsx:
    return (
        <ModalSide
            // variants:
            theme='primary'
            modalSideStyle='inlineEnd'
            
            
            
            // classes:
            className={styles.cartWindow}
            
            
            
            // behaviors:
            lazy={true}
            
            
            
            // states:
            expanded={isCartShown}
            
            
            
            // handlers:
            onExpandedChange={handleExpandedChange}
        >
            <EditCart />
            <ViewSubtotalCart />
        </ModalSide>
    )
};

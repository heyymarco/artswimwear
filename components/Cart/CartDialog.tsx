'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import {
    useRouter,
}                           from 'next/navigation'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

import {
    // simple-components:
    ButtonIcon,
    CloseButton,
    
    
    
    // layout-components:
    CardHeader,
    CardBody,
    
    
    
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
const CartDialog = () => {
    // styles:
    const styles = useCartStyleSheet();
    
    
    
    // states:
    const {
        // states:
        isCartShown,
        
        isLoadingPage,
        isReadyPage,
        
        
        
        // cart data:
        hasCart,
        
        
        
        // actions:
        hideCart,
    } = useCartState();
    
    
    
    // navigations:
    const router = useRouter();
    
    
    
    // handlers:
    const handleExpandedChange = useEvent<EventHandler<ModalExpandedChangeEvent> >(({expanded}) => {
        // conditions:
        if (expanded) return; // only interested of collapsed event
        
        
        
        // actions:
        hideCart();
    });
    const handleClick          = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        hideCart();
        router.push('/checkout');
    });
    
    
    
    // jsx:
    return (
        <ModalSide
            // variants:
            theme='primary'
            modalSideStyle='inlineEnd'
            
            
            
            // behaviors:
            lazy={true}
            
            
            
            // states:
            expanded={isCartShown}
            
            
            
            // handlers:
            onExpandedChange={handleExpandedChange}
        >
            <CardHeader>
                <h1>
                    My Shopping Cart
                </h1>
                <CloseButton
                    // handlers:
                    onClick={hideCart}
                />
            </CardHeader>
            <CardBody
                // classes:
                className={styles.cartBody}
            >
                <EditCart />
                <ViewSubtotalCart />
                
                <p
                    // classes:
                    className={styles.shippingTips}
                >
                    Tax included and <u>shipping calculated</u> at checkout.
                </p>
                
                <ButtonIcon
                    // appearances:
                    icon={
                        (hasCart && isLoadingPage)
                        ? 'busy'
                        : 'shopping_bag'
                    }
                    
                    
                    
                    // variants:
                    size='lg'
                    theme='primary'
                    gradient={true}
                    
                    
                    
                    // accessibilities:
                    enabled={isReadyPage}
                    
                    
                    
                    // handlers:
                    onClick={handleClick}
                >
                    Place My Order
                </ButtonIcon>
            </CardBody>
        </ModalSide>
    );
}
export {
    CartDialog,
    CartDialog as default,
};

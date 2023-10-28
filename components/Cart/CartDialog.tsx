'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
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
export const CartDialog = () => {
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
    
    
    
    // refs:
    const cartBodyRef = useRef<HTMLElement|null>(null);
    
    
    
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
            <CardHeader>
                <h1
                    // classes:
                    className={`h5 ${styles.cartListTitle}`}
                >
                    My Shopping Cart
                </h1>
                <CloseButton
                    // handlers:
                    onClick={hideCart}
                />
            </CardHeader>
            <CardBody
                // refs:
                elmRef={cartBodyRef}
                
                
                
                // classes:
                className={styles.cartBody}
            >
                <EditCart />
                <ViewSubtotalCart />
                
                <p
                    // classes:
                    className={styles.shippingInfo}
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
    )
};

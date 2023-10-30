'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    
    
    
    // a capability of UI to highlight itself to attract user's attention:
    ExcitedChangeEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // status-components:
    BadgeProps,
    Badge,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// contexts:
import {
    // hooks:
    useCartState,
}                           from './states/cartState'



// react components:
export interface CartStatusProps
    extends
        // bases:
        BadgeProps
{
}
const CartStatus = (props: CartStatusProps) => {
    
    
    
    // contexts:
    const {
        // cart data:
        totalProductQuantity,
    } = useCartState();
    
    
    
    // dom effects:
    // animate <CartButton> when the `totalProductQuantity` changed:
    const [cartStatusExcited, setCartStatusExcited] = useState<boolean>(false)
    useEffect(() => {
        if (!totalProductQuantity) return;
        
        
        
        setCartStatusExcited(true);
    }, [totalProductQuantity]); // if the quantity changes => make an animation
    
    
    
    // handlers:
    const handleExcitedChange = useEvent<EventHandler<ExcitedChangeEvent>>(({excited}) => {
        setCartStatusExcited(excited);
    });
    
    
    
    // jsx:
    return (
        <Badge
            // other props:
            {...props}
            
            
            
            // variants:
            theme={props.theme ?? 'danger'}
            badgeStyle={props.badgeStyle ?? 'pill'}
            
            
            
            // states:
            expanded={!!totalProductQuantity}
            excited={cartStatusExcited}
            
            
            
            // handlers:
            onExcitedChange={handleExcitedChange}
        >
            {props.children ?? totalProductQuantity}
        </Badge>
    );
};
export {
    CartStatus,
    CartStatus as default,
}

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

// reusable-ui components:
import {
    // layout-components:
    ListProps,
    List,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    LoadingBlankSection,
    ErrorBlankSection,
    EmptyProductBlankSection,
}                           from '@/components/BlankSection'
import {
    EditCartItem,
}                           from './EditCartItem'

// internals:
import {
    useCartStyleSheet,
}                           from '../../styles/loader'
import {
    useCartState,
}                           from '../../states/cartState'



// react components:
export interface EditCartProps
    extends
        // bases:
        ListProps
{
    /* no props yet */
}
const EditCart = (props: EditCartProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCartStyleSheet();
    
    
    
    // rest props:
    const {
        /* no props yet */
    ...restListProps} = props;
    
    
    
    // states:
    const {
        // states:
        isCartEmpty,
        isCartLoading,
        isCartError,
        
        
        
        // cart data:
        items: cartItems,
        
        
        
        // actions:
        deleteProductFromCart,
        changeProductFromCart,
        
        hideCart,
        
        refetchCart,
    } = useCartState();
    
    
    
    // handlers:
    const handleChange = useEvent((productId: string, variantIds: string[], quantity: number) => {
        // actions:
        changeProductFromCart(productId, variantIds, quantity);
    });
    const handleDelete = useEvent(async (productId: string, variantIds: string[]): Promise<void> => {
        // actions:
        deleteProductFromCart(productId, variantIds);
    });
    
    
    
    // jsx:
    if (isCartEmpty  ) return ( // empty cart => never loading|error
        <EmptyProductBlankSection
            // classes:
            className={props.className}
            
            
            
            // handlers:
            onNavigate={hideCart}
        />
    );
    if (isCartLoading) return (
        <LoadingBlankSection
            // classes:
            className={props.className}
        />
    );
    if (isCartError  ) return (
        <ErrorBlankSection
            // classes:
            className={props.className}
            
            
            
            // handlers:
            onRetry={refetchCart}
        />
    );
    return (
        <List
            // other props:
            {...restListProps}
            
            
            
            // variants:
            listStyle='flush'
            
            
            
            // classes:
            className={`orderList ${styleSheet.editCart}`}
        >
            {cartItems.map((cartItem, itemIndex) =>
                <EditCartItem
                    // identifiers:
                    key={`${cartItem.productId}/${cartItem.variantIds.join('/')}` || itemIndex}
                    
                    
                    
                    // data:
                    cartItem={cartItem}
                    
                    
                    
                    // handlers:
                    onChange={handleChange}
                    onDelete={handleDelete}
                />
            )}
        </List>
    );
};
export {
    EditCart,
    EditCart as default,
};
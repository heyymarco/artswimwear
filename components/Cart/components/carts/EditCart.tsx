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
        isLoadingPage,
        isErrorPage,
        
        
        
        // cart data:
        cartItems,
        hasCart,
        
        
        
        // actions:
        deleteProductFromCart,
        changeProductFromCart,
        
        refetch,
    } = useCartState();
    
    
    
    // handlers:
    const handleChange = useEvent((productId, quantity) => {
        // actions:
        changeProductFromCart(productId, quantity);
    });
    const handleDelete = useEvent(async (productId: string): Promise<void> => {
        // actions:
        deleteProductFromCart(productId);
    });
    
    
    
    // jsx:
    if (!hasCart) return ( // empty cart => never loading|error
        <EmptyProductBlankSection
            // classes:
            className={props.className}
        />
    );
    if (isLoadingPage) return (
        <LoadingBlankSection
            // classes:
            className={props.className}
        />
    );
    if (isErrorPage)   return (
        <ErrorBlankSection
            // classes:
            className={props.className}
            
            
            
            // handlers:
            onRetry={refetch}
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
            {cartItems.map((cartEntry, itemIndex) =>
                <EditCartItem
                    // identifiers:
                    key={cartEntry.productId || itemIndex}
                    
                    
                    
                    // data:
                    cartEntry={cartEntry}
                    
                    
                    
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
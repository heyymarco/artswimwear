'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// redux:
import type {
    EntityState
}                           from '@reduxjs/toolkit'

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    ListProps,
    List,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

// stores:
import type {
    // types:
    OutOfStockItem,
}                           from '@/store/features/api/apiSlice'

// contexts:
import {
    // types:
    ProductPreview,
    
    
    
    // hooks:
    useCartState,
}                           from '@/components/Cart'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'

// utilities:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// react components:
export interface ViewOutOfStockProps
    extends
        // bases:
        ListProps
{
    // data:
    outOfStockItems : OutOfStockItem[]
    
    
    
    // relation data:
    productList     : EntityState<ProductPreview>|undefined
}
const ViewOutOfStock = (props: ViewOutOfStockProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        outOfStockItems,
        
        
        
        // relation data:
        productList,
    ...restListProps} = props;
    const isPlural = outOfStockItems.length > 1;
    
    
    
    // contexts:
    const {
        // states:
        isCartReady,
    } = useCartState();
    
    
    
    // jsx:
    return (
        <List
            // other props:
            {...restListProps}
        >
            <ListItem
                // variants:
                mild={false}
                
                
                
                // classes:
                className={styleSheet.viewOutOfStockTitle}
            >
                Changed {isPlural ? 'Items' : 'Item'}
            </ListItem>
            {outOfStockItems.map(({productId, stock}, index) => {
                // fn props:
                const product          = productList?.entities?.[productId];
                const isProductDeleted = isCartReady && !product; // the relation data is available but there is no specified productId in productList => it's a deleted product
                
                
                
                // jsx:
                return (
                    <ListItem
                        // identifiers:
                        key={index}
                        
                        
                        
                        // classes:
                        className={styleSheet.viewOutOfStockItem}
                    >
                        <h3
                            // classes:
                            className='title h6'
                        >
                            {
                                !isProductDeleted
                                ? productList?.entities?.[productId]?.name
                                : 'PRODUCT DELETED'
                            }
                        </h3>
                        
                        <Image
                            // appearances:
                            alt={product?.name ?? ''}
                            src={resolveMediaUrl(product?.image)}
                            sizes='64px'
                            
                            
                            
                            // classes:
                            className='prodImg'
                        />
                        
                        <strong
                            // classes:
                            className='info'
                        >
                            {
                                (stock > 0)
                                ? 'Stock limited.'
                                : 'Out of stock.'
                            }
                        </strong>
                        
                        <span
                            // classes:
                            className='action'
                        >
                            {
                                (stock > 0)
                                ? <><em>Quantity changed to</em> <strong>{stock}</strong>.</>
                                : <em><strong>Deleted</strong>.</em>
                            }
                        </span>
                    </ListItem>
                );
            })}
        </List>
    );
};
export {
    ViewOutOfStock,
    ViewOutOfStock as default,
};

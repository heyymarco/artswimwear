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
    ListProps,
    List,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

// internal components:
import {
    VariantIndicator,
}                           from '@/components/VariantIndicator'

// models:
import {
    type ProductPreview,
    type LimitedStockItem,
}                           from '@/models'

// internals:
import {
    useCartStyleSheet,
}                           from '../../styles/loader'
import {
    // hooks:
    useCartState,
}                           from '../../states/cartState'

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
    limitedStockItems : LimitedStockItem[]
    
    
    
    // relation data:
    productPreviews   : Map<string, ProductPreview> | null | undefined
}
const ViewOutOfStock = (props: ViewOutOfStockProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCartStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        limitedStockItems,
        
        
        
        // relation data:
        productPreviews,
    ...restListProps} = props;
    const isPlural = limitedStockItems.length > 1;
    
    
    
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
            {limitedStockItems.map(({productId, variantIds, stock}, index) => {
                // fn props:
                const product          = productPreviews?.get(productId);
                const variants         = product?.variantGroups.flat();
                const isProductDeleted = isCartReady && !product; // the relation data is available but there is no specified productId in productPreviews => it's a deleted product
                
                
                
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
                                ? (product?.name ?? <em>Unknown Product</em>)
                                : <em>Deleted Product</em>
                            }
                        </h3>
                        
                        <p className='variants'>
                            {
                                variantIds
                                .map((variantId) =>
                                    variants?.find(({id}) => (id === variantId))
                                )
                                .filter((variant): variant is Exclude<typeof variant, undefined> => !!variant)
                                .map((variant, variantIndex) =>
                                    <VariantIndicator key={variantIndex} model={variant} />
                                )
                            }
                        </p>
                        
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
                                : <><strong>Deleted</strong>.</>
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

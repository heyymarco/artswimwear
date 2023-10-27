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
    
    
    
    // an accessibility management system:
    AccessibilityProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    List,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    ResponsiveDetails,
}                           from '../ResponsiveDetails'
import {
    EditCartItem,
}                           from './EditCartItem'

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'

// internals:
import {
    useCartState,
}                           from '@/components/Cart' // TODO: use relative path

// configs:
import {
    COMMERCE_CURRENCY,
}                           from '@/commerce.config'



// react components:
export interface EditCartProps
    extends
        // bases:
        Pick<AccessibilityProps,
            |'readOnly'
        >
{
    // data:
    totalShippingCost ?: number|null|undefined
}
const EditCart = (props: EditCartProps): JSX.Element|null => {
    // rest props:
    const {
        // data:
        totalShippingCost,
        
        
        
        // accessibilities:
        readOnly = false,
    } = props;
    
    
    
    // states:
    const {
        // cart data:
        cartItems,
        totalProductPrice,
        
        
        
        // actions:
        deleteItem,
        changeItem,
    } = useCartState();
    const isPhysicalProduct     = (totalShippingCost !== null);
    const isNotShippingSelected = (totalShippingCost === undefined);
    
    
    
    // handlers:
    const handleChange = useEvent((productId, quantity) => {
        // actions:
        changeItem(productId, quantity);
    });
    const handleDelete = useEvent(async (productId: string): Promise<void> => {
        // actions:
        deleteItem(productId);
    });
    
    
    
    // jsx:
    return (
        <>
            <ResponsiveDetails
                // variants:
                theme='secondary'
                detailsStyle='content'
                
                
                
                // classes:
                className='orderCollapse'
                
                
                
                // accessibilities:
                title='Order List'
                
                enabled={true}         // always enabled
                inheritEnabled={false} // always enabled
                
                readOnly={readOnly}
            >
                <List
                    // variants:
                    listStyle='flat'
                    
                    
                    
                    // classes:
                    className='orderList'
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
            </ResponsiveDetails>
            
            <hr />
            
            <p className='currencyBlock'>
                Subtotal <span className='currency'>
                    {formatCurrency(totalProductPrice)}
                </span>
            </p>
            
            {isPhysicalProduct && <p className='currencyBlock'>
                Shipping <span className='currency'>
                    {
                        !isNotShippingSelected
                        ? formatCurrency(totalShippingCost)
                        : 'calculated at next step'
                    }
                </span>
            </p>}
            
            <hr />
            
            <p className='currencyBlock totalCost'>
                Total <span className='currency'>
                    {
                        !isNotShippingSelected
                        ? <>
                            {formatCurrency(totalProductPrice + (totalShippingCost ?? 0))}
                            {' '}
                            <span>{COMMERCE_CURRENCY}</span>
                        </>
                        : 'calculated at next step'
                    }
                </span>
            </p>
        </>
    );
};
export {
    EditCart,
    EditCart as default,
};
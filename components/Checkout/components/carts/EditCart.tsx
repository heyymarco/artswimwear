'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// redux:
import {
    useDispatch,
}                           from 'react-redux'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
    
    
    
    // an accessibility management system:
    AccessibilityProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    
    
    
    // layout-components:
    List,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    ResponsiveDetails,
}                           from '../ResponsiveDetails'
import {
    EditCartItem,
}                           from './EditCartItem'

// stores:
import {
    removeFromCart,
    setCartItemQuantity,
}                           from '@/store/features/cart/cartSlice'

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'

// internals:
import {
    useCartState,
}                           from '@/components/Cart' // TODO: use relative path
import {
    useCheckoutState,
}                           from '../../states/checkoutState'

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
}
const EditCart = (props: EditCartProps): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        readOnly = false,
    } = props;
    
    
    
    // states:
    const {
        // cart data:
        cartItems,
        totalProductPrice,
        
        
        
        // relation data:
        productList,
    } = useCartState();
    const {
        // shipping data:
        shippingProvider,
        totalShippingCost,
    } = useCheckoutState();
    const hasSelectedShipping = !!shippingProvider;
    
    
    
    // stores:
    const dispatch = useDispatch();
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // dialogs:
    const {
        showMessage,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleChange = useEvent((productId, quantity) => {
        // actions:
        dispatch(setCartItemQuantity({ productId, quantity }));
    });
    const handleDelete = useEvent(async (productId: string): Promise<void> => {
        // conditions:
        if (
            (await showMessage<'yes'|'no'>({
                theme    : 'warning',
                size     : 'sm',
                title    : <h1>Delete Confirmation</h1>,
                message  : <p>
                    Are you sure to remove product:<br />
                    <strong>{productList?.entities?.[productId]?.name ?? 'UNKNOWN PRODUCT'}</strong><br />from the cart?
                </p>,
                options  : {
                    yes  : <ButtonIcon icon='check'          theme='primary'>Yes</ButtonIcon>,
                    no   : <ButtonIcon icon='not_interested' theme='secondary' autoFocus={true}>No</ButtonIcon>,
                },
                // viewport : cartBodyRef,
            }))
            !==
            'yes'
        ) return;
        if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
        
        
        
        // actions:
        dispatch(removeFromCart({ productId }));
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
            
            <p className='currencyBlock'>
                Shipping <span className='currency'>
                    {
                        !!hasSelectedShipping
                        ? formatCurrency(totalShippingCost)
                        : 'calculated at next step'
                    }
                </span>
            </p>
            
            <hr />
            
            <p className='currencyBlock totalCost'>
                Total <span className='currency'>
                    {
                        !!hasSelectedShipping
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
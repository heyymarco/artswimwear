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
    List,
    
    
    
    // status-components:
    Badge,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

// internal components:
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    ResponsiveDetails,
}                           from '../ResponsiveDetails'

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewCart = (): JSX.Element|null => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // cart data:
        cartItems,
        totalProductPrice,
        
        
        
        // shipping data:
        shippingProvider,
        totalShippingCost,
        
        
        
        // relation data:
        productList,
    } = useCheckoutState();
    const hasSelectedShipping = !!shippingProvider;
    
    
    
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
            >
                <List
                    // variants:
                    listStyle='flat'
                    
                    
                    
                    // classes:
                    className='orderList'
                >
                    {cartItems.map((item, itemIndex) => {
                        // fn props:
                        const product          = productList?.entities?.[item.productId];
                        const productUnitPrice = product?.price;
                        
                        
                        
                        // jsx:
                        return (
                            <ListItem
                                // identifiers:
                                key={item.productId || itemIndex}
                                
                                
                                
                                // variants:
                                theme={!product ? 'danger' : undefined}
                                mild={!product ? false : undefined}
                                
                                
                                
                                // classes:
                                className={styles.productPreview}
                                
                                
                                
                                // accessibilities:
                                enabled={!!product}
                            >
                                <h3
                                    // classes:
                                    className='title h6'
                                >
                                    {product?.name ?? 'PRODUCT DELETED'}
                                </h3>
                                
                                {/* image + quantity */}
                                <CompoundWithBadge
                                    // components:
                                    wrapperComponent={<React.Fragment />}
                                    badgeComponent={
                                        <Badge
                                            // variants:
                                            theme='danger'
                                            badgeStyle='pill'
                                            
                                            
                                            
                                            // floatable:
                                            floatingPlacement='right-start'
                                            floatingShift={-3}
                                            floatingOffset={-20}
                                        >
                                            {item.quantity}x
                                        </Badge>
                                    }
                                    elementComponent={
                                        <Image
                                            // appearances:
                                            alt={product?.name ?? ''}
                                            src={resolveMediaUrl(product?.image)}
                                            sizes='64px'
                                            
                                            
                                            
                                            // classes:
                                            className='prodImg'
                                        />
                                    }
                                />
                                
                                {(productUnitPrice !== undefined) && <p className='unitPrice'>
                                    @ <span className='currency secondary'>
                                        {formatCurrency(productUnitPrice)}
                                    </span>
                                </p>}
                                
                                <p className='subPrice currencyBlock'>
                                    {!product && <>This product was deleted</>}
                                    <span className='currency'>
                                        {formatCurrency(productUnitPrice ? (productUnitPrice * item.quantity) : undefined)}
                                    </span>
                                </p>
                            </ListItem>
                        );
                    })}
                </List>
            </ResponsiveDetails>
            
            <hr />
            
            <p className='currencyBlock'>
                Subtotal products: <span className='currency'>
                    {formatCurrency(totalProductPrice)}
                </span>
            </p>
            
            <p className='currencyBlock'>
                Shipping: <span className='currency'>
                    {!!hasSelectedShipping ? formatCurrency(totalShippingCost) : 'calculated at next step'}
                </span>
            </p>
            
            <hr />
            
            <p className='currencyBlock totalCost'>
                Total: <span className='currency'>
                    {!!hasSelectedShipping ? formatCurrency(totalProductPrice + (totalShippingCost ?? 0)) : 'calculated at next step'}
                </span>
            </p>
        </>
    );
};
export {
    ViewCart,
    ViewCart as default,
};
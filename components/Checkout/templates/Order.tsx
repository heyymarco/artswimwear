// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // hooks:
    useOrderDataContext,
}                           from './orderDataContext'

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'



// utilities:
const getTotalProductPrice = (items: ReturnType<typeof useOrderDataContext>['order']['items']): number => {
    let totalProductPrice = 0;
    for (const {price, quantity} of items) {
        totalProductPrice += (price * quantity);
    } // for
    return totalProductPrice;
};



// react components:

const OrderId = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            orderId,
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    return orderId;
};
const OrderCreatedAt = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            createdAt,
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    return createdAt.toISOString();
};
export interface OrderSubtotalProps {
    label ?: React.ReactNode
}
const OrderSubtotal = (props: OrderSubtotalProps): React.ReactNode => {
    // rest props:
    const {
        // accessibilities:
        label = <span>Subtotal</span>,
    } = props;
    
    
    
    // contexts:
    const {
        // data:
        order : {
            items,
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    return (
        <>
            {label} <span className='currency'>
                {formatCurrency(getTotalProductPrice(items))}
            </span>
        </>
    );
};
export interface OrderShippingProps {
    label ?: React.ReactNode
}
const OrderShipping = (props: OrderShippingProps): React.ReactNode => {
    // rest props:
    const {
        // accessibilities:
        label = <span>Shipping</span>,
    } = props;
    
    
    
    // contexts:
    const {
        // data:
        order : {
            shippingCost,
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (shippingCost === null) return null;
    return (
        <>
            {label} <span className='currency'>
                {formatCurrency(shippingCost)}
            </span>
        </>
    );
};
export interface OrderTotalProps {
    label ?: React.ReactNode
}
const OrderTotal = (props: OrderTotalProps): React.ReactNode => {
    // rest props:
    const {
        // accessibilities:
        label = <span>Total</span>,
    } = props;
    
    
    
    // contexts:
    const {
        // data:
        order : {
            shippingCost,
            items,
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    return (
        <>
            {label} <span className='currency'>
                {formatCurrency(getTotalProductPrice(items) + (shippingCost ?? 0))}
            </span>
        </>
    );
};
const OrderItems = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            items,
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    return (
        <ul
            // styles:
            style={{
                // layouts:
                listStyleType : 'none',
                
                
                
                // spacings:
                margin        : 'unset',
                padding       : 'unset',
            }}
        >
            {items.map(({price, quantity, product}, itemIndex) => {
                // jsx:
                return (
                    <li
                        // identifiers:
                        key={itemIndex}
                        
                        
                        
                        // styles:
                        style={{
                            // spacings:
                            margin    : 'unset',
                            
                            
                            
                            // typos:
                            textAlign : 'unset'
                        }}
                    >
                        <h3>
                            {product?.name}
                        </h3>
                        
                        {!!product?.imageBase64 && <img
                            // appearances:
                            alt={product?.name ?? ''}
                            src={product?.imageBase64}
                            sizes='64px'
                            
                            
                            
                            // classes:
                            className='prodImg'
                        />}
                        
                        <p>
                            @ {formatCurrency(price)}
                        </p>
                        
                        <p>
                            qty: x{quantity}
                        </p>
                        
                        <p>
                            {formatCurrency((price !== undefined) ? (price * quantity) : undefined)}
                        </p>
                    </li>
                );
            })}
        </ul>
    );
};

export const Order = {
    Id        : OrderId,
    CreatedAt : OrderCreatedAt,
    Subtotal  : OrderSubtotal,
    Shipping  : OrderShipping,
    Total     : OrderTotal,
    Items     : OrderItems,
};

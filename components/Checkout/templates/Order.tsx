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
        <div>
            {items.map(({price, quantity, product}, itemIndex, {length: itemsCount}) => {
                // jsx:
                return (
                    <table
                        // identifiers:
                        key={itemIndex}
                        
                        
                        
                        // styles:
                        style={{
                            // layouts:
                            tableLayout: 'auto',
                            
                            
                            
                            // sizes:
                            width : '100%', // consistent width across item(s)
                            
                            
                            
                            // borders:
                            borderCollapse: 'collapse',
                            
                            
                            
                            // typos:
                            color: 'initial',
                        }}
                    >
                        <tbody>
                            <tr>
                                <td rowSpan={4}
                                    // styles:
                                    style={{
                                        // spacings:
                                        // paddingInlineEnd : '1em', // not supported by GMail
                                        paddingRight     : '1em',
                                    }}
                                >
                                    {!!product?.imageId && <img
                                        // appearances:
                                        alt={product?.name ?? ''}
                                        src={`cid:${product?.imageId}`}
                                        
                                        
                                        
                                        // styles:
                                        style={{
                                            // positions:
                                            verticalAlign: 'middle',
                                        }}
                                    />}
                                </td>
                                <th
                                    // styles:
                                    style={{
                                        // positions:
                                        verticalAlign : 'middle',
                                        
                                        
                                        
                                        // sizes:
                                        width : '100%', // fill the available table width
                                        
                                        
                                        
                                        // typos:
                                        fontSize   : '1rem',
                                        fontWeight : 'bold',
                                        textAlign  : 'start',
                                    }}
                                >
                                    {product?.name}
                                </th>
                            </tr>
                            <tr>
                                <td
                                    // styles:
                                    style={{
                                        // appearances:
                                        opacity    : 0.6,
                                        
                                        
                                        
                                        // typos:
                                        fontSize   : '0.75rem',
                                        fontWeight : 'lighter',
                                    }}
                                >
                                    @ {formatCurrency(price)}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span
                                        style={{
                                            // positions:
                                            verticalAlign : 'middle',
                                            
                                            
                                            
                                            // appearances:
                                            opacity    : 0.6,
                                            
                                            
                                            
                                            // typos:
                                            fontSize      : '0.75rem',
                                            fontWeight    : 'lighter',
                                        }}
                                    >qty: </span>
                                    <span
                                        style={{
                                            // positions:
                                            verticalAlign : 'middle',
                                            
                                            
                                            
                                            // typos:
                                            fontSize      : '1rem',
                                            fontWeight    : 'normal',
                                        }}
                                    >x{quantity}</span>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    // styles:
                                    style={{
                                        // typos:
                                        // fontSize   : '1rem',
                                        fontWeight : 'bold',
                                        textAlign  : 'end',
                                    }}
                                >
                                    {formatCurrency((price !== undefined) ? (price * quantity) : undefined)}
                                </td>
                            </tr>
                            {(itemIndex < (itemsCount - 1)) && <tr>
                                <td colSpan={2}>
                                    <hr />
                                </td>
                            </tr>}
                        </tbody>
                    </table>
                );
            })}
        </div>
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

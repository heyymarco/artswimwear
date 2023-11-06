// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import * as styles          from '@/components/Checkout/templates/styles'

// internals:
import {
    // hooks:
    useOrderDataContext,
}                           from './orderDataContext'

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'

// configs:
import {
    COMMERCE_CURRENCY,
}                           from '@/commerce.config'



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
        <p style={styles.paragraphCurrency}>
            {label}
            <span
                // styles:
                style={{
                    // typos:
                    ...styles.boldText,
                    ...styles.numberCurrency,
                }}
            >
                {formatCurrency(getTotalProductPrice(items))}
            </span>
        </p>
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
        <p style={styles.paragraphCurrency}>
            {label}
            <span
                // styles:
                style={{
                    // typos:
                    ...styles.boldText,
                    ...styles.numberCurrency,
                }}
            >
                {formatCurrency(shippingCost)}
            </span>
        </p>
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
        <p
            // styles:
            style={{
                // typos:
                ...styles.paragraphCurrency,
                ...styles.bigText,
            }}
        >
            {label}
            <span
                // styles:
                style={{
                    // typos:
                    ...styles.boldText,
                    ...styles.numberCurrency,
                }}
            >
                {formatCurrency(getTotalProductPrice(items) + (shippingCost ?? 0))}
                {' '}
                <span>{COMMERCE_CURRENCY}</span>
            </span>
        </p>
    );
};

export interface OrderItemsProps {
    // styles:
    style ?: React.CSSProperties
}
const OrderItems = (props: OrderItemsProps): React.ReactNode => {
    // rest props:
    const {
        // styles:
        style,
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
        <div
            // styles:
            style={style}
        >
            {items.map(({price, quantity, product}, itemIndex, {length: itemsCount}) => {
                // jsx:
                return (
                    <table
                        // identifiers:
                        key={itemIndex}
                        
                        
                        
                        // styles:
                        style={{
                            // layouts:
                            ...styles.tableReset,
                            
                            
                            
                            // sizes:
                            width : '100%', // consistent width across item(s)
                        }}
                    >
                        <tbody>
                            <tr>
                                <td rowSpan={4}
                                    // styles:
                                    style={{
                                        // spacings:
                                        // a spacer between product image and the product contents:
                                        paddingRight       : '1em', // fallback for GMail
                                        paddingInlineStart : 0,
                                        paddingInlineEnd   : '1em',
                                    }}
                                >
                                    {!!product?.imageId && <img
                                        // appearances:
                                        alt={product?.name ?? ''}
                                        src={`cid:${product?.imageId}`}
                                        
                                        
                                        
                                        // styles:
                                        style={{
                                            // positions:
                                            // center product image vertically:
                                            verticalAlign : 'middle',// backgrounds:
                                            
                                            
                                            
                                            background    : 'white',
                                        }}
                                    />}
                                </td>
                                <th
                                    // styles:
                                    style={{
                                        // layouts:
                                        ...styles.tableTitle,
                                        
                                        
                                        
                                        // sizes:
                                        width : '100%', // the product title fills the available table width
                                    }}
                                >
                                    {product?.name}
                                </th>
                            </tr>
                            <tr>
                                <td style={styles.smallText}>
                                    @ {formatCurrency(price)}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span style={styles.smallText}>qty: </span>
                                    <span style={styles.normalText}>
                                        x{quantity}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    // styles:
                                    style={{
                                        // typos:
                                        ...styles.boldText,
                                        
                                        
                                        
                                        // typos:
                                        textAlign  : 'end', // align to right_most
                                    }}
                                >
                                    {formatCurrency((price !== undefined) ? (price * quantity) : undefined)}
                                </td>
                            </tr>
                            {(itemIndex < (itemsCount - 1)) && <tr>
                                <td colSpan={2}>
                                    <hr style={styles.horzRule} />
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

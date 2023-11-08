// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import * as styles          from '@/components/Checkout/templates/styles'

// reusable-ui core:
import {
    // a spacer (gap) management system
    spacerValues,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

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
                    ...styles.textBold,
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
                    ...styles.textBold,
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
                ...styles.textBig,
            }}
        >
            {label}
            <span
                // styles:
                style={{
                    // layouts:
                    display       : 'flex',
                    flexDirection : 'row',
                    flexWrap      : 'nowrap',
                    
                    
                    
                    // spacings:
                    columnGap     : '0.3em',
                    
                    
                    
                    // typos:
                    ...styles.textBold,
                    ...styles.numberCurrency,
                }}
            >
                {formatCurrency(getTotalProductPrice(items) + (shippingCost ?? 0))}
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
                            {/* image + title */}
                            <tr>
                                {/* image */}
                                <td rowSpan={4}
                                    // styles:
                                    style={{
                                        // spacings:
                                        // a spacer between product image and the product contents:
                                        paddingRight       : `${spacerValues.md}`, // fallback for GMail
                                        paddingInlineStart : 0,
                                        paddingInlineEnd   : `${spacerValues.md}`,
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
                                
                                {/* title */}
                                <th colSpan={3}
                                    // styles:
                                    style={{
                                        // layouts:
                                        ...styles.tableTitleProduct,
                                        
                                        
                                        
                                        // sizes:
                                        width : '100%', // the product title fills the available table width
                                    }}
                                >
                                    {product?.name}
                                </th>
                            </tr>
                            
                            {/* unit price */}
                            <tr>
                                {/* label */}
                                <td style={styles.textSmall}>
                                    @
                                </td>
                                
                                {/* gap */}
                                <td style={styles.tableGapSeparator}></td>
                                
                                {/* value */}
                                <td style={styles.textSmall}>
                                    {formatCurrency(price)}
                                </td>
                            </tr>
                            
                            {/* quantity */}
                            <tr>
                                {/* label */}
                                <td style={styles.textSmall}>
                                    Qty
                                </td>
                                
                                {/* gap */}
                                <td style={styles.tableGapSeparator}></td>
                                
                                {/* value */}
                                <td style={styles.textNormal}>
                                    x{quantity}
                                </td>
                            </tr>
                            
                            {/* total per product price */}
                            <tr>
                                <td colSpan={3}
                                    // styles:
                                    style={{
                                        // typos:
                                        ...styles.textBold,
                                        
                                        
                                        
                                        // typos:
                                        textAlign  : 'end', // align to right_most
                                    }}
                                >
                                    {formatCurrency((price !== undefined) ? (price * quantity) : undefined)}
                                </td>
                            </tr>
                            
                            {/* separator */}
                            {(itemIndex < (itemsCount - 1)) && <tr>
                                <td colSpan={4}>
                                    <hr style={styles.borderHorz} />
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

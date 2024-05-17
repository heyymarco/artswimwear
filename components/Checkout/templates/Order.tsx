// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a spacer (gap) management system
    spacerValues,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// types:
import type {
    // types:
    WysiwygEditorState,
}                           from '@/components/editors/WysiwygEditor/types'

// lexical functions:
import {
    createHeadlessEditor,
}                           from '@lexical/headless'
import {
    $generateHtmlFromNodes,
}                           from '@lexical/html'

// nodes:
import {
    // defined supported nodes.
    defaultNodes,
}                           from '@/components/editors/WysiwygEditor/defaultNodes'

// internals:
import * as styles          from './styles'
import {
    // hooks:
    useOrderDataContext,
}                           from './orderDataContext'
import {
    // react components:
    CurrencyDisplay,
}                           from './CurrencyDisplay'

// stores:
import {
    // types:
    ProductPricePart,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    commerceConfig,
}                           from '@/commerce.config'



// utilities:
const getProductPriceParts = (items: ReturnType<typeof useOrderDataContext>['order']['items']): ProductPricePart[] => {
    const productPriceParts  : ProductPricePart[] = [];
    for (const {price, quantity} of items) {
        productPriceParts.push({
            priceParts : [price],
            quantity   : quantity,
        });
    } // for
    return productPriceParts;
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


const OrderSubtotalValue = (props: OrderSubtotalProps): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            items,
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    return (
        <span
            // styles:
            style={{
                // typos:
                ...styles.textBold,
                ...styles.numberCurrency,
            }}
        >
            <CurrencyDisplay amount={getProductPriceParts(items)} />
        </span>
    );
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
    
    
    
    // jsx:
    return (
        <p style={styles.paragraphCurrency}>
            {label}
            
            <OrderSubtotalValue />
        </p>
    );
};


const OrderShippingValue = (props: OrderShippingProps): React.ReactNode => {
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
        <span
            // styles:
            style={{
                // typos:
                ...styles.textBold,
                ...styles.numberCurrency,
            }}
        >
            <CurrencyDisplay amount={shippingCost} />
        </span>
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
            
            <OrderShippingValue />
        </p>
    );
};

const OrderTotalValue = (props: OrderTotalProps): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            preferredCurrency,
            shippingCost,
            items,
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    return (
        <span
            // styles:
            style={{
                // layouts:
                display   : 'flex',
                
                
                
                // spacings:
                columnGap : '0.3em',
                
                
                
                // typos:
                ...styles.textBold,
                ...styles.numberCurrency,
            }}
        >
            <CurrencyDisplay amount={[...getProductPriceParts(items), shippingCost]} />
            <span>{preferredCurrency ? preferredCurrency.currency : commerceConfig.defaultCurrency}</span>
        </span>
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
    
    
    
    // jsx:
    return (
        <p
            // styles:
            style={{
                // layouts:
                ...styles.paragraphCurrency,
                
                
                
                // typos:
                ...styles.textBig,
            }}
        >
            {label}
            
            <OrderTotalValue />
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
            {items.map(({price, quantity, product, variantIds}, itemIndex, {length: itemsCount}) => {
                const variants = product?.variantGroups.flat();
                
                
                
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
                                <td rowSpan={5}
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
                                        ...styles.tableColumnAutoSize,
                                    }}
                                >
                                    {product?.name}
                                </th>
                            </tr>
                            
                            {/* variants */}
                            <tr>
                                <td colSpan={3}
                                    // styles:
                                    style={styles.tableColumnAutoSize}
                                >
                                    <div
                                        // styles:
                                        style={{
                                            // layouts:
                                            display      : 'flex',
                                            
                                            
                                            
                                            // spacings:
                                            columnGap    : `calc(${spacerValues.md} / 4)`,
                                            marginBottom : `calc(${spacerValues.md} / 4)`,
                                        }}
                                    >
                                        {
                                            variantIds
                                            .map((variantId) =>
                                                variants?.find(({id}) => (id === variantId))?.name
                                            )
                                            .filter((variantName): variantName is Exclude<typeof variantName, undefined> => !!variantName)
                                            .map((variantName, variantIndex) =>
                                                <span key={variantIndex}
                                                    // styles:
                                                    style={{
                                                        // layouts:
                                                        ...styles.basicBox,
                                                        
                                                        
                                                        
                                                        // typos:
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    {variantName}
                                                </span>
                                            )
                                        }
                                    </div>
                                </td>
                            </tr>
                            
                            {/* unit price */}
                            <tr>
                                {/* label */}
                                <td
                                    // styles:
                                    style={{
                                        // typos:
                                        ...styles.textSmall,
                                        textAlign : 'end', // align to right_most
                                    }}
                                >
                                    @
                                </td>
                                
                                {/* gap */}
                                <td style={styles.tableGapSeparator}></td>
                                
                                {/* value */}
                                <td
                                    // styles:
                                    style={{
                                        // sizes:
                                        ...styles.tableColumnAutoSize,
                                        
                                        
                                        
                                        // typos:
                                        ...styles.textSmall,
                                    }}
                                >
                                    <CurrencyDisplay amount={price} />
                                </td>
                            </tr>
                            
                            {/* quantity */}
                            <tr>
                                {/* label */}
                                <td
                                    // styles:
                                    style={{
                                        // typos:
                                        ...styles.textSmall,
                                        textAlign : 'end', // align to right_most
                                    }}
                                >
                                    Qty
                                </td>
                                
                                {/* gap */}
                                <td style={styles.tableGapSeparator}></td>
                                
                                {/* value */}
                                <td
                                    style={{
                                        // sizes:
                                        ...styles.tableColumnAutoSize,
                                        
                                        
                                        
                                        // typos:
                                        ...styles.textNormal,
                                    }}
                                >
                                    x{quantity}
                                </td>
                            </tr>
                            
                            {/* total per product price */}
                            <tr>
                                <td colSpan={3}
                                    // styles:
                                    style={{
                                        // sizes:
                                        ...styles.tableColumnAutoSize,
                                        
                                        
                                        
                                        // typos:
                                        ...styles.textBold,
                                        textAlign : 'end', // align to right_most
                                    }}
                                >
                                    <CurrencyDisplay amount={price} multiply={quantity} />
                                </td>
                            </tr>
                            
                            {/* separator */}
                            {(itemIndex < (itemsCount - 1)) && <tr>
                                <td colSpan={4} style={styles.tableColumnAutoSize}>
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

export const OrderCancelationReason = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            cancelationReason,
        },
    } = useOrderDataContext();
    
    
    
    const editor = createHeadlessEditor({
        namespace   : 'WysiwygEditor', 
        editable    : false,
        
        editorState : (cancelationReason ?? undefined) as WysiwygEditorState|undefined,
        
        // theme       : defaultTheme(), // no need className(s) because email doesn't support styling
        nodes       : defaultNodes(),
    });
    
    
    
    // jsx:
    if (!cancelationReason) return null;
    return (
        // $generateHtmlFromNodes(editor) ?? null
        JSON.stringify(cancelationReason)
    );
};
export const OrderHasCancelationReason = (props: React.PropsWithChildren<{}>): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            cancelationReason,
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!cancelationReason) return null;
    return props.children;
};

export const Order = {
    Id                   : OrderId,
    CreatedAt            : OrderCreatedAt,
    
    SubtotalValue        : OrderSubtotalValue,
    Subtotal             : OrderSubtotal,
    
    ShippingValue        : OrderShippingValue,
    Shipping             : OrderShipping,
    
    TotalValue           : OrderTotalValue,
    Total                : OrderTotal,
    
    Items                : OrderItems,
    
    CancelationReason    : OrderCancelationReason,
    HasCancelationReason : OrderHasCancelationReason,
};

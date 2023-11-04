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
const OrderSubtotal = (): React.ReactNode => {
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
            Subtotal <span className='currency'>
                {formatCurrency(getTotalProductPrice(items))}
            </span>
        </>
    );
};
const OrderTotal = (): React.ReactNode => {
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
            Subtotal <span className='currency'>
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
        <ul style={{
            listStyleType : 'none',
            margin        : 'unset',
            padding       : 'unset',
        }}>
            {items.map(({price, quantity, product}, itemIndex) => {
                // jsx:
                return (
                    <li
                        // identifiers:
                        key={itemIndex}
                    >
                        <h6>{product?.name}</h6>
                        <p>@ {formatCurrency(price)}</p>
                        <p>qty: x{quantity}</p>
                        <p>{formatCurrency((price !== undefined) ? (price * quantity) : undefined)}</p>
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
    Total     : OrderTotal,
    Items     : OrderItems,
};

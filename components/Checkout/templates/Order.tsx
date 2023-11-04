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
const getTotalProductPrice = (items: ReturnType<typeof useOrderDataContext>['items']): number => {
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
        items,
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
        items,
        shippingCost,
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

export const Order = {
    Id        : OrderId,
    CreatedAt : OrderCreatedAt,
    Subtotal  : OrderSubtotal,
    Total     : OrderTotal,
};

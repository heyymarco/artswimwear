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
// const OrderSubtotal = (): React.ReactNode => {
//     // jsx:
//     return (
//         <>
//             Subtotal <span className='currency'>
//                 {formatCurrency(totalProductPrice)}
//             </span>
//         </>
//     );
// };

export const Order = {
    Id        : OrderId,
    CreatedAt : OrderCreatedAt,
    // Subtotal  : OrderSubtotal,
};

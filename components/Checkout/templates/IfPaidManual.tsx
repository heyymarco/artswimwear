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
export const IfPaidManual = (props: React.PropsWithChildren<{}>): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            payment : {
                type : paymentType,
            },
        },
        isPaid,
    } = useOrderDataContext();
    const isManualPayment = (paymentType === 'MANUAL_PAID');
    
    
    
    // jsx:
    if (!isPaid) return null;
    if (!isManualPayment) return null;
    return props.children;
};

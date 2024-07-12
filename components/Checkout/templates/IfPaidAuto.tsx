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
export const IfPaidAuto = (props: React.PropsWithChildren<{}>): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            payment,
        },
        isPaid,
    } = useOrderDataContext();
    const isManualPayment = (!!payment && (payment.type === 'MANUAL_PAID'));
    
    
    
    // jsx:
    if (!isPaid) return null;
    if (isManualPayment) return null;
    return props.children;
};

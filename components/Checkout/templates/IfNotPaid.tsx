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
export const IfNotPaid = (props: React.PropsWithChildren<{}>): React.ReactNode => {
    // contexts:
    const {
        // data:
        isPaid,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (isPaid) return null;
    return props.children;
};

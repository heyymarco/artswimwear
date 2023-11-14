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
export const IfPhysicalProduct = (props: React.PropsWithChildren<{}>): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            shippingAddress : address,
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!address) return null;
    return props.children;
};

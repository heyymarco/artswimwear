// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // hooks:
    useBusinessContext,
}                           from './businessDataContext'



// react components:

const BusinessName = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        model,
    } = useBusinessContext();
    
    
    
    // jsx:
    return (
        model?.name || null
    );
};
const BusinessUrl = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        model,
    } = useBusinessContext();
    
    
    
    // jsx:
    return (
        model?.url || null
    );
};

export const Business = {
    Name : BusinessName,
    Url  : BusinessUrl,
};

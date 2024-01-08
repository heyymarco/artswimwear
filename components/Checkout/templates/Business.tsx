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
const BusinessUrl = (): string|null => {
    // contexts:
    const {
        // data:
        model,
    } = useBusinessContext();
    const url = model?.url;
    
    
    
    // jsx:
    return (
        url || null
    );
};
export interface BusinessLinkProps {
    // children:
    children ?: React.ReactNode
}
const BusinessLink = (props: BusinessLinkProps): React.ReactNode => {
    const url = BusinessUrl();
    
    
    
    // jsx:
    if (!url) return null;
    return (
        <a href={url}>
            {props.children ?? url}
        </a>
    );
};

export const Business = {
    Name : BusinessName,
    Url  : BusinessUrl,
    Link : BusinessLink,
};

'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import {
    usePathname,
}                           from 'next/navigation'



// react components:
export interface IfPathProps {
    // conditions:
    ifPathname  : string
    
    
    
    // children:
    children   ?: React.ReactNode
}
const IfPath = (props: IfPathProps): JSX.Element|null => {
    // props:
    const {
        // conditions:
        ifPathname,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // states:
    const mayInterceptedPathname = usePathname();
    
    
    
    // jsx:
    if (ifPathname !== mayInterceptedPathname) return null;
    return (
        <>
            {children}
        </>
    );
};
export {
    IfPath,            // named export for readibility
    IfPath as default, // default export to support React.lazy
}

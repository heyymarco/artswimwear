'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // react components:
    BasicProps,
    Basic,
}                           from '@reusable-ui/basic'       // a base component

// stores:
import type {
    // types:
    VariantPreview,
}                           from '@/store/features/api/apiSlice'

// styles:
import {
    useVariantIndicatorStyleSheet,
}                           from './styles/loader'



// react components:
export interface VariantIndicatorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        BasicProps<TElement>
{
    // data:
    model : VariantPreview
}
const VariantIndicator = <TElement extends Element = HTMLElement>(props: VariantIndicatorProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // data:
        model : {
            name,
        },
        
        
        
        // other props:
        ...restVariantIndicatorProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useVariantIndicatorStyleSheet();
    
    
    
    // default props:
    const {
        // semantics:
        tag       = 'span',                       // defaults to <span>
        
        
        
        // variants:
        size      = 'sm',                         // defaults to sm
        
        
        
        // classes:
        className = styleSheet.main,              // defaults to internal styleSheet
        
        
        
        // children:
        children  = name,                         // defaults to name
        
        
        
        // other props:
        ...restBasicProps
    } = restVariantIndicatorProps;
    
    
    
    // jsx:
    return (
        <Basic<TElement>
            // other props:
            {...restBasicProps}
            
            
            
            // semantics:
            tag={tag}
            
            
            
            // variants:
            size={size}
            
            
            
            // classes:
            className={className}
        >
            {children}
        </Basic>
    );
}
export {
    VariantIndicator,            // named export for readibility
    VariantIndicator as default, // default export to support React.lazy
}

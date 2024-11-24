'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    type ViewPaymentMethodRedirectProps,
    ViewPaymentMethodRedirect,
}                           from './ViewPaymentMethodRedirect'

// internals:
import {
    qrisRedirectDialogComponent,
}                           from './defaults'



// react components:
export interface ViewPaymentMethodQrisProps
    extends
        // bases
        ViewPaymentMethodRedirectProps
{
}
const ViewPaymentMethodQris = (props: ViewPaymentMethodQrisProps): JSX.Element|null => {
    // default props:
    const {
        // components:
        redirectDialogComponent = qrisRedirectDialogComponent,
        
        
        
        // other props:
        ...restViewPaymentMethodRedirectProps
    } = props;
    
    
    
    // jsx:
    return (
        <ViewPaymentMethodRedirect
            // other props:
            {...restViewPaymentMethodRedirectProps}
            
            
            
            // components:
            redirectDialogComponent={redirectDialogComponent}
        />
    );
};
export {
    ViewPaymentMethodQris,            // named export for readibility
    ViewPaymentMethodQris as default, // default export to support React.lazy
}

'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui components:
import {
    // simple-components:
    type CheckProps,
    Check,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// models:
import {
    paymentMethodLimitMax,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetPaymentMethodPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface ConditionalCreditCardSaveCheckProps
    extends
        // bases:
        CheckProps
{
}
const ConditionalCreditCardSaveCheck = (props: ConditionalCreditCardSaveCheckProps): JSX.Element|null => {
    // sessions:
    const { data: session } = useSession();
    
    
    
    // jsx:
    if (!session) return null;
    return (
        <ImplementedConditionalCreditCardSaveCheck {...props} />
    );
};
const ImplementedConditionalCreditCardSaveCheck = (props: ConditionalCreditCardSaveCheckProps): JSX.Element|null => {
    // states:
    const {
        data    : paymentMethodPagination,
    } = useGetPaymentMethodPage({
        page    : 0, // show the first page (zero_based index)
        perPage : paymentMethodLimitMax, // show all items at one page
    });
    const isMaxLimitReached = ((paymentMethodPagination?.total ?? 0) >= paymentMethodLimitMax);
    
    
    
    // jsx:
    if (isMaxLimitReached) return null;
    
    
    
    // default props:
    const {
        // classes:
        className      = 'save',
        
        
        
        // forms:
        name           = 'cardSave',
        
        
        
        // values:
        value          = 1,
        defaultChecked = true,
        
        
        
        // children:
        children       = <>
            Save my credit card information for future use.
        </>,
        
        
        
        // other props:
        ...restCheckProps
    } = props;
    
    
    
    // jsx:
    return (
        <Check
            // other props:
            {...restCheckProps}
            
            
            
            // classes:
            className      = {className}
            
            
            
            // forms:
            name           = {name}
            
            
            
            // values:
            value          = {value}
            defaultChecked = {defaultChecked}
        >
            {children}
        </Check>
    );
};
export {
    ConditionalCreditCardSaveCheck,
    ConditionalCreditCardSaveCheck as default,
};

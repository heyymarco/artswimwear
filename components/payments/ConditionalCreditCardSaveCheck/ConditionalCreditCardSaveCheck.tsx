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

// cart components:
import {
    useCartState,
}                           from '@/components/Cart/states/cartState'

// models:
import {
    paymentMethodLimitMax,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetPaymentMethodOfCurreny,
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
        // accessibilities:
        currency,
    } = useCartState();
    const {
        data    : compatiblePaymentMethods,
    } = useGetPaymentMethodOfCurreny({
        currency,
    });
    const isMaxLimitReached = ((compatiblePaymentMethods?.length ?? 0) >= paymentMethodLimitMax);
    
    
    
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

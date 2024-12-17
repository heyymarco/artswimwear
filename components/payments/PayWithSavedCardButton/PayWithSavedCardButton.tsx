'use client'

// styles:
import {
    usePayWithSavedCardButtonStyleSheet,
}                           from './styles/loader'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    type ButtonIconProps,
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    PaymentMethodBrand,
}                           from '@/components/payments/PaymentMethodBrand'
import {
    PaymentMethodIdentifier,
}                           from '@/components/payments/PaymentMethodIdentifier'

// models:
import {
    type PaymentMethodDetail,
}                           from '@/models'



// react components:
export interface PayWithSavedCardButtonProps
    extends
        // bases:
        ButtonIconProps
{
    // data:
    model : PaymentMethodDetail
}
const PayWithSavedCardButton = (props: PayWithSavedCardButtonProps): JSX.Element|null => {
    // styles:
    const styles = usePayWithSavedCardButtonStyleSheet();
    
    
    
    // props:
    const {
        // data:
        model,
        
        
        
        // other props:
        ...restPayWithSavedCardButtonProps
    } = props;
    
    
    
    // default props:
    const {
        // appearances:
        icon      = 'shopping_bag',
        
        
        
        // variants:
        size      = 'lg',
        gradient  = true,
        
        
        
        // classes:
        className = '',
        
        
        
        // children:
        children  = <>
            <span>Pay with</span>
            <PaymentMethodBrand model={model} size='sm' />
            <PaymentMethodIdentifier model={model} mild={false} />
        </>,
        
        
        
        // other props:
        ...restButtonIconProps
    } = restPayWithSavedCardButtonProps
    
    
    
    // jsx:
    return (
        <ButtonIcon
            // other props:
            {...restButtonIconProps}
            
            
            
            // appearances:
            icon={icon}
            
            
            
            // variants:
            size={size}
            gradient={gradient}
            
            
            
            // classes:
            className={`${styles.main} ${className}`}
        >
            {children}
        </ButtonIcon>
    );
};
export {
    PayWithSavedCardButton,            // named export for readibility
    PayWithSavedCardButton as default, // default export to support React.lazy
}

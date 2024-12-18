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

// reusable-ui components:
import {
    // simple-components:
    Icon,
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
        
        
        
        // appearances:
        icon = 'shopping_bag',
        
        
        
        // other props:
        ...restPayWithSavedCardButtonProps
    } = props;
    
    
    
    // default props:
    const {
        // variants:
        size      = 'lg',
        gradient  = true,
        
        
        
        // classes:
        className = '',
        
        
        
        // children:
        children  = <>
            <span className={styles.responsive}>
                <span className='labelGroup'>
                    {!!icon && <Icon icon={icon} size='md' />}
                    <span>Pay with</span>
                </span>
                <span className='cardGroup'>
                    <PaymentMethodBrand      model={model} size='sm' />
                    <PaymentMethodIdentifier model={model} mild={false} />
                </span>
            </span>
        </>,
        
        
        
        // other props:
        ...restButtonIconProps
    } = restPayWithSavedCardButtonProps
    
    
    
    // jsx:
    return (
        <ButtonIcon
            // other props:
            {...restButtonIconProps}
            
            
            
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

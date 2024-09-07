'use client'

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
    Icon,
    ButtonIcon,
    
    
    
    // status-components:
    BadgeProps,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// models:
// utilities:
import {
    type PaymentType,
    type OrderStatus,
    
    publicOrderStatusTheme,
    publicOrderStatusText,
    publicOrderStatusIcon,
}                           from '@/models'



// react components:
export interface PublicOrderStatusBadgeProps
    extends
        // bases:
        Omit<BadgeProps<HTMLButtonElement>,
            // handlers:
            |'onClick' // overriden
        >
{
    // data:
    orderStatus  : OrderStatus
    paymentType ?: PaymentType
    
    reportedAt  ?: Date|null
    reviewedAt  ?: Date|null
    
    
    
    // handlers:
    onClick     ?: (params: { orderStatus: OrderStatus, isPaid: boolean }) => void
}
const PublicOrderStatusBadge = (props: PublicOrderStatusBadgeProps): JSX.Element|null => {
    // rest props:
    const {
        // data:
        orderStatus,
        paymentType,
        
        reportedAt,
        reviewedAt,
        
        
        
        // children:
        children,
        
        
        
        // handlers:
        onClick,
    ...restBadgeProps} = props;
    const preferredTheme = publicOrderStatusTheme(orderStatus, paymentType, reportedAt, reviewedAt);
    const hasAlternateTheme = ((preferredTheme === 'warning') || (preferredTheme === 'secondary'));
    
    
    
    // handlers:
    const handleClick = useEvent(() => {
        onClick?.({
            orderStatus,
            isPaid : (paymentType !== 'MANUAL'),
        });
    });
    
    
    
    // jsx:
    return (
        <ButtonIcon
            // other props:
            {...restBadgeProps}
            
            
            
            // variants:
            size={props.size ?? 'sm'}
            theme={props.theme ?? preferredTheme}
            
            
            
            // components:
            iconComponent={
                <Icon
                    // appearances:
                    icon={publicOrderStatusIcon(orderStatus, paymentType, reportedAt, reviewedAt)}
                    
                    
                    
                    // variants:
                    size='sm'
                    theme={hasAlternateTheme ? 'dark' : preferredTheme}
                    mild={hasAlternateTheme ? true : undefined}
                />
            }
            
            
            
            // handlers:
            onClick={handleClick}
        >
            {publicOrderStatusText(orderStatus, paymentType, reportedAt, reviewedAt)}
        </ButtonIcon>
    );
};
export {
    PublicOrderStatusBadge,
    PublicOrderStatusBadge as default,
}

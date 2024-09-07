'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    usePublicOrderStatusBadgeStyleSheet,
}                           from './styles/loader'

// reusable-ui components:
import {
    // base-components:
    Basic,
    useBasicStyleSheet,
    
    
    
    // simple-components:
    Icon,
    
    
    
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
}
const PublicOrderStatusBadge = (props: PublicOrderStatusBadgeProps): JSX.Element|null => {
    // props:
    const {
        // data:
        orderStatus,
        paymentType,
        
        reportedAt,
        reviewedAt,
        
        
        
        // children:
        children,
        
        
        
        // other props:
        ...restPublicOrderStatusBadge
    } = props;
    const preferredTheme = publicOrderStatusTheme(orderStatus, paymentType, reportedAt, reviewedAt);
    const hasAlternateTheme = ((preferredTheme === 'warning') || (preferredTheme === 'secondary'));
    
    
    
    // styles:
    const basicStyleSheet = useBasicStyleSheet();
    const styleSheet      = usePublicOrderStatusBadgeStyleSheet();
    
    
    
    // default props:
    const {
        // classes:
        mainClass = `${basicStyleSheet.main} ${styleSheet.main}`,
        
        
        
        // other props:
        ...restBasicProps
    } = restPublicOrderStatusBadge
    
    
    
    // jsx:
    return (
        <Basic
            // other props:
            {...restBasicProps}
            
            
            
            // variants:
            size={props.size ?? 'sm'}
            theme={props.theme ?? preferredTheme}
            
            
            
            // classes:
            mainClass={mainClass}
        >
            <Icon
                // appearances:
                icon={publicOrderStatusIcon(orderStatus, paymentType, reportedAt, reviewedAt)}
                
                
                
                // variants:
                size='sm'
                theme={hasAlternateTheme ? 'dark' : preferredTheme}
                mild={hasAlternateTheme ? true : undefined}
            />
            {publicOrderStatusText(orderStatus, paymentType, reportedAt, reviewedAt)}
        </Basic>
    );
};
export {
    PublicOrderStatusBadge,
    PublicOrderStatusBadge as default,
}

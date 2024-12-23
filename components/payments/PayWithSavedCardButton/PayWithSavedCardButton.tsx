'use client'

// styles:
import {
    usePayWithSavedCardButtonStyleSheet,
}                           from './styles/loader'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
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
    type ButtonIconProps,
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// payment components:
import {
    AuthenticatedResult,
    useTransactionState,
}                           from '@/components/payments/states'
import {
    messageFailed,
    messageCanceled,
    messageExpired,
    messageDeclined,
    messageDeclinedRetry,
}                           from '@/components/payments/error-messages/credit-card-error-messages'
import {
    PaymentMethodBrand,
}                           from '@/components/payments/PaymentMethodBrand'
import {
    PaymentMethodIdentifier,
}                           from '@/components/payments/PaymentMethodIdentifier'
import {
    IfInStripeScriptProvider,
}                           from '@/components/payments/ConditionalStripeScriptProvider'
import {
    type ImperativeAuthenticate,
}                           from './ImperativeStripeAuthenticate'

// models:
import {
    // types:
    type PaymentDetail,
    type PlaceOrderDetail,
    
    type PaymentMethodDetail,
}                           from '@/models'

// react lazies:
const ImperativeStripeAuthenticateLazy = React.lazy(() => import('./ImperativeStripeAuthenticate'));



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
    
    
    
    // states:
    const {
        // actions:
        startTransaction,
        placeOrder,
    } = useTransactionState();
    
    
    
    // refs:
    const imperativeAuthenticateRef = useRef<ImperativeAuthenticate>(null);
    
    
    
    // handlers:
    const handlePayButtonClick = useEvent(() => {
        startTransaction({
            // options:
            paymentOption        : 'SAVED_CARD',
            performValidate      : false,
            
            
            
            // handlers:
            onPlaceOrder         : handlePlaceOrder,
            onAuthenticate       : handleAuthenticate,
            
            
            
            // messages:
            messageFailed        : messageFailed,
            messageCanceled      : messageCanceled,
            messageExpired       : messageExpired,
            messageDeclined      : messageDeclined,
            messageDeclinedRetry : messageDeclinedRetry,
        });
    });
    const handlePlaceOrder   = useEvent(async (): Promise<PlaceOrderDetail|PaymentDetail|false> => {
        return await placeOrder({
            paymentSource  : 'savedCard',
            cardToken      : model.id,
        });
    });
    const handleAuthenticate = useEvent(async (placeOrderDetail: PlaceOrderDetail): Promise<AuthenticatedResult|PaymentDetail> => {
        if (!placeOrderDetail.redirectData) return AuthenticatedResult.AUTHORIZED; // paid => waiting for the payment to be captured on server side
        
        
        
        // handle 3ds verification for stripe:
        if (placeOrderDetail.orderId.startsWith('#STRIPE_')) {
            const handleStripeAuthenticate = imperativeAuthenticateRef.current?.onAuthenticate;
            if (!handleStripeAuthenticate) return AuthenticatedResult.FAILED;
            return handleStripeAuthenticate(placeOrderDetail);
        } // if
        
        
        
        return AuthenticatedResult.FAILED; // no idea to handle => defaults to FAILED
    });
    
    
    
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
        <>
            <ButtonIcon
                // other props:
                {...restButtonIconProps}
                
                
                
                // variants:
                size={size}
                gradient={gradient}
                
                
                
                // classes:
                className={`${styles.main} ${className}`}
                
                
                
                // handlers:
                onClick={handlePayButtonClick}
            >
                {children}
            </ButtonIcon>
            
            <IfInStripeScriptProvider>
                <ImperativeStripeAuthenticateLazy authenticateRef={imperativeAuthenticateRef} />
            </IfInStripeScriptProvider>
        </>
    );
};
export {
    PayWithSavedCardButton,            // named export for readibility
    PayWithSavedCardButton as default, // default export to support React.lazy
}

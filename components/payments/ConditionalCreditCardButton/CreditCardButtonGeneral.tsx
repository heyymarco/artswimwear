'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useImperativeHandle,
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
    type ButtonIconProps,
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// payment components:
import {
    type StartTransactionArg,
    useTransactionState,
    useOnFinishOrder,
}                           from '@/components/payments/states'
import {
    messageFailed,
    messageCanceled,
    messageExpired,
    messageDeclined,
    messageDeclinedRetry,
}                           from '@/components/payments/error-messages/credit-card-error-messages'

// models:
import {
    // types:
    type PaymentDetail,
}                           from '@/models'



// react components:
export interface ImperativeClick {
    click: (event?: React.MouseEvent<HTMLButtonElement>) => Promise<PaymentDetail|null>
}
interface CreditCardButtonGeneralProps
    extends
        // bases:
        ButtonIconProps,
        
        // handlers:
        Pick<StartTransactionArg,
            // handlers:
            |'onPlaceOrder'
            |'onAuthenticate'
        >
{
    // refs:
    clickRef ?: React.Ref<ImperativeClick>
}
export interface ImplementedCreditCardButtonGeneralProps
    extends
        // bases:
        Omit<CreditCardButtonGeneralProps,
            // handlers:
            |'onPlaceOrder'
            |'onAuthenticate'
        >
{
}
const CreditCardButtonGeneral = (props: CreditCardButtonGeneralProps): JSX.Element|null => {
    // props:
    const {
        // refs:
        clickRef,
        
        
        
        // handlers:
        onPlaceOrder   : handlePlaceOrder,
        onAuthenticate : handleAuthenticate,
        
        
        
        // other props:
        ...restCreditCardButtonGeneralProps
    } = props;
    
    
    
    // states:
    const {
        // states:
        isTransactionReady,
        
        
        
        // actions:
        startTransaction,
    } = useTransactionState();
    
    
    
    // refs:
    const signalFinishOrderRef = useRef<((paymentDetail: PaymentDetail|null) => void)|undefined>(undefined);
    
    
    
    // handlers:
    const handlePayButtonClick = useEvent(async (event?: React.MouseEvent<HTMLButtonElement>): Promise<PaymentDetail|null> => {
        const { promise: promiseFinishOrder, resolve: resolveFinishOrder } = Promise.withResolvers<PaymentDetail|null>();
        signalFinishOrderRef.current = (paymentDetail: PaymentDetail|null): void => { // deref the proxy_resolver
            resolveFinishOrder(paymentDetail);        // invoke the origin_resolver
            signalFinishOrderRef.current = undefined; // now it's resolved => unref the proxy_resolver
        };
        
        
        
        startTransaction({
            // options:
            paymentOption        : 'CARD',
            
            
            
            // handlers:
            onPlaceOrder         : handlePlaceOrder,
            onAuthenticate       : handleAuthenticate,
            
            
            
            // messages:
            messageFailed        : messageFailed,
            messageCanceled      : messageCanceled,
            messageExpired       : messageExpired,
            messageDeclined      : messageDeclined,
            messageDeclinedRetry : messageDeclinedRetry,
        })
        .finally(() => { // cleanups:
            signalFinishOrderRef.current?.(null);     // notify the handleFinishOrder is never called (if never signaled)
            signalFinishOrderRef.current = undefined; // unref the proxy_resolver
        });
        
        
        
        return promiseFinishOrder;
    });
    
    const handleFinishOrder    = useEvent((paymentDetail: PaymentDetail): void => {
        signalFinishOrderRef.current?.(paymentDetail);
    });
    useOnFinishOrder(handleFinishOrder);
    
    
    
    // imperatives:
    useImperativeHandle(clickRef, () => ({
        click : handlePayButtonClick,
    }), []);
    
    
    
    // default props:
    const {
        // appearances:
        icon      = 'shopping_bag',
        
        
        
        // variants:
        gradient  = true,
        
        
        
        // classes:
        className = '',
        
        
        
        // states:
        enabled   = isTransactionReady,
        
        
        
        // children:
        children  = <>
            Pay Now
        </>,
        
        
        
        // other props:
        ...restButtonIconProps
    } = restCreditCardButtonGeneralProps;
    
    
    
    // jsx:
    if (clickRef) return null; // do not render anything if `clickRef` is provided
    return (
        <ButtonIcon
            // other props:
            {...restButtonIconProps}
            
            
            
            // appearances:
            icon={icon}
            
            
            
            // variants:
            gradient={gradient}
            
            
            
            // classes:
            className={`payButton ${className}`}
            
            
            
            // states:
            enabled={enabled}
            
            
            
            // handlers:
            onClick={handlePayButtonClick}
        >
            {children}
        </ButtonIcon>
    );
};
export {
    CreditCardButtonGeneral,            // named export for readibility
    CreditCardButtonGeneral as default, // default export to support React.lazy
}

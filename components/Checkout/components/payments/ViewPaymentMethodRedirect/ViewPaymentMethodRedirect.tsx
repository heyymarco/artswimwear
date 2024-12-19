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
    type ButtonIconProps,
    ButtonIcon,
    
    
    
    // dialog-components:
    type ModalExpandedChangeEvent,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    ButtonWithBusy,
}                           from '../../ButtonWithBusy'

// models:
import {
    // types:
    type PaymentDetail,
    
    type PaymentOption,
    type PlaceOrderRequestOptions,
    type PlaceOrderDetail,
}                           from '@/models'

// states:
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
}                           from '@/components/payments/error-messages/redirect-error-messages'

// internals:
import {
    type BaseRedirectDialogProps,
}                           from './types'
import {
    defaultRedirectDialogComponent,
}                           from './defaults'



// react components:
export interface ViewPaymentMethodRedirectProps {
    paymentOption            : Extract<PaymentOption,
        | 'QRIS'
        | 'GOPAY'
        | 'SHOPEEPAY'
    >
    // configs:
    appName                  : string
    paymentInstruction       : React.ReactNode
    paymentButtonText        : React.ReactNode
    paymentButtonIcon       ?: ButtonIconProps['icon']
    
    
    
    // components:
    redirectDialogComponent ?: React.ReactElement<BaseRedirectDialogProps<Element, ModalExpandedChangeEvent<PaymentDetail|false|0>>>
}
const ViewPaymentMethodRedirect = (props: ViewPaymentMethodRedirectProps): JSX.Element|null => {
    // props:
    const {
        // configs:
        paymentOption,
        appName,
        paymentInstruction,
        paymentButtonText,
        paymentButtonIcon = 'shopping_bag',
        
        
        
        // components:
        redirectDialogComponent = defaultRedirectDialogComponent,
    } = props;
    
    
    
    // states:
    const {
        // states:
        isTransactionReady,
        
        
        
        // actions:
        startTransaction,
        placeOrder,
    } = useTransactionState();
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handlePayWithRedirect  = useEvent(async (): Promise<void> => {
        startTransaction({
            // options:
            paymentOption        : paymentOption,
            
            
            
            // handlers:
            onPlaceOrder         : (): Promise<PlaceOrderDetail|PaymentDetail|false> => {
                // createOrder:
                return placeOrder({
                    paymentSource : (() => {
                        switch (paymentOption) {
                            case 'QRIS'      : return 'midtransQris';
                            case 'GOPAY'     : return 'gopay';
                            case 'SHOPEEPAY' : return 'shopeepay';
                            default          : throw Error('app error');
                        } // switch
                    })(),
                });
            },
            onAuthenticate       : async (placeOrderDetail: PlaceOrderDetail): Promise<AuthenticatedResult|PaymentDetail> => {
                const redirectData = placeOrderDetail.redirectData; // get the unfinished redirectData
                if (!redirectData) return AuthenticatedResult.FAILED; // undefined|empty_string => failed
                
                
                
                let expires = placeOrderDetail.expires;
                if (typeof(expires) === 'string') expires = new Date(Date.parse(expires));
                
                
                
                const redirectResult = await showDialog<PaymentDetail|false|0>(
                    React.cloneElement<BaseRedirectDialogProps<Element, ModalExpandedChangeEvent<PaymentDetail|false|0>>>(redirectDialogComponent,
                        // props:
                        {
                            // data:
                            placeOrderDetail : {
                                ...placeOrderDetail,
                                redirectData,
                                expires,
                            },
                            
                            
                            
                            // accessibilities:
                            appName,
                        },
                    )
                );
                switch (redirectResult) {
                    case 0         : return AuthenticatedResult.EXPIRED;
                    case undefined : return AuthenticatedResult.CANCELED;
                    case false     : return AuthenticatedResult.FAILED;
                } // switch
                return redirectResult;
            },
            
            
            
            // messages:
            messageFailed        : messageFailed,
            messageCanceled      : messageCanceled,
            messageExpired       : messageExpired,
            messageDeclined      : messageDeclined(appName),
            messageDeclinedRetry : messageDeclinedRetry,
        });
    });
    
    
    
    // jsx:
    return (
        <>
            {paymentInstruction}
            
            <ButtonWithBusy
                // behaviors:
                busyType={paymentOption}
                
                
                
                // components:
                buttonComponent={
                    <ButtonIcon
                        // appearances:
                        icon={paymentButtonIcon}
                        
                        
                        
                        // variants:
                        gradient={true}
                        
                        
                        
                        // states:
                        enabled={isTransactionReady}
                        
                        
                        
                        // handlers:
                        onClick={handlePayWithRedirect}
                    >
                        {paymentButtonText}
                    </ButtonIcon>
                }
            />
        </>
    );
};
export {
    ViewPaymentMethodRedirect,            // named export for readibility
    ViewPaymentMethodRedirect as default, // default export to support React.lazy
}

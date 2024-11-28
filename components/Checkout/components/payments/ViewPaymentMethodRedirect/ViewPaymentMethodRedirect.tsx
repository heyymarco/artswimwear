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
    type PaymentDetail,
    type PlaceOrderRequestOptions,
    type PlaceOrderDetail,
}                           from '@/models'

// states:
import {
    AuthenticatedResult,
    useTransactionState,
}                           from '@/components/payments/states'

// internals:
import {
    type BaseRedirectDialogProps,
}                           from './types'
import {
    defaultRedirectDialogComponent,
}                           from './defaults'



// react components:
export interface ViewPaymentMethodRedirectProps {
    paymentSource            : Extract<PlaceOrderRequestOptions['paymentSource'],
        |'gopay'
        |'shopeepay'
        |'midtransQris'
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
        paymentSource,
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
        doPlaceOrder,
    } = useTransactionState();
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handlePayWithRedirect  = useEvent(async (): Promise<void> => {
        startTransaction({
            // handlers:
            doPlaceOrder         : (): Promise<PlaceOrderDetail|PaymentDetail|false> => {
                // createOrder:
                return doPlaceOrder({
                    paymentSource : paymentSource,
                });
            },
            doAuthenticate       : async (placeOrderDetail: PlaceOrderDetail): Promise<AuthenticatedResult|PaymentDetail> => {
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
            messageFailed        : <>
                <p>
                    The transaction has been <strong>denied</strong> by the payment system.
                </p>
                <p>
                    <strong>No funds</strong> have been deducted.
                </p>
                <p>
                    Please try <strong>another payment method</strong>.
                </p>
            </>,
            messageCanceled      : <>
                <p>
                    The transaction has been <strong>canceled</strong> by the user.
                </p>
                <p>
                    <strong>No funds</strong> have been deducted.
                </p>
            </>,
            messageExpired       : <>
                <p>
                    The transaction has been <strong>canceled</strong> due to timeout.
                </p>
                <p>
                    <strong>No funds</strong> have been deducted.
                </p>
            </>,
            messageDeclined      : (errorMessage) => <>
                <p>
                    Unable to make a transaction using {appName}.
                </p>
                {!!errorMessage && <p>
                    {errorMessage}
                </p>}
                <p>
                    Please try <strong>another payment method</strong>.
                </p>
            </>,
        });
    });
    
    
    
    // jsx:
    return (
        <>
            {paymentInstruction}
            
            <ButtonWithBusy
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

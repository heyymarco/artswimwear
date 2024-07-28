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
    ButtonIcon,
    
    
    
    // dialog-components:
    PromiseDialog,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    ButtonWithBusy,
}                           from '../ButtonWithBusy'
import {
    RedirectDialog,
}                           from '@/components/dialogs/RedirectDialog'

// internals:
import {
    PlaceOrderOptions,
    useCheckoutState,
}                           from '../../states/checkoutState'

// models:
import type {
    PaymentDetail,
}                           from '@/models'



// react components:
export interface ViewPaymentMethodRedirectProps {
    paymentSource : PlaceOrderOptions['paymentSource']
    appName       : string
}
const ViewPaymentMethodRedirect = (props: ViewPaymentMethodRedirectProps): JSX.Element|null => {
    // props:
    const {
        paymentSource,
        appName,
    } = props;
    
    
    
    // states:
    const {
        // actions:
        gotoFinished,
        
        doTransaction,
        doPlaceOrder,
        doMakePayment,
    } = useCheckoutState();
    
    
    
    // dialogs:
    const {
        showDialog,
        showMessageError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handlePayWithRedirect  = useEvent(async (): Promise<void> => {
        doTransaction(async () => {
            try {
                // createOrder:
                const draftOrderDetail = await doPlaceOrder({
                    paymentSource : paymentSource,
                });
                if (draftOrderDetail === true) throw Error('Oops, an error occured!'); // immediately paid => no need further action, that should NOT be happened
                
                
                
                const redirectData = draftOrderDetail.redirectData; // get the unfinished redirectData
                if (redirectData) { // not undefined && not empty_string
                    const redirectResult = await showDialog<PaymentDetail|false>(
                        <RedirectDialog
                            // accessibilities:
                            title={`Redirecting to ${appName} App`}
                            
                            
                            
                            // resources:
                            appName={appName}
                            redirectUrl={redirectData}
                            paymentId={draftOrderDetail.orderId}
                        />
                    );
                    switch (redirectResult) {
                        case undefined: { // payment canceled or expired
                            // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                            handleRevertDraftOrder(draftOrderDetail.orderId);
                            
                            
                            
                            showMessageError({
                                error: <>
                                    <p>
                                        The transaction has been <strong>canceled</strong> by the user.
                                    </p>
                                    <p>
                                        <strong>No funds</strong> have been deducted.
                                    </p>
                                </>
                            });
                            return;
                        }
                        
                        
                        
                        case false : { // payment failed
                            showMessageError({
                                error: <>
                                    <p>
                                        The transaction has been <strong>denied</strong> by the payment system.
                                    </p>
                                    <p>
                                        <strong>No funds</strong> have been deducted.
                                    </p>
                                    <p>
                                        Please try using another e-wallet.
                                    </p>
                                </>
                            });
                            return;
                        }
                    } // switch
                    
                    
                    
                    gotoFinished(redirectResult, /*paid:*/true);
                } // if
            }
            catch (fetchError: any) {
                if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'payment' });
            } // try
        });
    });
    const handleRevertDraftOrder = useEvent((rawOrderId: string): void => {
        // notify to cancel transaction, so the draftOrder (if any) will be reverted:
        doMakePayment(rawOrderId, /*paid:*/false, { cancelOrder: true })
        .catch(() => {
            // ignore any error
        });
    });
    
    
    
    // jsx:
    return (
        <>
            <p>
                Click the button below. You will be redirected to <strong>{appName} App</strong> to process the payment.
            </p>
            
            <ButtonWithBusy
                // components:
                buttonComponent={
                    <ButtonIcon
                        // appearances:
                        icon='shopping_bag'
                        
                        
                        
                        // variants:
                        gradient={true}
                        
                        
                        
                        // handlers:
                        onClick={handlePayWithRedirect}
                    >
                        Pay with {appName}
                    </ButtonIcon>
                }
            />
        </>
    );
};
export {
    ViewPaymentMethodRedirect,
    ViewPaymentMethodRedirect as default,
};

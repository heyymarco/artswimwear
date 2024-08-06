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
    QrisDialog,
}                           from '@/components/dialogs/QrisDialog'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'

// models:
import type {
    PaymentDetail,
}                           from '@/models'



// react components:
const ViewPaymentMethodQris = (): JSX.Element|null => {
    // states:
    const {
        // shipping data:
        totalShippingCostStatus,
        
        
        
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
    const handlePayWithQris      = useEvent(async (): Promise<void> => {
        doTransaction(async () => {
            try {
                // createOrder:
                const draftOrderDetail = await doPlaceOrder({
                    paymentSource : 'midtransQris',
                });
                if (draftOrderDetail === true) throw Error('Oops, an error occured!'); // immediately paid => no need further action, that should NOT be happened
                
                
                
                const qrisData = draftOrderDetail.redirectData; // get the unfinished redirectData
                if (qrisData) { // not undefined && not empty_string
                    let expiresRaw = draftOrderDetail.expires;
                    if (typeof(expiresRaw) === 'string') expiresRaw = new Date(Date.parse(expiresRaw));
                    
                    const qrisResult = await showDialog<PaymentDetail|false|0>(
                        <QrisDialog
                            // accessibilities:
                            title='Pay With QRIS'
                            
                            
                            
                            // resources:
                            data={qrisData}
                            expires={expiresRaw}
                            paymentId={draftOrderDetail.orderId}
                        />
                    );
                    switch (qrisResult) {
                        case 0:
                        case undefined: { // payment canceled or expired
                            // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                            handleRevertDraftOrder(draftOrderDetail.orderId);
                            
                            
                            
                            showMessageError({
                                error: <>
                                    <p>
                                        The transaction has been <strong>canceled</strong> {(qrisResult === 0) ? <>due to timeout</> : <>by the user</>}.
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
                    
                    
                    
                    gotoFinished(qrisResult, /*paid:*/true);
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
                Click the button below. You will be shown a <strong>QRIS code</strong> to scan the payment.
            </p>
            
            <ButtonWithBusy
                // components:
                buttonComponent={
                    <ButtonIcon
                        // appearances:
                        icon='qr_code_scanner'
                        
                        
                        
                        // variants:
                        gradient={true}
                        
                        
                        
                        // states:
                        enabled={(totalShippingCostStatus !== 'ready') ? false : undefined}
                        
                        
                        
                        // handlers:
                        onClick={handlePayWithQris}
                    >
                        Pay with QRIS
                    </ButtonIcon>
                }
            />
        </>
    );
};
export {
    ViewPaymentMethodQris,
    ViewPaymentMethodQris as default,
};

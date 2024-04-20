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
    QrisDialog,
}                           from '@/components/dialogs/QrisDialog'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewPaymentMethodQris = (): JSX.Element|null => {
    // states:
    const {
        // shipping data:
        shippingFirstName : _shippingFirstName, // not implemented yet, because billingFirstName is not implemented
        shippingLastName  : _shippingLastName,  // not implemented yet, because billingLastName  is not implemented
        
        shippingPhone     : _shippingPhone,     // not implemented yet, because billingPhone     is not implemented
        
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        
        
        // billing data:
        billingAsShipping,
        
        billingFirstName  : _billingFirstName,  // not implemented, already to use cardholderName
        billingLastName   : _billingLastName,   // not implemented, already to use cardholderName
        
        billingPhone      : _billingPhone,      // not implemented yet
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
        
        
        
        // payment data:
        appropriatePaymentProcessor,
        
        
        
        // sections:
        paymentCardSectionRef,
        
        
        
        // fields:
        cardholderInputRef,
        
        
        
        // actions:
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
    const handlePayWithQris = useEvent(async (acquirer: string) => {
        doTransaction(async () => {
            try {
                // createOrder:
                const draftOrderDetail = await doPlaceOrder({
                    paymentSource : 'midtransQris',
                    acquirer      : acquirer,
                });
                if (!draftOrderDetail) return; // paid => no need redirection
                
                
                
                const qrisData = draftOrderDetail.redirectData;
                if (qrisData) { // not undefined && not empty_string
                    const qrisResult = await showDialog<boolean|null>(
                        <QrisDialog
                            // accessibilities:
                            title='Pay With QRIS'
                            
                            
                            
                            // resources:
                            data={qrisData}
                        />
                    );
                    switch (qrisResult) {
                        case null  :   // payment pending => assumes as payment failed
                        case false : { // payment failed
                            showMessageError({
                                error: <>
                                    <p>
                                        The credit card <strong>verification failed</strong>.
                                    </p>
                                    <p>
                                        <strong>No funds</strong> have been deducted.
                                    </p>
                                    <p>
                                        Please try using another card.
                                    </p>
                                </>
                            });
                            return;
                        }
                        
                        case undefined: {
                            // notify cancel transaction, so the authorized payment will be released:
                            (doMakePayment(draftOrderDetail.orderId, /*paid:*/false, { cancelOrder: true }))
                            .catch(() => {
                                // ignore any error
                            });
                            
                            
                            
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
                    } // switch
                } // if
                
                
                
                // then forward the authentication to backend_API to receive the fund:
                await doMakePayment(draftOrderDetail.orderId, /*paid:*/true);
            }
            catch (fetchError: any) {
                if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'payment' });
                // TODO: re-generate paypal payment token
            } // try
        });
    });
    
    
    
    // jsx:
    return (
        <>
            <p>
                Click the appropriate QRIS button below. You will be shown a QRIS code to scan the payment.
            </p>
            
            <div className='actionButtons'>
                <ButtonIcon
                    // appearances:
                    icon='qr_code_scanner'
                    
                    
                    
                    // variants:
                    gradient={true}
                    
                    
                    
                    // handlers:
                    onClick={() => handlePayWithQris('gopay')}
                >
                    <span className='text'>
                        QRIS with GoPay
                    </span>
                </ButtonIcon>
                
                <ButtonIcon
                    // appearances:
                    icon='qr_code_scanner'
                    
                    
                    
                    // variants:
                    gradient={true}
                    
                    
                    
                    // handlers:
                    onClick={() => handlePayWithQris('airpay shopee')}
                >
                    <span className='text'>
                        QRIS with Airpay Shopee
                    </span>
                </ButtonIcon>
            </div>
        </>
    );
};
export {
    ViewPaymentMethodQris,
    ViewPaymentMethodQris as default,
};

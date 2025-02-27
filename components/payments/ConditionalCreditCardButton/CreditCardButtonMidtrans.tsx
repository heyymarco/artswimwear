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
    // dialog-components:
    type PromiseDialog,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    IframeDialog,
}                           from '@/components/dialogs/IframeDialog'

// payment components:
import {
    AuthenticatedResult,
    useTransactionState,
}                           from '@/components/payments/states'
import {
    type ImplementedCreditCardButtonGeneralProps,
    CreditCardButtonGeneral,
}                           from './CreditCardButtonGeneral'

// models:
import {
    // types:
    type PaymentDetail,
    type PlaceOrderDetail,
}                           from '@/models'

// errors:
import {
    ErrorDeclined,
}                           from '@/errors'



// react components:
const CreditCardButtonMidtrans = (props: ImplementedCreditCardButtonGeneralProps): JSX.Element|null => {
    // states:
    const {
        // sections:
        paymentCardSectionRef,
        
        
        
        // actions:
        placeOrder,
    } = useTransactionState();
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handlePlaceOrder   = useEvent(async (): Promise<PlaceOrderDetail|PaymentDetail|false> => {
        // conditions:
        const paymentCardSectionElm = paymentCardSectionRef?.current;
        if (!paymentCardSectionElm) return false; // payment aborted due to unexpected error
        
        
        
        // validations:
        const cardToken = await new Promise<string|false>((resolve, reject) => {
            const MidtransNew3ds = (window as any).MidtransNew3ds;
            if (!MidtransNew3ds) {
                resolve(false); // payment aborted due to unexpected error
                return;
            } // if
            
            
            
            try {
                const cardData       = {
                    card_number         : (paymentCardSectionElm.querySelector('input[name="cardNumber"]') as HTMLInputElement|null)?.value?.toString()?.trim()?.replaceAll(' ', '')?.trim(),
                    card_exp_month      : (paymentCardSectionElm.querySelector('input[name="cardExpiry"]') as HTMLInputElement|null)?.value?.toString()?.trim()?.split('/')?.[0] || undefined,
                    card_exp_year       : (paymentCardSectionElm.querySelector('input[name="cardExpiry"]') as HTMLInputElement|null)?.value?.toString()?.trim()?.split('/')?.[1] || undefined,
                    card_cvv            : (paymentCardSectionElm.querySelector('input[name="cardCvv"]'   ) as HTMLInputElement|null)?.value?.toString()?.trim(),
                    // bank_one_time_token : "12345678"
                };
                MidtransNew3ds.getCardToken(cardData, {
                    onSuccess : (response: any): void => {
                        resolve(response.token_id);
                    },
                    onFailure : (response: any): void => {
                        reject(new ErrorDeclined({
                            shouldRetry : false, // please use another card
                        }));
                    },
                });
            }
            catch {
                resolve(false); // payment aborted due to unexpected error
            } // try
        });
        if (cardToken === false) return false;
        
        
        
        return await placeOrder({
            paymentSource  : 'midtransCard',
            cardToken      : cardToken,
            saveCard       : !!(paymentCardSectionElm.querySelector('input[name="cardSave"]') as HTMLInputElement|null)?.checked,
        });
    });
    const handleAuthenticate = useEvent(async (placeOrderDetail: PlaceOrderDetail): Promise<AuthenticatedResult|PaymentDetail> => {
        const redirectData = placeOrderDetail.redirectData;
        if (redirectData === undefined) { // if no redirectData => no need 3ds verification but the payment needs to be captured on server side
            return AuthenticatedResult.AUTHORIZED; // paid => waiting for the payment to be captured on server side
        } // if
        
        
        
        return new Promise<AuthenticatedResult|PaymentDetail>((resolve) => {
            const MidtransNew3ds = (window as any).MidtransNew3ds;
            if (!MidtransNew3ds) {
                resolve(AuthenticatedResult.FAILED); // payment failed due to unexpected error
                return;
            } // if
            
            
            
            try {
                let modal3dsPromiseDialog : PromiseDialog<AuthenticatedResult|PaymentDetail>|undefined = undefined; // holds the current shown 3ds_modal_dialog (if any)
                MidtransNew3ds.authenticate(redirectData, {
                    performAuthentication: (redirectUrl: string): void => {
                        // displays 3ds authentication redirectUrl to customer:
                        modal3dsPromiseDialog = showDialog<AuthenticatedResult|PaymentDetail>( // deref the promise_dialog
                            <IframeDialog
                                // accessibilities:
                                title='3DS Card Verification'
                                
                                
                                
                                // resources:
                                src={redirectUrl}
                            />
                        );
                        modal3dsPromiseDialog.collapseEndEvent().then(({data}) => {
                            resolve(
                                data
                                ??
                                AuthenticatedResult.CANCELED // undefined => escape the dialog => CANCELED
                            );
                            modal3dsPromiseDialog = undefined; // unref the promise_dialog
                        });
                    },
                    onSuccess: (response: any): void => {
                        // 3ds authentication success, implement payment success scenario
                        /*
                            with feature type: 'authorize'
                            {
                                status_code: "200",
                                transaction_id: "a82a389b-94c9-4a82-9d01-da9dc3745615",
                                gross_amount: "406000.00",
                                currency: "IDR",
                                order_id: "0465054995089660",
                                payment_type: "credit_card",
                                signature_key: "6f81de66301e701f9028d69eda2bdf078af9ec58bf460408520ce1fd58105d5d1fa32eb9915f257c959b63a4fed7509127b5b279ead997a037dd20f176cf8619",
                                transaction_status: "authorize", // not paid until manually capture on server_side
                                fraud_status: "accept",
                                status_message: "Success, Credit Card transaction is successful",
                                merchant_id: "G551313466",
                                transaction_time: "2024-07-22 03:02:11",
                                expiry_time: "2024-07-30 03:02:10",
                                channel_response_code: "00",
                                channel_response_message: "Approved",
                                bank: "mandiri",
                                approval_code: "1721592142277",
                                masked_card: "48111111-1114",
                                card_type: "credit",
                                channel: "mti",
                                three_ds_version: "2",
                                on_us: false,
                                challenge_completion: true,
                                eci: "05",
                            }
                        */
                        /*
                            without feature type: 'authorize'
                            {
                                status_code: "200",
                                transaction_id: "68394be2-9038-4029-8a8d-f7832d0de064",
                                gross_amount: "406000.00",
                                currency: "IDR",
                                order_id: "2014825178094227",
                                payment_type: "credit_card",
                                signature_key: "4fc5c2f0031729965e93f4790fe5a05219fd379a059347d7a3fe3be75039301baed01050badabe8e4d1e1d2291bca7cb63b7a6bba82efa86613b9d12e5c93f9b",
                                transaction_status: "capture", // capture => paid
                                fraud_status: "accept",
                                status_message: "Success, Credit Card capture transaction is successful",
                                merchant_id: "G551313466",
                                transaction_time: "2024-07-22 03:04:19",
                                settlement_time: "2024-07-22 03:04:27", // settlement => paid
                                expiry_time: "2024-07-30 03:04:19",
                                channel_response_code: "00",
                                channel_response_message: "Approved",
                                bank: "mega",
                                approval_code: "1721592267072",
                                masked_card: "48111111-1114",
                                card_type: "credit",
                                channel: "dragon",
                                three_ds_version: "2",
                                on_us: false,
                                challenge_completion: true,
                                eci: "05",
                            }
                        */
                        switch (response?.transaction_status?.toLowerCase?.()) {
                            case 'authorize':
                                modal3dsPromiseDialog?.closeDialog(AuthenticatedResult.AUTHORIZED, 'ui'); // paid => waiting for the payment to be captured on server side
                                break;
                            
                            
                            
                            case 'capture':
                                modal3dsPromiseDialog?.closeDialog(AuthenticatedResult.CAPTURED, 'ui'); // has been CAPTURED (maybe delayed), just needs DISPLAY paid page
                                break;
                            
                            
                            
                            default:
                                modal3dsPromiseDialog?.closeDialog(AuthenticatedResult.FAILED, 'ui'); // payment failed due to unexpected error
                        } // switch
                    },
                    onFailure: (response: any): void => {
                        /*
                            {
                                status_code: "202",
                                transaction_id: "25b6db00-550e-42b4-8cbd-bf778a78fa54",
                                gross_amount: "405000.00",
                                currency: "IDR",
                                order_id: "9291695765128641",
                                payment_type: "credit_card",
                                signature_key: "9ae5243ff9508672571004b0b01e69abad9890a87e31fe27e174e1ded172d32eccec845b9f3b936d72483af6e4bfd63eb5c19485208ee33c8be502657492ac32",
                                transaction_status: "deny",
                                fraud_status: "accept",
                                status_message: "Deny by Bank [MANDIRI] with code [05] and message [Do not honour]",
                                merchant_id: "G551313466",
                                transaction_time: "2024-07-25 02:53:35",
                                expiry_time: "2024-08-02 02:53:35",
                                channel_response_code: "05",
                                channel_response_message: "Do not honour",
                                bank: "mandiri",
                                masked_card: "49111111-1113",
                                card_type: "debit",
                                channel: "mti",
                                three_ds_version: "2",
                                on_us: false,
                                challenge_completion: true,
                                eci: "05",
                            }
                        */
                        /*
                            {
                                status_code: "202",
                                transaction_id: "ca52b211-13f6-4627-9166-297cd8501483",
                                gross_amount: "405000.00",
                                currency: "IDR",
                                order_id: "8381211428235331",
                                payment_type: "credit_card",
                                signature_key: "4dc8e84d8f7844e6c4d8ac5a7fc5a307e152c378ef9c3d2e4546d6b26d3bd322df84f04de072d6e2a55f19a330536403a9d81de600709001cc8c789f5fee0a4d",
                                transaction_status: "deny",
                                fraud_status: "deny",
                                status_message: "Denied by Veritrans Fraud Detection System",
                                merchant_id: "G551313466",
                                transaction_time: "2024-07-25 02:56:13",
                                expiry_time: "2024-08-02 02:56:13",
                                bank: "mandiri",
                                masked_card: "46111111-1116",
                                card_type: "debit",
                                channel: "mti",
                                three_ds_version: "2",
                                on_us: false,
                                challenge_completion: false,
                                eci: "06",
                            }
                        */
                        // 3ds authentication failure, implement payment failure scenario
                        modal3dsPromiseDialog?.closeDialog(AuthenticatedResult.FAILED, 'ui');
                    },
                    onPending: (response: any): void => {
                        // transaction is pending, transaction result will be notified later via 
                        // HTTP POST notification, implement as you wish here
                        modal3dsPromiseDialog?.closeDialog(AuthenticatedResult.PENDING, 'ui');
                        // TODO: handle pending transaction
                    },
                });
            }
            catch {
                resolve(AuthenticatedResult.FAILED); // payment failed due to exception
            } // try
        });
    });
    
    
    
    // jsx:
    return (
        <CreditCardButtonGeneral
            // other props:
            {...props}
            
            
            
            // handlers:
            onPlaceOrder={handlePlaceOrder}
            onAuthenticate={handleAuthenticate}
        />
    );
};
export {
    CreditCardButtonMidtrans,            // named export for readibility
    CreditCardButtonMidtrans as default, // default export to support React.lazy
}

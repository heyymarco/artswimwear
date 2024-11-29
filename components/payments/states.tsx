// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useMemo,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// models:
import {
    // types:
    type BillingAddressDetail,
    
    type PaymentDetail,
    
    type PlaceOrderRequestOptions,
    type PlaceOrderDetail,
}                           from '@/models'

// errors:
import {
    ErrorDeclined,
}                           from '@/errors'



// hooks:

// states:

//#region transactionState

// types:
export const enum AuthenticatedResult {
    /**
     * The user is not authenticated until the timeout expires.
     */
    EXPIRED    = -2,
    /**
     * The user has decided to cancel the transaction.
     */
    CANCELED   = -1,
    /**
     * An error occured.  
     * Usually using invalid card.
     */
    FAILED     = 0,
    
    /**
     * Requires to capture the funds in server side.
     */
    AUTHORIZED = 1,
    /**
     * The transaction was successful but the funds have not yet settled your account.
     */
    PENDING    = 2,
    /**
     * The transaction was successful and the funds have settled your account.
     */
    CAPTURED   = 3,
}
export interface StartTransactionArg {
    // handlers:
    onPlaceOrder          : () => Promise<PlaceOrderDetail|PaymentDetail|false>
    onAuthenticate        : (placeOrderDetail: PlaceOrderDetail) => Promise<AuthenticatedResult|PaymentDetail>
    
    
    
    // messages:
    messageFailed         : React.ReactNode
    messageCanceled      ?: React.ReactNode
    messageExpired       ?: React.ReactNode
    messageDeclined       : React.ReactNode | ((errorMessage: string) => React.ReactNode)
    messageDeclinedRetry ?: React.ReactNode | ((errorMessage: string) => React.ReactNode)
}



// contexts:
export interface TransactionState
{
    // billing data:
    billingValidation        : boolean
    billingAddress           : BillingAddressDetail|null
    
    
    
    // payment data:
    paymentValidation        : boolean
    
    
    
    // sections:
    billingAddressSectionRef : React.MutableRefObject<HTMLElement|null>     | undefined
    paymentCardSectionRef    : React.MutableRefObject<HTMLFormElement|null> | undefined
    
    
    
    // states:
    isTransactionReady       : boolean
    
    
    
    // actions:
    startTransaction         : (arg: StartTransactionArg) => Promise<boolean>
    placeOrder               : (options?: PlaceOrderRequestOptions) => Promise<PlaceOrderDetail|PaymentDetail>
}

const noopHandler = () => { throw Error('not inside <TransactionStateProvider>'); };
const TransactionStateContext = createContext<TransactionState>({
    // billing data:
    billingValidation        : false,
    billingAddress           : null,
    
    
    
    // payment data:
    paymentValidation        : false,
    
    
    
    // sections:
    billingAddressSectionRef : undefined,
    paymentCardSectionRef    : undefined,
    
    
    
    // states:
    isTransactionReady       : false,
    
    
    
    // actions:
    startTransaction         : noopHandler,
    placeOrder               : noopHandler,
});
TransactionStateContext.displayName  = 'TransactionState';

export const useTransactionState = (): TransactionState => {
    return useContext(TransactionStateContext);
}



// react components:
export interface TransactionStateProps
    extends
        // bases:
        Pick<TransactionState,
            // billing data:
            |'billingValidation'
            |'billingAddress'
            
            
            
            // payment data:
            |'paymentValidation'
            
            
            
            // states:
            |'isTransactionReady'
        >,
        Partial<Pick<TransactionState,
            // sections:
            |'billingAddressSectionRef'
            |'paymentCardSectionRef'
        >>
{
    // actions:
    onTransaction : (transaction: (() => Promise<void>)) => Promise<boolean>
    onPlaceOrder  : TransactionState['placeOrder']
    onCancelOrder : (orderId: string) => Promise<void>
    onMakePayment : (orderId: string) => Promise<PaymentDetail>
    onFinishOrder : (paymentDetail: PaymentDetail) => void
}
const TransactionStateProvider = (props: React.PropsWithChildren<TransactionStateProps>): JSX.Element|null => {
    // refs:
    const defaultBillingAddressSectionRef  = useRef<HTMLElement|null>(null);
    const defaultPaymentCardSectionRef     = useRef<HTMLFormElement|null>(null);
    
    
    
    // props:
    const {
        // billing data:
        billingValidation,
        billingAddress,
        
        
        
        // payment data:
        paymentValidation,
        
        
        
        // sections:
        billingAddressSectionRef = defaultBillingAddressSectionRef,
        paymentCardSectionRef    = defaultPaymentCardSectionRef,
        
        
        
        // states:
        isTransactionReady,
        
        
        
        // actions:
        onTransaction : transaction,
        onPlaceOrder  : handlePlaceOrder,
        onCancelOrder : cancelOrder,
        onMakePayment : makePayment,
        onFinishOrder : finishOrder,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // dialogs:
    const {
        showMessageError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // stable callbacks:
    const startTransaction = useEvent<TransactionState['startTransaction']>(async (arg: StartTransactionArg): Promise<boolean> => {
        // args:
        const {
            // handlers:
            onPlaceOrder   : placeOrder,
            onAuthenticate : authenticate,
            
            
            
            // messages:
            messageFailed,
            messageCanceled      = <>
                <p>
                    The transaction has been <strong>canceled</strong> by the user.
                </p>
                <p>
                    <strong>No funds</strong> have been deducted.
                </p>
            </>,
            messageExpired       = messageCanceled,
            messageDeclined,
            messageDeclinedRetry = messageDeclined,
        } = arg;
        
        
        
        // actions:
        return await transaction(async (): Promise<void> => {
            try {
                // createOrder:
                const orderBookedOrPaidOrAbort = await placeOrder(); // if returns `PlaceOrderDetail` => assumes a DraftOrder has been created
                if (orderBookedOrPaidOrAbort === false) return; // aborted (maybe due to validation error) => no need further action
                
                
                
                if (!('orderId' in orderBookedOrPaidOrAbort)) { // immediately paid => no need further action
                    finishOrder(orderBookedOrPaidOrAbort satisfies PaymentDetail);
                    return; // paid
                } // if
                
                
                
                let rawOrderId = orderBookedOrPaidOrAbort.orderId;
                let authenticatedOrPaid : AuthenticatedResult|PaymentDetail;
                try {
                    authenticatedOrPaid = await authenticate(orderBookedOrPaidOrAbort satisfies PlaceOrderDetail);
                    rawOrderId = orderBookedOrPaidOrAbort.orderId; // the `placeOrderDetail.orderId` may be updated during `authenticate()` call.
                }
                catch (error: any) { // an unexpected authentication error occured
                    // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                    cancelOrder(rawOrderId);
                    
                    throw error;
                } // try
                
                
                
                if (typeof(authenticatedOrPaid) === 'object') {
                    finishOrder(authenticatedOrPaid satisfies PaymentDetail);
                }
                else {
                    switch (authenticatedOrPaid) {
                        case AuthenticatedResult.FAILED     : {
                            // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                            cancelOrder(rawOrderId);
                            
                            
                            
                            showMessageError({
                                error: messageFailed,
                            });
                            break;
                        }
                        
                        case AuthenticatedResult.CANCELED   : {
                            // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                            cancelOrder(rawOrderId);
                            
                            
                            
                            showMessageError({
                                error: messageCanceled,
                            });
                            break;
                        }
                        case AuthenticatedResult.EXPIRED    : {
                            // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                            cancelOrder(rawOrderId);
                            
                            
                            
                            showMessageError({
                                error: messageExpired,
                            });
                            break;
                        }
                        
                        
                        
                        case AuthenticatedResult.AUTHORIZED : { // paid => waiting for the payment to be captured on server side
                            // then forward the authentication to backend_API to receive the fund:
                            if (rawOrderId /* ignore empty string */) {
                                const paymentDetail = await makePayment(rawOrderId);
                                finishOrder(paymentDetail);
                            } // if
                            break;
                        }
                        
                        
                        
                        case AuthenticatedResult.PENDING    :
                        case AuthenticatedResult.CAPTURED   : { // has been CAPTURED (maybe delayed), just needs DISPLAY paid page
                            // finishOrder(); // TODO: DISPLAY paid page
                            break;
                        }
                        
                        
                        
                        default : { // an unexpected authentication result occured
                            // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                            cancelOrder(rawOrderId);
                            
                            
                            
                            throw Error('Oops, an error occured!');
                        }
                    } // switch
                } // if
            }
            catch (fetchError: any) {
                if ((fetchError instanceof ErrorDeclined) || (fetchError?.status === 402)) {
                    const errorMessage : string = fetchError?.message ?? fetchError?.data?.error ?? '';
                    showMessageError({
                        error : (
                            fetchError.shouldRetry
                            ? ((typeof(messageDeclinedRetry) !== 'function') ? messageDeclinedRetry : messageDeclinedRetry(errorMessage))
                            : ((typeof(messageDeclined     ) !== 'function') ? messageDeclined      : messageDeclined(errorMessage))
                        ),
                    });
                }
                else if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'payment' /* context: 'order' */ });
            } // try
        });
    });
    const placeOrder       = useEvent<TransactionState['placeOrder']>((options?: PlaceOrderRequestOptions): Promise<PlaceOrderDetail|PaymentDetail> => {
        return handlePlaceOrder(options); // convert unstable `handlePlaceOrder()` to stable `placeOrder()`
    });
    
    
    
    // states:
    const transactionState = useMemo<TransactionState>(() => ({
        // billing data:
        billingValidation,
        billingAddress,
        
        
        
        // payment data:
        paymentValidation,
        
        
        
        // sections:
        billingAddressSectionRef,    // stable ref
        paymentCardSectionRef,       // stable ref
        
        
        
        // states:
        isTransactionReady,
        
        
        
        // actions:
        startTransaction,            // stable ref
        placeOrder,                  // stable ref
    }), [
        // billing data:
        billingValidation,
        billingAddress,
        
        
        
        // payment data:
        paymentValidation,
        
        
        
        // sections:
        // billingAddressSectionRef, // stable ref
        // paymentCardSectionRef,    // stable ref
        
        
        
        // states:
        isTransactionReady,
        
        
        
        // actions:
        // startTransaction,         // stable ref
        // placeOrder,               // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <TransactionStateContext.Provider value={transactionState}>
            {children}
        </TransactionStateContext.Provider>
    );
};
export {
    TransactionStateProvider,
    TransactionStateProvider as default,
}
//#endregion transactionState

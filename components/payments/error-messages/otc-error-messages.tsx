// payment components:
import {
    type StartTransactionArg,
}                           from '@/components/payments/states'



// messages:
export const messageFailed        : StartTransactionArg['messageFailed'       ] = null; // the payment NEVER rejected
export const messageCanceled      : StartTransactionArg['messageCanceled'     ] = null; // the payment NEVER canceled
export const messageExpired       : StartTransactionArg['messageExpired'      ] = null; // the payment NEVER expired
export const messageDeclined      : StartTransactionArg['messageDeclined'     ] = (errorMessage) => <>
    <p>
        Unable to make a transaction.
    </p>
    {!!errorMessage && <p>
        {errorMessage}
    </p>}
    <p>
        Please try <strong>another payment method</strong>.
    </p>
</>;
export const messageDeclinedRetry : StartTransactionArg['messageDeclinedRetry'] = undefined;

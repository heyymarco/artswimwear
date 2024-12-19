// payment components:
import {
    type StartTransactionArg,
}                           from '@/components/payments/states'



// messages:
export const messageFailed        : StartTransactionArg['messageFailed'       ] = <>
    <p>
        The credit card <strong>verification failed</strong>.
    </p>
    <p>
        Please try using <strong>another card</strong>.
    </p>
</>;
export const messageCanceled      : StartTransactionArg['messageCanceled'     ] = undefined; // use default canceled message
export const messageExpired       : StartTransactionArg['messageExpired'      ] = undefined; // same as `messageCanceled`
export const messageDeclined      : StartTransactionArg['messageDeclined'     ] = (errorMessage) => <>
    <p>
        Unable to make a transaction using this card.
    </p>
    {!errorMessage && <p>
        Your card was declined.
    </p>}
    {!!errorMessage && <p>
        {errorMessage}{errorMessage?.endsWith('.') ? '' : '.'}
    </p>}
    <p>
        Please try using <strong>another card</strong>.
    </p>
</>;
export const messageDeclinedRetry : StartTransactionArg['messageDeclinedRetry'] = (errorMessage) => <>
    <p>
        Unable to make a transaction using this card.
    </p>
    {!errorMessage && <p>
        Your card was declined.
    </p>}
    {!!errorMessage && <p>
        {errorMessage}{errorMessage?.endsWith('.') ? '' : '.'}
    </p>}
    <p>
        Please <strong>try again</strong> in a few minutes.
    </p>
</>;

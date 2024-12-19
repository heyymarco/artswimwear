// payment components:
import {
    type StartTransactionArg,
}                           from '@/components/payments/states'



// messages:
export const messageFailed        : StartTransactionArg['messageFailed'       ] = <>
    <p>
        The transaction has been <strong>denied</strong> by the payment system.
    </p>
    <p>
        <strong>No funds</strong> have been deducted.
    </p>
    <p>
        Please try <strong>another payment method</strong>.
    </p>
</>;
export const messageCanceled      : StartTransactionArg['messageCanceled'     ] = <>
    <p>
        The transaction has been <strong>canceled</strong> by the user.
    </p>
    <p>
        <strong>No funds</strong> have been deducted.
    </p>
</>;
export const messageExpired       : StartTransactionArg['messageExpired'      ] = <>
    <p>
        The transaction has been <strong>canceled</strong> due to timeout.
    </p>
    <p>
        <strong>No funds</strong> have been deducted.
    </p>
</>;
export const messageDeclined      : (appName: string) => StartTransactionArg['messageDeclined'     ] = (appName) => /* Error: Component definition is missing display name */ function MessageDeclined(errorMessage) { return <>
    <p>
        Unable to make a transaction using {appName}.
    </p>
    {!!errorMessage && <p>
        {errorMessage}
    </p>}
    <p>
        Please try <strong>another payment method</strong>.
    </p>
</> };
export const messageDeclinedRetry : StartTransactionArg['messageDeclinedRetry'] = undefined;
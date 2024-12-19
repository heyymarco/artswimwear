// payment components:
import {
    type StartTransactionArg,
}                           from '@/components/payments/states'



// messages:
export const messageFailed        : (walletName: string) => StartTransactionArg['messageFailed'       ] = (walletName) => <>
    <p>
        Unable to make a transaction using {walletName}.
    </p>
    <p>
        Please try <strong>another payment method</strong>.
    </p>
</>;
export const messageCanceled      : StartTransactionArg['messageCanceled'     ] = undefined; // use default canceled message
export const messageExpired       : StartTransactionArg['messageExpired'      ] = undefined; // same as `messageCanceled`
export const messageDeclined      : (walletName: string) => StartTransactionArg['messageDeclined'     ] = (walletName) => /* Error: Component definition is missing display name */ function MessageDeclined(errorMessage) { return <>
    <p>
        Unable to make a transaction using {walletName}.
    </p>
    {!!errorMessage && <p>
        {errorMessage}
    </p>}
    <p>
        Please try <strong>another payment method</strong>.
    </p>
</> };
export const messageDeclinedRetry : (walletName: string) => StartTransactionArg['messageDeclinedRetry'] = (walletName) => /* Error: Component definition is missing display name */ function MessageDeclinedRetry(errorMessage) { return <>
    <p>
        Unable to make a transaction using {walletName}.
    </p>
    {!!errorMessage && <p>
        {errorMessage}
    </p>}
    <p>
        Please <strong>try again</strong> in a few minutes.
    </p>
</> };
'use client'

// react:
import {
    // hooks:
    useMemo,
}                           from 'react'

// payment components:
import {
    useIsInPaypalScriptProvider,
}                           from './ConditionalPaypalScriptProvider'
import {
    useIsInStripeScriptProvider,
}                           from './ConditionalStripeScriptProvider'
import {
    useIsInMidtransScriptProvider,
}                           from './ConditionalMidtransScriptProvider'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



export interface AppropriatePaymentProcessorsProps {
    // payment data:
    currency : string
}
export const useAppropriatePaymentProcessors = (props: AppropriatePaymentProcessorsProps): (typeof checkoutConfigClient.payment.preferredProcessors) => {
    // props:
    const {
        // payment data:
        currency,
    } = props;
    
    
    
    const appropriatePaymentProcessors = useMemo<(typeof checkoutConfigClient.payment.preferredProcessors)>((): (typeof checkoutConfigClient.payment.preferredProcessors) => {
        return (
            checkoutConfigClient.payment.preferredProcessors
            .map((paymentProcessorName) => [
                paymentProcessorName,
                checkoutConfigClient.payment.processors[paymentProcessorName]
            ] as const)
            .filter(([paymentProcessorName, {enabled, supportedCurrencies}]) =>
                enabled
                &&
                supportedCurrencies.includes(currency)
            )
            .map(([name, value]) => name)
        );
    }, [currency]);
    return appropriatePaymentProcessors;
}



export interface PaymentProcessorPriorityProps
    extends
        // bases:
        AppropriatePaymentProcessorsProps
{
}
export interface PaymentProcessorPriority {
    paymentPriorityProcessor  : string|null
    isPaymentPriorityPaypal   : boolean
    isPaymentPriorityStripe   : boolean
    isPaymentPriorityMidtrans : boolean
}
export const usePaymentProcessorPriority = (props: PaymentProcessorPriorityProps): PaymentProcessorPriority => {
    const appropriatePaymentProcessors = useAppropriatePaymentProcessors(props);
    const isInPaypalScriptProvider     = useIsInPaypalScriptProvider();
    const isInStripeScriptProvider     = useIsInStripeScriptProvider();
    const isInMidtransScriptProvider   = useIsInMidtransScriptProvider();
    const supportedCardProcessors      : string[] = (
        ([
            !isInPaypalScriptProvider   ? undefined : 'paypal',
            !isInStripeScriptProvider   ? undefined : 'stripe',
            !isInMidtransScriptProvider ? undefined : 'midtrans',
        ] satisfies ((typeof checkoutConfigClient.payment.preferredProcessors[number])|undefined)[])
        .filter((item): item is Exclude<typeof item, undefined> => (item !== undefined))
    );
    const paymentPriorityProcessor     = appropriatePaymentProcessors.find((processor) => supportedCardProcessors.includes(processor)) ?? null; // find the highest priority payment processor that supports card payment
    const isPaymentPriorityPaypal      = (paymentPriorityProcessor === 'paypal');
    const isPaymentPriorityStripe      = (paymentPriorityProcessor === 'stripe');
    const isPaymentPriorityMidtrans    = (paymentPriorityProcessor === 'midtrans');
    
    
    
    return {
        paymentPriorityProcessor,
        isPaymentPriorityPaypal,
        isPaymentPriorityStripe,
        isPaymentPriorityMidtrans,
    };
}



export interface PaymentProcessorAvailabilityProps
    extends
        // bases:
        AppropriatePaymentProcessorsProps
{
    // payment data:
    currency                     : string
}
export interface PaymentProcessorAvailability {
    isPaymentAvailablePaypal     : boolean
    isPaymentAvailableStripe     : boolean
    isPaymentAvailableMidtrans   : boolean
    isPaymentAvailableBank       : boolean
    isPaymentAvailableCreditCard : boolean
}
export const usePaymentProcessorAvailability = (props: PaymentProcessorAvailabilityProps): PaymentProcessorAvailability => {
    const appropriatePaymentProcessors = useAppropriatePaymentProcessors(props);
    const isInPaypalScriptProvider     = useIsInPaypalScriptProvider();
    const isInStripeScriptProvider     = useIsInStripeScriptProvider();
    const isInMidtransScriptProvider   = useIsInMidtransScriptProvider();
    const isPaymentAvailablePaypal     = isInPaypalScriptProvider   && appropriatePaymentProcessors.includes('paypal');
    const isPaymentAvailableStripe     = isInStripeScriptProvider   && appropriatePaymentProcessors.includes('stripe');
    const isPaymentAvailableMidtrans   = isInMidtransScriptProvider && appropriatePaymentProcessors.includes('midtrans');
    const isPaymentAvailableBank       = !!checkoutConfigClient.payment.processors.bank.enabled && checkoutConfigClient.payment.processors.bank.supportedCurrencies.includes(props.currency);
    const isPaymentAvailableCreditCard = (isPaymentAvailablePaypal || isPaymentAvailableStripe || isPaymentAvailableMidtrans);
    
    
    
    return {
        isPaymentAvailablePaypal,
        isPaymentAvailableStripe,
        isPaymentAvailableMidtrans,
        isPaymentAvailableBank,
        isPaymentAvailableCreditCard,
    };
}

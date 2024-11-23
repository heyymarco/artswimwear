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

// cart components:
import {
    useCartState,
}                           from '@/components/Cart/states/cartState'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



export const useAppropriatePaymentProcessors = (): (typeof checkoutConfigClient.payment.preferredProcessors) => {
    // states:
    const {
        // payment data:
        currency,
    } = useCartState();
    
    
    
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



export interface PaymentProcessorPriority {
    paymentPriorityProcessor  : string|null
    isPaymentPriorityPaypal   : boolean
    isPaymentPriorityStripe   : boolean
    isPaymentPriorityMidtrans : boolean
}
export const usePaymentProcessorPriority = (): PaymentProcessorPriority => {
    const appropriatePaymentProcessors = useAppropriatePaymentProcessors();
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



export interface PaymentProcessorAvailability {
    isPaymentAvailablePaypal     : boolean
    isPaymentAvailableStripe     : boolean
    isPaymentAvailableMidtrans   : boolean
    isPaymentAvailableBank       : boolean
    isPaymentAvailableCreditCard : boolean
}
export const usePaymentProcessorAvailability = (): PaymentProcessorAvailability => {
    // states:
    const {
        // payment data:
        currency,
    } = useCartState();
    
    
    
    const appropriatePaymentProcessors = useAppropriatePaymentProcessors();
    const isInPaypalScriptProvider     = useIsInPaypalScriptProvider();
    const isInStripeScriptProvider     = useIsInStripeScriptProvider();
    const isInMidtransScriptProvider   = useIsInMidtransScriptProvider();
    const isPaymentAvailablePaypal     = isInPaypalScriptProvider   && appropriatePaymentProcessors.includes('paypal');
    const isPaymentAvailableStripe     = isInStripeScriptProvider   && appropriatePaymentProcessors.includes('stripe');
    const isPaymentAvailableMidtrans   = isInMidtransScriptProvider && appropriatePaymentProcessors.includes('midtrans');
    const isPaymentAvailableBank       = !!checkoutConfigClient.payment.processors.bank.enabled && checkoutConfigClient.payment.processors.bank.supportedCurrencies.includes(currency);
    const isPaymentAvailableCreditCard = (isPaymentAvailablePaypal || isPaymentAvailableStripe || isPaymentAvailableMidtrans);
    
    
    
    return {
        isPaymentAvailablePaypal,
        isPaymentAvailableStripe,
        isPaymentAvailableMidtrans,
        isPaymentAvailableBank,
        isPaymentAvailableCreditCard,
    };
}

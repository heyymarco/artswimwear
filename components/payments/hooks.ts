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



export interface PaymentProcessorPriorityProps {
    // payment data:
    appropriatePaymentProcessors : (typeof checkoutConfigClient.payment.preferredProcessors)
}
export interface PaymentProcessorPriority {
    paymentPriorityProcessor  : string|null
    isPaymentPriorityPaypal   : boolean
    isPaymentPriorityStripe   : boolean
    isPaymentPriorityMidtrans : boolean
}
export const usePaymentProcessorPriority = (props: PaymentProcessorPriorityProps): PaymentProcessorPriority => {
    // props:
    const {
        // payment data:
        appropriatePaymentProcessors,
    } = props;
    
    
    
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



export interface PaymentProcessorAvailabilityProps {
    // payment data:
    appropriatePaymentProcessors : (typeof checkoutConfigClient.payment.preferredProcessors)
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
    // props:
    const {
        // payment data:
        appropriatePaymentProcessors,
        currency,
    } = props;
    
    
    
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

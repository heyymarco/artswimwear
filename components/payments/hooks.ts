// payment components:
import {
    useIsInPayPalScriptProvider,
}                           from './ConditionalPaypalScriptProvider'
import {
    useIsInStripeElementsProvider,
}                           from './ConditionalStripeElementsProvider'
import {
    useIsInMidtransScriptProvider,
}                           from './ConditionalMidtransScriptProvider'

// configs:
import {
    type checkoutConfigClient,
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
    
    
    
    const isInPaypalScriptProvider   = useIsInPayPalScriptProvider();
    const isInStripeElementsProvider = useIsInStripeElementsProvider();
    const isInMidtransScriptProvider = useIsInMidtransScriptProvider();
    const supportedCardProcessors    : string[] = (
        ([
            !isInPaypalScriptProvider   ? undefined : 'paypal',
            !isInStripeElementsProvider ? undefined : 'stripe',
            !isInMidtransScriptProvider ? undefined : 'midtrans',
        ] satisfies ((typeof checkoutConfigClient.payment.preferredProcessors[number])|undefined)[])
        .filter((item): item is Exclude<typeof item, undefined> => (item !== undefined))
    );
    const paymentPriorityProcessor  = appropriatePaymentProcessors.find((processor) => supportedCardProcessors.includes(processor)) ?? null; // find the highest priority payment processor that supports card payment
    const isPaymentPriorityPaypal   = (paymentPriorityProcessor === 'paypal');
    const isPaymentPriorityStripe   = (paymentPriorityProcessor === 'stripe');
    const isPaymentPriorityMidtrans = (paymentPriorityProcessor === 'midtrans');
    
    
    
    return {
        paymentPriorityProcessor,
        isPaymentPriorityPaypal,
        isPaymentPriorityStripe,
        isPaymentPriorityMidtrans,
    };
}
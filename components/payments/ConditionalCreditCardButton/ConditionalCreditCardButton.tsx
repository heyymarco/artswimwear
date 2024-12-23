'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// payment components:
import {
    usePaymentProcessorPriority,
}                           from '@/components/payments/hooks'
import {
    type ImplementedCreditCardButtonGeneralProps,
}                           from './CreditCardButtonGeneral'

// react lazies:
const CreditCardButtonPaypalLazy   = React.lazy(() => import('./CreditCardButtonPaypal'));
const CreditCardButtonStripeLazy   = React.lazy(() => import('./CreditCardButtonStripe'));
const CreditCardButtonMidtransLazy = React.lazy(() => import('./CreditCardButtonMidtrans'));



// react components:
const ConditionalCreditCardButton = (props: ImplementedCreditCardButtonGeneralProps): JSX.Element|null => {
    // states:
    const {
        isPaymentPriorityPaypal,
        isPaymentPriorityStripe,
        isPaymentPriorityMidtrans,
    } = usePaymentProcessorPriority();
    
    
    
    // jsx:
    if (isPaymentPriorityPaypal  ) return <CreditCardButtonPaypalLazy   {...props} />;
    if (isPaymentPriorityStripe  ) return <CreditCardButtonStripeLazy   {...props} />;
    if (isPaymentPriorityMidtrans) return <CreditCardButtonMidtransLazy {...props} />;
    return null;
};
export {
    ConditionalCreditCardButton,            // named export for readibility
    ConditionalCreditCardButton as default, // default export to support React.lazy
}

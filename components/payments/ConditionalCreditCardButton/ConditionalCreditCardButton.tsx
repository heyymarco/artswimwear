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
import {
    CreditCardButtonPaypalLazy,
}                           from './CreditCardButtonPaypalLazy'
import {
    CreditCardButtonStripeLazy,
}                           from './CreditCardButtonStripeLazy'
import {
    CreditCardButtonMidtransLazy,
}                           from './CreditCardButtonMidtransLazy'



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

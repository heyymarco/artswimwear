'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    EditBillingAddress,
}                           from './EditBillingAddress'
import {
    ButtonPaymentCard,
}                           from './ButtonPaymentCard'
import {
    ConditionalPayPalCardFieldsProvider,
}                           from './ConditionalPayPalCardFieldsProvider'
import {
    ConditionalCreditCardNumberEditor,
}                           from './ConditionalCreditCardNumberEditor'
import {
    ConditionalCreditCardNameEditor,
}                           from './ConditionalCreditCardNameEditor'
import {
    ConditionalCreditCardExpiryEditor,
}                           from './ConditionalCreditCardExpiryEditor'
import {
    ConditionalCreditCardCvvEditor,
}                           from './ConditionalCreditCardCvvEditor'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const EditPaymentMethodCard = (): JSX.Element|null => {
    // jsx:
    return (
        <ConditionalPayPalCardFieldsProvider>
            <EditPaymentMethodCardInternal />
        </ConditionalPayPalCardFieldsProvider>
    );
};
const EditPaymentMethodCardInternal = (): JSX.Element|null => {
    const {
        // payment data:
        appropriatePaymentProcessors,
        paymentValidation,
        
        
        
        // sections:
        billingAddressSectionRef,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <ValidationProvider
            // validations:
            enableValidation={paymentValidation}
        >
            <div className='instruct'>
                <p>
                    Fill in your <strong>credit card information</strong> below, enter <strong>billing address</strong>, and then click the <strong>Pay Now</strong> button:
                </p>
            </div>
            
            <ConditionalCreditCardNumberEditor appropriatePaymentProcessors={appropriatePaymentProcessors} />
            <ConditionalCreditCardNameEditor   appropriatePaymentProcessors={appropriatePaymentProcessors} />
            <ConditionalCreditCardExpiryEditor appropriatePaymentProcessors={appropriatePaymentProcessors} />
            <ConditionalCreditCardCvvEditor    appropriatePaymentProcessors={appropriatePaymentProcessors} />
            
            <hr className='horz1' />
            
            <section
                // refs:
                ref={billingAddressSectionRef}
                
                
                
                // classes:
                className='billing'
            >
                <p>
                    Enter the address that matches your card&apos;s billing address.
                </p>
                <EditBillingAddress />
            </section>
            
            <hr className='horz2' />
            
            <div className='verify'>
                <p>
                    Make sure the information above is correct. Click <strong>Pay Now</strong> button below to process the payment:
                </p>
            </div>
            <ButtonPaymentCard />
        </ValidationProvider>
    );
};
export {
    EditPaymentMethodCard,
    EditPaymentMethodCard as default,
};

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

// heymarco components:
import {
    AlternateSeparator,
}                           from '@heymarco/alternate-separator'

// payment components:
import {
    ConditionalPaypalCardComposerProvider,
}                           from '@/components/payments/ConditionalPaypalCardComposerProvider'
import {
    ConditionalCreditCardNumberEditor,
}                           from '@/components/payments/ConditionalCreditCardNumberEditor'
import {
    ConditionalCreditCardNameEditor,
}                           from '@/components/payments/ConditionalCreditCardNameEditor'
import {
    ConditionalCreditCardExpiryEditor,
}                           from '@/components/payments/ConditionalCreditCardExpiryEditor'
import {
    ConditionalCreditCardCvvEditor,
}                           from '@/components/payments/ConditionalCreditCardCvvEditor'
import {
    ConditionalCreditCardSaveCheck,
}                           from '@/components/payments/ConditionalCreditCardSaveCheck'
import {
    ConditionalCreditCardButton,
}                           from '@/components/payments/ConditionalCreditCardButton'
import {
    ConditionalCreditCardSavedSection,
}                           from '@/components/payments/ConditionalCreditCardSavedSection'
import {
    ConditionalCreditCardSavedButton,
}                           from '@/components/payments/ConditionalCreditCardSavedButton'

// internal components:
import {
    ButtonWithBusy,
}                           from '../ButtonWithBusy'
import {
    EditBillingAddress,
}                           from './EditBillingAddress'

// states:
import {
    useTransactionState,
}                           from '@/components/payments/states'



// react components:
const EditPaymentMethodCard = (): JSX.Element|null => {
    // jsx:
    return (
        <ConditionalPaypalCardComposerProvider>
            <EditPaymentMethodCardInternal />
        </ConditionalPaypalCardComposerProvider>
    );
};
const EditPaymentMethodCardInternal = (): JSX.Element|null => {
    // states:
    const {
        // payment data:
        paymentValidation,
        
        
        
        // sections:
        billingAddressSectionRef,
    } = useTransactionState();
    
    
    
    // jsx:
    return (
        <ValidationProvider
            // validations:
            enableValidation={paymentValidation}
        >
            <ConditionalCreditCardSavedSection>
                <p className='instruct1'>
                    Pay with my saved card:
                </p>
                
                <ConditionalCreditCardSavedButton className='savedButton' />
                
                <AlternateSeparator className='horz1' />
            </ConditionalCreditCardSavedSection>
            
            <div className='instruct2'>
                <p>
                    Fill in your <strong>credit card information</strong> below, enter <strong>billing address</strong>, and then click the <strong>Pay Now</strong> button:
                </p>
            </div>
            
            <ConditionalCreditCardNumberEditor />
            <ConditionalCreditCardNameEditor />
            <ConditionalCreditCardExpiryEditor />
            <ConditionalCreditCardCvvEditor />
            
            <ConditionalCreditCardSaveCheck />
            
            <hr className='horz2' />
            
            <section
                // refs:
                ref={billingAddressSectionRef}
                
                
                
                // classes:
                className='billing'
            >
                <p>
                    Enter your billing address as it appears on your credit card statement for successful processing:
                </p>
                <EditBillingAddress />
            </section>
            
            <hr className='horz3' />
            
            <div className='verify'>
                <p>
                    Make sure the information above is correct. Click <strong>Pay Now</strong> button below to process the payment:
                </p>
            </div>
            <ButtonWithBusy
                // components:
                buttonComponent={
                    <ConditionalCreditCardButton />
                }
            />
        </ValidationProvider>
    );
};
export {
    EditPaymentMethodCard,
    EditPaymentMethodCard as default,
};

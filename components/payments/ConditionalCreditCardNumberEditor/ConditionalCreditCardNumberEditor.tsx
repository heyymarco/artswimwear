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
    IfInPaypalScriptProvider,
}                           from '@/components/payments/ConditionalPaypalScriptProvider'
import {
    IfInStripeScriptProvider,
}                           from '@/components/payments/ConditionalStripeScriptProvider'
import {
    IfInMidtransScriptProvider,
}                           from '@/components/payments/ConditionalMidtransScriptProvider'
import {
    useBaseCardFieldWrapperStyleSheet,
}                           from '@/components/payments/BaseCardFieldWrapper'
import {
    // options:
    paypalCardNumberOptions,
    
    
    
    // react components:
    PaypalCardFieldWrapper,
}                           from '@/components/payments/PaypalCardFieldWrapper'
import {
    // options:
    stripeCardNumberOptions,
    
    
    
    // react components:
    StripeCardFieldWrapper,
}                           from '@/components/payments/StripeCardFieldWrapper'

// internal components:
import {
    InputWithLabel,
}                           from '@/components/InputWithLabel'
import {
    CreditCardNumberEditor,
}                           from '@/components/editors/CreditCardNumberEditor'
import {
    type LabelHintsWithTooltipProps,
    LabelHintsWithTooltip,
}                           from '@/components/LabelHintsWithTooltip'



// react components:
const ConditionalCreditCardNumberEditor = (): JSX.Element|null => {
    const styleSheets = useBaseCardFieldWrapperStyleSheet();
    
    
    
    // states:
    const {
        isPaymentPriorityPaypal,
        isPaymentPriorityStripe,
        isPaymentPriorityMidtrans,
    } = usePaymentProcessorPriority();
    
    
    
    // jsx:
    return (
        <>
            <IfInStripeScriptProvider>
                {/* conditional re-render */}
                {isPaymentPriorityStripe && <InputWithLabel
                    // appearances:
                    icon='credit_card'
                    
                    
                    
                    // classes:
                    className='number'
                    
                    
                    
                    // components:
                    inputComponent={
                        <StripeCardFieldWrapper
                            // options:
                            {...stripeCardNumberOptions}
                            
                            
                            
                            // accessibilities:
                            aria-label='Card Number'
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={<LabelHintsForCreditCardNumber />}
                />}
            </IfInStripeScriptProvider>
            <IfInPaypalScriptProvider>
                {/* conditional visibility via css */}
                <InputWithLabel
                    // appearances:
                    icon='credit_card'
                    
                    
                    
                    // classes:
                    className={'number ' + (isPaymentPriorityPaypal ? '' : styleSheets.hidden)}
                    
                    
                    
                    // components:
                    inputComponent={
                        <PaypalCardFieldWrapper
                            // options:
                            {...paypalCardNumberOptions}
                            
                            
                            
                            // accessibilities:
                            aria-label='Card Number'
                            
                            
                            
                            // validations:
                            enableValidation={isPaymentPriorityPaypal ? undefined : false}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={<LabelHintsForCreditCardNumber />}
                />
            </IfInPaypalScriptProvider>
            <IfInMidtransScriptProvider>
                {/* conditional re-render */}
                {isPaymentPriorityMidtrans && <InputWithLabel
                    // appearances:
                    icon='credit_card'
                    
                    
                    
                    // classes:
                    className='number'
                    
                    
                    
                    // components:
                    inputComponent={
                        <CreditCardNumberEditor
                            // forms:
                            name='cardNumber'
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={<LabelHintsForCreditCardNumber />}
                />}
            </IfInMidtransScriptProvider>
        </>
    );
};
export {
    ConditionalCreditCardNumberEditor,
    ConditionalCreditCardNumberEditor as default,
};



const LabelHintsForCreditCardNumber = (props: LabelHintsWithTooltipProps): JSX.Element|null => {
    // default props:
    const {
        // appearances:
        icon            = 'lock',
        
        
        
        // classes:
        className       = 'solid',
        
        
        
        // children:
        tooltipChildren = <>
            <p>
                All transactions are secure and encrypted.
            </p>
            <p>
                Once the payment is processed, the credit card data <strong>no longer stored</strong> in application memory.
            </p>
            <p>
                The card data will be forwarded to our payment gateway (PayPal and/or Stripe).<br />
                We won&apos;t store your card data into our database.
            </p>
        </>,
        
        
        
        // other props:
        ...restLabelHintsWithTooltipProps
    } = props;
    
    
    
    // jsx:
    return (
        <LabelHintsWithTooltip
            // other props:
            {...restLabelHintsWithTooltipProps}
            
            
            
            // appearances:
            icon={icon}
            
            
            
            // classes:
            className={className}
            
            
            
            // children:
            tooltipChildren={tooltipChildren}
        />
    )
};

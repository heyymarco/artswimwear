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
    paypalCardCvvOptions,
    
    
    
    // react components:
    PaypalCardFieldWrapper,
}                           from '@/components/payments/PaypalCardFieldWrapper'
import {
    // options:
    stripeCardCvvOptions,
    
    
    
    // react components:
    StripeCardFieldWrapper,
}                           from '@/components/payments/StripeCardFieldWrapper'

// internal components:
import {
    InputWithLabel,
}                           from '@/components/InputWithLabel'
import {
    CreditCardCvvEditor,
}                           from '@/components/editors/CreditCardCvvEditor'
import {
    type LabelHintsWithTooltipProps,
    LabelHintsWithTooltip,
}                           from '@/components/LabelHintsWithTooltip'



// react components:
const ConditionalCreditCardCvvEditor = (): JSX.Element|null => {
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
                    icon='edit'
                    
                    
                    
                    // classes:
                    className='csc'
                    
                    
                    
                    // components:
                    inputComponent={
                        <StripeCardFieldWrapper
                            // options:
                            {...stripeCardCvvOptions}
                            
                            
                            
                            // accessibilities:
                            aria-label='Card CSC/CVV'
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={<LabelHintsForCreditCardCvv />}
                />}
            </IfInStripeScriptProvider>
            <IfInPaypalScriptProvider>
                {/* conditional visibility via css */}
                <InputWithLabel
                    // appearances:
                    icon='edit'
                    
                    
                    
                    // classes:
                    className={'csc ' + (isPaymentPriorityPaypal ? '' : styleSheets.hidden)}
                    
                    
                    
                    // components:
                    inputComponent={
                        <PaypalCardFieldWrapper
                            // options:
                            {...paypalCardCvvOptions}
                            
                            
                            
                            // accessibilities:
                            aria-label='Card CSC/CVV'
                            
                            
                            
                            // validations:
                            enableValidation={isPaymentPriorityPaypal ? undefined : false}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={<LabelHintsForCreditCardCvv />}
                />
            </IfInPaypalScriptProvider>
            <IfInMidtransScriptProvider>
                {/* conditional re-render */}
                {isPaymentPriorityMidtrans && <InputWithLabel
                    // appearances:
                    icon='edit'
                    
                    
                    
                    // classes:
                    className='csc'
                    
                    
                    
                    // components:
                    inputComponent={
                        <CreditCardCvvEditor
                            // forms:
                            name='cardCvv'
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={<LabelHintsForCreditCardCvv />}
                />}
            </IfInMidtransScriptProvider>
        </>
    );
};
export {
    ConditionalCreditCardCvvEditor,
    ConditionalCreditCardCvvEditor as default,
};



const LabelHintsForCreditCardCvv = (props: LabelHintsWithTooltipProps): JSX.Element|null => {
    // default props:
    const {
        // appearances:
        icon            = 'help',
        
        
        
        // classes:
        className       = 'solid',
        
        
        
        // children:
        tooltipChildren = <>
            <p>
                3-digit security code usually found on the back of your card.
            </p>
            <p>
                American Express cards have a 4-digit code located on the front.
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

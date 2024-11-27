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
    paypalCardNameOptions,
    
    
    
    // react components:
    PaypalCardFieldWrapper,
}                           from '@/components/payments/PaypalCardFieldWrapper'

// internal components:
import {
    InputWithLabel,
}                           from '@/components/InputWithLabel'
import {
    CreditCardNameEditor,
}                           from '@/components/editors/CreditCardNameEditor'
import {
    type LabelHintsWithTooltipProps,
    LabelHintsWithTooltip,
}                           from '@/components/LabelHintsWithTooltip'



// react components:
const ConditionalCreditCardNameEditor = (): JSX.Element|null => {
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
                    icon='person'
                    
                    
                    
                    // classes:
                    className='name'
                    
                    
                    
                    // components:
                    inputComponent={
                        <CreditCardNameEditor
                            // accessibilities:
                            aria-label='Cardholder Name'
                            placeholder='John Doe'
                            
                            
                            
                            // forms:
                            name='cardHolder'
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={<LabelHintsForCreditCardName />}
                />}
            </IfInStripeScriptProvider>
            <IfInPaypalScriptProvider>
                {/* conditional visibility via css */}
                <InputWithLabel
                    // appearances:
                    icon='credit_card'
                    
                    
                    
                    // classes:
                    className={'name ' + (isPaymentPriorityPaypal ? '' : styleSheets.hidden)}
                    
                    
                    
                    // components:
                    inputComponent={
                        <PaypalCardFieldWrapper
                            // options:
                            {...paypalCardNameOptions}
                            
                            
                            
                            // accessibilities:
                            aria-label='Cardholder Name'
                            
                            
                            
                            // validations:
                            enableValidation={isPaymentPriorityPaypal ? undefined : false}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={<LabelHintsForCreditCardName />}
                />
            </IfInPaypalScriptProvider>
            <IfInMidtransScriptProvider>
                {/* conditional re-render */}
                {isPaymentPriorityMidtrans && <InputWithLabel
                    // appearances:
                    icon='person'
                    
                    
                    
                    // classes:
                    className='name'
                    
                    
                    
                    // components:
                    inputComponent={
                        <CreditCardNameEditor
                            // forms:
                            name='cardHolder'
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={<LabelHintsForCreditCardName />}
                />}
            </IfInMidtransScriptProvider>
        </>
    );
};
export {
    ConditionalCreditCardNameEditor,
    ConditionalCreditCardNameEditor as default,
};



const LabelHintsForCreditCardName = (props: LabelHintsWithTooltipProps): JSX.Element|null => {
    // default props:
    const {
        // appearances:
        icon            = 'help',
        
        
        
        // classes:
        className       = 'solid',
        
        
        
        // children:
        tooltipChildren = <>
            <p>
                The owner name as printed on front card.
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

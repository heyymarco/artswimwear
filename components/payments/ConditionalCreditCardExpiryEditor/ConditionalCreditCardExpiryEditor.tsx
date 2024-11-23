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
    paypalCardExpiryOptions,
    
    
    
    // react components:
    PaypalCardFieldWrapper,
}                           from '@/components/payments/PaypalCardFieldWrapper'
import {
    // options:
    stripeCardExpiryOptions,
    
    
    
    // react components:
    StripeCardFieldWrapper,
}                           from '@/components/payments/StripeCardFieldWrapper'

// cart components:
import {
    useCartState,
}                           from '@/components/Cart/states/cartState'

// internal components:
import {
    InputWithLabel,
}                           from '@/components/InputWithLabel'
import {
    CreditCardExpiryEditor,
}                           from '@/components/editors/CreditCardExpiryEditor'
import {
    type LabelHintsWithTooltipProps,
    LabelHintsWithTooltip,
}                           from '@/components/LabelHintsWithTooltip'



// react components:
const ConditionalCreditCardExpiryEditor = (): JSX.Element|null => {
    const styleSheets = useBaseCardFieldWrapperStyleSheet();
    
    
    
    // states:
    const {
        // payment data:
        currency,
    } = useCartState();
    
    const {
        isPaymentPriorityPaypal,
        isPaymentPriorityStripe,
        isPaymentPriorityMidtrans,
    } = usePaymentProcessorPriority({
        currency,
    });
    
    
    
    // jsx:
    return (
        <>
            <IfInStripeScriptProvider>
                {/* conditional re-render */}
                {isPaymentPriorityStripe && <InputWithLabel
                    // appearances:
                    icon='date_range'
                    
                    
                    
                    // classes:
                    className='expiry'
                    
                    
                    
                    // components:
                    inputComponent={
                        <StripeCardFieldWrapper
                            // options:
                            {...stripeCardExpiryOptions}
                            
                            
                            
                            // accessibilities:
                            aria-label='Card Expiry'
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={<LabelHintsForCreditCardExpiry />}
                />}
            </IfInStripeScriptProvider>
            <IfInPaypalScriptProvider>
                {/* conditional visibility via css */}
                <InputWithLabel
                    // appearances:
                    icon='date_range'
                    
                    
                    
                    // classes:
                    className={'expiry' + (isPaymentPriorityPaypal ? '' : styleSheets.hidden)}
                    
                    
                    
                    // components:
                    inputComponent={
                        <PaypalCardFieldWrapper
                            // options:
                            {...paypalCardExpiryOptions}
                            
                            
                            
                            // accessibilities:
                            aria-label='Card Expiry'
                            
                            
                            
                            // validations:
                            enableValidation={isPaymentPriorityPaypal ? undefined : false}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={<LabelHintsForCreditCardExpiry />}
                />
            </IfInPaypalScriptProvider>
            <IfInMidtransScriptProvider>
                {/* conditional re-render */}
                {isPaymentPriorityMidtrans && <InputWithLabel
                    // appearances:
                    icon='date_range'
                    
                    
                    
                    // classes:
                    className='expiry'
                    
                    
                    
                    // components:
                    inputComponent={
                        <CreditCardExpiryEditor
                            // forms:
                            name='cardExpiry'
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={<LabelHintsForCreditCardExpiry />}
                />}
            </IfInMidtransScriptProvider>
        </>
    );
};
export {
    ConditionalCreditCardExpiryEditor,
    ConditionalCreditCardExpiryEditor as default,
};



const LabelHintsForCreditCardExpiry = (props: LabelHintsWithTooltipProps): JSX.Element|null => {
    // default props:
    const {
        // appearances:
        icon            = 'help',
        
        
        
        // classes:
        className       = 'solid',
        
        
        
        // children:
        tooltipChildren = <>
            <p>
                The expiration date as printed on front card.
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

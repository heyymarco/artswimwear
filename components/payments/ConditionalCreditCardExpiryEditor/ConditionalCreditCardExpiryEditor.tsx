'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    Icon,
    Label,
    
    
    
    // notification-components:
    Tooltip,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// payment components:
import {
    usePaymentProcessorPriority,
}                           from '@/components/payments/hooks'

import {
    IfInPaypalScriptProvider,
}                           from '@/components/payments/ConditionalPaypalScriptProvider'
import {
    // options:
    paypalCardExpiryOptions,
    
    
    
    // react components:
    PaypalCardFieldWrapper,
}                           from '@/components/payments/PaypalCardFieldWrapper'

import {
    IfInStripeScriptProvider,
}                           from '@/components/payments/ConditionalStripeScriptProvider'
import {
    // options:
    stripeCardExpiryOptions,
    
    
    
    // react components:
    StripeCardFieldWrapper,
}                           from '@/components/payments/StripeCardFieldWrapper'

import {
    IfInMidtransScriptProvider,
}                           from '@/components/payments/ConditionalMidtransScriptProvider'

// internal components:
import {
    InputWithLabel,
}                           from '@/components/InputWithLabel'
import {
    CreditCardExpiryEditor,
}                           from '@/components/editors/CreditCardExpiryEditor'

// configs:
import {
    type checkoutConfigClient,
}                           from '@/checkout.config.client'



// react components:
export interface ConditionalCreditCardExpiryEditorProps {
    // payment data:
    appropriatePaymentProcessors : (typeof checkoutConfigClient.payment.preferredProcessors)
}
const ConditionalCreditCardExpiryEditor = (props: ConditionalCreditCardExpiryEditorProps): JSX.Element|null => {
    // props:
    const {
        // payment data:
        appropriatePaymentProcessors,
    } = props;
    
    
    
    const {
        isPaymentPriorityPaypal,
        isPaymentPriorityStripe,
        isPaymentPriorityMidtrans,
    } = usePaymentProcessorPriority({
        appropriatePaymentProcessors,
    });
    
    
    
    // refs:
    const labelRef = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    const labelCardExpiry = (
        <Label
            // refs:
            elmRef={labelRef}
            
            
            
            // variants:
            theme='success'
            mild={true}
            
            
            
            // classes:
            className='solid'
        >
            <Icon
                // appearances:
                icon='help'
            />
            <Tooltip
                // variants:
                theme='warning'
                
                
                
                // classes:
                className='tooltip'
                
                
                
                // floatable:
                floatingOn={labelRef}
            >
                <p>
                    The expiration date as printed on front card.
                </p>
            </Tooltip>
        </Label>
    );
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
                    childrenAfter={labelCardExpiry}
                />}
            </IfInStripeScriptProvider>
            <IfInPaypalScriptProvider>
                {/* conditional visibility via css */}
                <InputWithLabel
                    // appearances:
                    icon='date_range'
                    
                    
                    
                    // classes:
                    className={'expiry' + (isPaymentPriorityPaypal ? '' : ' hidden')}
                    
                    
                    
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
                    childrenAfter={labelCardExpiry}
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
                    childrenAfter={labelCardExpiry}
                />}
            </IfInMidtransScriptProvider>
        </>
    );
};
export {
    ConditionalCreditCardExpiryEditor,
    ConditionalCreditCardExpiryEditor as default,
};
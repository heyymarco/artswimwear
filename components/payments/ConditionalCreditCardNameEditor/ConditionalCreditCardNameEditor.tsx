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

// internal components:
import {
    InputWithLabel,
}                           from '@/components/InputWithLabel'
import {
    CreditCardNameEditor,
}                           from '@/components/editors/CreditCardNameEditor'

// payment components:
import {
    usePaymentProcessorPriority,
}                           from '@/components/payments/hooks'

import {
    IfInPaypalScriptProvider,
}                           from '@/components/payments/ConditionalPaypalScriptProvider'
import {
    // options:
    paypalCardNameOptions,
    
    
    
    // react components:
    PaypalCardFieldWrapper,
}                           from '@/components/payments/PaypalCardFieldWrapper'

import {
    IfInStripeScriptProvider,
}                           from '@/components/payments/ConditionalStripeScriptProvider'

import {
    IfInMidtransScriptProvider,
}                           from '@/components/payments/ConditionalMidtransScriptProvider'

// configs:
import {
    type checkoutConfigClient,
}                           from '@/checkout.config.client'



// react components:
export interface ConditionalCreditCardNameEditorProps {
    // payment data:
    appropriatePaymentProcessors : (typeof checkoutConfigClient.payment.preferredProcessors)
}
const ConditionalCreditCardNameEditor = (props: ConditionalCreditCardNameEditorProps): JSX.Element|null => {
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
    const labelCardName   = (
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
                    The owner name as printed on front card.
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
                    icon='person'
                    
                    
                    
                    // classes:
                    className='name'
                    
                    
                    
                    // components:
                    inputComponent={
                        <CreditCardNameEditor
                            // accessibilities:
                            aria-label='Cardholder Name'
                            placeholder='John Doe'
                            
                            
                            
                            // classes:
                            // className='cardFieldWrapper' // <CreditCardNameEditor> is not a iframe wrapper, do not add `cardFieldWrapper` class
                            
                            
                            
                            // forms:
                            name='cardHolder'
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={labelCardName}
                />}
            </IfInStripeScriptProvider>
            <IfInPaypalScriptProvider>
                {/* conditional visibility via css */}
                <InputWithLabel
                    // appearances:
                    icon='credit_card'
                    
                    
                    
                    // classes:
                    className={'name' + (isPaymentPriorityPaypal ? '' : ' hidden')}
                    
                    
                    
                    // components:
                    inputComponent={
                        <PaypalCardFieldWrapper
                            // options:
                            {...paypalCardNameOptions}
                            
                            
                            
                            // accessibilities:
                            aria-label='Cardholder Name'
                            
                            
                            
                            // classes:
                            className='cardFieldWrapper'
                            
                            
                            
                            // validations:
                            enableValidation={isPaymentPriorityPaypal ? undefined : false}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={labelCardName}
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
                    childrenAfter={labelCardName}
                />}
            </IfInMidtransScriptProvider>
        </>
    );
};
export {
    ConditionalCreditCardNameEditor,
    ConditionalCreditCardNameEditor as default,
};

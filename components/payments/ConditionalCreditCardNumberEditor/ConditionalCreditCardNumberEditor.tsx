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
    paypalCardNumberOptions,
    
    
    
    // react components:
    PaypalCardFieldWrapper,
}                           from '@/components/payments/PaypalCardFieldWrapper'

import {
    CardNumberElement,
}                           from '@stripe/react-stripe-js'
import {
    IfInStripeElementsProvider,
}                           from '@/components/payments/ConditionalStripeElementsProvider'
import {
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
    CreditCardNumberEditor,
}                           from '@/components/editors/CreditCardNumberEditor'

// configs:
import {
    type checkoutConfigClient,
}                           from '@/checkout.config.client'



// react components:
export interface ConditionalCreditCardNumberEditorProps {
    // payment data:
    appropriatePaymentProcessors : (typeof checkoutConfigClient.payment.preferredProcessors)
}
const ConditionalCreditCardNumberEditor = (props: ConditionalCreditCardNumberEditorProps): JSX.Element|null => {
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
    const labelCardNumber = (
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
                icon='lock'
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
                    All transactions are secure and encrypted.
                </p>
                <p>
                    Once the payment is processed, the credit card data <strong>no longer stored</strong> in application memory.
                </p>
                <p>
                    The card data will be forwarded to our payment gateway (PayPal).<br />
                    We won&apos;t store your card data into our database.
                </p>
            </Tooltip>
        </Label>
    );
    return (
        <>
            <IfInStripeElementsProvider>
                {/* conditional re-render */}
                {isPaymentPriorityStripe && <InputWithLabel
                    // appearances:
                    icon='credit_card'
                    
                    
                    
                    // classes:
                    className='number'
                    
                    
                    
                    // components:
                    inputComponent={
                        <StripeCardFieldWrapper
                            // accessibilities:
                            aria-label='Card Number'
                            
                            
                            
                            // validations:
                            enableValidation={isPaymentPriorityStripe ? undefined : false}
                            
                            
                            
                            // components:
                            cardElementComponent={
                                <CardNumberElement />
                            }
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={labelCardNumber}
                />}
            </IfInStripeElementsProvider>
            <IfInPaypalScriptProvider>
                {/* conditional visibility via css */}
                <InputWithLabel
                    // appearances:
                    icon='credit_card'
                    
                    
                    
                    // classes:
                    className={'number' + (isPaymentPriorityPaypal ? '' : ' hidden')}
                    
                    
                    
                    // components:
                    inputComponent={
                        <PaypalCardFieldWrapper
                            // options:
                            {...paypalCardNumberOptions}
                            
                            
                            
                            // accessibilities:
                            aria-label='Card Number'
                            
                            
                            
                            // classes:
                            className='cardField'
                            
                            
                            
                            // validations:
                            enableValidation={isPaymentPriorityPaypal ? undefined : false}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={labelCardNumber}
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
                    childrenAfter={labelCardNumber}
                />}
            </IfInMidtransScriptProvider>
        </>
    );
};
export {
    ConditionalCreditCardNumberEditor,
    ConditionalCreditCardNumberEditor as default,
};

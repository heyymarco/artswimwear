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
    CreditCardCvvEditor,
}                           from '@/components/editors/CreditCardCvvEditor'

// paypal:
import {
    IfInPayPalScriptProvider,
}                           from './ConditionalPayPalScriptProvider'
import {
    // options:
    paypalCardCvvOptions,
    
    
    
    // react components:
    PayPalCardFieldWrapper,
}                           from '../payments/PayPalCardFieldWrapper'

// stripe:
import {
    CardCvcElement,
}                           from '@stripe/react-stripe-js'
import {
    IfInStripeElementsProvider,
}                           from './ConditionalStripeElementsProvider'
import {
    // react components:
    StripeCardFieldWrapper,
}                           from '../payments/StripeCardFieldWrapper'

// midtrans:
import {
    IfInMidtransScriptProvider,
}                           from './ConditionalMidtransScriptProvider'

// internals:
import {
    usePaymentProcessorPriority,
}                           from './hooks'

// configs:
import {
    type checkoutConfigClient,
}                           from '@/checkout.config.client'



// react components:
export interface ConditionalCreditCardCvvEditorProps {
    // payment data:
    appropriatePaymentProcessors : (typeof checkoutConfigClient.payment.preferredProcessors)
}
const ConditionalCreditCardCvvEditor = (props: ConditionalCreditCardCvvEditorProps): JSX.Element|null => {
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
    const labelCardCvv    = (
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
                    3-digit security code usually found on the back of your card.
                </p>
                <p>
                    American Express cards have a 4-digit code located on the front.
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
                    icon='edit'
                    
                    
                    
                    // classes:
                    className='csc'
                    
                    
                    
                    // components:
                    inputComponent={
                        <StripeCardFieldWrapper
                            // accessibilities:
                            aria-label='Card CSC/CVV'
                            
                            
                            
                            // validations:
                            enableValidation={isPaymentPriorityStripe ? undefined : false}
                            
                            
                            
                            // components:
                            cardElementComponent={
                                <CardCvcElement />
                            }
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={labelCardCvv}
                />}
            </IfInStripeElementsProvider>
            <IfInPayPalScriptProvider>
                {/* conditional visibility via css */}
                <InputWithLabel
                    // appearances:
                    icon='edit'
                    
                    
                    
                    // classes:
                    className={'csc' + (isPaymentPriorityPaypal ? '' : ' hidden')}
                    
                    
                    
                    // components:
                    inputComponent={
                        <PayPalCardFieldWrapper
                            // options:
                            {...paypalCardCvvOptions}
                            
                            
                            
                            // accessibilities:
                            aria-label='Card CSC/CVV'
                            
                            
                            
                            // classes:
                            className='cardField'
                            
                            
                            
                            // validations:
                            enableValidation={isPaymentPriorityPaypal ? undefined : false}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={labelCardCvv}
                />
            </IfInPayPalScriptProvider>
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
                    childrenAfter={labelCardCvv}
                />}
            </IfInMidtransScriptProvider>
        </>
    );
};
export {
    ConditionalCreditCardCvvEditor,
    ConditionalCreditCardCvvEditor as default,
};
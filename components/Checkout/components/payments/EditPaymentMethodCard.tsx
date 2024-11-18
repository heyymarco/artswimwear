'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

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
import {
    CreditCardNumberEditor,
}                           from '@/components/editors/CreditCardNumberEditor'
import {
    CreditCardExpiryEditor,
}                           from '@/components/editors/CreditCardExpiryEditor'
import {
    CreditCardCvvEditor,
}                           from '@/components/editors/CreditCardCvvEditor'
import {
    EditBillingAddress,
}                           from './EditBillingAddress'
import {
    ButtonPaymentCard,
}                           from '../payments/ButtonPaymentCard'

// paypal:
import {
    PayPalNumberField,
    PayPalNameField,
    PayPalExpiryField,
    PayPalCVVField,
}                           from '@paypal/react-paypal-js'
import {
    IfInPayPalScriptProvider,
}                           from './ConditionalPayPalScriptProvider'
import {
    ConditionalPayPalCardFieldsProvider,
}                           from './ConditionalPayPalCardFieldsProvider'
import {
    // react components:
    PayPalCardFieldWrapperProps,
    PayPalCardFieldWrapper,
}                           from '../payments/PayPalCardFieldWrapper'

// stripe:
import {
    CardNumberElement,
    CardExpiryElement,
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
    useCheckoutState,
}                           from '../../states/checkoutState'
import {
    usePaymentProcessorPriority,
}                           from './hooks'



// utilities:
const cardNumberOptions      : PayPalCardFieldWrapperProps = {
    // selector              : '#cardNumber',
    placeholder              : '1111-2222-3333-4444',
    type                     : 'cardNumberField',
    payPalCardFieldComponent : <PayPalNumberField />,
};
const cardNameOptions      : PayPalCardFieldWrapperProps = {
    // selector              : '#cardName',
    placeholder              : 'John Doe',
    type                     : 'cardNameField',
    payPalCardFieldComponent : <PayPalNameField />,
};
const cardExpiryOptions      : PayPalCardFieldWrapperProps = {
    // selector              : '#cardExpiry',
    placeholder              : '11/2020',
    type                     : 'cardExpiryField',
    payPalCardFieldComponent : <PayPalExpiryField />,
};
const cardCvvOptions         : PayPalCardFieldWrapperProps = {
    // selector              : '#cardCvv',
    placeholder              : '123',
    type                     : 'cardCvvField',
    payPalCardFieldComponent : <PayPalCVVField />,
};



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
    
    
    
    // refs:
    const safeSignRef = useRef<HTMLElement|null>(null);
    const nameSignRef = useRef<HTMLElement|null>(null);
    const dateSignRef = useRef<HTMLElement|null>(null);
    const cscSignRef  = useRef<HTMLElement|null>(null);
    
    
    
    const {
        isPaymentPriorityPaypal,
        isPaymentPriorityStripe,
        isPaymentPriorityMidtrans,
    } = usePaymentProcessorPriority({
        appropriatePaymentProcessors,
    });
    
    
    
    // jsx:
    const labelCardNumber = (
        <Label
            // refs:
            elmRef={safeSignRef}
            
            
            
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
                floatingOn={safeSignRef}
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
    const labelCardName   = (
        <Label
            // refs:
            elmRef={nameSignRef}
            
            
            
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
                floatingOn={nameSignRef}
            >
                <p>
                    The owner name as printed on front card.
                </p>
            </Tooltip>
        </Label>
    );
    const labelCardExpiry = (
        <Label
            // refs:
            elmRef={dateSignRef}
            
            
            
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
                floatingOn={dateSignRef}
            >
                <p>
                    The expiration date as printed on front card.
                </p>
            </Tooltip>
        </Label>
    );
    const labelCardCvv    = (
        <Label
            // refs:
            elmRef={cscSignRef}
            
            
            
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
                floatingOn={cscSignRef}
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
        <ValidationProvider
            // validations:
            enableValidation={paymentValidation}
        >
            <div className='instruct'>
                <p>
                    Fill in your <strong>credit card information</strong> below, enter <strong>billing address</strong>, and then click the <strong>Pay Now</strong> button:
                </p>
            </div>
            
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
            <IfInPayPalScriptProvider>
                {/* conditional visibility via css */}
                <InputWithLabel
                    // appearances:
                    icon='credit_card'
                    
                    
                    
                    // classes:
                    className={'number' + (isPaymentPriorityPaypal ? '' : ' hidden')}
                    
                    
                    
                    // components:
                    inputComponent={
                        <PayPalCardFieldWrapper
                            // options:
                            {...cardNumberOptions}
                            
                            
                            
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
            </IfInPayPalScriptProvider>
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
            
            <IfInStripeElementsProvider>
                {/* conditional re-render */}
                {isPaymentPriorityStripe && <InputWithLabel
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
            </IfInStripeElementsProvider>
            <IfInPayPalScriptProvider>
                {/* conditional visibility via css */}
                <InputWithLabel
                    // appearances:
                    icon='credit_card'
                    
                    
                    
                    // classes:
                    className={'name' + (isPaymentPriorityPaypal ? '' : ' hidden')}
                    
                    
                    
                    // components:
                    inputComponent={
                        <PayPalCardFieldWrapper
                            // options:
                            {...cardNameOptions}
                            
                            
                            
                            // accessibilities:
                            aria-label='Cardholder Name'
                            
                            
                            
                            // classes:
                            className='cardField'
                            
                            
                            
                            // validations:
                            enableValidation={isPaymentPriorityPaypal ? undefined : false}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={labelCardName}
                />
            </IfInPayPalScriptProvider>
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
            
            
            <IfInStripeElementsProvider>
                {/* conditional re-render */}
                {isPaymentPriorityStripe && <InputWithLabel
                    // appearances:
                    icon='date_range'
                    
                    
                    
                    // classes:
                    className='expiry'
                    
                    
                    
                    // components:
                    inputComponent={
                        <StripeCardFieldWrapper
                            // accessibilities:
                            aria-label='Card Expiry'
                            
                            
                            
                            // validations:
                            enableValidation={isPaymentPriorityStripe ? undefined : false}
                            
                            
                            
                            // components:
                            cardElementComponent={
                                <CardExpiryElement />
                            }
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={labelCardExpiry}
                />}
            </IfInStripeElementsProvider>
            <IfInPayPalScriptProvider>
                {/* conditional visibility via css */}
                <InputWithLabel
                    // appearances:
                    icon='date_range'
                    
                    
                    
                    // classes:
                    className={'expiry' + (isPaymentPriorityPaypal ? '' : ' hidden')}
                    
                    
                    
                    // components:
                    inputComponent={
                        <PayPalCardFieldWrapper
                            // options:
                            {...cardExpiryOptions}
                            
                            
                            
                            // accessibilities:
                            aria-label='Card Expiry'
                            
                            
                            
                            // classes:
                            className='cardField'
                            
                            
                            
                            // validations:
                            enableValidation={isPaymentPriorityPaypal ? undefined : false}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={labelCardExpiry}
                />
            </IfInPayPalScriptProvider>
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
                            {...cardCvvOptions}
                            
                            
                            
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

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
    
    
    
    // menu-components:
    Collapse,
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
    CreditCardExpiresEditor,
}                           from '@/components/editors/CreditCardExpiresEditor'
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
    useIsInPayPalScriptProvider,
    IfInPayPalScriptProvider,
}                           from './ConditionalPayPalScriptProvider'
import {
    ConditionalPayPalHostedFieldsProvider,
}                           from './ConditionalPayPalHostedFieldsProvider'
import {
    // react components:
    PayPalHostedFieldWrapperProps,
    PayPalHostedFieldWrapper,
}                           from '../payments/PayPalHostedFieldWrapper'

// stripe:
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
}                           from '@stripe/react-stripe-js'
import {
    useIsInStripeElementsProvider,
    IfInStripeElementsProvider,
}                           from './ConditionalStripeElementsProvider'
import {
    // react components:
    StripeHostedFieldWrapper,
}                           from '../payments/StripeHostedFieldWrapper'

// midtrans:
import {
    useIsInMidtransScriptProvider,
    IfInMidtransScriptProvider,
}                           from './ConditionalMidtransScriptProvider'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'

// configs:
import {
    type checkoutConfigClient,
}                           from '@/checkout.config.client'



// utilities:
const cardNumberOptions  : PayPalHostedFieldWrapperProps['options'] = {
    selector    : '#cardNumber',
    placeholder : '1111-2222-3333-4444',
};
const cardExpiresOptions : PayPalHostedFieldWrapperProps['options'] = {
    selector    : '#cardExpires',
    placeholder : '11/2020',
};
const cardCvvOptions     : PayPalHostedFieldWrapperProps['options'] = {
    selector    : '#cardCvv',
    placeholder : '123',
};



// react components:
const EditPaymentMethodCard = (): JSX.Element|null => {
    // jsx:
    return (
        <ConditionalPayPalHostedFieldsProvider>
            <EditPaymentMethodCardInternal />
        </ConditionalPayPalHostedFieldsProvider>
    );
};
const EditPaymentMethodCardInternal = (): JSX.Element|null => {
    const {
        // billing data:
        isBillingAddressRequired,
        
        
        
        // payment data:
        appropriatePaymentProcessors,
        paymentValidation,
        paymentSession,
        
        
        
        // sections:
        billingAddressSectionRef,
    } = useCheckoutState();
    
    
    
    // refs:
    const safeSignRef = useRef<HTMLElement|null>(null);
    const nameSignRef = useRef<HTMLElement|null>(null);
    const dateSignRef = useRef<HTMLElement|null>(null);
    const cscSignRef  = useRef<HTMLElement|null>(null);
    
    
    
    const isInPayPalScriptProvider   = useIsInPayPalScriptProvider();
    const isInStripeElementsProvider = useIsInStripeElementsProvider();
    const isInMidtransScriptProvider = useIsInMidtransScriptProvider();
    const supportedCardProcessors    : string[] = (
        ([
            !isInPayPalScriptProvider   ? undefined : 'paypal',
            !isInStripeElementsProvider ? undefined : 'stripe',
            !isInMidtransScriptProvider ? undefined : 'midtrans',
        ] satisfies ((typeof checkoutConfigClient.payment.preferredProcessors[number])|undefined)[])
        .filter((item): item is Exclude<typeof item, undefined> => (item !== undefined))
    );
    const priorityPaymentProcessor   = appropriatePaymentProcessors.find((processor) => supportedCardProcessors.includes(processor)); // find the highest priority payment processor that supports card payment
    const isPayUsingPaypalPriority   = (priorityPaymentProcessor === 'paypal');
    const isPayUsingStripePriority   = (priorityPaymentProcessor === 'stripe');
    const isPayUsingMidtransPriority = (priorityPaymentProcessor === 'midtrans');
    
    
    
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
                    Fill in your credit card information below and then click the <em>Pay Now</em> button:
                </p>
            </div>
            
            <IfInStripeElementsProvider>
                {/* conditional re-render */}
                {isPayUsingStripePriority && <InputWithLabel
                    // appearances:
                    icon='credit_card'
                    
                    
                    
                    // classes:
                    className='number'
                    
                    
                    
                    // components:
                    inputComponent={
                        <StripeHostedFieldWrapper
                            // accessibilities:
                            aria-label='Card Number'
                            
                            
                            
                            // validations:
                            enableValidation={isPayUsingStripePriority ? undefined : false}
                            
                            
                            
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
                    className={'number' + (isPayUsingPaypalPriority ? '' : ' hidden')}
                    
                    
                    
                    // components:
                    inputComponent={
                        <PayPalHostedFieldWrapper
                            // identifiers:
                            id='cardNumber'
                            
                            
                            
                            // accessibilities:
                            aria-label='Card Number'
                            
                            
                            
                            // classes:
                            className='hostedField'
                            
                            
                            
                            // validations:
                            enableValidation={isPayUsingPaypalPriority ? undefined : false}
                            
                            
                            
                            // formats:
                            hostedFieldType='number'
                            
                            
                            
                            // options:
                            options={cardNumberOptions}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={labelCardNumber}
                />
            </IfInPayPalScriptProvider>
            <IfInMidtransScriptProvider>
                {/* conditional re-render */}
                {isPayUsingMidtransPriority && <InputWithLabel
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
            
            <InputWithLabel
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
            />
            
            <IfInStripeElementsProvider>
                {/* conditional re-render */}
                {isPayUsingStripePriority && <InputWithLabel
                    // appearances:
                    icon='date_range'
                    
                    
                    
                    // classes:
                    className='expiry'
                    
                    
                    
                    // components:
                    inputComponent={
                        <StripeHostedFieldWrapper
                            // accessibilities:
                            aria-label='Card Expires'
                            
                            
                            
                            // validations:
                            enableValidation={isPayUsingStripePriority ? undefined : false}
                            
                            
                            
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
                    className={'expiry' + (isPayUsingPaypalPriority ? '' : ' hidden')}
                    
                    
                    
                    // components:
                    inputComponent={
                        <PayPalHostedFieldWrapper
                            // identifiers:
                            id='cardExpires'
                            
                            
                            
                            // accessibilities:
                            aria-label='Card Expires'
                            
                            
                            
                            // classes:
                            className='hostedField'
                            
                            
                            
                            // validations:
                            enableValidation={isPayUsingPaypalPriority ? undefined : false}
                            
                            
                            
                            // formats:
                            hostedFieldType='expirationDate'
                            
                            
                            
                            // options:
                            options={cardExpiresOptions}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={labelCardExpiry}
                />
            </IfInPayPalScriptProvider>
            <IfInMidtransScriptProvider>
                {/* conditional re-render */}
                {isPayUsingMidtransPriority && <InputWithLabel
                    // appearances:
                    icon='date_range'
                    
                    
                    
                    // classes:
                    className='expiry'
                    
                    
                    
                    // components:
                    inputComponent={
                        <CreditCardExpiresEditor
                            // forms:
                            name='cardExpires'
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={labelCardExpiry}
                />}
            </IfInMidtransScriptProvider>
            
            <IfInStripeElementsProvider>
                {/* conditional re-render */}
                {isPayUsingStripePriority && <InputWithLabel
                    // appearances:
                    icon='edit'
                    
                    
                    
                    // classes:
                    className='csc'
                    
                    
                    
                    // components:
                    inputComponent={
                        <StripeHostedFieldWrapper
                            // accessibilities:
                            aria-label='Card CSC/CVV'
                            
                            
                            
                            // validations:
                            enableValidation={isPayUsingStripePriority ? undefined : false}
                            
                            
                            
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
                    className={'csc' + (isPayUsingPaypalPriority ? '' : ' hidden')}
                    
                    
                    
                    // components:
                    inputComponent={
                        <PayPalHostedFieldWrapper
                            // identifiers:
                            id='cardCvv'
                            
                            
                            
                            // accessibilities:
                            aria-label='Card CSC/CVV'
                            
                            
                            
                            // classes:
                            className='hostedField'
                            
                            
                            
                            // validations:
                            enableValidation={isPayUsingPaypalPriority ? undefined : false}
                            
                            
                            
                            // formats:
                            hostedFieldType='cvv'
                            
                            
                            
                            // options:
                            options={cardCvvOptions}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={labelCardCvv}
                />
            </IfInPayPalScriptProvider>
            <IfInMidtransScriptProvider>
                {/* conditional re-render */}
                {isPayUsingMidtransPriority && <InputWithLabel
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
            
            <Collapse
                // refs:
                elmRef={billingAddressSectionRef}
                
                
                
                // semantics:
                tag='section'
                
                
                
                // classes:
                className='billing'
                
                
                
                // behaviors:
                // lazy={true} // causes collapsing animation error
                
                
                
                // states:
                expanded={isBillingAddressRequired}
            >
                <p>
                    Enter the address that matches your card&apos;s billing address.
                </p>
                <EditBillingAddress />
                
                <hr className='horz2' />
            </Collapse>
            
            <ButtonPaymentCard />
        </ValidationProvider>
    );
};
export {
    EditPaymentMethodCard,
    EditPaymentMethodCard as default,
};

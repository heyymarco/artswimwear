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
    // react helper hooks:
    useEvent,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    Label,
    TextInput,
    
    
    
    // notification-components:
    Tooltip,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    InputWithLabel,
}                           from '@/components/InputWithLabel'
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
    PortalToNavCheckoutSection,
}                           from '../navigations/PortalToNavCheckoutSection'
import {
    // styles:
    hostedFieldsStyle,
    
    
    
    // react components:
    PayPalHostedFieldExtendedProps,
    PayPalHostedFieldExtended,
}                           from '../payments/PayPalHostedFieldExtended'
import {
    ButtonPaymentCard,
}                           from '../payments/ButtonPaymentCard'

// contexts:
import {
    // hooks:
    useCartState,
}                           from '@/components/Cart'

// paypal:
import {
    PayPalHostedFieldsProvider,
}                           from '@paypal/react-paypal-js'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'

// configs:
import {
    paymentConfig,
}                           from '@/payment.config'



// utilities:
const cardNumberOptions  : PayPalHostedFieldExtendedProps['options'] = {
    selector    : '#cardNumber',
    placeholder : 'Card Number',
};
const cardExpiresOptions : PayPalHostedFieldExtendedProps['options'] = {
    selector    : '#cardExpires',
    placeholder : 'MM / YY',
};
const cardCvvOptions     : PayPalHostedFieldExtendedProps['options'] = {
    selector    : '#cardCvv',
    placeholder : 'Security Code',
};



// react components:
const EditPaymentMethodCard = (): JSX.Element|null => {
    // states:
    const {
        // accessibilities:
        preferredCurrency,
    } = useCartState();
    
    const {
        // payment data:
        paymentValidation,
        paymentMethod,
        
        
        
        // fields:
        cardholderInputRef,
        
        
        
        // actions:
        doPlaceOrder,
    } = useCheckoutState();
    
    
    
    // refs:
    const safeSignRef = useRef<HTMLElement|null>(null);
    const nameSignRef = useRef<HTMLElement|null>(null);
    const dateSignRef = useRef<HTMLElement|null>(null);
    const cscSignRef  = useRef<HTMLElement|null>(null);
    
    
    
    // dialogs:
    const {
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleCreateOrder    = useEvent(async (): Promise<string> => {
        try {
            return await doPlaceOrder();
        }
        catch (fetchError: any) {
            if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'order' });
            throw fetchError;
        } // try
    });
    
    
    
    const appropriatePaymentProcessor = (
        paymentConfig.preferredPaymentProcessors
        .map((paymentProcessorName) => [
            paymentProcessorName,
            paymentConfig.paymentProcessors[paymentProcessorName]
        ] as const)
        .find(([paymentProcessorName, {enabled, supportedCurrencies}]) =>
            enabled
            &&
            supportedCurrencies.includes(preferredCurrency)
        )
        ?.[0]
    );
    const isUsingPaypal   = (appropriatePaymentProcessor === 'paypal');
    const isUsingMidtrans = (appropriatePaymentProcessor === 'midtrans');
    
    
    
    // jsx:
    const creditCardFields = (
        <ValidationProvider
            // validations:
            enableValidation={paymentValidation}
        >
            <InputWithLabel
                // appearances:
                icon='credit_card'
                
                
                
                // classes:
                className='number'
                
                
                
                // components:
                inputComponent={
                    (() => {
                        if (isUsingPaypal) return (
                            <PayPalHostedFieldExtended
                                // identifiers:
                                id='cardNumber'
                                
                                
                                
                                // classes:
                                className='hostedField'
                                
                                
                                
                                // formats:
                                hostedFieldType='number'
                                
                                
                                
                                // options:
                                options={cardNumberOptions}
                            />
                        );
                        return (
                            <CreditCardNumberEditor
                                // identifiers:
                                id='cardNumber'
                            />
                        );
                    })()
                }
                
                
                
                // children:
                childrenAfter={
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
                }
            />
            
            <InputWithLabel
                // appearances:
                icon='person'
                
                
                
                // classes:
                className='name'
                
                
                
                // components:
                inputComponent={
                    <TextInput
                        // refs:
                        elmRef={cardholderInputRef}
                        
                        
                        
                        // accessibilities:
                        placeholder='Cardholder Name'
                        
                        
                        
                        // validations:
                        required={true}
                        
                        
                        
                        // formats:
                        inputMode='text'
                        autoComplete='cc-name'
                        autoCapitalize='words'
                    />
                }
                
                
                
                // children:
                childrenAfter={
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
                }
            />
            
            <InputWithLabel
                // appearances:
                icon='date_range'
                
                
                
                // classes:
                className='expiry'
                
                
                
                // components:
                inputComponent={
                    (() => {
                        if (isUsingPaypal) return (
                            <PayPalHostedFieldExtended
                                // identifiers:
                                id='cardExpires'
                                
                                
                                
                                // classes:
                                className='hostedField'
                                
                                
                                
                                // formats:
                                hostedFieldType='expirationDate'
                                
                                
                                
                                // options:
                                options={cardExpiresOptions}
                            />
                        );
                        return (
                            <CreditCardExpiresEditor
                                // identifiers:
                                id='cardExpires'
                            />
                        );
                    })()
                }
                
                
                
                // children:
                childrenAfter={
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
                }
            />
            
            <InputWithLabel
                // appearances:
                icon='edit'
                
                
                
                // classes:
                className='csc'
                
                
                
                // components:
                inputComponent={
                    (() => {
                        if (isUsingPaypal) return (
                            <PayPalHostedFieldExtended
                                // identifiers:
                                id='cardCvv'
                                
                                
                                
                                // classes:
                                className='hostedField'
                                
                                
                                
                                // formats:
                                hostedFieldType='cvv'
                                
                                
                                
                                // options:
                                options={cardCvvOptions}
                            />
                        );
                        return (
                            <CreditCardCvvEditor
                                // identifiers:
                                id='cardCvv'
                            />
                        );
                    })()
                }
                
                
                
                // children:
                childrenAfter={
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
                }
            />
            
            {((paymentMethod ?? 'card') === 'card') && <PortalToNavCheckoutSection>
                <ButtonPaymentCard />
            </PortalToNavCheckoutSection>}
        </ValidationProvider>
    );
    if (isUsingPaypal) return (
        <PayPalHostedFieldsProvider
            // styles:
            styles={hostedFieldsStyle}
            
            
            
            // handlers:
            createOrder={handleCreateOrder}
        >
            {creditCardFields}
        </PayPalHostedFieldsProvider>
    );
    return (
        <div>
            {creditCardFields}
        </div>
    );
};
export {
    EditPaymentMethodCard,
    EditPaymentMethodCard as default,
};

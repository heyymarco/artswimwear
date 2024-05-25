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
    
    
    
    // notification-components:
    Tooltip,
    
    
    
    // menu-components:
    Collapse,
    
    
    
    // utility-components:
    useDialogMessage,
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
    // styles:
    hostedFieldsStyle,
    
    
    
    // react components:
    PayPalHostedFieldExtendedProps,
    PayPalHostedFieldExtended,
}                           from '../payments/PayPalHostedFieldExtended'
import {
    EditBillingAddress,
}                           from './EditBillingAddress'
import {
    ButtonPaymentCard,
}                           from '../payments/ButtonPaymentCard'

// paypal:
import {
    PayPalHostedFieldsProvider,
}                           from '@paypal/react-paypal-js'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



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
    const {
        // billing data:
        isBillingAddressRequired,
        
        
        
        // payment data:
        appropriatePaymentProcessor,
        paymentValidation,
        
        
        
        // sections:
        billingAddressSectionRef,
        
        
        
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
            const draftOrderDetail = await doPlaceOrder();
            if (!draftOrderDetail) throw Error('Oops, an error occured!');
            return draftOrderDetail.orderId;
        }
        catch (fetchError: any) {
            if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'order' });
            throw fetchError;
        } // try
    });
    
    
    
    const isPayUsingPaypal   = (appropriatePaymentProcessor === 'paypal');
    const isPayUsingMidtrans = (appropriatePaymentProcessor === 'midtrans');
    
    
    
    // jsx:
    const creditCardFields = (
        <ValidationProvider
            // validations:
            enableValidation={paymentValidation}
        >
            <div className='instruct'>
                <p>
                    Fill in your credit card information below and then click the <em>Pay Now</em> button:
                </p>
            </div>
            
            <InputWithLabel
                // appearances:
                icon='credit_card'
                
                
                
                // classes:
                className='number'
                
                
                
                // components:
                inputComponent={
                    (() => {
                        if (isPayUsingPaypal) return (
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
                                // forms:
                                name='cardNumber'
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
                    <CreditCardNameEditor
                        // refs:
                        elmRef={cardholderInputRef}
                        
                        
                        
                        // forms:
                        name='cardHolder'
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
                        if (isPayUsingPaypal) return (
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
                                // forms:
                                name='cardExpires'
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
                        if (isPayUsingPaypal) return (
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
                                // forms:
                                name='cardCvv'
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
    if (isPayUsingPaypal) return (
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

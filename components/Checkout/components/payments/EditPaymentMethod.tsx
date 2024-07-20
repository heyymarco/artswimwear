'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

import {
    default as NextImage,
}                           from 'next/image'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    
    
    
    // composite-components:
    AccordionItem,
    ExclusiveExpandedChangeEvent,
    ExclusiveAccordion,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'
import {
    RadioDecorator,
}                           from '@heymarco/radio-decorator'

// internal components:
import {
    EditPaymentMethodCard,
}                           from '../payments/EditPaymentMethodCard'
import {
    ViewPaymentMethodPaypal,
}                           from '../payments/ViewPaymentMethodPaypal'
import {
    ViewPaymentMethodQris,
}                           from '../payments/ViewPaymentMethodQris'
import {
    ViewPaymentMethodRedirect,
}                           from '../payments/ViewPaymentMethodRedirect'
import {
    ViewPaymentMethodOtc,
}                           from '../payments/ViewPaymentMethodOtc'
import {
    ViewPaymentMethodManual,
}                           from '../payments/ViewPaymentMethodManual'

// paypal:
import {
    useIsInPayPalScriptProvider,
    ConditionalPayPalScriptProvider,
}                           from './ConditionalPayPalScriptProvider'

// stripe:
import {
    useIsInStripeElementsProvider,
    ConditionalStripeElementsProvider,
}                           from './ConditionalStripeElementsProvider'

// midtrans:
import {
    useIsInMidtransScriptProvider,
    ConditionalMidtransScriptProvider,
}                           from './ConditionalMidtransScriptProvider'

// models:
import type {
    PaymentMethod,
}                           from '@/models'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    // states:
    useCartState,
}                           from '@/components/Cart'
import {
    // states:
    useCheckoutState,
}                           from '../../states/checkoutState'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



// react components:
const EditPaymentMethod = (): JSX.Element|null => {
    // jsx:
    return (
        <ConditionalPayPalScriptProvider>
            <ConditionalStripeElementsProvider>
                <ConditionalMidtransScriptProvider>
                    <EditPaymentMethodInternal />
                </ConditionalMidtransScriptProvider>
            </ConditionalStripeElementsProvider>
        </ConditionalPayPalScriptProvider>
    );
};
const EditPaymentMethodInternal = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // accessibilities:
        currency,
    } = useCartState();
    
    const {
        // payment data:
        appropriatePaymentProcessors,
        paymentMethod,
        setPaymentMethod,
        
        
        
        // sections:
        paymentCardSectionRef,
    } = useCheckoutState();
    
    
    
    const isInPayPalScriptProvider   = useIsInPayPalScriptProvider();
    const isInStripeElementsProvider = useIsInStripeElementsProvider();
    const isInMidtransScriptProvider = useIsInMidtransScriptProvider();
    const isPayUsingPaypal           = isInPayPalScriptProvider   && appropriatePaymentProcessors.includes('paypal');
    const isPayUsingStripe           = isInStripeElementsProvider && appropriatePaymentProcessors.includes('stripe');
    const isPayUsingMidtrans         = isInMidtransScriptProvider && appropriatePaymentProcessors.includes('midtrans');
    const canPayUsingBank            = !!checkoutConfigClient.payment.processors.bank.enabled && checkoutConfigClient.payment.processors.bank.supportedCurrencies.includes(currency);
    
    
    
    // payment method options:
    const paymentMethodList : PaymentMethod[] = Array.from(
        new Set([ // remove duplicate(s)
            ...(isPayUsingPaypal   ? (['card' /* card must be the first index */, 'paypal'] satisfies PaymentMethod[]) : []),
            ...(isPayUsingStripe   ? (['card' /* card must be the first index */] satisfies PaymentMethod[]) : []),
            ...(isPayUsingMidtrans ? (['card' /* card must be the first index */, 'qris', 'gopay', 'shopeepay', 'indomaret', 'alfamart'] satisfies PaymentMethod[]) : []),
            ...(canPayUsingBank    ? (['manual'] satisfies PaymentMethod[]) : []),
        ])
    );
    
    
    
    // handlers:
    const handlePaymentMethodExpandedChange = useEvent<EventHandler<ExclusiveExpandedChangeEvent>>(({expanded, listIndex}) => {
        // conditions:
        if (!expanded) return;
        
        
        
        // actions:
        setPaymentMethod(paymentMethodList[listIndex]);
    });
    
    
    
    // jsx:
    return (
        <>
            <p>
                Choose the payment method you are most familiar with:
            </p>
            
            <ExclusiveAccordion
                // classes:
                className={styleSheet.selectPayment}
                
                
                
                // states:
                expandedListIndex={
                    Math.max(-1, paymentMethodList.findIndex((option) => (option === paymentMethod)))
                }
                
                
                
                // handlers:
                onExpandedChange={handlePaymentMethodExpandedChange}
            >
                {(isPayUsingPaypal || isPayUsingStripe || isPayUsingMidtrans) && <AccordionItem
                    // accessibilities:
                    label={<>
                        <RadioDecorator />
                        <span className='label'>
                            Credit Card
                        </span>
                        <NextImage alt='Credit Card' src='/brands/creditcard.svg' width={39} height={30} />
                    </>}
                    
                    
                    
                    // behaviors:
                    // lazy={true} // causes error
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Section
                            // refs:
                            elmRef={paymentCardSectionRef}
                            
                            
                            
                            // semantics:
                            tag='form'
                            
                            
                            
                            // classes:
                            className={styleSheet.paymentEntryCard}
                        />
                    }
                >
                    <EditPaymentMethodCard />
                </AccordionItem>}
                
                {isPayUsingPaypal && <AccordionItem
                    // accessibilities:
                    label={<>
                        <RadioDecorator />
                        <span className='label'>
                            PayPal
                        </span>
                        <NextImage alt='PayPal' src='/brands/paypal.svg' width={60} height={15.5} />
                    </>}
                    
                    
                    
                    // behaviors:
                    // lazy={true} // causes error
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Section
                            // classes:
                            className={styleSheet.paymentEntryPaypal}
                        />
                    }
                >
                    <ViewPaymentMethodPaypal />
                </AccordionItem>}
                
                {isPayUsingMidtrans && <AccordionItem
                    // accessibilities:
                    label={<>
                        <RadioDecorator />
                        <span className='label'>
                            QRIS
                        </span>
                        <NextImage alt='QRIS' src='/brands/qris.svg' width={60} height={22.75} />
                    </>}
                    
                    
                    
                    // behaviors:
                    // lazy={true} // causes collapsing animation error
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Section
                            // classes:
                            className={styleSheet.paymentEntryPaymentButton}
                        />
                    }
                >
                    <ViewPaymentMethodQris />
                </AccordionItem>}
                
                {isPayUsingMidtrans && <AccordionItem
                    // accessibilities:
                    label={<>
                        <RadioDecorator />
                        <span className='label'>
                            GoPay
                        </span>
                        <NextImage alt='GoPay' src='/brands/gopay.svg' width={60} height={12.25} />
                    </>}
                    
                    
                    
                    // behaviors:
                    // lazy={true} // causes collapsing animation error
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Section
                            // classes:
                            className={styleSheet.paymentEntryPaymentButton}
                        />
                    }
                >
                    <ViewPaymentMethodRedirect
                        paymentSource='gopay'
                        appName='GoPay'
                    />
                </AccordionItem>}
                
                {isPayUsingMidtrans && <AccordionItem
                    // accessibilities:
                    label={<>
                        <RadioDecorator />
                        <span className='label'>
                            ShopeePay
                        </span>
                        <NextImage alt='ShopeePay' src='/brands/shopeepay.svg' width={60} height={19.2} />
                    </>}
                    
                    
                    
                    // behaviors:
                    // lazy={true} // causes collapsing animation error
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Section
                            // classes:
                            className={styleSheet.paymentEntryPaymentButton}
                        />
                    }
                >
                    <ViewPaymentMethodRedirect
                        paymentSource='shopeepay'
                        appName='ShopeePay'
                    />
                </AccordionItem>}
                
                {isPayUsingMidtrans && <AccordionItem
                    // accessibilities:
                    label={<>
                        <RadioDecorator />
                        <span className='label'>
                            Pay at Indomaret Store
                        </span>
                        <NextImage alt='Indomaret' src='/brands/indomaret.svg' width={60} height={19.25} />
                    </>}
                    
                    
                    
                    // behaviors:
                    // lazy={true} // causes collapsing animation error
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Section
                            // classes:
                            className={styleSheet.paymentEntryPaymentButton}
                        />
                    }
                >
                    <ViewPaymentMethodOtc
                        paymentSource='indomaret'
                        storeName='Indomaret'
                    />
                </AccordionItem>}
                
                {isPayUsingMidtrans && <AccordionItem
                    // accessibilities:
                    label={<>
                        <RadioDecorator />
                        <span className='label'>
                            Pay at Alfamart Store
                        </span>
                        <NextImage alt='Alfamart' src='/brands/alfamart.svg' width={60} height={19.2} />
                    </>}
                    
                    
                    
                    // behaviors:
                    // lazy={true} // causes collapsing animation error
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Section
                            // classes:
                            className={styleSheet.paymentEntryPaymentButton}
                        />
                    }
                >
                    <ViewPaymentMethodOtc
                        paymentSource='alfamart'
                        storeName='Alfamart'
                    />
                </AccordionItem>}
                
                {canPayUsingBank && <AccordionItem
                    // accessibilities:
                    label={<>
                        <RadioDecorator />
                        <span className='label'>
                            Bank Transfer
                        </span>
                        <NextImage alt='Bank Transfer' src='/brands/banktransfer.svg' width={60} height={30} />
                    </>}
                    
                    
                    
                    // behaviors:
                    // lazy={true} // causes collapsing animation error
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Section
                            // classes:
                            className={styleSheet.paymentEntryPaymentButton}
                        />
                    }
                >
                    <ViewPaymentMethodManual />
                </AccordionItem>}
            </ExclusiveAccordion>
        </>
    );
};
export {
    EditPaymentMethod,
    EditPaymentMethod as default,
};

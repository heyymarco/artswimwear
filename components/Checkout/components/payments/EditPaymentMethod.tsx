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
import {
    ViewExpressCheckout,
    ViewExpressCheckoutPaypal,
}                           from './ViewExpressCheckout'

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
    /*
        The <ConditionalStripeElementsProvider> must be on top of <ConditionalPayPalScriptProvider>
        to avoid re-render error from <ConditionalStripeElementsProvider>
        Error:
        Error: Failed to render <PayPalHostedFieldsProvider /> component. BraintreeError: Element already contains a Braintree iframe.
    */
    return (
        <ConditionalStripeElementsProvider>
            <ConditionalPayPalScriptProvider>
                <ConditionalMidtransScriptProvider>
                    <EditPaymentMethodInternal />
                </ConditionalMidtransScriptProvider>
            </ConditionalPayPalScriptProvider>
        </ConditionalStripeElementsProvider>
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
            ...((isPayUsingPaypal || isPayUsingStripe || isPayUsingMidtrans) ? ['card'] satisfies PaymentMethod[] : []),
            ...(isPayUsingPaypal   ? (['paypal'] satisfies PaymentMethod[]) : []),
            ...(isPayUsingStripe   ? (['googlePay' as any, 'applePay' as any, 'amazonPay' as any, 'link' as any] satisfies PaymentMethod[]) : []),
            ...(isPayUsingMidtrans ? (['qris', 'gopay', 'shopeepay', 'indomaret', 'alfamart'] satisfies PaymentMethod[]) : []),
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
                    lazy={true}
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Section
                            // classes:
                            className={styleSheet.paymentEntryExpressCheckout}
                        />
                    }
                >
                    <ViewExpressCheckoutPaypal />
                </AccordionItem>}
                
                {isPayUsingStripe && <AccordionItem
                    // accessibilities:
                    label={<>
                        <RadioDecorator />
                        <span className='label'>
                            Google Pay
                        </span>
                        <NextImage alt='Google Pay' src='/brands/googlepay.svg' width={60*1.5} height={11.51*1.5} />
                    </>}
                    
                    
                    
                    // behaviors:
                    lazy={true}
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Section
                            // classes:
                            className={styleSheet.paymentEntryExpressCheckout}
                        />
                    }
                >
                    {(paymentMethod === 'googlePay' as any) && <ViewExpressCheckout type='googlePay' walletName='Google Pay' websiteName='Google' />}
                </AccordionItem>}
                
                {isPayUsingStripe && <AccordionItem
                    // accessibilities:
                    label={<>
                        <RadioDecorator />
                        <span className='label'>
                            Apple Pay
                        </span>
                        <NextImage alt='Apple Pay' src='/brands/applepay.svg' width={60*1.5} height={11.51*1.5} />
                    </>}
                    
                    
                    
                    // behaviors:
                    lazy={true}
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Section
                            // classes:
                            className={styleSheet.paymentEntryExpressCheckout}
                        />
                    }
                >
                    {(paymentMethod === 'applePay' as any) && <ViewExpressCheckout type='applePay' walletName='Apple Pay' websiteName='Apple' />}
                </AccordionItem>}
                
                {isPayUsingStripe && <AccordionItem
                    // accessibilities:
                    label={<>
                        <RadioDecorator />
                        <span className='label'>
                            Amazon Pay
                        </span>
                        <NextImage alt='Amazon Pay' src='/brands/amazonpay.svg' width={60*1.5} height={11.51*1.5} />
                    </>}
                    
                    
                    
                    // behaviors:
                    lazy={true}
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Section
                            // classes:
                            className={styleSheet.paymentEntryExpressCheckout}
                        />
                    }
                >
                    {(paymentMethod === 'amazonPay' as any) && <ViewExpressCheckout type='amazonPay' walletName='Amazon Pay' websiteName='Amazon' />}
                </AccordionItem>}
                
                {isPayUsingStripe && <AccordionItem
                    // accessibilities:
                    label={<>
                        <RadioDecorator />
                        <span className='label'>
                            Link
                        </span>
                        <NextImage alt='Link' src='/brands/link.svg' width={60} height={20} />
                    </>}
                    
                    
                    
                    // behaviors:
                    lazy={true}
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Section
                            // classes:
                            className={styleSheet.paymentEntryExpressCheckout}
                        />
                    }
                >
                    {(paymentMethod === 'link' as any) && <ViewExpressCheckout type='link' walletName='Link' websiteName='Link' />}
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

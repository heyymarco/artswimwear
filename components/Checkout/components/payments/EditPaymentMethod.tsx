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

// payment components:
import {
    usePaymentProcessorAvailability,
}                           from '@/components/payments/hooks'
import {
    ConditionalPaymentScriptProvider,
}                           from '@/components/payments/ConditionalPaymentScriptProvider'

// internal components:
import {
    ViewExpressCheckout,
    ViewExpressCheckoutPaypal,
}                           from './ViewExpressCheckout'
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
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const EditPaymentMethod = (): JSX.Element|null => {
    // states:
    const {
        // shipping data:
        totalShippingCost,
    } = useCheckoutState();
    
    
    
    // jsx:
    /*
        The <ConditionalStripeScriptProvider> must be on top of <ConditionalPaypalScriptProvider>
        to avoid re-render error from <ConditionalStripeScriptProvider>
        Error:
        Error: Failed to render <PayPalCardFieldsProvider /> component. BraintreeError: Element already contains a Braintree iframe.
    */
    return (
        <ConditionalPaymentScriptProvider
            // required for purchasing:
            totalShippingCost={totalShippingCost}
        >
            <EditPaymentMethodInternal />
        </ConditionalPaymentScriptProvider>
    );
};
const EditPaymentMethodInternal = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // payment data:
        paymentMethod,
        setPaymentMethod,
        
        
        
        // sections:
        paymentCardSectionRef,
    } = useCheckoutState();
    
    
    
    const {
        isPaymentAvailablePaypal,
        isPaymentAvailableStripe,
        isPaymentAvailableMidtrans,
        isPaymentAvailableBank,
        isPaymentAvailableCreditCard,
    } = usePaymentProcessorAvailability();
    
    
    
    // payment method options:
    const paymentMethodList : PaymentMethod[] = Array.from(
        new Set([ // remove duplicate(s)
            ...((isPaymentAvailablePaypal || isPaymentAvailableStripe || isPaymentAvailableMidtrans) ? ['card'] satisfies PaymentMethod[] : []),
            ...(isPaymentAvailablePaypal   ? (['paypal'] satisfies PaymentMethod[]) : []),
            ...(isPaymentAvailableStripe   ? (['googlePay', 'applePay', 'amazonPay', 'link'] satisfies PaymentMethod[]) : []),
            ...(isPaymentAvailableMidtrans ? (['qris', 'gopay', 'shopeepay', 'indomaret', 'alfamart'] satisfies PaymentMethod[]) : []),
            ...(isPaymentAvailableBank     ? (['manual'] satisfies PaymentMethod[]) : []),
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
                {isPaymentAvailableCreditCard && <AccordionItem
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
                
                {isPaymentAvailablePaypal     && <AccordionItem
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
                
                {isPaymentAvailableStripe     && <AccordionItem
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
                    {(paymentMethod === 'googlePay') && <ViewExpressCheckout type='googlePay' walletName='Google Pay' websiteName='Google' />}
                </AccordionItem>}
                
                {isPaymentAvailableStripe     && <AccordionItem
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
                    {(paymentMethod === 'applePay') && <ViewExpressCheckout type='applePay' walletName='Apple Pay' websiteName='Apple' />}
                </AccordionItem>}
                
                {isPaymentAvailableStripe     && <AccordionItem
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
                    {(paymentMethod === 'amazonPay') && <ViewExpressCheckout type='amazonPay' walletName='Amazon Pay' websiteName='Amazon' />}
                </AccordionItem>}
                
                {isPaymentAvailableStripe     && <AccordionItem
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
                    {(paymentMethod === 'link') && <ViewExpressCheckout type='link' walletName='Link' websiteName='Link' />}
                </AccordionItem>}
                
                {isPaymentAvailableMidtrans   && <AccordionItem
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
                
                {isPaymentAvailableMidtrans   && <AccordionItem
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
                
                {isPaymentAvailableMidtrans   && <AccordionItem
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
                
                {isPaymentAvailableMidtrans   && <AccordionItem
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
                        storeName='Indomaret Store'
                    />
                </AccordionItem>}
                
                {isPaymentAvailableMidtrans   && <AccordionItem
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
                        storeName='Alfamart Store'
                    />
                </AccordionItem>}
                
                {isPaymentAvailableBank       && <AccordionItem
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
                    <ViewPaymentMethodOtc
                        paymentSource='manual'
                        storeName='Bank Transfer'
                    />
                </AccordionItem>}
            </ExclusiveAccordion>
        </>
    );
};
export {
    EditPaymentMethod,
    EditPaymentMethod as default,
};

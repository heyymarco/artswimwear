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
    ViewPaymentMethodRedirect,
}                           from '../payments/ViewPaymentMethodRedirect'
import {
    ViewPaymentMethodOtc,
}                           from '../payments/ViewPaymentMethodOtc'

// models:
import {
    type PaymentOption,
}                           from '@/models'

// states:
import {
    // states:
    useCheckoutState,
}                           from '../../states/checkoutState'
import {
    useTransactionState,
}                           from '@/components/payments/states'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'



// react components:
const EditPaymentOption = (): JSX.Element|null => {
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
            <EditPaymentOptionInternal />
        </ConditionalPaymentScriptProvider>
    );
};
const EditPaymentOptionInternal = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // payment data:
        paymentOption,
        setPaymentOption,
    } = useCheckoutState();
    
    const {
        // sections:
        paymentCardSectionRef,
    } = useTransactionState();
    
    
    
    const {
        isPaymentAvailablePaypal,
        isPaymentAvailableStripe,
        isPaymentAvailableMidtrans,
        isPaymentAvailableBank,
        isPaymentAvailableCreditCard,
    } = usePaymentProcessorAvailability();
    
    
    
    // payment method options:
    const paymentOptionList : PaymentOption[] = Array.from(
        new Set([ // remove duplicate(s)
            ...((isPaymentAvailablePaypal || isPaymentAvailableStripe || isPaymentAvailableMidtrans) ? ['CARD'] satisfies PaymentOption[] : []),
            ...(isPaymentAvailablePaypal   ? (['PAYPAL'] satisfies PaymentOption[]) : []),
            ...(isPaymentAvailableStripe   ? (['GOOGLEPAY', 'APPLEPAY', 'AMAZONPAY', 'LINK'] satisfies PaymentOption[]) : []),
            ...(isPaymentAvailableMidtrans ? (['QRIS', 'GOPAY', 'SHOPEEPAY', 'INDOMARET', 'ALFAMART'] satisfies PaymentOption[]) : []),
            ...(isPaymentAvailableBank     ? (['MANUAL'] satisfies PaymentOption[]) : []),
        ])
    );
    
    
    
    // handlers:
    const handlePaymentOptionExpandedChange = useEvent<EventHandler<ExclusiveExpandedChangeEvent>>(({expanded, listIndex}) => {
        // conditions:
        if (!expanded) return;
        
        
        
        // actions:
        setPaymentOption(paymentOptionList[listIndex]);
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
                    Math.max(-1, paymentOptionList.findIndex((option) => (option === paymentOption)))
                }
                
                
                
                // handlers:
                onExpandedChange={handlePaymentOptionExpandedChange}
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
                    {(paymentOption === 'GOOGLEPAY') && <ViewExpressCheckout paymentOption='GOOGLEPAY' walletName='Google Pay' websiteName='Google' />}
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
                    {(paymentOption === 'APPLEPAY') && <ViewExpressCheckout paymentOption='APPLEPAY' walletName='Apple Pay' websiteName='Apple' />}
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
                    {(paymentOption === 'AMAZONPAY') && <ViewExpressCheckout paymentOption='AMAZONPAY' walletName='Amazon Pay' websiteName='Amazon' />}
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
                    {(paymentOption === 'LINK') && <ViewExpressCheckout paymentOption='LINK' walletName='Link' websiteName='Link' />}
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
                    <ViewPaymentMethodQris
                        paymentOption='QRIS'
                        appName='QRIS'
                        paymentInstruction={<>
                            <p>
                                Click the button below. You will be shown a <strong>QRIS code</strong> to scan the payment.
                            </p>
                        </>}
                        paymentButtonText='Pay with QRIS'
                        paymentButtonIcon='qr_code_scanners'
                    />
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
                        paymentOption='GOPAY'
                        appName='GoPay App'
                        paymentInstruction={<>
                            <p>
                                Click the button below. You will be redirected to <strong>GoPay App</strong> to process the payment.
                            </p>
                        </>}
                        paymentButtonText='Pay with GoPay'
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
                        paymentOption='SHOPEEPAY'
                        appName='ShopeePay App'
                        paymentInstruction={<>
                            <p>
                                Click the button below. You will be redirected to <strong>ShopeePay App</strong> to process the payment.
                            </p>
                        </>}
                        paymentButtonText='Pay with ShopeePay'
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
                        // configs:
                        paymentOption='INDOMARET'
                        paymentInstruction={<>
                            <p>
                                Pay at <strong>Indomaret Store</strong>.
                            </p>
                            <p>
                                Click the button below. We will send <em>payment instructions</em> to your (billing) email.
                            </p>
                        </>}
                        paymentButtonText='Pay at Indomaret Store'
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
                        // configs:
                        paymentOption='ALFAMART'
                        paymentInstruction={<>
                            <p>
                                Pay at <strong>Alfamart Store</strong>.
                            </p>
                            <p>
                                Click the button below. We will send <em>payment instructions</em> to your (billing) email.
                            </p>
                        </>}
                        paymentButtonText='Pay at Alfamart Store'
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
                        // configs:
                        paymentOption='MANUAL'
                        paymentInstruction={<>
                            <p>
                                Pay by <strong>bank transfer</strong>.
                            </p>
                            <p>
                                Click the button below. We will send <em>payment instructions</em> to your (billing) email.
                            </p>
                        </>}
                        paymentButtonText='Pay by Bank Transfer'
                    />
                </AccordionItem>}
            </ExclusiveAccordion>
        </>
    );
};
export {
    EditPaymentOption,
    EditPaymentOption as default,
};

'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
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

// internal components:
import {
    RadioDecorator,
}                           from '@/components/RadioDecorator'
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
import type {
    PayPalScriptOptions,
}                           from '@paypal/paypal-js'
import {
    PayPalScriptProvider,
}                           from '@paypal/react-paypal-js'

// midtrans:
import {
    MidtransScriptOptions,
    MidtransScriptProvider,
}                           from './MidtransScriptProvider'

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
    paymentConfig,
}                           from '@/payment.config'



// react components:
const EditPaymentMethod = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // accessibilities:
        preferredCurrency,
    } = useCartState();
    const {
        // payment data:
        paymentMethod,
        setPaymentMethod,
        paymentToken,
        
        
        
        // sections:
        paymentCardSectionRef,
    } = useCheckoutState();
    
    
    
    // payment method options:
    const paymentMethodList : PaymentMethod[] = ['card', 'paypal', 'qris', 'gopay', 'shopeepay', 'indomaret', 'alfamart', 'manual'];
    
    
    
    // handlers:
    const handlePaymentMethodExpandedChange = useEvent<EventHandler<ExclusiveExpandedChangeEvent>>(({expanded, listIndex}) => {
        // conditions:
        if (!expanded) return;
        
        
        
        // actions:
        setPaymentMethod(paymentMethodList[listIndex]);
    });
    
    
    
    // paypal options:
    const paypalOptions = useMemo<PayPalScriptOptions>(() => ({
        'client-id'         : process.env.NEXT_PUBLIC_PAYPAL_ID ?? '',
        'data-client-token' : paymentToken?.paymentToken,
        currency            : paymentConfig.paymentProcessors.paypal.supportedCurrencies.includes(preferredCurrency) ? preferredCurrency : 'USD',
        intent              : 'capture',
        components          : 'hosted-fields,buttons',
    }), [paymentToken?.paymentToken]);
    
    const midtransOptions = useMemo<MidtransScriptOptions>(() => ({
        environment         : process.env.NEXT_PUBLIC_MIDTRANS_ENV ?? 'sandbox',
        clientId            : process.env.NEXT_PUBLIC_MIDTRANS_ID  ?? '',
    }), []);
    
    
    
    // jsx:
    return (
        <PayPalScriptProvider
            options={paypalOptions}
        >
            <MidtransScriptProvider
                options={midtransOptions}
            >
                <p>
                    Choose the payment method you are most familiar with:
                </p>
                
                <ExclusiveAccordion
                    // classes:
                    className={styleSheet.selectPayment}
                    
                    
                    
                    // states:
                    expandedListIndex={
                        Math.max(0, paymentMethodList.findIndex((option) => (option === paymentMethod)))
                    }
                    
                    
                    
                    // handlers:
                    onExpandedChange={handlePaymentMethodExpandedChange}
                >
                    <AccordionItem
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
                    </AccordionItem>
                    
                    <AccordionItem
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
                    </AccordionItem>
                    
                    <AccordionItem
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
                    </AccordionItem>
                    
                    <AccordionItem
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
                    </AccordionItem>
                    
                    <AccordionItem
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
                    </AccordionItem>
                    
                    <AccordionItem
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
                    </AccordionItem>
                    
                    <AccordionItem
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
                    </AccordionItem>
                    
                    <AccordionItem
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
                    </AccordionItem>
                </ExclusiveAccordion>
            </MidtransScriptProvider>
        </PayPalScriptProvider>
    );
};
export {
    EditPaymentMethod,
    EditPaymentMethod as default,
};

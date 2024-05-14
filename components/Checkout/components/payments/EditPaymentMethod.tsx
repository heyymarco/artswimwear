'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

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
    const paymentMethodList : PaymentMethod[] = ['card', 'paypal', 'qris', 'gopay', 'shopeepay', 'manual'];
    
    
    
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
                    All transactions are secure and encrypted.
                </p>
                
                <ExclusiveAccordion
                    // variants:
                    listStyle='content'
                    
                    
                    
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
                            Credit Card
                        </>}
                        
                        
                        
                        // behaviors:
                        // lazy={true} // causes error
                        
                        
                        
                        // components:
                        listItemComponent={
                            <ListItem
                                // classes:
                                className={styleSheet.optionEntryHeader}
                            />
                        }
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
                            PayPal
                        </>}
                        
                        
                        
                        // behaviors:
                        // lazy={true} // causes error
                        
                        
                        
                        // components:
                        listItemComponent={
                            <ListItem
                                // classes:
                                className={styleSheet.optionEntryHeader}
                            />
                        }
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
                            QRIS
                        </>}
                        
                        
                        
                        // behaviors:
                        lazy={true}
                        
                        
                        
                        // components:
                        listItemComponent={
                            <ListItem
                                // classes:
                                className={styleSheet.optionEntryHeader}
                            />
                        }
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
                            GoPay
                        </>}
                        
                        
                        
                        // behaviors:
                        lazy={true}
                        
                        
                        
                        // components:
                        listItemComponent={
                            <ListItem
                                // classes:
                                className={styleSheet.optionEntryHeader}
                            />
                        }
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
                            ShopeePay
                        </>}
                        
                        
                        
                        // behaviors:
                        lazy={true}
                        
                        
                        
                        // components:
                        listItemComponent={
                            <ListItem
                                // classes:
                                className={styleSheet.optionEntryHeader}
                            />
                        }
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
                            Bank Transfer
                        </>}
                        
                        
                        
                        // behaviors:
                        lazy={true}
                        
                        
                        
                        // components:
                        listItemComponent={
                            <ListItem
                                // classes:
                                className={styleSheet.optionEntryHeader}
                            />
                        }
                        bodyComponent={
                            <Section
                                // classes:
                                className={styleSheet.paymentEntryManual}
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

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
    ViewPaymentMethodManual,
}                           from '../payments/ViewPaymentMethodManual'

// stores:
import type {
    PaymentMethod,
}                           from '@/store/features/checkout/checkoutSlice'

// paypal:
import type {
    PayPalScriptOptions,
}                           from '@paypal/paypal-js'
import {
    PayPalScriptProvider,
}                           from '@paypal/react-paypal-js'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const EditPaymentMethod = (): JSX.Element|null => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // states:
        isBusy,
        
        
        
        // payment data:
        paymentMethod,
        setPaymentMethod,
        paymentToken,
        
        
        
        // sections:
        paymentCardSectionRef,
    } = useCheckoutState();
    
    
    
    // payment method options:
    const paymentMethodList : PaymentMethod[] = ['card', 'paypal', 'manual'];
    
    
    
    // handlers:
    const handlePaymentMethodExpandedChange = useEvent<EventHandler<ExclusiveExpandedChangeEvent>>(({expanded, listIndex}) => {
        // conditions:
        if (!expanded) return;
        
        
        
        // actions:
        setPaymentMethod(paymentMethodList[listIndex]);
    });
    
    
    
    // paypal options:
    const paypalOptions = useMemo<PayPalScriptOptions>(() => ({
        'client-id'         : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
        'data-client-token' : paymentToken?.paymentToken,
        currency            : 'USD',
        intent              : 'capture',
        components          : 'hosted-fields,buttons',
    }), [paymentToken?.paymentToken]);
    
    
    
    // jsx:
    return (
        <PayPalScriptProvider
            options={paypalOptions}
        >
            <p>
                All transactions are secure and encrypted.
            </p>
            
            <ExclusiveAccordion
                // variants:
                theme='primary'
                listStyle='content'
                
                
                
                // accessibilities:
                enabled={!isBusy}
                
                
                
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
                            className={styles.optionEntryHeader}
                        />
                    }
                    bodyComponent={
                        <Section
                            // refs:
                            elmRef={paymentCardSectionRef}
                            
                            
                            
                            // classes:
                            className={styles.paymentEntryCard}
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
                            className={styles.optionEntryHeader}
                        />
                    }
                    bodyComponent={
                        <Section
                            // classes:
                            className={styles.paymentEntryPaypal}
                        />
                    }
                >
                    <ViewPaymentMethodPaypal />
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
                            className={styles.optionEntryHeader}
                        />
                    }
                    bodyComponent={
                        <Section
                            // classes:
                            className={styles.paymentEntryManual}
                        />
                    }
                >
                    <ViewPaymentMethodManual />
                </AccordionItem>
            </ExclusiveAccordion>
        </PayPalScriptProvider>
    );
};
export {
    EditPaymentMethod,
    EditPaymentMethod as default,
};

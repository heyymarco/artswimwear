'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    Container,
    
    
    
    // simple-components:
    ButtonIcon,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // status-components:
    Busy,
    
    
    
    // notification-components:
    Alert,
    
    
    
    // menu-components:
    Collapse,
    
    
    
    // composite-components:
    AccordionItem,
    ExclusiveExpandedChangeEvent,
    ExclusiveAccordion,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// heymarco components:
import {
    Article,
    Section,
}                           from '@heymarco/section'
import {
    AddressFields,
}                           from '@heymarco/address-fields'

// internal components:
import {
    RadioDecorator,
}                           from '@/components/RadioDecorator'
import {
    ProgressCheckout,
}                           from './components/navigations/ProgressCheckout'
import {
    NavCheckout,
}                           from './components/navigations/NavCheckout'
import {
    ViewCart,
}                           from './components/carts/ViewCart'
import {
    EditRegularCheckout,
}                           from './components/checkouts/EditRegularCheckout'
import {
    ViewShippingAddress,
}                           from './components/informations/ViewShippingAddress'
import {
    ViewCustomer,
}                           from './components/informations/ViewCustomer'
import {
    ViewInformation,
}                           from './components/informations/ViewInformation'
import {
    EditShippingMethod,
}                           from './components/shippings/EditShippingMethod'
import {
    EditPaymentMethodCard,
}                           from './components/payments/EditPaymentMethodCard'
import {
    ViewPaymentMethodPaypal,
}                           from './components/payments/ViewPaymentMethodPaypal'
import {
    ViewPaymentMethodManual,
}                           from './components/payments/ViewPaymentMethodManual'

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
}                           from './styles/loader'
import {
    CheckoutStateProvider,
    useCheckoutState,
}                           from './states/checkoutState'

// configs:
import {
    PAGE_CHECKOUT_TITLE,
    PAGE_CHECKOUT_DESCRIPTION,
    
    PAGE_CHECKOUT_STEP_INFO_TITLE,
    PAGE_CHECKOUT_STEP_INFO_DESCRIPTION,
    
    PAGE_CHECKOUT_STEP_SHIPPING_TITLE,
    PAGE_CHECKOUT_STEP_SHIPPING_DESCRIPTION,
    
    PAGE_CHECKOUT_STEP_PAYMENT_TITLE,
    PAGE_CHECKOUT_STEP_PAYMENT_DESCRIPTION,
    
    PAGE_CHECKOUT_STEP_PENDING_TITLE,
    PAGE_CHECKOUT_STEP_PENDING_DESCRIPTION,
    
    PAGE_CHECKOUT_STEP_PAID_TITLE,
    PAGE_CHECKOUT_STEP_PAID_DESCRIPTION,
}                           from '@/website.config'



// react components:
const Checkout = () => {
    // jsx:
    return (
        <CheckoutStateProvider>
            <CheckoutInternal />
        </CheckoutStateProvider>
    );
};
const CheckoutInternal = (): JSX.Element|null => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // states:
        checkoutStep,
        
        isLoadingPage,
        isErrorPage,
        
        isDesktop,
        
        
        
        // cart data:
        hasCart,
        
        
        
        // sections:
        regularCheckoutSectionRef,
        currentStepSectionRef,
        navCheckoutSectionElm,
    } = useCheckoutState();
    
    
    
    // dom effects:
    useEffect(() => {
        const titleElm = document.head.querySelector('title')                    ?? document.head.appendChild(document.createElement('title'));
        const metaElm  = document.head.querySelector('meta[name="description"]') ?? document.head.appendChild((() => { const meta = document.createElement('meta'); meta.setAttribute('name', 'description'); return meta; })());
        switch(checkoutStep) {
            case 'info'     :
                titleElm.textContent = PAGE_CHECKOUT_TITLE.replace('{{TheCurrentStepTitle}}', PAGE_CHECKOUT_STEP_INFO_TITLE);
                metaElm.setAttribute('description', PAGE_CHECKOUT_DESCRIPTION.replace('{{TheCurrentStepDescription}}', PAGE_CHECKOUT_STEP_INFO_DESCRIPTION));
            break;
            
            case 'shipping' :
                titleElm.textContent = PAGE_CHECKOUT_TITLE.replace('{{TheCurrentStepTitle}}', PAGE_CHECKOUT_STEP_SHIPPING_TITLE);
                metaElm.setAttribute('description', PAGE_CHECKOUT_DESCRIPTION.replace('{{TheCurrentStepDescription}}', PAGE_CHECKOUT_STEP_SHIPPING_DESCRIPTION));
            break;
            
            case 'payment'  :
                titleElm.textContent = PAGE_CHECKOUT_TITLE.replace('{{TheCurrentStepTitle}}', PAGE_CHECKOUT_STEP_PAYMENT_TITLE);
                metaElm.setAttribute('description', PAGE_CHECKOUT_DESCRIPTION.replace('{{TheCurrentStepDescription}}', PAGE_CHECKOUT_STEP_PAYMENT_DESCRIPTION));
            break;
            
            case 'pending'  :
                titleElm.textContent = PAGE_CHECKOUT_TITLE.replace('{{TheCurrentStepTitle}}', PAGE_CHECKOUT_STEP_PENDING_TITLE);
                metaElm.setAttribute('description', PAGE_CHECKOUT_DESCRIPTION.replace('{{TheCurrentStepDescription}}', PAGE_CHECKOUT_STEP_PENDING_DESCRIPTION));
            break;
            
            case 'paid'     :
                titleElm.textContent = PAGE_CHECKOUT_TITLE.replace('{{TheCurrentStepTitle}}', PAGE_CHECKOUT_STEP_PAID_TITLE);
                metaElm.setAttribute('description', PAGE_CHECKOUT_DESCRIPTION.replace('{{TheCurrentStepDescription}}', PAGE_CHECKOUT_STEP_PAID_DESCRIPTION));
            break;
        } // switch
    }, [checkoutStep]);
    
    
    
    // jsx:
    if (!hasCart || isLoadingPage || isErrorPage) return (
        <Section
            // variants:
            theme='secondary'
            
            
            
            // classes:
            className={styles.loading}
        >
            {/* empty cart => no data to show: */}
            {!hasCart && <>
                <p>
                    Your shopping cart is empty. Please add one/some products to buy.
                </p>
                <ButtonIcon
                    // appearances:
                    icon='image_search'
                    
                    
                    
                    // variants:
                    size='lg'
                    theme='primary'
                    gradient={true}
                >
                    <Link href='/products'>
                        See our product gallery
                    </Link>
                </ButtonIcon>
            </>}
            
            {/* has cart => show loading indicator (if still loading), otherwise show load error status: */}
            {hasCart && <>
                {isLoadingPage && <Busy
                    // variants:
                    size='lg'
                    theme='primary'
                />}
                
                {isErrorPage && <p>Oops, an error occured!</p>}
            </>}
        </Section>
    );
    return (
        <Container
            // variants:
            theme='secondary'
            
            
            
            // classes:
            className={`${styles.layout} ${checkoutStep}`}
        >
            <Section
                // semantics:
                tag='aside'
                
                
                
                // variants:
                theme={!isDesktop ? 'primary' : undefined}
                
                
                
                // classes:
                className={styles.orderSummary}
                
                
                
                // accessibilities:
                title='Order Summary'
            >
                <ViewCart />
            </Section>
            
            <Section
                // semantics:
                tag='nav'
                
                
                
                // variants:
                theme={!isDesktop ? 'primary' : undefined}
                mild={!isDesktop ? false : undefined}
                
                
                
                // classes:
                className={styles.progressCheckout}
            >
                <ProgressCheckout />
            </Section>
            
            <div
                // classes:
                className={styles.currentStepLayout}
            >
                {((checkoutStep === 'shipping') || (checkoutStep === 'payment')) && <Section
                    // semantics:
                    tag='aside'
                    
                    
                    
                    // classes:
                    className={styles.orderReview}
                >
                    <ViewInformation />
                </Section>}
                
                
                
                {(checkoutStep === 'info'    ) && <Section
                    // refs:
                    elmRef={currentStepSectionRef}
                    
                    
                    
                    // classes:
                    className={styles.checkout}
                >
                    {/* TODO: activate */}
                    {/* <Section
                        // classes:
                        className={styles.expressCheckout}
                        
                        
                        
                        // accessibilities:
                        title='Express Checkout'
                    >
                        // TODO: express checkout
                    </Section>
                    
                    <div
                        // classes:
                        className={styles.checkoutAlt}
                    >
                        <hr />
                        <span>OR</span>
                        <hr />
                    </div> */}
                    
                    <Section
                        // refs:
                        elmRef={regularCheckoutSectionRef}
                        
                        
                        
                        // classes:
                        className={styles.regularCheckout}
                        
                        
                        
                        // accessibilities:
                        title='Regular Checkout'
                    >
                        <EditRegularCheckout />
                    </Section>
                </Section>}
                
                {(checkoutStep === 'shipping') && <Section
                    // refs:
                    elmRef={currentStepSectionRef}
                    
                    
                    
                    // classes:
                    className={styles.shippingMethod} title='Shipping Method'
                >
                    <EditShippingMethod />
                </Section>}
                
                {(checkoutStep === 'payment' ) && <Section
                    // refs:
                    elmRef={currentStepSectionRef}
                    
                    
                    
                    // classes:
                    className={styles.payment} title='Payment'
                >
                    <EditPaymentAndBillingAddress />
                </Section>}
                
                {(checkoutStep === 'pending' ) && <Section
                    // refs:
                    elmRef={currentStepSectionRef}
                    
                    
                    
                    // classes:
                    className={styles.paymentFinish} title='Thank You'
                >
                    <ViewOrderFinishedPending />
                </Section>}
                
                {(checkoutStep === 'paid'    ) && <Section
                    // refs:
                    elmRef={currentStepSectionRef}
                    
                    
                    
                    // classes:
                    className={styles.paymentFinish} title='Thank You'
                >
                    <ViewOrderFinishedPaid />
                </Section>}
            </div>
            
            <Section
                // semantics:
                tag='nav'
                
                
                
                // classes:
                className={styles.navCheckout}
                
                
                
                // components:
                articleComponent={
                    <Article
                        // refs:
                        elmRef={navCheckoutSectionElm}
                    />
                }
            >
                <NavCheckout />
            </Section>
            
            <hr
                // classes:
                className={styles.vertLine}
            />
        </Container>
    );
};
export {
    Checkout,
    Checkout as default,
};



// payments:
const EditPaymentAndBillingAddress = (): JSX.Element|null => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // states:
        isBusy,
        
        
        
        // billing data:
        billingValidation,
        
        billingAsShipping,
        setBillingAsShipping,
        
        
        billingFirstName,
        billingFirstNameHandlers,
        
        billingLastName,
        billingLastNameHandlers,
        
        
        billingPhone,
        billingPhoneHandlers,
        
        
        billingAddress,
        billingAddressHandlers,
        
        billingCity,
        billingCityHandlers,
        
        billingZone,
        billingZoneHandlers,
        
        billingZip,
        billingZipHandlers,
        
        billingCountry,
        billingCountryHandlers,
        
        
        
        // payment data:
        paymentMethod,
        
        
        
        // relation data:
        countryList,
        
        
        
        // sections:
        billingAddressSectionRef,
    } = useCheckoutState();
    
    
    
    // handlers:
    const handleBillingAddressExpandedChange = useEvent<EventHandler<ExclusiveExpandedChangeEvent>>(({expanded, listIndex}) => {
        // conditions:
        if (!expanded) return;
        
        
        
        // actions:
        setBillingAsShipping(listIndex === 0);
    });
    
    
    
    // jsx:
    return (
        <>
            <Section
                // classes:
                className={styles.paymentMethod}
                
                
                
                // accessibilities:
                title='Payment Method'
            >
                <EditPaymentMethod />
            </Section>
            
            <Collapse
                // classes:
                className='collapse'
                
                
                
                // behaviors:
                lazy={true}
                
                
                
                // states:
                expanded={paymentMethod !== 'paypal'} // the billingAddress is required for 'card' and 'manual'
            >
                <Section
                    // refs:
                    elmRef={billingAddressSectionRef}
                    
                    
                    
                    // accessibilities:
                    title='Billing Address'
                >
                    <p>
                        Select the address that matches your card or payment method.
                    </p>
                    
                    <ExclusiveAccordion
                        // variants:
                        theme='primary'
                        listStyle='content'
                        
                        
                        
                        // accessibilities:
                        enabled={!isBusy}
                        
                        
                        
                        // states:
                        expandedListIndex={billingAsShipping ? 0 : 1}
                        
                        
                        
                        // handlers:
                        onExpandedChange={handleBillingAddressExpandedChange}
                    >
                        <AccordionItem
                            // accessibilities:
                            label={
                                <>
                                    <RadioDecorator />
                                    Same as shipping address
                                </>
                            }
                            
                            
                            
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
                                    className={styles.billingEntry}
                                />
                            }
                        >
                            <ViewShippingAddress />
                        </AccordionItem>
                        
                        <AccordionItem
                            // accessibilities:
                            label={<>
                                <RadioDecorator />
                                Use a different billing address
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
                                    className={`${styles.billingEntry} ${styles.address}`}
                                />
                            }
                        >
                            <ValidationProvider
                                // validations:
                                enableValidation={!billingAsShipping && billingValidation}
                            >
                                <AddressFields
                                    // types:
                                    addressType       = 'billing'
                                    
                                    
                                    
                                    // values:
                                    firstName         = {billingFirstName}
                                    lastName          = {billingLastName}
                                    
                                    phone             = {billingPhone}
                                    
                                    address           = {billingAddress}
                                    city              = {billingCity}
                                    zone              = {billingZone}
                                    zip               = {billingZip}
                                    country           = {billingCountry}
                                    countryList       = {countryList}
                                    
                                    
                                    
                                    // handlers:
                                    onFirstNameChange = {billingFirstNameHandlers.onChange}
                                    onLastNameChange  = {billingLastNameHandlers.onChange }
                                    
                                    onPhoneChange     = {billingPhoneHandlers.onChange    }
                                    
                                    onAddressChange   = {billingAddressHandlers.onChange  }
                                    onCityChange      = {billingCityHandlers.onChange     }
                                    onZoneChange      = {billingZoneHandlers.onChange     }
                                    onZipChange       = {billingZipHandlers.onChange      }
                                    onCountryChange   = {billingCountryHandlers.onChange  }
                                />
                            </ValidationProvider>
                        </AccordionItem>
                    </ExclusiveAccordion>
                </Section>
            </Collapse>
        </>
    );
};
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



// orders:
const ViewOrderFinishedPending = (): JSX.Element|null => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // customer data:
        customerEmail,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <Section>
                <Alert
                    // variants:
                    theme='success'
                    
                    
                    
                    // states:
                    expanded={true}
                    
                    
                    
                    // components:
                    controlComponent={<React.Fragment />}
                >
                    <p className='h5'>
                        Your order has been confirmed.
                    </p>
                    <p>
                        You&apos;ll receive a confirmation email with your order number shortly.
                    </p>
                    <p>
                        Please <strong>follow the payment instructions</strong> sent to your email: <strong className={styles.data}>{customerEmail}</strong>.
                    </p>
                </Alert>
            </Section>
            
            <Section
                // semantics:
                tag='aside'
                
                
                
                // classes:
                className={styles.orderReview}
            >
                <ViewCustomer />
            </Section>
        </>
    );
};
const ViewOrderFinishedPaid = (): JSX.Element|null => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // customer data:
        customerEmail,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <Section>
                <Alert
                    // variants:
                    theme='success'
                    
                    
                    
                    // states:
                    expanded={true}
                    
                    
                    
                    // components:
                    controlComponent={<React.Fragment />}
                >
                    <p className='h5'>
                        Your order has been confirmed and we have received your payment.
                    </p>
                    <p>
                        You&apos;ll receive a confirmation email with your order number shortly to: <strong className={styles.data}>{customerEmail}</strong>.
                    </p>
                </Alert>
            </Section>
            
            <Section
                // semantics:
                tag='aside'
                
                
                
                // classes:
                className={styles.orderReview}
            >
                <ViewCustomer />
            </Section>
        </>
    );
};

'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// cssfn:
import {
    useCheckoutStyleSheet,
}                           from './styles/loader'

// reusable-ui components:
import {
    // base-content-components:
    Container,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    Article,
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    LoadingBlankSection,
    ErrorBlankSection,
    EmptyProductBlankSection,
}                           from '@/components/BlankSection'
import {
    ProgressCheckout,
}                           from './components/navigations/ProgressCheckout'
import {
    NavCheckout,
}                           from './components/navigations/NavCheckout'
import {
    EditCart,
}                           from './components/carts/EditCart'
import {
    ViewSubtotalCart,
}                           from '@/components/Cart/components/carts/ViewSubtotalCart'
import {
    ViewShippingCart,
}                           from './components/carts/ViewShippingCart'
import {
    ViewTotalCart,
}                           from './components/carts/ViewTotalCart'
import {
    EditRegularCheckout,
}                           from './components/checkouts/EditRegularCheckout'
import {
    ViewCustomerInfo,
}                           from './components/informations/ViewCustomerInfo'
import {
    ViewShippingInfo,
}                           from './components/informations/ViewShippingInfo'
import {
    EditShippingMethod,
}                           from './components/shippings/EditShippingMethod'
import {
    EditPaymentMethod,
}                           from './components/payments/EditPaymentMethod'
import {
    ViewOrderFinished,
}                           from './components/orders/ViewOrderFinished'

// contexts:
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
const Checkout = (): JSX.Element|null => {
    // jsx:
    return (
        <CheckoutStateProvider>
            <CheckoutInternal />
        </CheckoutStateProvider>
    );
};
const CheckoutInternal = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // contexts:
    const {
        // states:
        checkoutStep,
        
        isCheckoutEmpty,
        isCheckoutLoading,
        isCheckoutError,
        isCheckoutFinished,
        
        isDesktop,
        
        
        
        // shipping data:
        isShippingAddressRequired,
        
        
        
        // sections:
        regularCheckoutSectionRef,
        currentStepSectionRef,
        
        
        
        // actions:
        refetchCheckout,
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
    if (isCheckoutEmpty  ) return ( // empty checkout => never loading|error
        <EmptyProductBlankSection
            // classes:
            className={styleSheet.blankSection}
        />
    );
    if (isCheckoutLoading) return (
        <LoadingBlankSection
            // classes:
            className={styleSheet.blankSection}
        />
    );
    if (isCheckoutError  ) return (
        <ErrorBlankSection
            // classes:
            className={styleSheet.blankSection}
            
            
            
            // handlers:
            onRetry={refetchCheckout}
        />
    );
    return (
        <Container
            // variants:
            theme='primary'
            
            
            
            // classes:
            className={`${styleSheet.layout} ${checkoutStep}`}
        >
            <Section
                // semantics:
                tag='aside'
                
                
                
                // classes:
                className={styleSheet.orderSummary}
                
                
                
                // accessibilities:
                title='Order Summary'
            >
                <EditCart
                    // accessibilities:
                    readOnly={isCheckoutFinished}
                    // readOnly={true} // for testing
                />
                
                <hr />
                
                <ViewSubtotalCart />
                {isShippingAddressRequired && <ViewShippingCart />}
                
                <hr />
                
                <ViewTotalCart />
            </Section>
            
            <Section
                // semantics:
                tag='nav'
                
                
                
                // variants:
                mild={!isDesktop ? false : undefined}
                
                
                
                // classes:
                className={styleSheet.progressCheckout}
            >
                <ProgressCheckout />
            </Section>
            
            <div
                // classes:
                className={styleSheet.currentStepLayout}
            >
                {((checkoutStep === 'shipping') || (checkoutStep === 'payment')) && <Section
                    // semantics:
                    tag='aside'
                    
                    
                    
                    // classes:
                    className={styleSheet.info}
                >
                    <ViewCustomerInfo />
                    
                    <ViewShippingInfo />
                </Section>}
                
                
                
                {(checkoutStep === 'info'    ) && <Section
                    // refs:
                    elmRef={currentStepSectionRef}
                    
                    
                    
                    // classes:
                    className={styleSheet.checkout}
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
                        className={styleSheet.regularCheckout}
                        
                        
                        
                        // accessibilities:
                        title='Regular Checkout'
                    >
                        <EditRegularCheckout />
                    </Section>
                </Section>}
                
                {(checkoutStep === 'shipping') && <Section
                    // refs:
                    elmRef={currentStepSectionRef}
                    
                    
                    
                    // accessibilities:
                    title='Shipping Method'
                >
                    <EditShippingMethod />
                </Section>}
                
                {(checkoutStep === 'payment' ) && <Section
                    // refs:
                    elmRef={currentStepSectionRef}
                    
                    
                    
                    // accessibilities:
                    title='Payment Method'
                >
                    <EditPaymentMethod />
                </Section>}
                
                {((checkoutStep === 'pending') || (checkoutStep === 'paid')) && <Section
                    // refs:
                    elmRef={currentStepSectionRef}
                    
                    
                    
                    // classes:
                    className={styleSheet.paymentFinish}
                    
                    
                    
                    // accessibilities:
                    title='Thanks For Your Order!'
                >
                    <ViewOrderFinished
                        // data:
                        paid={(checkoutStep === 'paid')}
                    />
                </Section>}
            </div>
            
            <Section
                // semantics:
                tag='nav'
                
                
                
                // classes:
                className={styleSheet.navCheckout}
            >
                <NavCheckout />
            </Section>
            
            <hr
                // classes:
                className={styleSheet.vertLine}
            />
        </Container>
    );
};
export {
    Checkout,
    Checkout as default,
};

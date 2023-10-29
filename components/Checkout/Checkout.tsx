'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// reusable-ui components:
import {
    // base-content-components:
    Container,
    
    
    
    // simple-components:
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// heymarco components:
import {
    Article,
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    BlankSection,
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
    ViewTotalCart,
}                           from './components/carts/ViewTotalCart'
import {
    EditRegularCheckout,
}                           from './components/checkouts/EditRegularCheckout'
import {
    ViewCollectedInformation,
}                           from './components/informations/ViewCollectedInformation'
import {
    EditShippingMethod,
}                           from './components/shippings/EditShippingMethod'
import {
    EditPaymentAndBillingAddress,
}                           from './components/payments/EditPaymentAndBillingAddress'
import {
    ViewOrderFinishedPending,
}                           from './components/orders/ViewOrderFinishedPending'
import {
    ViewOrderFinishedPaid,
}                           from './components/orders/ViewOrderFinishedPaid'

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
    
    
    
    // states:
    const {
        // states:
        checkoutStep,
        
        isLoadingPage,
        isErrorPage,
        
        isDesktop,
        
        
        
        // cart data:
        hasCart,
        
        
        
        // shipping data:
        totalShippingCost,
        
        
        
        // sections:
        regularCheckoutSectionRef,
        currentStepSectionRef,
        navCheckoutSectionElm,
        
        
        
        // actions:
        refetch,
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
    if (!hasCart) return ( // empty cart => never loading|error
        <EmptyProductBlankSection
            // classes:
            className={styleSheet.blankSection}
        />
    );
    if (isLoadingPage) return (
        <LoadingBlankSection
            // classes:
            className={styleSheet.blankSection}
        />
    );
    if (isErrorPage)   return (
        <ErrorBlankSection
            // classes:
            className={styleSheet.blankSection}
            
            
            
            // handlers:
            onRetry={refetch}
        />
    );
    return (
        <Container
            // variants:
            theme='secondary'
            
            
            
            // classes:
            className={`${styleSheet.layout} ${checkoutStep}`}
        >
            <Section
                // semantics:
                tag='aside'
                
                
                
                // variants:
                theme={!isDesktop ? 'primary' : undefined}
                
                
                
                // classes:
                className={styleSheet.orderSummary}
                
                
                
                // accessibilities:
                title='Order Summary'
            >
                <EditCart
                    // accessibilities:
                    readOnly={
                        (checkoutStep === 'pending')
                        ||
                        (checkoutStep === 'paid')
                    }
                />
                <ViewTotalCart
                    // data:
                    totalShippingCost={totalShippingCost}
                />
            </Section>
            
            <Section
                // semantics:
                tag='nav'
                
                
                
                // variants:
                theme={!isDesktop ? 'primary' : undefined}
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
                    className={styleSheet.orderReview}
                >
                    <ViewCollectedInformation />
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
                    
                    
                    
                    // classes:
                    className={styleSheet.shippingMethod} title='Shipping Method'
                >
                    <EditShippingMethod />
                </Section>}
                
                {(checkoutStep === 'payment' ) && <Section
                    // refs:
                    elmRef={currentStepSectionRef}
                    
                    
                    
                    // classes:
                    className={styleSheet.payment} title='Payment'
                >
                    <EditPaymentAndBillingAddress />
                </Section>}
                
                {(checkoutStep === 'pending' ) && <Section
                    // refs:
                    elmRef={currentStepSectionRef}
                    
                    
                    
                    // classes:
                    className={styleSheet.paymentFinish} title='Thank You'
                >
                    <ViewOrderFinishedPending />
                </Section>}
                
                {(checkoutStep === 'paid'    ) && <Section
                    // refs:
                    elmRef={currentStepSectionRef}
                    
                    
                    
                    // classes:
                    className={styleSheet.paymentFinish} title='Thank You'
                >
                    <ViewOrderFinishedPaid />
                </Section>}
            </div>
            
            <Section
                // semantics:
                tag='nav'
                
                
                
                // classes:
                className={styleSheet.navCheckout}
                
                
                
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
                className={styleSheet.vertLine}
            />
        </Container>
    );
};
export {
    Checkout,
    Checkout as default,
};

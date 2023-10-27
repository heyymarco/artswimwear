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
    
    
    
    // status-components:
    Busy,
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
        
        
        
        // shipping data:
        totalShippingCost,
        
        
        
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
                    <ViewCollectedInformation />
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

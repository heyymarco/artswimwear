'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useState,
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
import {
    AlternateSeparator,
}                           from '@heymarco/alternate-separator'

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
    ViewCustomerInfo,
}                           from './components/informations/ViewCustomerInfo'
import {
    ViewShippingInfo,
}                           from './components/informations/ViewShippingInfo'
import {
    EditGuestAccount,
}                           from './components/checkouts/EditGuestAccount'
import {
    SignInCustomerAccount,
}                           from './components/checkouts/SignInCustomerAccount'
import {
    EditSubscribeInfo,
}                           from './components/checkouts/EditSubscribeInfo'
import {
    EditShippingAddress,
}                           from './components/checkouts/EditShippingAddress'
import {
    EditShippingMethod,
}                           from './components/shippings/EditShippingMethod'
import {
    EditPaymentOption,
}                           from './components/payments/EditPaymentOption'
import {
    ViewOrderFinished,
}                           from './components/orders/ViewOrderFinished'
import {
    SignInCollapse,
}                           from '@/components/SignInCollapse'
import {
    SignInBusyDialog,
}                           from '@/components/SignInBusyDialog'

// contexts:
import {
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
        customerInfoSectionRef,
        shippingAddressSectionRef,
        currentStepSectionRef,
        
        
        
        // actions:
        refetchCheckout,
    } = useCheckoutState();
    
    
    
    // dom effects:
    useEffect(() => {
        const titleElm = document.head.querySelector('title')                    ?? document.head.appendChild(document.createElement('title'));
        const metaElm  = document.head.querySelector('meta[name="description"]') ?? document.head.appendChild((() => { const meta = document.createElement('meta'); meta.setAttribute('name', 'description'); return meta; })());
        switch(checkoutStep) {
            case 'INFO'     :
                titleElm.textContent = PAGE_CHECKOUT_TITLE.replace('{{TheCurrentStepTitle}}', PAGE_CHECKOUT_STEP_INFO_TITLE);
                metaElm.setAttribute('description', PAGE_CHECKOUT_DESCRIPTION.replace('{{TheCurrentStepDescription}}', PAGE_CHECKOUT_STEP_INFO_DESCRIPTION));
            break;
            
            case 'SHIPPING' :
                titleElm.textContent = PAGE_CHECKOUT_TITLE.replace('{{TheCurrentStepTitle}}', PAGE_CHECKOUT_STEP_SHIPPING_TITLE);
                metaElm.setAttribute('description', PAGE_CHECKOUT_DESCRIPTION.replace('{{TheCurrentStepDescription}}', PAGE_CHECKOUT_STEP_SHIPPING_DESCRIPTION));
            break;
            
            case 'PAYMENT'  :
                titleElm.textContent = PAGE_CHECKOUT_TITLE.replace('{{TheCurrentStepTitle}}', PAGE_CHECKOUT_STEP_PAYMENT_TITLE);
                metaElm.setAttribute('description', PAGE_CHECKOUT_DESCRIPTION.replace('{{TheCurrentStepDescription}}', PAGE_CHECKOUT_STEP_PAYMENT_DESCRIPTION));
            break;
            
            case 'PENDING'  :
                titleElm.textContent = PAGE_CHECKOUT_TITLE.replace('{{TheCurrentStepTitle}}', PAGE_CHECKOUT_STEP_PENDING_TITLE);
                metaElm.setAttribute('description', PAGE_CHECKOUT_DESCRIPTION.replace('{{TheCurrentStepDescription}}', PAGE_CHECKOUT_STEP_PENDING_DESCRIPTION));
            break;
            
            case 'PAID'     :
                titleElm.textContent = PAGE_CHECKOUT_TITLE.replace('{{TheCurrentStepTitle}}', PAGE_CHECKOUT_STEP_PAID_TITLE);
                metaElm.setAttribute('description', PAGE_CHECKOUT_DESCRIPTION.replace('{{TheCurrentStepDescription}}', PAGE_CHECKOUT_STEP_PAID_DESCRIPTION));
            break;
        } // switch
    }, [checkoutStep]);
    
    
    
    // refs:
    const [customerInfoSectionOuterRef, setCustomerInfoSectionOuterRef] = useState<HTMLElement|null>(null);
    
    
    
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
            className={styleSheet.layout}
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
                {((checkoutStep === 'SHIPPING') || (checkoutStep === 'PAYMENT')) && <Section
                    // semantics:
                    tag='aside'
                    
                    
                    
                    // classes:
                    className={styleSheet.info}
                >
                    <ViewCustomerInfo />
                    
                    <ViewShippingInfo />
                </Section>}
                
                {(checkoutStep === 'INFO'    ) && <>
                    <Section
                        // refs:
                        elmRef={customerInfoSectionRef}
                        outerRef={setCustomerInfoSectionOuterRef}
                        
                        
                        
                        // accessibilities:
                        title='Contact Information'
                    >
                        <SignInCollapse
                            // states:
                            whenSignedIn='collapse' // hides the guest input when the customer is signed in
                            whenLoading='expand'    // shows the guest input when the auth is still loading
                        >
                            <Section
                                // classes:
                                className={styleSheet.accountSection}
                                
                                
                                
                                // accessibilities:
                                title={
                                    <>
                                        <span className='txt-sec'>Sign In as a</span> Guest
                                    </>
                                }
                            >
                                <EditGuestAccount />
                            </Section>
                            
                            <AlternateSeparator />
                        </SignInCollapse>
                        
                        <Section
                            // classes:
                            className={styleSheet.accountSection}
                            
                            
                            
                            // accessibilities:
                            title={
                                <>
                                    <span className='txt-sec'>Sign In as a</span> Customer
                                </>
                            }
                        >
                            <SignInCustomerAccount />
                        </Section>
                        <SignInBusyDialog viewport={customerInfoSectionOuterRef} />
                    </Section>
                    
                    <Section
                        // semantics:
                        tag='aside'
                        
                        
                        
                        // classes:
                        className={styleSheet.subscribeSection}
                        
                        
                        
                        // accessibilities:
                        title='Subscribe to Our Info'
                    >
                        <p>
                            Wanna to receive information about our product offers and news?
                        </p>
                        <EditSubscribeInfo />
                    </Section>
                    
                    {isShippingAddressRequired && <Section
                        // refs:
                        elmRef={shippingAddressSectionRef}
                        
                        
                        
                        // accessibilities:
                        title='Shipping Address'
                    >
                        <EditShippingAddress />
                    </Section>}
                </>}
                
                {(checkoutStep === 'SHIPPING') && <Section
                    // refs:
                    elmRef={currentStepSectionRef}
                    
                    
                    
                    // accessibilities:
                    title='Shipping Method'
                >
                    <EditShippingMethod />
                </Section>}
                
                {(checkoutStep === 'PAYMENT' ) && <Section
                    // refs:
                    elmRef={currentStepSectionRef}
                    
                    
                    
                    // accessibilities:
                    title='Payment Method'
                >
                    <EditPaymentOption />
                </Section>}
                
                {((checkoutStep === 'PENDING') || (checkoutStep === 'PAID')) && <Section
                    // refs:
                    elmRef={currentStepSectionRef}
                    
                    
                    
                    // classes:
                    className={styleSheet.paymentFinish}
                    
                    
                    
                    // accessibilities:
                    title='Thanks For Your Order!'
                >
                    <ViewOrderFinished
                        // data:
                        paid={(checkoutStep === 'PAID')}
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

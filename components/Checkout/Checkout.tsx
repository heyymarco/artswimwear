'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useMemo,
    useRef,
    useState,
}                           from 'react'
import {
    default as ReactDOM,
}                           from 'react-dom'

// redux:
import {
    useDispatch,
}                           from 'react-redux'

// reusable-ui core:
import {
    // a color management system:
    colorValues,
    
    
    
    // a typography management system:
    typoValues,
    
    
    
    // a set of React node utility functions:
    isTruthyNode,
    
    
    
    // react helper hooks:
    useEvent,
    EventHandler,
    useMergeEvents,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    ExpandedChangeEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    EditableTextControlProps,
    EditableTextControl,
    
    
    
    // base-content-components:
    Container,
    
    
    
    // simple-components:
    Icon,
    Label,
    ButtonIcon,
    inputValues,
    TextInput,
    EmailInput,
    Check,
    
    
    
    // layout-components:
    ListItem,
    List,
    
    
    
    // status-components:
    Badge,
    Busy,
    
    
    
    // notification-components:
    Alert,
    Tooltip,
    
    
    
    // menu-components:
    Collapse,
    
    
    
    // composite-components:
    AccordionItem,
    ExclusiveExpandedChangeEvent,
    ExclusiveAccordion,
    DetailsProps,
    Details,
    
    
    
    // utility-components:
    useDialogMessage,
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
    ImageProps,
    Image,
}                           from '@heymarco/image'
import {
    AddressFields,
}                           from '@heymarco/address-fields'

// internal components:
import {
    InputWithLabel,
}                           from '@/components/InputWithLabel'
import {
    RadioDecorator,
}                           from '@/components/RadioDecorator'
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    EditButton,
}                           from '@/components/EditButton'

// stores:
import {
    showCart,
}                           from '@/store/features/cart/cartSlice'
import type {
    PaymentMethod as PaymentMethodType,
}                           from '@/store/features/checkout/checkoutSlice'

// paypal:
import type {
    PayPalScriptOptions,
    
    HostedFieldsEvent,
    HostedFieldsHostedFieldsFieldName,
    
    OnApproveActions,
    OnApproveData,
    OnShippingChangeActions,
    OnShippingChangeData,
}                           from '@paypal/paypal-js'
import {
    PayPalScriptProvider,
    
    PayPalButtons,
    
    PayPalHostedFieldsProvider,
    PayPalHostedFieldProps,
    PayPalHostedField,
    usePayPalHostedFields,
}                           from '@paypal/react-paypal-js'

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'
import {
    calculateShippingCost,
}                           from '@/libs/shippings'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

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



// navigations:
const ProgressCheckout = (): JSX.Element|null => {
    // states:
    const {
        // states:
        checkoutProgress,
        
        isDesktop,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <List
            // variants:
            size='sm'
            theme={!isDesktop ? 'secondary' : 'primary'}
            outlined={!isDesktop}
            listStyle='breadcrumb'
            orientation='inline'
        >
            <ListItem active={checkoutProgress >= 0}>Information</ListItem>
            <ListItem active={checkoutProgress >= 1}>Shipping</ListItem>
            <ListItem active={checkoutProgress >= 2}>Payment</ListItem>
        </List>
    );
};
const NavCheckout = (): JSX.Element|null => {
    // states:
    const {
        // states:
        checkoutStep,
        checkoutProgress,
        
        isBusy,
        
        
        
        // actions:
        gotoStepInformation,
        gotoStepShipping,
        gotoPayment,
    } = useCheckoutState();
    const isCheckoutFinished = (checkoutStep === 'pending') || (checkoutStep === 'paid');
    
    
    
    // stores:
    const dispatch = useDispatch();
    
    
    
    // utilities:
    const [prevAction, nextAction] = useMemo(() => {
        const prevAction = [
            { text: 'Return to cart'       , action: () => dispatch(showCart(true)) },
            { text: 'Return to information', action: () => gotoStepInformation()    },
            { text: 'Return to shipping'   , action: gotoStepShipping               },
        ][checkoutProgress];
        
        const nextAction = [
            { text: 'Continue to shipping' , action: gotoStepShipping               },
            { text: 'Continue to payment'  , action: gotoPayment                    },
        ][checkoutProgress];
        
        return [prevAction, nextAction] as const;
    }, [checkoutProgress]);
    
    
    
    // jsx:
    return (
        <>
            {!isCheckoutFinished && <>
                {!!prevAction && <ButtonIcon
                    // appearances:
                    icon='arrow_back'
                    iconPosition='start'
                    
                    
                    
                    // variants:
                    size='md'
                    theme='primary'
                    buttonStyle='link'
                    
                    
                    
                    // classes:
                    className='back'
                    
                    
                    
                    // accessibilities:
                    enabled={!isBusy}
                    
                    
                    
                    // handlers:
                    onClick={prevAction.action}
                >
                    {prevAction.text}
                </ButtonIcon>}
                
                {!!nextAction && <ButtonIcon
                    // appearances:
                    icon={!isBusy ? 'arrow_forward' : 'busy'}
                    iconPosition='end'
                    
                    
                    
                    // variants:
                    size='lg'
                    theme='primary'
                    gradient={true}
                    
                    
                    
                    // classes:
                    className='next'
                    
                    
                    
                    // accessibilities:
                    enabled={!isBusy}
                    
                    
                    
                    // handlers:
                    onClick={nextAction.action}
                >
                    {nextAction.text}
                </ButtonIcon>}
            </>}
            
            {isCheckoutFinished && <>
                {/* TODO: remove when the finish order completed */}
                <ButtonIcon
                    icon='arrow_back'
                    iconPosition='start'
                    
                    size='md'
                    theme='primary'
                    buttonStyle='link'
                    className='back'
                    
                    enabled={!isBusy}
                    
                    onClick={gotoPayment}
                >
                    BACK
                </ButtonIcon>
                {/* TODO: re-activate when the finish order completed */}
                {/* <p>
                    <Icon
                        // appearances:
                        icon='help'
                        
                        
                        
                        // variants:
                        size='md'
                        theme='primary'
                    />
                    Need help?
                    <Button
                        // variants:
                        theme='primary'
                        buttonStyle='link'
                    >
                        <Link href='/contact'>
                            Contact Us
                        </Link>
                    </Button>
                </p> */}
                
                <ButtonIcon
                    // appearances:
                    icon='shopping_bag'
                    iconPosition='end'
                    
                    
                    
                    // variants:
                    size='lg'
                    theme='primary'
                    gradient={true}
                    
                    
                    
                    // classes:
                    className='next'
                    
                    
                    
                    // accessibilities:
                    enabled={!isBusy}
                >
                    <Link href='/products'>
                        Continue Shopping
                    </Link>
                </ButtonIcon>
            </>}
        </>
    );
};



// carts:
interface ResponsiveDetailsProps<TElement extends Element = HTMLElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>
    extends
        // bases:
        DetailsProps<TElement, TExpandedChangeEvent>
{
    // accessibilities:
    title ?: React.ReactNode
}
const ResponsiveDetails = <TElement extends Element = HTMLElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>(props: ResponsiveDetailsProps<TElement, TExpandedChangeEvent>): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        title,
        
        
        
        // states:
        defaultExpanded = false,
        
        
        
        // children:
        children,
    ...restDetailsProps} = props;
    
    
    
    // states:
    const {
        // states:
        isDesktop,
    } = useCheckoutState();
    
    const [showDetails, setShowDetails] = useState<boolean>(defaultExpanded);
    
    
    
    // handlers:
    const handleExpandedChangeInternal = useEvent<EventHandler<TExpandedChangeEvent>>((event) => {
        setShowDetails(event.expanded);
    });
    const handleExpandedChange         = useMergeEvents(
        // preserves the original `onExpandedChange`:
        props.onExpandedChange,
        
        
        
        // actions:
        handleExpandedChangeInternal,
    );
    
    
    
    // jsx:
    if (isDesktop) return (
        <>
            {children}
        </>
    );
    return (
        <Details<TElement, TExpandedChangeEvent>
            // other props:
            {...restDetailsProps}
            
            
            
            // states:
            expanded={props.expanded ?? showDetails}
            
            
            
            // components:
            buttonChildren={
                props.buttonChildren
                ??
                <>
                    {`${showDetails ? 'Hide' : 'Show' }${isTruthyNode(title) ? ' ' : ''}`}
                    {title}
                </>
            }
            
            
            
            // handlers:
            onExpandedChange={handleExpandedChange}
        >
            {children}
        </Details>
    );
};
const ViewCart = (): JSX.Element|null => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // cart data:
        cartItems,
        totalProductPrice,
        
        
        
        // shipping data:
        shippingProvider,
        totalShippingCost,
        
        
        
        // relation data:
        productList,
    } = useCheckoutState();
    const hasSelectedShipping = !!shippingProvider;
    
    
    
    // jsx:
    return (
        <>
            <ResponsiveDetails
                // variants:
                theme='secondary'
                detailsStyle='content'
                
                
                
                // classes:
                className='orderCollapse'
                
                
                
                // accessibilities:
                title='Order List'
            >
                <List
                    // variants:
                    listStyle='flat'
                    
                    
                    
                    // classes:
                    className='orderList'
                >
                    {cartItems.map((item, itemIndex) => {
                        // fn props:
                        const product          = productList?.entities?.[item.productId];
                        const productUnitPrice = product?.price;
                        
                        
                        
                        // jsx:
                        return (
                            <ListItem
                                // identifiers:
                                key={item.productId || itemIndex}
                                
                                
                                
                                // variants:
                                theme={!product ? 'danger' : undefined}
                                mild={!product ? false : undefined}
                                
                                
                                
                                // classes:
                                className={styles.productPreview}
                                
                                
                                
                                // accessibilities:
                                enabled={!!product}
                            >
                                <h3
                                    // classes:
                                    className='title h6'
                                >
                                    {product?.name ?? 'PRODUCT DELETED'}
                                </h3>
                                
                                {/* image + quantity */}
                                <CompoundWithBadge
                                    // components:
                                    wrapperComponent={<React.Fragment />}
                                    badgeComponent={
                                        <Badge
                                            // variants:
                                            theme='danger'
                                            badgeStyle='pill'
                                            
                                            
                                            
                                            // floatable:
                                            floatingPlacement='right-start'
                                            floatingShift={-3}
                                            floatingOffset={-20}
                                        >
                                            {item.quantity}x
                                        </Badge>
                                    }
                                    elementComponent={
                                        <Image
                                            // appearances:
                                            alt={product?.name ?? ''}
                                            src={resolveMediaUrl(product?.image)}
                                            sizes='64px'
                                            
                                            
                                            
                                            // classes:
                                            className='prodImg'
                                        />
                                    }
                                />
                                
                                {(productUnitPrice !== undefined) && <p className='unitPrice'>
                                    @ <span className='currency secondary'>
                                        {formatCurrency(productUnitPrice)}
                                    </span>
                                </p>}
                                
                                <p className='subPrice currencyBlock'>
                                    {!product && <>This product was deleted</>}
                                    <span className='currency'>
                                        {formatCurrency(productUnitPrice ? (productUnitPrice * item.quantity) : undefined)}
                                    </span>
                                </p>
                            </ListItem>
                        );
                    })}
                </List>
            </ResponsiveDetails>
            
            <hr />
            
            <p className='currencyBlock'>
                Subtotal products: <span className='currency'>
                    {formatCurrency(totalProductPrice)}
                </span>
            </p>
            
            <p className='currencyBlock'>
                Shipping: <span className='currency'>
                    {!!hasSelectedShipping ? formatCurrency(totalShippingCost) : 'calculated at next step'}
                </span>
            </p>
            
            <hr />
            
            <p className='currencyBlock totalCost'>
                Total: <span className='currency'>
                    {!!hasSelectedShipping ? formatCurrency(totalProductPrice + (totalShippingCost ?? 0)) : 'calculated at next step'}
                </span>
            </p>
        </>
    );
};



// checkouts:
const EditRegularCheckout = (): JSX.Element|null => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // extra data:
        marketingOpt,
        marketingOptHandlers,
        
        
        
        // customer data:
        customerNickName,
        customerNickNameHandlers,
        
        customerEmail,
        customerEmailHandlers,
        
        
        
        // shipping data:
        shippingValidation,
        
        
        shippingFirstName,
        shippingFirstNameHandlers,
        
        shippingLastName,
        shippingLastNameHandlers,
        
        
        shippingPhone,
        shippingPhoneHandlers,
        
        
        shippingAddress,
        shippingAddressHandlers,
        
        shippingCity,
        shippingCityHandlers,
        
        shippingZone,
        shippingZoneHandlers,
        
        shippingZip,
        shippingZipHandlers,
        
        shippingCountry,
        shippingCountryHandlers,
        
        
        
        // relation data:
        countryList,
        
        
        
        // fields:
        contactEmailInputRef,
        shippingAddressInputRef,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <ValidationProvider
            // validations:
            enableValidation={shippingValidation}
        >
            <Section
                // classes:
                className='contact'
                
                
                
                // accessibilities:
                title='Contact Information'
            >
                <InputWithLabel
                    // appearances:
                    icon='chat'
                    
                    
                    
                    // classes:
                    className='nick'
                    
                    
                    
                    // components:
                    inputComponent={
                        <TextInput
                            // accessibilities:
                            placeholder='Your Nick Name'
                            
                            
                            
                            // values:
                            value={customerNickName}
                            
                            
                            
                            // validations:
                            required={true}
                            minLength={2}
                            maxLength={30}
                            
                            
                            
                            // formats:
                            autoComplete='nickname'
                            autoCapitalize='words'
                            
                            
                            
                            // handlers:
                            {...customerNickNameHandlers}
                        />
                    }
                />
                <InputWithLabel
                    // appearances:
                    icon='email'
                    
                    
                    
                    // classes:
                    className='email'
                    
                    
                    
                    // components:
                    inputComponent={
                        <EmailInput
                            // refs:
                            elmRef={contactEmailInputRef}
                            
                            
                            
                            // accessibilities:
                            placeholder='Your Email'
                            
                            
                            
                            // values:
                            value={customerEmail}
                            
                            
                            
                            // validations:
                            required={true}
                            minLength={5}
                            maxLength={50}
                            
                            
                            
                            // formats:
                            autoComplete='email'
                            
                            
                            
                            // handlers:
                            {...customerEmailHandlers}
                        />
                    }
                />
                <Check
                    // classes:
                    className='marketingOpt'
                    
                    
                    
                    // values:
                    active={marketingOpt}
                    
                    
                    
                    // validations:
                    required={false}
                    enableValidation={false}
                    
                    
                    
                    // handlers:
                    {...marketingOptHandlers}
                >
                    Email me with news and offers
                </Check>
            </Section>
            
            <Section
                // classes:
                className={styles.address}
                
                
                
                // accessibilities:
                title='Shipping Address'
            >
                <AddressFields
                    // refs:
                    addressRef        = {shippingAddressInputRef}
                    
                    
                    
                    // types:
                    addressType       = 'shipping'
                    
                    
                    
                    // values:
                    firstName         = {shippingFirstName}
                    lastName          = {shippingLastName}
                    
                    phone             = {shippingPhone}
                    
                    address           = {shippingAddress}
                    city              = {shippingCity}
                    zone              = {shippingZone}
                    zip               = {shippingZip}
                    country           = {shippingCountry}
                    countryList       = {countryList}
                    
                    
                    
                    // handlers:
                    onFirstNameChange = {shippingFirstNameHandlers.onChange}
                    onLastNameChange  = {shippingLastNameHandlers.onChange }
                    
                    onPhoneChange     = {shippingPhoneHandlers.onChange    }
                    
                    onAddressChange   = {shippingAddressHandlers.onChange  }
                    onCityChange      = {shippingCityHandlers.onChange     }
                    onZoneChange      = {shippingZoneHandlers.onChange     }
                    onZipChange       = {shippingZipHandlers.onChange      }
                    onCountryChange   = {shippingCountryHandlers.onChange  }
                />
            </Section>
        </ValidationProvider>
    );
};



// informations:
const ViewInformation = (): JSX.Element|null => {
    // states:
    const {
        // states:
        checkoutStep,
        
        isBusy,
        
        
        
        // actions:
        gotoStepInformation,
        gotoStepShipping,
    } = useCheckoutState();
    
    
    
    // handlers:
    const handleGotoContactInfo      = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        gotoStepInformation(/* focusTo: */'contactInfo');
    });
    const handleGotoShippingAddress  = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        gotoStepInformation(/* focusTo: */'shippingAddress');
    });
    const handleGotoShippingProvider = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        gotoStepShipping();
    });
    
    
    
    // jsx:
    return (
        <AccessibilityProvider
            // accessibilities:
            enabled={!isBusy}
        >
            <table>
                <tbody>
                    <tr>
                        <th>Contact</th>
                        <td><ViewCustomerContact /></td>
                        <td>
                            <EditButton onClick={handleGotoContactInfo} />
                        </td>
                    </tr>
                    
                    <tr>
                        <th>Ship To</th>
                        <td><ViewShippingAddress /></td>
                        <td>
                            <EditButton onClick={handleGotoShippingAddress} />
                        </td>
                    </tr>
                    
                    {(checkoutStep !== 'shipping') && <tr>
                        <th>Method</th>
                        <td><ViewShippingMethod /></td>
                        <td>
                            <EditButton onClick={handleGotoShippingProvider} />
                        </td>
                    </tr>}
                </tbody>
            </table>
        </AccessibilityProvider>
    );
};
const ViewCustomer = (): JSX.Element|null => {
    // states:
    const {
        // states:
        isBusy,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <AccessibilityProvider
            // accessibilities:
            enabled={!isBusy}
        >
            <table>
                <thead>
                    <tr>
                        <th colSpan={2}>
                            Customer Information
                        </th>
                    </tr>
                </thead>
                
                <tbody>
                    <tr>
                        <th>Contact</th>
                        <td><ViewCustomerContact /></td>
                    </tr>
                    
                    <tr>
                        <th>Shipping Address</th>
                        <td><ViewShippingAddress /></td>
                    </tr>
                    
                    <tr>
                        <th>Shipping Method</th>
                        <td><ViewShippingMethod /></td>
                    </tr>
                    
                    <tr>
                        <th>Payment Method</th>
                        <td><ViewPaymentMethod /></td>
                    </tr>
                    
                    <tr>
                        <th>Billing Address</th>
                        <td><ViewBillingAddress /></td>
                    </tr>
                </tbody>
            </table>
        </AccessibilityProvider>
    );
};
const ViewCustomerContact = (): JSX.Element|null => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // customer data:
        customerNickName,
        customerEmail,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <span className={styles.data}>{customerEmail}</span> (<span className={styles.data}>{customerNickName}</span>)
        </>
    );
};
const ViewShippingAddress = (): JSX.Element|null => {
    // states:
    const {
        // shipping data:
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        
        
        // relation data:
        countryList,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            {`${shippingAddress}, ${shippingCity}, ${shippingZone} (${shippingZip}), ${countryList?.entities?.[shippingCountry ?? '']?.name}`}
        </>
    );
};
const ViewShippingMethod = (): JSX.Element|null => {
    // states:
    const {
        // shipping data:
        shippingProvider,
        
        
        
        // relation data:
        shippingList,
    } = useCheckoutState();
    const selectedShipping = shippingList?.entities?.[shippingProvider ?? ''];
    
    
    
    // jsx:
    return (
        <>
            {`${selectedShipping?.name}${!selectedShipping?.estimate ? '' : ` - ${selectedShipping?.estimate}`}`}
        </>
    );
};
const ViewPaymentMethod = (): JSX.Element|null => {
    // context:
    // TODO: replace payment api with finish checkout state
    const {makePaymentApi} = useCheckoutState();
    
    
    
    // apis:
    const [, {data: payment}] = makePaymentApi;
    const paymentMethod = payment?.paymentMethod;
    const type          = paymentMethod?.type;
    const brand         = paymentMethod?.brand || undefined;
    const identifier    = paymentMethod?.identifier;
    
    
    
    // jsx:
    return (
        <>
            {
                !!brand
                ? <Image
                    // appearances:
                    alt={brand}
                    src={`/brands/${brand}.svg`}
                    width={42}
                    height={26}
                    
                    
                    
                    // classes:
                    className='paymentProvider'
                />
                : (type?.toUpperCase() ?? type)
            }
            
            {!!identifier && <span
                // classes:
                className='paymentIdentifier'
            >
                ({identifier})
            </span>}
        </>
    );
};
const ViewBillingAddress = (): JSX.Element|null => {
    // states:
    const {
        // shipping data:
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        
        
        // billing data:
        billingAsShipping,
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
        
        
        
        // relation data:
        countryList,
    } = useCheckoutState();
    
    const finalBillingAddress    = billingAsShipping ? shippingAddress : billingAddress;
    const finalBillingCity       = billingAsShipping ? shippingCity    : billingCity;
    const finalBillingZone       = billingAsShipping ? shippingZone    : billingZone;
    const finalBillingZip        = billingAsShipping ? shippingZip     : billingZip;
    const finalBillingCountry    = billingAsShipping ? shippingCountry : billingCountry;
    
    
    
    // jsx:
    return (
        <>
            {`${finalBillingAddress}, ${finalBillingCity}, ${finalBillingZone} (${finalBillingZip}), ${countryList?.entities?.[finalBillingCountry ?? '']?.name}`}
        </>
    );
};



// shippings:
const EditShippingMethod = (): JSX.Element|null => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // cart data:
        totalProductWeight,
        
        
        
        // shipping data:
        shippingProvider,
        setShippingProvider,
        
        
        
        // relation data:
        shippingList,
        
        
        
        // sections:
        shippingMethodOptionRef,
    } = useCheckoutState();
    const filteredShippingList = !shippingList ? undefined : Object.values(shippingList.entities).filter((shippingEntry): shippingEntry is Exclude<typeof shippingEntry, undefined> => !!shippingEntry);
    
    
    
    // jsx:
    return (
        <>
            {!!filteredShippingList && <List
                // variants:
                theme='primary'
                
                
                
                // behaviors:
                actionCtrl={true}
            >
                {
                    filteredShippingList
                    .map((shippingEntry) => ({
                        totalShippingCost : calculateShippingCost(totalProductWeight, shippingEntry),
                        ...shippingEntry,
                    }))
                    .sort(({totalShippingCost: a}, {totalShippingCost: b}): number => (a ?? 0) - (b ?? 0))
                    .map(({totalShippingCost, ...shippingEntry}) => {
                        const isActive = `${shippingEntry.id}` === shippingProvider;
                        
                        
                        
                        // jsx:
                        return (
                            <ListItem
                                // identifiers:
                                key={`${shippingEntry.id}`}
                                
                                
                                
                                // refs:
                                elmRef={isActive ? shippingMethodOptionRef : undefined}
                                
                                
                                
                                // classes:
                                className={styles.optionEntryHeader}
                                
                                
                                
                                // states:
                                active={isActive}
                                
                                
                                
                                // handlers:
                                onClick={() => setShippingProvider(`${shippingEntry.id}`)}
                            >
                                <RadioDecorator />
                                
                                <p className='name'>
                                    {shippingEntry.name}
                                </p>
                                
                                {!!shippingEntry.estimate && <p className='estimate'>
                                    Estimate: {shippingEntry.estimate}
                                </p>}
                                
                                <p className='cost'>
                                    {formatCurrency(totalShippingCost)}
                                </p>
                            </ListItem>
                        );
                    })
                }
            </List>}
        </>
    );
};



// payments:
const hostedFieldsStyle = {
    // style input element:
    input: {
        'font-size'        : typoValues.fontSizeMd,
        'font-family'      : typoValues.fontFamilySansSerief,
        'font-weight'      : typoValues.fontWeightNormal,
        'font-style'       : typoValues.fontStyle,
        'text-decoration'  : typoValues.textDecoration,
        'line-height'      : typoValues.lineHeightMd,
        
        'color'            : colorValues.primaryBold.toString(),
    },
    '::placeholder': {
        'color'            : 'currentColor',
        'opacity'          : inputValues.placeholderOpacity,
    },
    // '::selection': {
    //     background         : colorValues.primary.toString(),     // doesn't work
    //     color              : colorValues.primaryText.toString(), // works
    // },
    
    
    // styling element states:
    // ':focus': {
    // },
    '.valid': {
        'color'            : colorValues.successBold.toString(),
    },
    // '.valid::selection': {
    //     'background-color' : colorValues.success.toString(),     // doesn't work
    //     'color'            : colorValues.successText.toString(), // works
    // },
    '.invalid': {
        'color'            : colorValues.dangerBold.toString(),
    },
    // '.invalid::selection': {
    //     'background-color' : colorValues.danger.toString(),     // doesn't work
    //     'color'            : colorValues.dangerText.toString(), // works
    // },
};

interface PayPalHostedFieldExtendedProps
    extends
        EditableTextControlProps,
        Pick<PayPalHostedFieldProps,
            // identifiers:
            |'id'              // required for stable hostedField id
            
            // formats:
            |'hostedFieldType' // required for determining field type
            
            |'options'         // required for field options
            // |'className'
            // |'lang'
            // |'title'
            // |'style'
        >
{
    // formats:
    hostedFieldType : HostedFieldsHostedFieldsFieldName
}
const PayPalHostedFieldExtended = (props: PayPalHostedFieldExtendedProps) => {
    // rest props:
    const {
        // identifiers:
        id,
        
        
        
        // formats:
        hostedFieldType,
        options,
    ...restEditableTextControlProps} = props;
    
    
    
    // states:
    const [isFocused, setIsFocused] = useState<boolean|undefined>(false);
    const [isValid  , setIsValid  ] = useState<boolean|undefined>(true);
    
    
    
    // handlers:
    const handleFocusBlur    = useEvent((event: HostedFieldsEvent) => {
        // conditions:
        const field = event.fields?.[hostedFieldType]; // find the field in hostedForm
        if (!field)                        return;     // not found in hostedForm => ignore
        if (field.isFocused === isFocused) return;     // already focused/blurred => nothing to change
        
        
        
        // actions:
        setIsFocused(field.isFocused);
    });
    const handleValidInvalid = useEvent((event: HostedFieldsEvent) => {
        // conditions:
        const field = event.fields?.[hostedFieldType]; // find the field in hostedForm
        if (!field)                    return;         // not found in hostedForm => ignore
        if (field.isValid === isValid) return;         // already validated/invalidated => nothing to change
        
        
        
        // actions:
        setIsValid(field.isValid);
    });
    
    
    
    // dom effects:
    const {cardFields} = usePayPalHostedFields();
    
    // setup the initial state of `isFocused` & `isValid`:
    useEffect(() => {
        // conditions:
        if (!cardFields) return; // hostedForm not found => ignore
        const field = cardFields.getState()?.fields?.[hostedFieldType]; // find the field in hostedForm
        if (!field)      return; // not found in hostedForm => ignore
        
        
        
        // setups:
        setIsValid(field.isValid);
        setIsFocused(field.isFocused);
    }, [cardFields, hostedFieldType]);
    
    // setup the event handlers:
    useEffect(() => {
        // conditions:
        if (!cardFields) return;
        
        
        
        // setups:
        cardFields.on('focus'          , handleFocusBlur);
        cardFields.on('blur'           , handleFocusBlur);
        cardFields.on('validityChange' , handleValidInvalid);
        
        
        
        // cleanups:
        return () => {
            /*
                off?.() : workaround for 'TypeError: cardFields.off is not a function'
            */
            cardFields.off?.('focus'          , handleFocusBlur);
            cardFields.off?.('blur'           , handleFocusBlur);
            cardFields.off?.('validityChange' , handleValidInvalid);
        };
    }, [cardFields]);
    
    
    
    // caches:
    const {
        selector,
        placeholder,
        type,
        formatInput,
        maskInput,
        select,
        maxlength,
        minlength,
        prefill,
        rejectUnsupportedCards,
    } = options;
    const cachedHostedField = useMemo(() => {
        const options = {
            selector,
            placeholder,
            type,
            formatInput,
            maskInput,
            select,
            maxlength,
            minlength,
            prefill,
            rejectUnsupportedCards,
        };
        
        
        
        // jsx:
        return (
            <PayPalHostedField
                // identifiers:
                id={id}
                
                
                
                // formats:
                hostedFieldType={hostedFieldType}
                
                
                
                // options:
                options={options}
            />
        );
    }, [
        // identifiers:
        id,
        
        
        
        // formats:
        hostedFieldType,
        
        
        
        // options:
        selector,
        placeholder,
        type,
        formatInput,
        maskInput,
        select,
        maxlength,
        minlength,
        prefill,
        rejectUnsupportedCards,
    ]);
    
    
    
    // jsx:
    return (
        <EditableTextControl
            // other props:
            {...restEditableTextControlProps}
            
            
            
            // accessibilities:
            tabIndex   = {-1}
            aria-label = {placeholder}
            
            
            
            // states:
            focused    = {isFocused ?? false}
            isValid    = {isValid   ?? null }
        >
            {cachedHostedField}
        </EditableTextControl>
    );
}

const cardNumberOptions  : PayPalHostedFieldExtendedProps['options'] = {
    selector    : '#cardNumber',
    placeholder : 'Card Number',
};
const cardExpiresOptions : PayPalHostedFieldExtendedProps['options'] = {
    selector    : '#cardExpires',
    placeholder : 'MM / YY',
};
const cardCvvOptions     : PayPalHostedFieldExtendedProps['options'] = {
    selector    : '#cardCvv',
    placeholder : 'Security Code',
};

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
    const paymentMethodList : PaymentMethodType[] = ['card', 'paypal', 'manual'];
    
    
    
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
const EditPaymentMethodCard = (): JSX.Element|null => {
    // states:
    const {
        // payment data:
        paymentValidation,
        paymentMethod,
        
        
        
        // fields:
        cardholderInputRef,
        
        
        
        // actions:
        doPlaceOrder,
    } = useCheckoutState();
    
    
    
    // refs:
    const safeSignRef = useRef<HTMLElement|null>(null);
    const nameSignRef = useRef<HTMLElement|null>(null);
    const dateSignRef = useRef<HTMLElement|null>(null);
    const cscSignRef  = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    return (
        <PayPalHostedFieldsProvider
            // styles:
            styles={hostedFieldsStyle}
            
            
            
            // handlers:
            createOrder={doPlaceOrder}
        >
            <ValidationProvider
                // validations:
                enableValidation={paymentValidation}
            >
                <InputWithLabel
                    // appearances:
                    icon='credit_card'
                    
                    
                    
                    // classes:
                    className='number'
                    
                    
                    
                    // components:
                    inputComponent={
                        <PayPalHostedFieldExtended
                            // identifiers:
                            id='cardNumber'
                            
                            
                            
                            // classes:
                            className='hostedField'
                            
                            
                            
                            // formats:
                            hostedFieldType='number'
                            
                            
                            
                            // options:
                            options={cardNumberOptions}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={
                        <Label
                            // refs:
                            elmRef={safeSignRef}
                            
                            
                            
                            // variants:
                            theme='success'
                            mild={true}
                            
                            
                            
                            // classes:
                            className='solid'
                        >
                            <Icon
                                // appearances:
                                icon='lock'
                            />
                            
                            <Tooltip
                                // variants:
                                theme='warning'
                                
                                
                                
                                // classes:
                                className='tooltip'
                                
                                
                                
                                // floatable:
                                floatingOn={safeSignRef}
                            >
                                <p>
                                    All transactions are secure and encrypted.
                                </p>
                                <p>
                                    Once the payment is processed, the credit card data <strong>no longer stored</strong> in application memory.
                                </p>
                                <p>
                                    The card data will be forwarded to our payment gateway (PayPal).<br />
                                    We won&apos;t store your card data into our database.
                                </p>
                            </Tooltip>
                        </Label>
                    }
                />
                
                <InputWithLabel
                    // appearances:
                    icon='person'
                    
                    
                    
                    // classes:
                    className='name'
                    
                    
                    
                    // components:
                    inputComponent={
                        <TextInput
                            // refs:
                            elmRef={cardholderInputRef}
                            
                            
                            
                            // accessibilities:
                            placeholder='Cardholder Name'
                            
                            
                            
                            // validations:
                            required={true}
                            
                            
                            
                            // formats:
                            inputMode='text'
                            autoComplete='cc-name'
                            autoCapitalize='words'
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={
                        <Label
                            // refs:
                            elmRef={nameSignRef}
                            
                            
                            
                            // variants:
                            theme='success'
                            mild={true}
                            
                            
                            
                            // classes:
                            className='solid'
                        >
                            <Icon
                                // appearances:
                                icon='help'
                            />
                            <Tooltip
                                // variants:
                                theme='warning'
                                
                                
                                
                                // classes:
                                className='tooltip'
                                
                                
                                
                                // floatable:
                                floatingOn={nameSignRef}
                            >
                                <p>
                                    The owner name as printed on front card.
                                </p>
                            </Tooltip>
                        </Label>
                    }
                />
                
                <InputWithLabel
                    // appearances:
                    icon='date_range'
                    
                    
                    
                    // classes:
                    className='expiry'
                    
                    
                    
                    // components:
                    inputComponent={
                        <PayPalHostedFieldExtended
                            // identifiers:
                            id='cardExpires'
                            
                            
                            
                            // classes:
                            className='hostedField'
                            
                            
                            
                            // formats:
                            hostedFieldType='expirationDate'
                            
                            
                            
                            // options:
                            options={cardExpiresOptions}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={
                        <Label
                            // refs:
                            elmRef={dateSignRef}
                            
                            
                            
                            // variants:
                            theme='success'
                            mild={true}
                            
                            
                            
                            // classes:
                            className='solid'
                        >
                            <Icon
                                // appearances:
                                icon='help'
                            />
                            <Tooltip
                                // variants:
                                theme='warning'
                                
                                
                                
                                // classes:
                                className='tooltip'
                                
                                
                                
                                // floatable:
                                floatingOn={dateSignRef}
                            >
                                <p>
                                    The expiration date as printed on front card.
                                </p>
                            </Tooltip>
                        </Label>
                    }
                />
                
                <InputWithLabel
                    // appearances:
                    icon='fiber_pin'
                    
                    
                    
                    // classes:
                    className='csc'
                    
                    
                    
                    // components:
                    inputComponent={
                        <PayPalHostedFieldExtended
                            // identifiers:
                            id='cardCvv'
                            
                            
                            
                            // classes:
                            className='hostedField'
                            
                            
                            
                            // formats:
                            hostedFieldType='cvv'
                            
                            
                            
                            // options:
                            options={cardCvvOptions}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={
                        <Label
                            // refs:
                            elmRef={cscSignRef}
                            
                            
                            
                            // variants:
                            theme='success'
                            mild={true}
                            
                            
                            
                            // classes:
                            className='solid'
                        >
                            <Icon
                                // appearances:
                                icon='help'
                            />
                            <Tooltip
                                // variants:
                                theme='warning'
                                
                                
                                
                                // classes:
                                className='tooltip'
                                
                                
                                
                                // floatable:
                                floatingOn={cscSignRef}
                            >
                                <p>
                                    3-digit security code usually found on the back of your card.
                                </p>
                                <p>
                                    American Express cards have a 4-digit code located on the front.
                                </p>
                            </Tooltip>
                        </Label>
                    }
                />
                
                {((paymentMethod ?? 'card') === 'card') && <PortalToNavCheckoutSection>
                    <ButtonPaymentCard />
                </PortalToNavCheckoutSection>}
            </ValidationProvider>
        </PayPalHostedFieldsProvider>
    );
};

const ViewPaymentMethodPaypal = (): JSX.Element|null => {
    // states:
    const checkoutState = useCheckoutState();
    const {
        // actions:
        doTransaction,
        doPlaceOrder,
        doMakePayment,
    } = checkoutState;
    
    
    
    // dialogs:
    const {
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleFundApproved   = useEvent(async (paypalAuthentication: OnApproveData, actions: OnApproveActions): Promise<void> => {
        doTransaction(async () => {
            try {
                // forward the authentication to backend_API to receive the fund agreement:
                await doMakePayment(paypalAuthentication.orderID, /*paid:*/true);
            }
            catch (error: any) {
                showMessageFetchError({ error, context: 'payment' });
            } // try
        });
    });
    const handleShippingChange = useEvent(async (data: OnShippingChangeData, actions: OnShippingChangeActions): Promise<void> => {
        // prevents the shipping_address DIFFERENT than previously inputed shipping_address:
        const shipping_address = data.shipping_address;
        if (shipping_address) {
            const shippingFieldMap = new Map<string, keyof typeof checkoutState | undefined>([
                ['address_line_1', 'shippingAddress'],
                ['address_line_2', undefined        ],
                ['city'          , 'shippingCity'   ],
                ['admin_area_2'  , 'shippingCity'   ],
                ['state'         , 'shippingZone'   ],
                ['admin_area_1'  , 'shippingZone'   ],
                ['postal_code'   , 'shippingZip'    ],
                ['country_code'  , 'shippingCountry'],
            ]);
            
            
            
            for (const [shippingField, shippingValue] of Object.entries(shipping_address)) {
                if (shippingField === undefined) continue;
                
                
                
                const mappedShippingField = shippingFieldMap.get(shippingField);
                if (mappedShippingField === undefined) {
                    // console.log('unknown shipping field: ', shippingField);
                    return actions.reject();
                } // if
                
                
                
                const originShippingValue = checkoutState[mappedShippingField];
                if (originShippingValue !== shippingValue) {
                    // console.log(`DIFF: ${shippingField} = ${shippingValue} <==> ${mappedShippingField} = ${originShippingValue}`)
                    return actions.reject();
                } // if
            } // for
            
            
            
            return actions.resolve();
        } // if
    });
    
    
    
    // jsx:
    return (
        <>
            <p>
                Click the PayPal button below. You will be redirected to the PayPal website to complete the payment.
            </p>
            
            <PayPalButtons
                // handlers:
                createOrder={doPlaceOrder}
                onApprove={handleFundApproved}
                onShippingChange={handleShippingChange}
            />
        </>
    );
};
const ViewPaymentMethodManual = (): JSX.Element|null => {
    // states:
    const {
        // payment data:
        paymentMethod,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <p>
                Pay manually via <strong>bank transfer</strong>.
            </p>
            <p>
                We&apos;ll send <em>payment instructions</em> to your (billing) email after you&apos;ve <em>finished the order</em>.
            </p>
            
            {(paymentMethod === 'manual') && <PortalToNavCheckoutSection>
                <ButtonPaymentManual />
            </PortalToNavCheckoutSection>}
        </>
    );
};

const ButtonPaymentCard = (): JSX.Element|null => {
    // states:
    const {
        // states:
        isBusy,
        
        
        
        // shipping data:
        shippingFirstName : _shippingFirstName, // not implemented yet, because billingFirstName is not implemented
        shippingLastName  : _shippingLastName,  // not implemented yet, because billingLastName  is not implemented
        
        shippingPhone     : _shippingPhone,     // not implemented yet, because billingPhone     is not implemented
        
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        
        
        // billing data:
        billingAsShipping,
        
        billingFirstName  : _billingFirstName,  // not implemented, already to use cardholderName
        billingLastName   : _billingLastName,   // not implemented, already to use cardholderName
        
        billingPhone      : _billingPhone,      // not implemented yet
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
        
        
        
        // fields:
        cardholderInputRef,
        
        
        
        // actions:
        doTransaction,
        doMakePayment,
    } = useCheckoutState();
    
    
    
    // dialogs:
    const {
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const hostedFields = usePayPalHostedFields();
    const handlePayButtonClick = useEvent(() => {
        if (typeof(hostedFields.cardFields?.submit) !== 'function') return; // validate that `submit()` exists before invoke it
        const submitCardData = hostedFields.cardFields?.submit;
        doTransaction(async () => {
            try {
                // submit card data to PayPal_API to get authentication:
                const paypalAuthentication = await submitCardData({
                    // trigger 3D Secure authentication:
                    contingencies  : ['SCA_WHEN_REQUIRED'],
                    
                    cardholderName        : cardholderInputRef?.current?.value, // cardholder's first and last name
                    billingAddress : {
                        streetAddress     : billingAsShipping ? shippingAddress : billingAddress, // street address, line 1
                     // extendedAddress   : undefined,                                            // street address, line 2 (Ex: Unit, Apartment, etc.)
                        locality          : billingAsShipping ? shippingCity    : billingCity,    // city
                        region            : billingAsShipping ? shippingZone    : billingZone,    // state
                        postalCode        : billingAsShipping ? shippingZip     : billingZip,     // postal Code
                        countryCodeAlpha2 : billingAsShipping ? shippingCountry : billingCountry, // country Code
                    },
                });
                /*
                    example:
                    {
                        authenticationReason: undefined
                        authenticationStatus: "APPROVED",
                        card: {
                            brand: "VISA",
                            card_type: "VISA",
                            last_digits: "7704",
                            type: "CREDIT",
                        },
                        liabilityShift: undefined
                        liabilityShifted: undefined
                        orderId: "1N785713SG267310M"
                    }
                */
                
                
                
                // then forward the authentication to backend_API to receive the fund:
                await doMakePayment(paypalAuthentication.orderId, /*paid:*/true);
            }
            catch (error: any) {
                showMessageFetchError({ error, context: 'payment' });
            } // try
        });
    });
    
    
    
    // jsx:
    return (
        <ButtonIcon
            // appearances:
            icon={!isBusy ? 'monetization_on' : 'busy'}
            
            
            
            // variants:
            size='lg'
            theme='primary'
            gradient={true}
            
            
            
            // classes:
            className='next payNow'
            
            
            
            // accessibilities:
            enabled={!isBusy}
            
            
            
            // handlers:
            onClick={handlePayButtonClick}
        >
            Pay Now
        </ButtonIcon>
    );
};
const ButtonPaymentManual = (): JSX.Element|null => {
    // states:
    const {
        // states:
        isBusy,
        
        
        
        // actions:
        doTransaction,
        doPlaceOrder,
        doMakePayment,
    } = useCheckoutState();
    
    
    
    // dialogs:
    const {
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleFinishOrderButtonClick = useEvent(() => {
        doTransaction(async () => {
            try {
                // createOrder:
                const orderId = await doPlaceOrder({paymentSource: 'manual'});
                
                
                
                // then forward the authentication to backend_API to book the order (but not paid yet):
                await doMakePayment(orderId, /*paid:*/false);
            }
            catch (error: any) {
                showMessageFetchError({ error, context: 'order' });
            } // try
        });
    });
    
    
    
    // jsx:
    return (
        <ButtonIcon
            // appearances:
            icon={!isBusy ? 'done' : 'busy'}
            
            
            
            // variants:
            size='lg'
            theme='primary'
            gradient={true}
            
            
            
            // classes:
            className='next finishOrder'
            
            
            
            // accessibilities:
            enabled={!isBusy}
            
            
            
            // handlers:
            onClick={handleFinishOrderButtonClick}
        >
            Finish Order
        </ButtonIcon>
    );
};

interface PortalToNavCheckoutSectionProps {
    children : React.ReactNode
}
const PortalToNavCheckoutSection = (props: PortalToNavCheckoutSectionProps): JSX.Element|null => {
    // states:
    const {
        // sections:
        navCheckoutSectionElm,
    } = useCheckoutState();
    
    
    
    // dom effects:
    // delays the rendering of portal until the page is fully hydrated
    const [isHydrated, setIsHydrated] = useState<boolean>(false);
    useEffect(() => {
        setIsHydrated(true);
    }, []);
    
    
    
    // jsx:
    if (!isHydrated) return null;
    if (!navCheckoutSectionElm?.current) return (
        <>
            {props.children}
        </>
    );
    return ReactDOM.createPortal(
        props.children,
        navCheckoutSectionElm.current
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

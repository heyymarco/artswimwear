import Head from 'next/head'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.scss'

import { Article, Section } from '@heymarco/section'

import { AccordionItem, Alert, Badge, Busy, ButtonIcon, Check, Collapse, Container, Details, EditableTextControl, EditableTextControlProps, EmailInput, ExclusiveAccordion, Icon, Label, List, ListItem, Radio, RadioProps, TextInput, Tooltip, useDialogMessage } from '@reusable-ui/components'
import { InputWithLabel } from '@/components/InputWithLabel'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'
import { formatCurrency } from '@/libs/formatters'
import { ImageProps, Image } from '@heymarco/image'
import Link from '@reusable-ui/next-compat-link'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { showCart } from '@/store/features/cart/cartSlice'
import { useDispatch } from 'react-redux'
import { AccessibilityProvider, colorValues, typoValues, useEvent, ValidationProvider } from '@reusable-ui/core'
import { setShippingProvider, setShippingValidation, PaymentMethod } from '@/store/features/checkout/checkoutSlice'
import type { HostedFieldsEvent, HostedFieldsHostedFieldsFieldName, OnApproveActions, OnApproveData, OnShippingChangeActions, OnShippingChangeData } from '@paypal/paypal-js'
import { PayPalScriptProvider, PayPalButtons, PayPalHostedFieldsProvider, PayPalHostedField, usePayPalHostedFields, PayPalHostedFieldProps } from '@paypal/react-paypal-js'
import { calculateShippingCost } from '@/libs/shippings'
import { AddressFields } from '@heymarco/address-fields'
import {
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
    PAGE_CHECKOUT_TITLE,
    PAGE_CHECKOUT_DESCRIPTION,
} from '@/website.config'
import { resolveMediaUrl } from '@/libs/mediaStorage.client'
// internals:
import {
    CheckoutStateProvider,
    useCheckoutState,
}                           from './states/checkoutState'



// const inter = Inter({ subsets: ['latin'] })
const useCheckoutStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./CheckoutStyles')
, { id: 'gdfyt2agd1' });
import './CheckoutStyles';



// handlers:
const handleRadioDecorator : React.MouseEventHandler<HTMLSpanElement> = (event) => {
    event.preventDefault();
    event.currentTarget.parentElement?.click();
}

const RadioDecorator = (props: RadioProps) => {
    // jsx:
    return (
        <Radio
            // other props:
            {...props}
            
            
            
            // variants:
            outlined={props.outlined ?? true}
            nude={props.nude ?? true}
            
            
            
            // classes:
            className={props.className ?? 'indicator'}
            
            
            
            // accessibilities:
            enableValidation={props.enableValidation ?? false}
            inheritActive={props.inheritActive ?? true}
            tabIndex={props.tabIndex ?? -1}
            
            
            
            // handlers:
            onClick={props.onClick ?? handleRadioDecorator}
        />
    )
}



const invalidSelector = ':is(.invalidating, .invalidated)';

const hostedFieldsStyle = {
    // Style all elements
    input: {
        'font-size'       : typoValues.fontSizeMd,
        'font-family'     : typoValues.fontFamilySansSerief,
        'font-weight'     : typoValues.fontWeightNormal,
        'font-style'      : typoValues.fontStyle,
        'text-decoration' : typoValues.textDecoration,
        'line-height'     : typoValues.lineHeightMd,
        'color'           : colorValues.primaryBold.toString(),
    },
    
    
    // // Styling element state
    // ':focus': {
    //     'color': 'blue'
    // },
    // '.valid': {
    //     'color': 'green'
    // },
    // '.invalid': {
    //     'color': 'red'
    // },
}

interface PayPalHostedFieldExtendedProps
    extends
        EditableTextControlProps,
        Pick<PayPalHostedFieldProps,
            |'hostedFieldType'
            |'options'
            |'id'
            // |'className'
            // |'lang'
            // |'title'
            // |'style'
        >
{
}
const PayPalHostedFieldExtended = (props: PayPalHostedFieldExtendedProps) => {
    // rest props:
    const {
        hostedFieldType,
        options,
        id,
    ...restEditableTextControlProps} = props;
    
    
    
    // states:
    const [isFocused, setIsFocused] = useState<boolean|undefined>(false);
    const [isValid  , setIsValid  ] = useState<boolean|undefined>(true);
    
    
    
    // handlers:
    const handleFocusBlur    = useEvent((event: HostedFieldsEvent) => {
        // conditions:
        const field = event.fields?.[hostedFieldType as HostedFieldsHostedFieldsFieldName];
        if (!field) return;
        if (field.isFocused === isFocused) return;
        
        
        
        // actions:
        setIsFocused(field.isFocused);
    });
    const handleValidInvalid = useEvent((event: HostedFieldsEvent) => {
        // conditions:
        const field = event.fields?.[hostedFieldType as HostedFieldsHostedFieldsFieldName];
        if (!field) return;
        if (field.isValid === isValid) return;
        
        
        
        // actions:
        setIsValid(field.isValid);
    });
    
    
    
    // dom effects:
    const {cardFields} = usePayPalHostedFields();
    
    useEffect(() => {
        // conditions:
        if (!cardFields)      return;
        if (!hostedFieldType) return;
        const field = cardFields.getState()?.fields?.[hostedFieldType as HostedFieldsHostedFieldsFieldName];
        if (!field)           return;
        
        
        
        // setups:
        setIsValid(field.isValid);
        setIsFocused(field.isFocused);
    }, [cardFields, hostedFieldType]);
    
    useEffect(() => {
        // conditions:
        if (!cardFields) return;
        
        
        
        // setups:
        cardFields.on('focus'          , handleFocusBlur);
        cardFields.on('blur'           , handleFocusBlur);
        cardFields.on('validityChange' , handleValidInvalid);
        
        
        
        // cleanups:
        return () => {
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
    const optionsCached = useMemo(() => ({
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
    }), [
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
            {...restEditableTextControlProps}
            
            tabIndex   = {-1}
            
            focused    = {isFocused ?? false}
            isValid    = {isValid   ?? null }
            
            aria-label = {optionsCached.placeholder}
        >
            {useMemo(() =>
                <PayPalHostedField
                    {...{
                        hostedFieldType,
                        options : optionsCached,
                        id,
                    }}
                />
            , [hostedFieldType, optionsCached, id])}
        </EditableTextControl>
    );
}



// react components:
const Checkout = () => {
    // jsx:
    return (
        <CheckoutStateProvider>
            <CheckoutInternal />
        </CheckoutStateProvider>
    );
};
const CheckoutInternal = () => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // cart data:
        hasCart,
        
        
        
        // states:
        checkoutStep,
        
        isLoadingPage,
        isErrorPage,
        isReadyPage,
        
        isDesktop,
        
        
        
        // sections:
        regularCheckoutSectionRef,
        currentStepSectionRef,
        navCheckoutSectionElm,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <Head>
                {((): React.ReactNode => {
                    switch(checkoutStep) {
                        case 'info'     : return <>
                            <title>{PAGE_CHECKOUT_TITLE.replace('{{TheCurrentStepTitle}}', PAGE_CHECKOUT_STEP_INFO_TITLE)}</title>
                            <meta name='description' content={PAGE_CHECKOUT_DESCRIPTION.replace('{{TheCurrentStepDescription}}', PAGE_CHECKOUT_STEP_INFO_DESCRIPTION)} />
                        </>
                        
                        case 'shipping' : return <>
                            <title>{PAGE_CHECKOUT_TITLE.replace('{{TheCurrentStepTitle}}', PAGE_CHECKOUT_STEP_SHIPPING_TITLE)}</title>
                            <meta name='description' content={PAGE_CHECKOUT_DESCRIPTION.replace('{{TheCurrentStepDescription}}', PAGE_CHECKOUT_STEP_SHIPPING_DESCRIPTION)} />
                        </>
                        
                        case 'payment'  : return <>
                            <title>{PAGE_CHECKOUT_TITLE.replace('{{TheCurrentStepTitle}}', PAGE_CHECKOUT_STEP_PAYMENT_TITLE)}</title>
                            <meta name='description' content={PAGE_CHECKOUT_DESCRIPTION.replace('{{TheCurrentStepDescription}}', PAGE_CHECKOUT_STEP_PAYMENT_DESCRIPTION)} />
                        </>
                        
                        case 'pending'  : return <>
                            <title>{PAGE_CHECKOUT_TITLE.replace('{{TheCurrentStepTitle}}', PAGE_CHECKOUT_STEP_PENDING_TITLE)}</title>
                            <meta name='description' content={PAGE_CHECKOUT_DESCRIPTION.replace('{{TheCurrentStepDescription}}', PAGE_CHECKOUT_STEP_PENDING_DESCRIPTION)} />
                        </>
                        
                        case 'paid'     : return <>
                            <title>{PAGE_CHECKOUT_TITLE.replace('{{TheCurrentStepTitle}}', PAGE_CHECKOUT_STEP_PAID_TITLE)}</title>
                            <meta name='description' content={PAGE_CHECKOUT_DESCRIPTION.replace('{{TheCurrentStepDescription}}', PAGE_CHECKOUT_STEP_PAID_DESCRIPTION)} />
                        </>
                        
                        default         : return <>
                        </>
                    } // switch
                })()}
            </Head>
            
            {(isLoadingPage || isErrorPage || !hasCart) && <Section className={styles.loading} theme='secondary'>
                {
                    !hasCart
                    ?  <>
                        <p>
                            Your shopping cart is empty. Please add one/some products to buy.
                        </p>
                        <ButtonIcon icon='image_search' theme='primary' size='lg' gradient={true}>
                            <Link href='/products'>
                                See our product gallery
                            </Link>
                        </ButtonIcon>
                    </>
                    : isLoadingPage
                    ? <Busy theme='primary' size='lg' />
                    : <p>Oops, an error occured!</p>
                }
            </Section>}
            
            {useMemo(() =>
                isReadyPage && <Container className={`${styles.layout} ${checkoutStep}`} theme='secondary'>
                    <Section tag='aside' className={styles.orderSummary} title='Order Summary' theme={!isDesktop ? 'primary' : undefined}>
                        <OrderSummary />
                    </Section>
                    
                    <Section tag='nav' className={styles.progressCheckout} theme={!isDesktop ? 'primary' : undefined} mild={!isDesktop ? false : undefined}>
                        <ProgressCheckout />
                    </Section>
                    
                    <div className={styles.currentStepLayout}>
                        {((checkoutStep === 'shipping') || (checkoutStep === 'payment')) && <Section tag='aside' className={styles.orderReview}>
                            <OrderReview />
                        </Section>}
                        
                        {(checkoutStep === 'info') && <Section elmRef={currentStepSectionRef} className={styles.checkout}>
                            {/* TODO: activate */}
                            {/* <Section className={styles.expressCheckout} title='Express Checkout'>
                            </Section>
                            
                            <div className={styles.checkoutAlt}>
                                <hr />
                                <span>OR</span>
                                <hr />
                            </div> */}
                            
                            <Section elmRef={regularCheckoutSectionRef} className={styles.regularCheckout} title='Regular Checkout'>
                                <RegularCheckout />
                            </Section>
                        </Section>}
                        
                        {(checkoutStep === 'shipping') && <Section elmRef={currentStepSectionRef} className={styles.shippingMethod} title='Shipping Method'>
                            <ShippingMethod />
                        </Section>}
                        
                        {(checkoutStep === 'payment') && <Section elmRef={currentStepSectionRef} className={styles.payment} title='Payment'>
                            <Payment />
                        </Section>}
                        
                        {(checkoutStep === 'pending') && <Section elmRef={currentStepSectionRef} className={styles.paymentFinish} title='Thank You'>
                            <PaymentPending />
                        </Section>}
                        
                        {(checkoutStep === 'paid') && <Section elmRef={currentStepSectionRef} className={styles.paymentFinish} title='Thank You'>
                            <Paid />
                        </Section>}
                    </div>
                    
                    <Section tag='nav' className={styles.navCheckout} articleComponent={<Article elmRef={navCheckoutSectionElm} />}>
                        <NavCheckout />
                    </Section>
                    
                    <hr className={styles.vertLine} />
                </Container>
            , [isReadyPage, isDesktop, checkoutStep, styles])}
        </>
    );
};
export {
    Checkout,
    Checkout as default,
};



interface ImageWithStatusProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        ImageProps<TElement>
{
    status : string|number
}
const ImageWithStatus = <TElement extends Element = HTMLElement>(props: ImageWithStatusProps<TElement>) => {
    // refs:
    const [imageRef, setImageRef] = useState<TElement|null>(null);
    
    
    
    // rest props:
    const {
        status,
    ...restImageProps} = props;
    
    
    
    // jsx:
    return (
        <>
            <Image<TElement>
                // other props:
                {...restImageProps}
                
                
                
                // refs:
                elmRef={setImageRef}
            />
            <Badge theme='danger' badgeStyle='pill' floatingOn={imageRef} floatingPlacement='right-start' floatingOffset={-20} floatingShift={-3}>
                {status}x
            </Badge>
        </>
    )
}



interface ResponsiveDetailsProps {
    children  : React.ReactNode
}
const ResponsiveDetails = ({children}: ResponsiveDetailsProps) => {
    // context:
    const {isDesktop} = useCheckoutState();
    
    
    
    // states:
    const [showDetails, setShowDetails] = useState<boolean>(false);
    
    
    
    // jsx:
    if (isDesktop) return (
        <>
            {children}
        </>
    );
    return (
        <Details className='orderCollapse' buttonChildren={`${showDetails ? 'Hide' : 'Show' } Order List`} theme='secondary' detailsStyle='content'
            expanded={showDetails}
            onExpandedChange={(event) => setShowDetails(event.expanded)}
        >
            {children}
        </Details>
    );
}



const ProgressCheckout = () => {
    // context:
    const {isDesktop, checkoutProgress} = useCheckoutState();
    
    
    
    // jsx:
    return (
        <List theme={!isDesktop ? 'secondary' : 'primary'} outlined={!isDesktop} listStyle='breadcrumb' orientation='inline' size='sm'>
            <ListItem active={checkoutProgress >= 0}>Information</ListItem>
            <ListItem active={checkoutProgress >= 1}>Shipping</ListItem>
            <ListItem active={checkoutProgress >= 2}>Payment</ListItem>
        </List>
    );
}



const NavCheckout = () => {
    // states:
    const {
        // states:
        checkoutStep,
        setCheckoutStep,
        checkoutProgress,
        
        isBusy,
        
        
        
        // actions:
        gotoStepInformation,
        gotoStepShipping,
    } = useCheckoutState();
    const isCheckoutFinished = ['pending', 'paid'].includes(checkoutStep);
    
    
    
    // stores:
    const dispatch = useDispatch();
    
    
    
    // dialogs:
    const {
        showMessageFieldError,
    } = useDialogMessage();
    
    
    
    // utilities:
    const prevAction = [
        { text: 'Return to cart'       , action: () => dispatch(showCart(true))   },
        { text: 'Return to information', action: () => gotoStepInformation()      },
        { text: 'Return to shipping'   , action: gotoStepShipping                 },
    ][checkoutProgress];
    
    const nextAction = [
        { text: 'Continue to shipping' , action: gotoStepShipping                 },
        { text: 'Continue to payment'  , action: () => setCheckoutStep('payment') },
    ][checkoutProgress];
    
    
    
    // jsx:
    return (
        <>
            {!isCheckoutFinished && <>
                {!!prevAction && <ButtonIcon
                    enabled={!isBusy}
                    
                    className='back'
                    theme='primary'
                    size='md'
                    buttonStyle='link'
                    
                    icon='arrow_back'
                    iconPosition='start'
                    
                    onClick={prevAction.action}
                >
                    {prevAction.text}
                </ButtonIcon>}
                
                {!!nextAction && <ButtonIcon
                    enabled={!isBusy}
                    
                    className='next'
                    theme='primary'
                    size='lg'
                    gradient={true}
                    
                    icon={!isBusy ? 'arrow_forward' : 'busy'}
                    iconPosition='end'
                    
                    onClick={nextAction.action}
                >
                    {nextAction.text}
                </ButtonIcon>}
            </>}
            
            {isCheckoutFinished && <>
                {/* TODO: remove when the finish order completed */}
                <ButtonIcon
                    enabled={!isBusy}
                    
                    className='back'
                    theme='primary'
                    size='md'
                    buttonStyle='link'
                    
                    icon='arrow_back'
                    iconPosition='start'
                    
                    onClick={() => setCheckoutStep('payment')}
                >
                    BACK
                </ButtonIcon>
                {/* TODO: re-activate when the finish order completed */}
                {/* <p>
                    <Icon icon='help' theme='primary' size='md' /> Need help? <Button theme='primary' buttonStyle='link'><Link href='/contact'>Contact Us</Link></Button>
                </p> */}
                
                <ButtonIcon
                    enabled={!isBusy}
                    
                    className='next'
                    theme='primary'
                    size='lg'
                    gradient={true}
                    
                    icon='shopping_bag'
                    iconPosition='end'
                >
                    <Link href='/products'>
                        Continue Shopping
                    </Link>
                </ButtonIcon>
            </>}
        </>
    );
}



const RegularCheckout = () => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // context:
    const {countryList, contactEmailInputRef, shippingAddressInputRef } = useCheckoutState();
    
    
    
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
    } = useCheckoutState();
    
    
    
    return (
        <ValidationProvider enableValidation={shippingValidation}>
            <Section className='contact' title='Contact Information'>
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
            <Section className={styles.address} title='Shipping Address'>
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
                    
                    
                    
                    // events:
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
}



const OrderSummary = () => {
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
        priceList,
        productList,
    } = useCheckoutState();
    
    const hasSelectedShipping   = !!shippingProvider;
    
    
    
    // jsx:
    return (
        <>
            <ResponsiveDetails>
                <List className='orderList' listStyle='flat'>
                    {cartItems.map((item) => {
                        const productUnitPrice = priceList?.entities?.[item.productId]?.price;
                        const product          = productList?.entities?.[item.productId];
                        return (
                            <ListItem key={item.productId} className={styles.productPreview}
                                enabled={!!product}
                                theme={!product ? 'danger' : undefined}
                                mild={!product ? false : undefined}
                            >
                                <h3 className='title h6'>{product?.name ?? 'PRODUCT WAS REMOVED'}</h3>
                                <ImageWithStatus
                                    className='prodImg'
                                    
                                    alt={product?.name ?? ''}
                                    src={resolveMediaUrl(product?.image)}
                                    sizes='64px'
                                    
                                    status={item.quantity}
                                />
                                {(productUnitPrice !== undefined) && <p className='unitPrice'>
                                    @ <span className='currency secondary'>{formatCurrency(productUnitPrice)}</span>
                                </p>}
                                <p className='subPrice currencyBlock'>
                                    {!product && <>This product was removed before you purcase it</>}
                                    <span className='currency'>{formatCurrency(productUnitPrice ? (productUnitPrice * item.quantity) : undefined)}</span>
                                </p>
                            </ListItem>
                        )
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
}
const OrderReview = () => {
    // states:
    const {
        // states:
        checkoutStep,
        isBusy,
        
        
        
        // actions:
        gotoStepInformation,
        gotoStepShipping,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <AccessibilityProvider enabled={!isBusy}>
            <table>
                <tbody>
                    <tr>
                        <th>Contact</th>
                        <td><CustomerContactReview /></td>
                        <td>
                            <ButtonIcon icon='edit' theme='primary' size='sm' buttonStyle='link' onClick={() => {
                                gotoStepInformation(/* focusTo: */'contactInfo');
                            }}>Change</ButtonIcon>
                        </td>
                    </tr>
                    <tr>
                        <th>Ship To</th>
                        <td><ShippingAddressReview /></td>
                        <td>
                            <ButtonIcon icon='edit' theme='primary' size='sm' buttonStyle='link' onClick={() => {
                                gotoStepInformation(/* focusTo: */'shippingAddress');
                            }}>Change</ButtonIcon>
                        </td>
                    </tr>
                    {(checkoutStep !== 'shipping') && <tr>
                        <th>Method</th>
                        <td><ShippingMethodReview /></td>
                        <td>
                            <ButtonIcon icon='edit' theme='primary' size='sm' buttonStyle='link' onClick={() => {
                                gotoStepShipping();
                            }}>Change</ButtonIcon>
                        </td>
                    </tr>}
                </tbody>
            </table>
        </AccessibilityProvider>
    );
}
const OrderReviewCompleted = () => {
    // states:
    const {
        // states:
        isBusy,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <AccessibilityProvider enabled={!isBusy}>
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
                        <td><CustomerContactReview /></td>
                    </tr>
                    <tr>
                        <th>Shipping Address</th>
                        <td><ShippingAddressReview /></td>
                    </tr>
                    <tr>
                        <th>Shipping Method</th>
                        <td><ShippingMethodReview /></td>
                    </tr>
                    <tr>
                        <th>Payment Method</th>
                        <td><PaymentMethodReview /></td>
                    </tr>
                    <tr>
                        <th>Billing Address</th>
                        <td><BillingAddressReview /></td>
                    </tr>
                </tbody>
            </table>
        </AccessibilityProvider>
    );
}
const CustomerContactReview = () => {
    // states:
    const {
        // customer data:
        customerNickName,
        customerEmail,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            {customerEmail} ({customerNickName})
        </>
    );
}
const ShippingAddressReview = () => {
    // context:
    const {countryList} = useCheckoutState();
    
    
    
    // states:
    const {
        // shipping data:
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
    } = useCheckoutState();
    
    
    
    return (
        <>
            {`${shippingAddress}, ${shippingCity}, ${shippingZone} (${shippingZip}), ${countryList?.entities?.[shippingCountry ?? '']?.name}`}
        </>
    );
}
const ShippingMethodReview = () => {
    // context:
    const {shippingList} = useCheckoutState();
    
    
    
    // states:
    const {
        // shipping data:
        shippingProvider,
    } = useCheckoutState();
    
    const selectedShipping = shippingList?.entities?.[shippingProvider ?? ''];
    
    
    
    // jsx:
    return (
        <>
            {`${selectedShipping?.name}${!selectedShipping?.estimate ? '' : ` - ${selectedShipping?.estimate}`}`}
        </>
    );
}
const PaymentMethodReview = () => {
    // context:
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
            {!!brand ? <Image className='paymentProvider' alt={brand} src={`/brands/${brand}.svg`} width={42} height={26} /> : (type?.toUpperCase() ?? type)}
            {!!identifier && <span className='paymentIdentifier'>({identifier})</span>}
        </>
    );
}
const BillingAddressReview = () => {
    // context:
    const {countryList} = useCheckoutState();
    
    
    
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
}



const ShippingMethod = () => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // cart data:
        totalProductWeight,
        
        
        
        // shipping data:
        shippingProvider,
        
        
        
        // relation data:
        shippingList,
        
        
        
        // sections:
        shippingMethodOptionRef,
    } = useCheckoutState();
    
    const selectedShipping = shippingList?.entities?.[shippingProvider ?? ''];
    
    const dispatch = useDispatch();
    
    
    
    const filteredShippingList = !shippingList ? undefined : Object.values(shippingList.entities).filter((shippingEntry): shippingEntry is Exclude<typeof shippingEntry, undefined> => !!shippingEntry);
    
    
    
    // if no selected shipping method => auto select the cheapest one:
    useEffect(() => {
        if (selectedShipping) return; // already selected => ignore
        
        
        
        // find the cheapest shipping cost:
        const orderedConstAscending = (
            filteredShippingList
            ?.map((shippingEntry) => ({
                id                 : `${shippingEntry.id}`,
                totalShippingCost : calculateShippingCost(totalProductWeight, shippingEntry) ?? -1, // -1 means: no need to ship (digital products)
            }))
            ?.sort((a, b) => a.totalShippingCost - b.totalShippingCost) // -1 means: no need to ship (digital products)
        );
        
        if (orderedConstAscending && orderedConstAscending.length >= 1) {
            dispatch(setShippingProvider(orderedConstAscending[0].id));
        } // if
    }, [selectedShipping, filteredShippingList, totalProductWeight]);
    
    
    
    // jsx:
    return (
        <>
            {!!filteredShippingList && <List theme='primary' actionCtrl={true}>
                {filteredShippingList.map((shippingEntry) => {
                    const totalShippingCost = calculateShippingCost(totalProductWeight, shippingEntry);
                    return {
                        totalShippingCost,
                        ...shippingEntry,
                    };
                })
                .sort(({totalShippingCost: a}, {totalShippingCost: b}): number => (a ?? 0) - (b ?? 0))
                .map(({totalShippingCost, ...shippingEntry}) => {
                    const isActive           = `${shippingEntry.id}` === shippingProvider;
                    
                    
                    
                    // jsx:
                    return (
                        <ListItem
                            key={`${shippingEntry.id}`}
                            className={styles.optionEntryHeader}
                            
                            active={isActive}
                            onClick={() => dispatch(setShippingProvider(`${shippingEntry.id}`))}
                            
                            elmRef={isActive ? shippingMethodOptionRef : undefined}
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
                })}
            </List>}
        </>
    );
}



const Payment = () => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // context:
    const {countryList, billingAddressSectionRef} = useCheckoutState();
    
    
    
    // states:
    const {
        // states:
        isBusy,
    } = useCheckoutState();
    
    
    
    // states:
    const {
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
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <Section className={styles.paymentMethod} title='Payment Method'>
                <PaymentMethod />
            </Section>
            <Collapse className='collapse' expanded={paymentMethod !== 'paypal'} lazy={true}>
                <Section title='Billing Address' elmRef={billingAddressSectionRef}>
                    <p>
                        Select the address that matches your card or payment method.
                    </p>
                    <ExclusiveAccordion enabled={!isBusy} theme='primary' expandedListIndex={billingAsShipping ? 0 : 1} onExpandedChange={({expanded, listIndex}) => {
                        // conditions:
                        if (!expanded) return;
                        
                        
                        
                        // actions:
                        setBillingAsShipping(listIndex === 0);
                    }} listStyle='content'>
                        <AccordionItem label={<>
                            <RadioDecorator />
                            Same as shipping address
                        </>} listItemComponent={<ListItem className={styles.optionEntryHeader} />} bodyComponent={<Section className={styles.billingEntry} />} >
                            <ShippingAddressReview />
                        </AccordionItem>
                        <AccordionItem label={<>
                            <RadioDecorator />
                            Use a different billing address
                        </>} listItemComponent={<ListItem className={styles.optionEntryHeader} />} bodyComponent={<Section className={`${styles.billingEntry} ${styles.address}`} />} >
                            <ValidationProvider enableValidation={!billingAsShipping && billingValidation}>
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
                                    
                                    
                                    
                                    // events:
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
}
const PaymentMethod = () => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // context:
    const {
        // payment data:
        paymentToken,
        
        
        
        // sections:
        paymentCardSectionRef,
    } = useCheckoutState();
    
    
    
    // states:
    const {
        // states:
        isBusy,
    } = useCheckoutState();
    
    
    
    // states:
    const {
        // payment data:
        paymentMethod,
        setPaymentMethod,
    } = useCheckoutState();
    
    
    
    // jsx:
    const paymentMethodList : PaymentMethod[] = ['card', 'paypal', 'manual'];
    return (
        <PayPalScriptProvider options={{
            'client-id'         : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
            'data-client-token' : paymentToken?.paymentToken,
            currency            : 'USD',
            intent              : 'capture',
            components          : 'hosted-fields,buttons',
        }}>
            <p>
                All transactions are secure and encrypted.
            </p>
            <ExclusiveAccordion enabled={!isBusy} theme='primary' expandedListIndex={Math.max(0, paymentMethodList.findIndex((option) => (option === paymentMethod)))} onExpandedChange={({expanded, listIndex}) => {
                // conditions:
                if (!expanded) return;
                
                
                
                // actions:
                setPaymentMethod(paymentMethodList[listIndex]);
            }} listStyle='content'>
                <AccordionItem label={<>
                    <RadioDecorator />
                    Credit Card
                </>} listItemComponent={<ListItem className={styles.optionEntryHeader} />} bodyComponent={<Section className={styles.paymentEntryCard} elmRef={paymentCardSectionRef} />} /*lazy={true} causes error*/ >
                    <PaymentMethodCard />
                </AccordionItem>
                <AccordionItem label={<>
                    <RadioDecorator />
                    PayPal
                    </>} listItemComponent={<ListItem className={styles.optionEntryHeader} />} bodyComponent={<Section className={styles.paymentEntryPaypal} />} /*lazy={true} causes error*/ >
                    <PaymentMethodPaypal />
                </AccordionItem>
                <AccordionItem label={<>
                    <RadioDecorator />
                    Bank Transfer
                    </>} listItemComponent={<ListItem className={styles.optionEntryHeader} />} bodyComponent={<Section className={styles.paymentEntryManual} />} /*lazy={true} causes error*/ >
                    <PaymentMethodManual />
                </AccordionItem>
            </ExclusiveAccordion>
        </PayPalScriptProvider>
    );
}
const PaymentMethodCard = () => {
    // context:
    const {cardholderInputRef, doPlaceOrder} = useCheckoutState();
    
    
    
    // states:
    const {
        // payment data:
        paymentValidation,
        paymentMethod,
    } = useCheckoutState();
    
    
    
    // refs:
    const safeSignRef = useRef<HTMLElement|null>(null);
    const nameSignRef = useRef<HTMLElement|null>(null);
    const dateSignRef = useRef<HTMLElement|null>(null);
    const cscSignRef  = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    return (
        <PayPalHostedFieldsProvider styles={hostedFieldsStyle} createOrder={doPlaceOrder}>
            <ValidationProvider enableValidation={paymentValidation}>
                <InputWithLabel
                    // appearances:
                    icon='credit_card'
                    
                    
                    
                    // classes:
                    className='number'
                    
                    
                    
                    // components:
                    inputComponent={
                        <PayPalHostedFieldExtended
                            className='hostedField'
                            
                            id='cardNumber'
                            hostedFieldType='number'
                            options={{
                                selector: '#cardNumber',
                                placeholder: 'Card Number',
                            }}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={
                        <Label theme='success' mild={true} className='solid' elmRef={safeSignRef}>
                            <Icon icon='lock' />
                            <Tooltip className='tooltip' theme='warning' floatingOn={safeSignRef}>
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
                        <TextInput placeholder='Cardholder Name' inputMode='text' required autoComplete='cc-name' autoCapitalize='words' elmRef={cardholderInputRef} />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={
                        <Label theme='success' mild={true} className='solid' elmRef={nameSignRef}>
                            <Icon icon='help' />
                            <Tooltip className='tooltip' theme='warning' floatingOn={nameSignRef}>
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
                            className='hostedField'
                            
                            id='cardExpires'
                            hostedFieldType='expirationDate'
                            options={{
                                selector: '#cardExpires',
                                placeholder: 'MM / YY',
                            }}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={
                        <Label theme='success' mild={true} className='solid' elmRef={dateSignRef}>
                            <Icon icon='help' />
                            <Tooltip className='tooltip' theme='warning' floatingOn={dateSignRef}>
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
                            className='hostedField'
                            
                            id='cardCvv'
                            hostedFieldType='cvv'
                            options={{
                                selector: '#cardCvv',
                                placeholder: 'Security Code',
                            }}
                        />
                    }
                    
                    
                    
                    // children:
                    childrenAfter={
                        <Label theme='success' mild={true} className='solid' elmRef={cscSignRef}>
                            <Icon icon='help' />
                            <Tooltip className='tooltip' theme='warning' floatingOn={cscSignRef}>
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
                    <CardPaymentButton />
                </PortalToNavCheckoutSection>}
            </ValidationProvider>
        </PayPalHostedFieldsProvider>
    );
}
const PaymentMethodPaypal = () => {
    // context:
    const {doPlaceOrder, doMakePayment} = useCheckoutState();
    
    
    
    // states:
    const checkoutState = useCheckoutState();
    const {
        // actions:
        doTransaction,
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
        console.log('data', data);
        // prevents the shipping_address DIFFERENT than previously inputed shipping_address:
        const shipping_address = data.shipping_address;
        if (shipping_address) {
            const shippingFieldMap = new Map([
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
                    console.log('unknown shipping field: ', shippingField);
                    return actions.reject();
                } // if
                const originShippingValue = checkoutState[mappedShippingField as keyof typeof checkoutState];
                if (originShippingValue !== shippingValue) {
                    console.log(`DIFF: ${shippingField} = ${shippingValue} <==> ${mappedShippingField} = ${originShippingValue}`)
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
                createOrder={doPlaceOrder}
                onApprove={handleFundApproved}
                onShippingChange={handleShippingChange}
            />
        </>
    );
}
const PaymentMethodManual = () => {
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
                <ManualPaymentButton />
            </PortalToNavCheckoutSection>}
        </>
    );
}
const CardPaymentButton = () => {
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
        
        
        
        // sections:
        billingAddressSectionRef,
        paymentCardSectionRef,
        
        
        
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
    const handlePayButtonClicked = useEvent(async () => {
        if (typeof(hostedFields.cardFields?.submit) !== 'function') return; // validate that `submit()` exists before using it
        const submitCardData = hostedFields.cardFields?.submit;
        doTransaction(async () => {
            try {
                // submit card data to PayPal_API to get authentication:
                const paypalAuthentication = await submitCardData({
                    // trigger 3D Secure authentication:
                    contingencies: ['SCA_WHEN_REQUIRED'],
                    
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
                console.log('paypalAuthentication: ', paypalAuthentication);
                
                
                
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
        <ButtonIcon className='next payNow' enabled={!isBusy} icon={!isBusy ? 'monetization_on' : 'busy'} theme='primary' size='lg' gradient={true} onClick={handlePayButtonClicked}>
            Pay Now
        </ButtonIcon>
    );
}
const ManualPaymentButton = () => {
    // states:
    const {
        // states:
        isBusy,
        
        
        
        // billing data:
        billingAsShipping,
        
        
        
        // sections:
        billingAddressSectionRef,
        
        
        
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
    const handleFinishOrderButtonClicked = useEvent(async () => {
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
        <ButtonIcon className='next finishOrder' enabled={!isBusy} icon={!isBusy ? 'done' : 'busy'} theme='primary' size='lg' gradient={true} onClick={handleFinishOrderButtonClicked}>
            Finish Order
        </ButtonIcon>
    );
}
interface PortalToNavCheckoutSectionProps {
    children : React.ReactNode
}
const PortalToNavCheckoutSection = (props: PortalToNavCheckoutSectionProps) => {
    // context:
    const {navCheckoutSectionElm} = useCheckoutState();
    
    
    
    // dom effects:
    // delays the rendering of portal until the page is fully hydrated
    const [isHydrated, setIsHydrated] = useState<boolean>(false);
    useEffect(() => {
        setIsHydrated(true);
    }, []);
    
    
    
    // jsx:
    return (
        <>
            {isHydrated && !!navCheckoutSectionElm?.current && ReactDOM.createPortal(
                props.children,
                navCheckoutSectionElm.current
            )}
        </>
    );
}



const PaymentPending = () => {
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
                <Alert theme='success' expanded={true} controlComponent={<></>}>
                    <p className='h5'>
                        Your order has been confirmed.
                    </p>
                    <p>
                        You&apos;ll receive a confirmation email with your order number shortly.
                    </p>
                    <p>
                        Please <strong>follow the payment instructions</strong> sent to your email: <strong style={{wordBreak: 'break-all'}}>{customerEmail}</strong>.
                    </p>
                </Alert>
            </Section>
            <Section tag='aside' className={styles.orderReview}>
                <OrderReviewCompleted />
            </Section>
        </>
    );
}
const Paid = () => {
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
                <Alert theme='success' expanded={true} controlComponent={<></>}>
                    <p className='h5'>
                        Your order has been confirmed and we have received your payment.
                    </p>
                    <p>
                        You&apos;ll receive a confirmation email with your order number shortly to: <strong style={{wordBreak: 'break-all'}}>{customerEmail}</strong>.
                    </p>
                </Alert>
            </Section>
            <Section tag='aside' className={styles.orderReview}>
                <OrderReviewCompleted />
            </Section>
        </>
    );
}

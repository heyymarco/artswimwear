import Head from 'next/head'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.scss'
import { Main } from '@/components/sections/Main'
import { Accordion, AccordionItem, Badge, BasicProps, Busy, ButtonIcon, Check, Container, controlValues, Details, DropdownListButton, EditableTextControl, EditableTextControlProps, EmailInput, ExclusiveAccordion, Group, Icon, Label, List, ListItem, Radio, TelInput, TextInput, Tooltip, useWindowResizeObserver, VisuallyHidden, WindowResizeCallback } from '@reusable-ui/components'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'
import { CountryEntry, PriceEntry, ProductEntry, ShippingEntry, useGeneratePaymentToken, useGetCountryList, useGetPriceList, useGetProductList, useGetShippingList, usePlaceOrder, useMakePayment } from '@/store/features/api/apiSlice'
import { formatCurrency } from '@/libs/formatters'
import ProductImage, { ProductImageProps } from '@/components/ProductImage'
import Link from 'next/link'
import { Section } from '@/components/sections/Section'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CartEntry, selectCartItems, showCart } from '@/store/features/cart/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AccessibilityProvider, breakpoints, colorValues, typos, typoValues, useEvent, ValidationProvider } from '@reusable-ui/core'
import { CheckoutStep, selectCheckoutProgress, selectCheckoutState, setCheckoutStep, setMarketingOpt, setPaymentToken, setShippingAddress, setShippingCity, setShippingCountry, setShippingEmail, setShippingFirstName, setShippingLastName, setShippingPhone, setShippingProvider, setShippingValidation, setShippingZip, setShippingZone, PaymentToken, setPaymentMethod, setBillingAddress, setBillingCity, setBillingCountry, setBillingFirstName, setBillingLastName, setBillingPhone, setBillingZip, setBillingZone, setBillingAsShipping, setBillingValidation, setPaymentCardValidation, setPaymentIsProcessing } from '@/store/features/checkout/checkoutSlice'
import { EntityState } from '@reduxjs/toolkit'
import type { HostedFieldsEvent, HostedFieldsHostedFieldsFieldName } from '@paypal/paypal-js';
import { PayPalScriptProvider, PayPalButtons, PayPalHostedFieldsProvider, PayPalHostedField, usePayPalHostedFields, PayPalHostedFieldProps } from '@paypal/react-paypal-js'
import { calculateShippingCost } from '@/libs/utilities';
import AddressField from '@/components/AddressFields'



// const inter = Inter({ subsets: ['latin'] })
const useCheckoutStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'@/styles/checkout')
, { id: 'checkout' });



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
    const handleFocusBlur = useEvent((event: HostedFieldsEvent) => {
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
    
    
    
    // jsx:
    return (
        <EditableTextControl
            {...restEditableTextControlProps}
            
            tabIndex = {-1}
            
            focused  = {isFocused ?? false}
            isValid  = {isValid   ?? null }
        >
            <PayPalHostedField
                {...{
                    hostedFieldType,
                    options,
                    id,
                }}
            />
        </EditableTextControl>
    );
}



interface ICheckoutContext {
    cartItems                 : CartEntry[]
    hasCart                   : boolean
    checkoutStep              : CheckoutStep
    checkoutProgress          : number
    
    priceList                 : EntityState<PriceEntry>    | undefined
    productList               : EntityState<ProductEntry>  | undefined
    countryList               : EntityState<CountryEntry>  | undefined
    shippingList              : EntityState<ShippingEntry> | undefined
    
    isLoading                 : boolean
    isError                   : boolean
    isCartDataReady           : boolean
    
    isDesktop                 : boolean
    
    regularCheckoutSectionRef : React.MutableRefObject<HTMLElement|null>      | undefined
    shippingMethodOptionRef   : React.MutableRefObject<HTMLElement|null>      | undefined
    billingAddressSectionRef  : React.MutableRefObject<HTMLElement|null>      | undefined
    paymentCardSectionRef     : React.MutableRefObject<HTMLElement|null>      | undefined
    
    shippingEmailInputRef     : React.MutableRefObject<HTMLInputElement|null> | undefined
    shippingAddressInputRef   : React.MutableRefObject<HTMLInputElement|null> | undefined
    cardholderInputRef        : React.MutableRefObject<HTMLInputElement|null> | undefined
    
    paymentToken              : PaymentToken|undefined
    handlePlaceOrder          : () => Promise<string>
    
    placeOrderApi             : ReturnType<typeof usePlaceOrder>
    makePaymentApi            : ReturnType<typeof useMakePayment>
}
const CheckoutContext = createContext<ICheckoutContext>({
    cartItems                 : [],
    hasCart                   : false,
    checkoutStep              : 'info',
    checkoutProgress          : 0,
    
    priceList                 : undefined,
    productList               : undefined,
    countryList               : undefined,
    shippingList              : undefined,
    
    isLoading                 : false,
    isError                   : false,
    isCartDataReady           : false,
    
    isDesktop                 : false,
    
    regularCheckoutSectionRef : undefined,
    shippingMethodOptionRef   : undefined,
    billingAddressSectionRef  : undefined,
    paymentCardSectionRef     : undefined,
    
    shippingEmailInputRef     : undefined,
    shippingAddressInputRef   : undefined,
    cardholderInputRef        : undefined,
    
    paymentToken              : undefined,
    handlePlaceOrder          : undefined as any,
    
    placeOrderApi             : undefined as any,
    makePaymentApi            : undefined as any,
});
const useCheckout = () => useContext(CheckoutContext);

export default function Checkout() {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // stores:
    const cartItems        = useSelector(selectCartItems);
    const checkoutState    = useSelector(selectCheckoutState);
    const {
        checkoutStep,
        paymentToken : existingPaymentToken,
    } = checkoutState;
    const {
        checkoutStep          : _checkoutStep,          // remove
        
        shippingValidation    : _shippingValidation,    // remove
        
        billingAsShipping     : _billingAsShipping,     // remove
        billingValidation     : _billingValidation,     // remove
        
        paymentMethod         : _paymentMethod,         // remove
        paymentToken          : _paymentToken,          // remove
        paymentCardValidation : _paymentCardValidation, // remove
        paymentIsProcessing   : _paymentIsProcessing,   // remove
    ...shippingAddressAndBillingAddress} = checkoutState;
    const checkoutProgress = useSelector(selectCheckoutProgress);
    const hasCart = !!cartItems.length;
    const dispatch = useDispatch();
    
    
    
    // apis:
    const                        {data: priceList      , isLoading: isLoading1, isError: isError1}  = useGetPriceList();
    const                        {data: productList    , isLoading: isLoading2, isError: isError2}  = useGetProductList();
    const                        {data: countryList    , isLoading: isLoading3, isError: isError3}  = useGetCountryList();
    const                        {data: shippingList   , isLoading: isLoading4, isError: isError4}  = useGetShippingList();
    const [generatePaymentToken, {data: newPaymentToken, isLoading: isLoading5, isError: isError5}] = useGeneratePaymentToken();
    
    const isLoading       = isLoading1 || isLoading2 || isLoading3 || isLoading4 ||  !existingPaymentToken;
    const isError         = isError1   || isError2   || isError3   || isError4   || (!existingPaymentToken && isError5);
    const isCartDataReady = hasCart && !!priceList && !!productList && !!countryList && !!shippingList;
    
    
    
    // dom effects:
    const isPaymentTokenInitialized = useRef<boolean>(false);
    useEffect(() => {
        // conditions:
        if (isLoading5) return;
        
        
        
        // setups:
        let cancelRefresh : ReturnType<typeof setTimeout>|undefined = undefined;
        if (!isPaymentTokenInitialized.current) {
            isPaymentTokenInitialized.current = true;
            
            // the first time to generate a new token:
            console.log('initial: generate a new token');
            generatePaymentToken();
        }
        else if (isError5) {
            // retry to generate a new token:
            console.log('schedule retry : generate a new token');
            cancelRefresh = setTimeout(() => {
                console.log('retry : generate a new token');
                generatePaymentToken();
            }, 60 * 1000);
        }
        else if (newPaymentToken) {
            // replace the expiring one:
            dispatch(setPaymentToken(newPaymentToken));
            
            
            
            // schedule to generate a new token:
            console.log('schedule renew : generate a new token');
            cancelRefresh = setTimeout(() => {
                console.log('renew : generate a new token');
                generatePaymentToken();
            }, (newPaymentToken.expires - Date.now()) * 1000);
        } // if
        
        
        
        // cleanups:
        return () => {
            if (cancelRefresh) clearTimeout(cancelRefresh);
        };
    }, [newPaymentToken, isLoading5, isError5]);
    
    
    // states:
    const [isDesktop, setIsDesktop] = useState<boolean>(false); // mobile first
    
    // dom effects:
    const handleWindowResize = useEvent<WindowResizeCallback>(({inlineSize: mediaCurrentWidth}) => {
        const breakpoint = breakpoints.lg;
        const newIsDesktop = (!!breakpoint && (mediaCurrentWidth >= breakpoint));
        if (isDesktop === newIsDesktop) return;
        setIsDesktop(newIsDesktop);
    });
    useWindowResizeObserver(handleWindowResize);
    
    
    
    // refs:
    const regularCheckoutSectionRef = useRef<HTMLElement|null>(null);
    const shippingMethodOptionRef   = useRef<HTMLElement|null>(null);
    const billingAddressSectionRef  = useRef<HTMLElement|null>(null);
    const paymentCardSectionRef     = useRef<HTMLElement|null>(null);
    
    const shippingEmailInputRef     = useRef<HTMLInputElement|null>(null);
    const shippingAddressInputRef   = useRef<HTMLInputElement|null>(null);
    const cardholderInputRef        = useRef<HTMLInputElement|null>(null);
    
    
    
    // apis:
    const placeOrderApi  = usePlaceOrder();
    const [placeOrder]   = placeOrderApi;
    
    const makePaymentApi = useMakePayment();
    
    
    
    // handlers:
    const handlePlaceOrder = useEvent(async (): Promise<string> => {
        console.log('placing order!');
        try {
            const paypalOrderData = await placeOrder({
                items : cartItems,                   // cart item(s)
                ...shippingAddressAndBillingAddress, // shipping address + billing address + marketingOpt
            }).unwrap();
            if (paypalOrderData.id && (paypalOrderData.status === 'CREATED')) {
                console.log('order data: ', paypalOrderData);
                return paypalOrderData.id;
            }
            else {
                // TODO handle error
                return '';
            } // if
        }
        catch {
            // TODO: handle error
            return '';
        } // try
    });
    
    
    
    const checkoutData = useMemo<ICheckoutContext>(() => ({
        cartItems,
        hasCart,
        checkoutStep,
        checkoutProgress,
        
        priceList,
        productList,
        countryList,
        shippingList,
        
        isLoading,
        isError,
        isCartDataReady,
        
        isDesktop,
        
        regularCheckoutSectionRef, // stable ref
        shippingMethodOptionRef,   // stable ref
        billingAddressSectionRef,  // stable ref
        paymentCardSectionRef,     // stable ref
        
        shippingEmailInputRef,     // stable ref
        shippingAddressInputRef,   // stable ref
        cardholderInputRef,        // stable ref
        
        paymentToken: existingPaymentToken,
        handlePlaceOrder,          // stable ref
        
        placeOrderApi,
        makePaymentApi,
    }), [
        cartItems,
        hasCart,
        checkoutStep,
        checkoutProgress,
        
        priceList,
        productList,
        countryList,
        shippingList,
        
        isLoading,
        isError,
        isCartDataReady,
        
        isDesktop,
        
        // regularCheckoutSectionRef, // stable ref
        // shippingMethodOptionRef,   // stable ref
        // billingAddressSectionRef,  // stable ref
        // paymentCardSectionRef,     // stable ref
        
        // shippingEmailInputRef,     // stable ref
        // shippingAddressInputRef,   // stable ref
        // cardholderInputRef,        // stable ref
        
        existingPaymentToken,
        // handlePlaceOrder,          // stable ref
        
        placeOrderApi,
        makePaymentApi,
    ]);
    
    
    
    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name='description' content='Generated by create next app' />
            </Head>
            <Main nude={true}>
                <CheckoutContext.Provider value={checkoutData}>
                    {(isLoading || isError || !hasCart) && <Section className={styles.loading} theme='secondary'>
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
                            : isLoading
                            ? <Busy theme='primary' size='lg' />
                            : <p>Oops, an error occured!</p>
                        }
                    </Section>}
                    
                    {isCartDataReady && <Container className={`${styles.layout} ${checkoutStep}`} theme='secondary'>
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
                            
                            {(checkoutStep === 'info') && <Section className={styles.checkout}>
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
                            
                            {(checkoutStep === 'shipping') && <Section className={styles.shippingMethod} title='Shipping Method'>
                                <ShippingMethod />
                            </Section>}
                            
                            {(checkoutStep === 'payment') && <Section className={styles.payment} title='Payment'>
                                <Payment />
                            </Section>}
                        </div>
                        
                        <Section tag='nav' className={styles.navCheckout}>
                            <NavCheckout />
                        </Section>
                        
                        <hr className={styles.vertLine} />
                    </Container>}
                </CheckoutContext.Provider>
            </Main>
        </>
    )
}



interface ProductImageWithStatusProps extends ProductImageProps {
    status : string|number
}
const ProductImageWithStatus = (props: ProductImageWithStatusProps) => {
    const [imageRef, setImageRef] = useState<HTMLElement|null>(null);
    
    const {
        status,
    ...restProductImageProps} = props;
    
    return (
        <>
            <ProductImage
                {...restProductImageProps}
                elmRef={setImageRef}
            />
            <Badge theme='danger' badgeStyle='pill' floatingOn={imageRef} floatingPlacement='right-start' floatingOffset={-12} floatingShift={-3}>
                {status}
            </Badge>
        </>
    )
}



interface WithDetailsProps {
    children  : React.ReactNode
}
const WithDetails = ({children}: WithDetailsProps) => {
    // context:
    const {isDesktop} = useCheckout();
    
    
    
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
    const {isDesktop, checkoutProgress} = useCheckout();
    
    
    
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
    // context:
    const {checkoutStep, checkoutProgress, regularCheckoutSectionRef} = useCheckout();
    
    
    
    // stores:
    const {
        paymentIsProcessing,
    } = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
    // utilities:
    const prevAction = [
        { text: 'Return to cart'       , action: () => dispatch(showCart(true)) },
        { text: 'Return to information', action: () => dispatch(setCheckoutStep('info')) },
        { text: 'Return to shipping'   , action: () => dispatch(setCheckoutStep('shipping')) },
    ][checkoutProgress];
    
    const nextAction = [
        { text: 'Continue to shipping' , action: async () => {
            // validate:
            // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
            await dispatch(setShippingValidation(true));
            const invalidFields = regularCheckoutSectionRef?.current?.querySelectorAll?.(invalidSelector);
            if (invalidFields?.length) { // there is an/some invalid field
                // TODO: show modal error message
                console.log('there is an/some invalid field', invalidFields);
                return;
            } // if
            
            
            
            // next:
            dispatch(setCheckoutStep('shipping'));
        }},
        { text: 'Continue to payment'  , action: () => dispatch(setCheckoutStep('payment')) },
        { text: 'Pay Now' , action: () => {
            // payment action
        }},
    ][checkoutProgress];
    
    
    
    // jsx:
    return (
        <>
            <ButtonIcon enabled={!paymentIsProcessing} className='back' icon='arrow_back' theme='primary' size='md' buttonStyle='link' onClick={prevAction.action}>
                {prevAction.text}
            </ButtonIcon>
            {(checkoutStep !== 'payment') && <ButtonIcon enabled={!paymentIsProcessing} className='next' icon='arrow_forward' theme='primary' size='lg' gradient={true} iconPosition='end' onClick={nextAction.action}>
                {nextAction.text}
            </ButtonIcon>}
        </>
    );
}



const RegularCheckout = () => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // context:
    const {countryList, shippingEmailInputRef, shippingAddressInputRef } = useCheckout();
    
    
    
    // stores:
    const {
        marketingOpt,
        
        
        
        shippingValidation,
        
        shippingFirstName,
        shippingLastName,
        
        shippingPhone,
        shippingEmail,
        
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
    } = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
    return (
        <ValidationProvider enableValidation={shippingValidation}>
            <Section className='contact' title='Contact Information'>
                <Group className='email'>
                    <Label theme='secondary' mild={false} className='solid'>
                        <Icon icon='email' theme='primary' mild={true} />
                    </Label>
                    <EmailInput placeholder='Email' required autoComplete='shipping email' value={shippingEmail} onChange={({target:{value}}) => dispatch(setShippingEmail(value))} elmRef={shippingEmailInputRef} />
                </Group>
                <Check      className='marketingOpt' enableValidation={false}                                             active={marketingOpt} onActiveChange={({active})                 => dispatch(setMarketingOpt(active))}      >
                    Email me with news and offers
                </Check>
            </Section>
            <Section className={styles.address} title='Shipping Address'>
                <AddressField
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
                    onFirstNameChange = {({target:{value}}) => dispatch(setShippingFirstName(value))}
                    onLastNameChange  = {({target:{value}}) => dispatch(setShippingLastName(value))}
                    
                    onPhoneChange     = {({target:{value}}) => dispatch(setShippingPhone(value))}
                    
                    onAddressChange   = {({target:{value}}) => dispatch(setShippingAddress(value))}
                    onCityChange      = {({target:{value}}) => dispatch(setShippingCity(value))}
                    onZoneChange      = {({target:{value}}) => dispatch(setShippingZone(value))}
                    onZipChange       = {({target:{value}}) => dispatch(setShippingZip(value))}
                    onCountryChange   = {({target:{value}}) => dispatch(setShippingCountry(value))}
                />
            </Section>
        </ValidationProvider>
    );
}



const OrderSummary = () => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // context:
    const {cartItems, priceList, productList, shippingList} = useCheckout();
    
    
    
    // stores:
    const {
        shippingProvider,
    } = useSelector(selectCheckoutState);
    
    const selectedShipping    = shippingList?.entities?.[shippingProvider ?? ''];
    
    const totalProductPrices  = cartItems.reduce((accum, item) => {
        const productUnitPrice = priceList?.entities?.[item.productId]?.price;
        if (!productUnitPrice) return accum;
        return accum + (productUnitPrice * item.quantity);
    }, 0);
    
    const totalProductWeights = selectedShipping && cartItems.reduce((accum, item) => {
        const productUnitWeight = priceList?.entities?.[item.productId]?.shippingWeight;
        if (!productUnitWeight) return accum;
        return accum + (productUnitWeight * item.quantity);
    }, 0);
    const totalShippingCosts  = selectedShipping && calculateShippingCost(totalProductWeights, selectedShipping);
    
    
    
    // jsx:
    return (
        <>
            <WithDetails>
                <List className='orderList' listStyle='flat'>
                    {cartItems.map((item) => {
                        const productUnitPrice = priceList?.entities?.[item.productId]?.price;
                        const product          = productList?.entities?.[item.productId];
                        return (
                            <ListItem key={item.productId} className={styles.productEntry}
                                enabled={!!product}
                                theme={!product ? 'danger' : undefined}
                                mild={!product ? false : undefined}
                            >
                                <h3 className='title h6'>{product?.name ?? 'PRODUCT WAS REMOVED'}</h3>
                                <ProductImageWithStatus
                                    alt={product?.name ?? ''}
                                    src={product?.image ? `/products/${product?.name}/${product?.image}` : undefined}
                                    sizes='64px'
                                    
                                    status={item.quantity}
                                />
                                <p className='subPrice currencyBlock'>
                                    {!product && <>This product was removed before you purcase it</>}
                                    <span className='currency'>{formatCurrency(productUnitPrice ? (productUnitPrice * item.quantity) : undefined)}</span>
                                </p>
                            </ListItem>
                        )
                    })}
                </List>
            </WithDetails>
            <hr />
            <p className='currencyBlock'>
                Subtotal products: <span className='currency'>
                    {formatCurrency(totalProductPrices)}
                </span>
            </p>
            <p className='currencyBlock'>
                Shipping: <span className='currency'>
                    {!!selectedShipping ? formatCurrency(totalShippingCosts) : 'calculated at next step'}
                </span>
            </p>
            <hr />
            <p className='currencyBlock'>
                Total: <span className='currency'>
                    {!!selectedShipping ? formatCurrency(totalProductPrices + (totalShippingCosts ?? 0)) : 'calculated at next step'}
                </span>
            </p>
        </>
    );
}
const OrderReview = () => {
    // context:
    const {checkoutStep, shippingEmailInputRef, shippingAddressInputRef, shippingMethodOptionRef} = useCheckout();
    
    
    
    // stores:
    const {
        paymentIsProcessing,
    } = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
    // jsx:
    return (
        <AccessibilityProvider enabled={!paymentIsProcessing}>
            <table>
                <tbody>
                    <tr>
                        <td>Contact</td>
                        <td><ShippingContactReview /></td>
                        <td>
                            <ButtonIcon icon='edit' theme='primary' size='sm' buttonStyle='link' onClick={() => {
                                dispatch(setCheckoutStep('info'));
                                setTimeout(() => {
                                    shippingEmailInputRef?.current?.focus?.();
                                }, 100);
                            }}>Change</ButtonIcon>
                        </td>
                    </tr>
                    <tr>
                        <td>Ship to</td>
                        <td><ShippingAddressReview /></td>
                        <td>
                            <ButtonIcon icon='edit' theme='primary' size='sm' buttonStyle='link' onClick={() => {
                                dispatch(setCheckoutStep('info'));
                                setTimeout(() => {
                                    shippingAddressInputRef?.current?.focus?.();
                                }, 100);
                            }}>Change</ButtonIcon>
                        </td>
                    </tr>
                    {(checkoutStep !== 'shipping') && <tr>
                        <td>Method</td>
                        <td><ShippingMethodReview /></td>
                        <td>
                            <ButtonIcon icon='edit' theme='primary' size='sm' buttonStyle='link' onClick={() => {
                                dispatch(setCheckoutStep('shipping'));
                                setTimeout(() => {
                                    shippingMethodOptionRef?.current?.focus?.();
                                }, 100);
                            }}>Change</ButtonIcon>
                        </td>
                    </tr>}
                </tbody>
            </table>
        </AccessibilityProvider>
    );
}
const ShippingContactReview = () => {
    // stores:
    const {
        shippingEmail,
    } = useSelector(selectCheckoutState);
    
    
    
    // jsx:
    return (
        <>
            {shippingEmail}
        </>
    );
}
const ShippingAddressReview = () => {
    // context:
    const {countryList} = useCheckout();
    
    
    
    // stores:
    const {
        shippingEmail,
        
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        shippingProvider,
    } = useSelector(selectCheckoutState);
    
    
    
    return (
        <>
            {`${shippingAddress}, ${shippingCity}, ${shippingZone} (${shippingZip}), ${countryList?.entities?.[shippingCountry ?? '']?.name}`}
        </>
    );
}
const ShippingMethodReview = () => {
    // context:
    const {shippingList} = useCheckout();
    
    
    
    // stores:
    const {
        shippingProvider,
    } = useSelector(selectCheckoutState);
    
    
    
    const selectedShipping = shippingList?.entities?.[shippingProvider ?? ''];
    
    
    
    // jsx:
    return (
        <>
            {`${selectedShipping?.name}${!selectedShipping?.estimate ? '' : ` - ${selectedShipping?.estimate}`}`}
        </>
    );
}



const ShippingMethod = () => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // context:
    const {cartItems, priceList, shippingList, shippingMethodOptionRef} = useCheckout();
    
    
    
    // stores:
    const {
        shippingProvider,
    } = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
    const filteredShippingList = !shippingList ? undefined : Object.values(shippingList.entities).filter((shippingEntry): shippingEntry is Exclude<typeof shippingEntry, undefined> => !!shippingEntry);
    // const selectedShipping  = shippingList?.entities[shippingProvider ?? ''];
    
    
    
    const totalProductWeights = cartItems.reduce((accum, item) => {
        const productUnitWeight = priceList?.entities?.[item.productId]?.shippingWeight;
        if (!productUnitWeight) return accum;
        return accum + (productUnitWeight * item.quantity);
    }, 0);
    
    
    
    useEffect(() => {
        if (shippingProvider) return; // already set => ignore
        
        
        
        // find the cheapest shipping cost:
        const orderedConstAscending = (
            filteredShippingList
            ?.map((shippingEntry) => ({
                _id                : shippingEntry._id,
                totalShippingCosts : calculateShippingCost(totalProductWeights, shippingEntry) ?? -1, // -1 means: no need to ship (digital products)
            }))
            ?.sort((a, b) => a.totalShippingCosts - b.totalShippingCosts) // -1 means: no need to ship (digital products)
        );
        if (orderedConstAscending && orderedConstAscending.length >= 1) {
            dispatch(setShippingProvider(orderedConstAscending[0]._id));
            // console.log('shipping method has automatically set to cheapest: ', orderedConstAscending[0]._id);
        } // if
    }, [shippingProvider]);
    
    
    
    // jsx:
    return (
        <List theme='primary' actionCtrl={true}>
            {!!filteredShippingList && filteredShippingList.map((shippingEntry, index) => {
                const totalShippingCosts = calculateShippingCost(totalProductWeights, shippingEntry);
                const isActive           = filteredShippingList?.[index]?._id === shippingProvider;
                
                
                return (
                    <ListItem
                        key={index}
                        className={styles.shippingEntry}
                        
                        active={isActive}
                        onClick={() => dispatch(setShippingProvider(filteredShippingList?.[index]?._id ?? ''))}
                        
                        elmRef={isActive ? shippingMethodOptionRef : undefined}
                    >
                        <Radio className='indicator' enableValidation={false} inheritActive={true} outlined={true} nude={true} tabIndex={-1} />
                        <p className='name'>{shippingEntry.name}</p>
                        {!!shippingEntry.estimate && <p className='estimate'>Estimate: {shippingEntry.estimate}</p>}
                        <p className='cost'>
                            {formatCurrency(totalShippingCosts)}
                        </p>
                    </ListItem>
                );
            })}
        </List>
    );
}



const Payment = () => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // context:
    const {countryList, billingAddressSectionRef} = useCheckout();
    
    
    
    // stores:
    const {
        billingAsShipping,
        billingValidation,
        
        billingFirstName,
        billingLastName,
        
        billingPhone,
        billingEmail,
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
        
        
        
        paymentIsProcessing,
    } = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
    return (
        <>
            <Section title='Billing Address' elmRef={billingAddressSectionRef}>
                <p>
                    Select the address that matches your card or payment method.
                </p>
                <ExclusiveAccordion enabled={!paymentIsProcessing} theme='primary' expandedListIndex={billingAsShipping ? 0 : 1} onExpandedChange={({expanded, listIndex}) => {
                    // conditions:
                    if (!expanded) return;
                    
                    
                    
                    // actions:
                    dispatch(setBillingAsShipping(listIndex === 0));
                    if (listIndex === 0) dispatch(setBillingValidation(false));
                }} listStyle='content'>
                    <AccordionItem label={<>
                        <Radio className='indicator' enableValidation={false} inheritActive={true} outlined={true} nude={true} tabIndex={-1} />
                        Same as shipping address
                    </>} listItemComponent={<ListItem className={styles.optionEntryHeader} />} contentComponent={<Section className={styles.billingEntry} />} >
                        <ShippingAddressReview />
                    </AccordionItem>
                    <AccordionItem label={<>
                        <Radio className='indicator' enableValidation={false} inheritActive={true} outlined={true} nude={true} tabIndex={-1} />
                        Use a different billing address
                    </>} listItemComponent={<ListItem className={styles.optionEntryHeader} />} contentComponent={<Section className={`${styles.billingEntry} ${styles.address}`} />} >
                        <ValidationProvider enableValidation={!billingAsShipping && billingValidation}>
                            <AddressField
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
                                onFirstNameChange = {({target:{value}}) => dispatch(setBillingFirstName(value))}
                                onLastNameChange  = {({target:{value}}) => dispatch(setBillingLastName(value))}
                                
                                onPhoneChange     = {({target:{value}}) => dispatch(setBillingPhone(value))}
                                
                                onAddressChange   = {({target:{value}}) => dispatch(setBillingAddress(value))}
                                onCityChange      = {({target:{value}}) => dispatch(setBillingCity(value))}
                                onZoneChange      = {({target:{value}}) => dispatch(setBillingZone(value))}
                                onZipChange       = {({target:{value}}) => dispatch(setBillingZip(value))}
                                onCountryChange   = {({target:{value}}) => dispatch(setBillingCountry(value))}
                            />
                        </ValidationProvider>
                    </AccordionItem>
                </ExclusiveAccordion>
            </Section>
            <Section className={styles.paymentMethod} title='Payment Method'>
                <PaymentMethod />
            </Section>
        </>
    );
}
const PaymentMethod = () => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // context:
    const {paymentCardSectionRef, paymentToken} = useCheckout();
    
    
    
    // stores:
    const {
        paymentMethod,
        paymentIsProcessing,
    } = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
    // jsx:
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
            <ExclusiveAccordion enabled={!paymentIsProcessing} theme='primary' expandedListIndex={paymentMethod ?? 0} onExpandedChange={({expanded, listIndex}) => {
                // conditions:
                if (!expanded) return;
                
                
                
                // actions:
                dispatch(setPaymentMethod(listIndex));
                if (listIndex !== 0) dispatch(setPaymentCardValidation(false));
            }} listStyle='content'>
                <AccordionItem label={<>
                    <Radio className='indicator' enableValidation={false} inheritActive={true} outlined={true} nude={true} tabIndex={-1} />
                    Credit Card
                </>} listItemComponent={<ListItem className={styles.optionEntryHeader} />} contentComponent={<Section className={styles.paymentEntryCard} elmRef={paymentCardSectionRef} />} /*lazy={true} causes error*/ >
                    <PaymentMethodCard />
                </AccordionItem>
                <AccordionItem label={<>
                    <Radio className='indicator' enableValidation={false} inheritActive={true} outlined={true} nude={true} tabIndex={-1} />
                    PayPal
                    </>} listItemComponent={<ListItem className={styles.optionEntryHeader} />} contentComponent={<Section className={styles.paymentEntryPaypal} />} /*lazy={true} causes error*/ >
                    <PaymentMethodPaypal />
                </AccordionItem>
            </ExclusiveAccordion>
        </PayPalScriptProvider>
    );
}
const PaymentMethodPaypal = () => {
    // context:
    const {handlePlaceOrder} = useCheckout();
    
    
    
    // jsx:
    return (
        <>
            <p>
                Click the PayPal button below. You will be redirected to the PayPal website to complete the payment.
            </p>
            <PayPalButtons createOrder={handlePlaceOrder} />
        </>
    );
}
const PaymentMethodCard = () => {
    // context:
    const {cardholderInputRef, handlePlaceOrder} = useCheckout();
    
    
    
    // stores:
    const {
        paymentCardValidation,
    } = useSelector(selectCheckoutState);
    
    
    
    // refs:
    const safeSignRef = useRef<HTMLElement|null>(null);
    const nameSignRef = useRef<HTMLElement|null>(null);
    const dateSignRef = useRef<HTMLElement|null>(null);
    const cscSignRef  = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    return (
        <PayPalHostedFieldsProvider styles={hostedFieldsStyle} createOrder={handlePlaceOrder}>
            <ValidationProvider enableValidation={paymentCardValidation}>
                <Group className='number'>
                    <Label theme='secondary' mild={false} className='solid'>
                        <Icon icon='credit_card' theme='primary' mild={true} />
                    </Label>
                    <PayPalHostedFieldExtended
                        className='hostedField'
                        
                        id='cardNumber'
                        hostedFieldType='number'
                        options={{
                            selector: '#cardNumber',
                            placeholder: 'Card Number',
                        }}
                    />
                    <Label theme='success' mild={true} className='solid' elmRef={safeSignRef}>
                        <Icon icon='lock' />
                        <Tooltip className='tooltip' size='sm' floatingOn={safeSignRef}>
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
                </Group>
                <Group className='name'>
                    <Label theme='secondary' mild={false} className='solid'>
                        <Icon icon='person' theme='primary' mild={true} />
                    </Label>
                    <TextInput placeholder='Cardholder Name' inputMode='text' required autoComplete='cc-name' elmRef={cardholderInputRef} />
                    <Label theme='success' mild={true} className='solid' elmRef={nameSignRef}>
                        <Icon icon='help' />
                        <Tooltip className='tooltip' size='sm' floatingOn={nameSignRef}>
                            <p>
                                The owner name as printed on front card.
                            </p>
                        </Tooltip>
                    </Label>
                </Group>
                <Group className='expiry'>
                    <Label theme='secondary' mild={false} className='solid'>
                        <Icon icon='date_range' theme='primary' mild={true} />
                    </Label>
                    <PayPalHostedFieldExtended
                        className='hostedField'
                        
                        id='cardExpires'
                        hostedFieldType='expirationDate'
                        options={{
                            selector: '#cardExpires',
                            placeholder: 'MM / YY',
                        }}
                    />
                    <Label theme='success' mild={true} className='solid' elmRef={dateSignRef}>
                        <Icon icon='help' />
                        <Tooltip className='tooltip' size='sm' floatingOn={dateSignRef}>
                            <p>
                                The expiration date as printed on front card.
                            </p>
                        </Tooltip>
                    </Label>
                </Group>
                <Group className='csc'>
                    <Label theme='secondary' mild={false} className='solid'>
                        <Icon icon='fiber_pin' theme='primary' mild={true} />
                    </Label>
                    <PayPalHostedFieldExtended
                        className='hostedField'
                        
                        id='cardCvv'
                        hostedFieldType='cvv'
                        options={{
                            selector: '#cardCvv',
                            placeholder: 'Security Code',
                        }}
                    />
                    <Label theme='success' mild={true} className='solid' elmRef={cscSignRef}>
                        <Icon icon='help' />
                        <Tooltip className='tooltip' size='sm' floatingOn={cscSignRef}>
                            <p>
                                3-digit security code usually found on the back of your card.
                            </p>
                            <p>
                                American Express cards have a 4-digit code located on the front.
                            </p>
                        </Tooltip>
                    </Label>
                </Group>
                <hr className='horz' />
                <CardPaymentButton />
            </ValidationProvider>
        </PayPalHostedFieldsProvider>
    );
}
const CardPaymentButton = () => {
    // context:
    const {billingAddressSectionRef, paymentCardSectionRef, cardholderInputRef, placeOrderApi, makePaymentApi} = useCheckout();
    
    
    
    // stores:
    const {
        shippingFirstName : _shippingFirstName, // not implemented yet, because billingFirstName is not implemented
        shippingLastName  : _shippingLastName,  // not implemented yet, because billingLastName  is not implemented
        
        shippingPhone     : _shippingPhone,     // not implemented yet, because billingPhone     is not implemented
        shippingEmail     : _shippingEmail,     // not implemented yet, because billingEmail     is not implemented
        
        shippingCountry,
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        
        
        
        billingAsShipping,
        
        billingFirstName  : _billingFirstName,  // not implemented, already to use cardholderName
        billingLastName   : _billingLastName,   // not implemented, already to use cardholderName
        
        billingPhone      : _billingPhone,      // not implemented yet
        billingEmail      : _billingEmail,      // not implemented yet
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
        
        
        
        paymentIsProcessing,
    } = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
    // apis:
    const [makePayment] = makePaymentApi;
    
    
    
    // handlers:
    const hostedFields = usePayPalHostedFields();
    const handleMakePayment = async () => {
        console.log('check: ', hostedFields);
        
        
        
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        if (!billingAsShipping) await dispatch(setBillingValidation(true));
        await dispatch(setPaymentCardValidation(true));
        const invalidFields = [
            ...((!billingAsShipping ? billingAddressSectionRef?.current?.querySelectorAll?.(invalidSelector) : undefined) ?? []),
            ...(paymentCardSectionRef?.current?.querySelectorAll?.(invalidSelector) ?? []),
        ];
        if (invalidFields?.length) { // there is an/some invalid field
            // TODO: show modal error message
            console.log('there is an/some invalid field', invalidFields);
            return;
        } // if
        
        
        
        // next:
        if (typeof(hostedFields.cardFields?.submit) !== 'function') return; // validate that `submit()` exists before using it
        try {
            // update the UI:
            dispatch(setPaymentIsProcessing(true));
            
            
            
            // submit card data to PayPal_API to get authentication:
            const paypalAuthentication = await hostedFields.cardFields.submit({
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
            
            
            
            try {
                // then forward the authentication to backend_API to receive the fund:
                const data = await makePayment(paypalAuthentication).unwrap();
                // Two cases to handle:
                //   (1) Non-recoverable errors -> Show a failure message
                //   (2) Successful transaction -> Show confirmation or thank you
                // This example reads a v2/checkout/orders capture response, propagated from the server
                // You could use a different API or structure for your 'orderData'
                if (data.id) {
                    console.log('payment data: ', data);
                    return data.id;
                }
                else {
                    // TODO handle error
                    return '';
                } // if
            }
            catch {
                // TODO: handle error
                return '';
            } // try
        }
        catch {
            // TODO: handle payment authentication rejection
        }
        finally {
            // update the UI:
            dispatch(setPaymentIsProcessing(false));
        } // try
    }
    
    
    
    // jsx:
    return (
        <ButtonIcon icon={!paymentIsProcessing ? 'monetization_on' : 'busy'} enabled={!paymentIsProcessing} className='payNow' size='lg' gradient={true} onClick={handleMakePayment}>
            Pay Now
        </ButtonIcon>
    );
}

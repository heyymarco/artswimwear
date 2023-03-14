import Head from 'next/head'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.scss'
import { Main } from '@/components/sections/Main'
import { Accordion, AccordionItem, Badge, Busy, ButtonIcon, Check, Container, Details, DropdownListButton, EmailInput, ExclusiveAccordion, Group, Icon, Label, List, ListItem, Radio, TelInput, TextInput, Tooltip, useWindowResizeObserver, VisuallyHidden, WindowResizeCallback } from '@reusable-ui/components'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'
import { calculateShippingCost, CountryEntry, PriceEntry, ProductEntry, ShippingEntry, useGeneratePaymentTokenMutation, useGetCountryListQuery, useGetPriceListQuery, useGetProductListQuery, useGetShippingListQuery, useMakePaymentMutation } from '@/store/features/api/apiSlice'
import { formatCurrency } from '@/libs/formatters'
import ProductImage, { ProductImageProps } from '@/components/ProductImage'
import Link from 'next/link'
import { Section } from '@/components/sections/Section'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CartEntry, selectCartItems, showCart } from '@/store/features/cart/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { breakpoints, useEvent, ValidationProvider } from '@reusable-ui/core'
import { CheckoutStep, selectCheckoutProgress, selectCheckoutState, setCheckoutStep, setMarketingOpt, setPaymentToken, setShippingAddress, setShippingCity, setShippingCountry, setShippingEmail, setShippingFirstName, setShippingLastName, setShippingPhone, setShippingProvider, setShippingValidation, setShippingZip, setShippingZone, PaymentToken } from '@/store/features/checkout/checkoutSlice'
import { EntityState } from '@reduxjs/toolkit'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'



// const inter = Inter({ subsets: ['latin'] })
const useCheckoutStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'@/styles/checkout')
, { id: 'checkout' });



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
    shippingEmailInputRef     : React.MutableRefObject<HTMLInputElement|null> | undefined
    shippingAddressInputRef   : React.MutableRefObject<HTMLInputElement|null> | undefined
    shippingMethodOptionRef   : React.MutableRefObject<HTMLElement|null>      | undefined
    
    paymentToken              : PaymentToken|undefined
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
    shippingEmailInputRef     : undefined,
    shippingAddressInputRef   : undefined,
    shippingMethodOptionRef   : undefined,
    
    paymentToken              : undefined,
});
const useCheckout = () => useContext(CheckoutContext);

export default function Checkout() {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // stores:
    const cartItems        = useSelector(selectCartItems);
    const {
        checkoutStep,
        paymentToken : existingPaymentToken,
    }   = useSelector(selectCheckoutState);
    const checkoutProgress = useSelector(selectCheckoutProgress);
    const hasCart = !!cartItems.length;
    const dispatch = useDispatch();
    
    
    
    // apis:
    const                        {data: priceList      , isLoading: isLoading1, isError: isError1}  = useGetPriceListQuery();
    const                        {data: productList    , isLoading: isLoading2, isError: isError2}  = useGetProductListQuery();
    const                        {data: countryList    , isLoading: isLoading3, isError: isError3}  = useGetCountryListQuery();
    const                        {data: shippingList   , isLoading: isLoading4, isError: isError4}  = useGetShippingListQuery();
    const [generatePaymentToken, {data: newPaymentToken, isLoading: isLoading5, isError: isError5}] = useGeneratePaymentTokenMutation();
    
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
    const shippingEmailInputRef     = useRef<HTMLInputElement|null>(null);
    const shippingAddressInputRef   = useRef<HTMLInputElement|null>(null);
    const shippingMethodOptionRef   = useRef<HTMLElement|null>(null);
    
    
    
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
        
        regularCheckoutSectionRef,
        shippingEmailInputRef,
        shippingAddressInputRef,
        shippingMethodOptionRef,
        
        paymentToken: existingPaymentToken,
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
    ]);
    
    
    
    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
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
                                <Section className={styles.expressCheckout} title='Express Checkout'>
                                </Section>
                                
                                <div className={styles.checkoutAlt}>
                                    <hr />
                                    <span>OR</span>
                                    <hr />
                                </div>
                                
                                <Section elmRef={regularCheckoutSectionRef} className={styles.regularCheckout} title='Regular Checkout'>
                                    <RegularCheckout />
                                </Section>
                            </Section>}
                            
                            {(checkoutStep === 'shipping') && <Section className={styles.shippingMethod} title='Shipping Method'>
                                <ShippingMethod />
                            </Section>}
                            
                            {(checkoutStep === 'payment') && <Section className={styles.paymentMethod} title='Payment Method'>
                                <PaymentMethod />
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
    const dispatch = useDispatch();
    
    
    
    // utilities:
    const prevAction = [
        { text: 'Return to cart'       , action: () => dispatch(showCart(true)) },
        { text: 'Return to information', action: () => dispatch(setCheckoutStep('info')) },
        { text: 'Return to shipping'   , action: () => dispatch(setCheckoutStep('shipping')) },
    ][checkoutProgress];
    
    const nextAction = [
        { text: 'Continue to shipping' , action: () => {
            dispatch(setShippingValidation(true));
            
            if (!!regularCheckoutSectionRef?.current?.querySelector(':invalid')) return; // there is an invalid field
            
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
            <ButtonIcon className='back' icon='arrow_back' theme='primary' size='md' buttonStyle='link' onClick={prevAction.action}>
                {prevAction.text}
            </ButtonIcon>
            {(checkoutStep !== 'payment') && <ButtonIcon className='next' icon='arrow_forward' theme='primary' size='lg' gradient={true} iconPosition='end' onClick={nextAction.action}>
                {nextAction.text}
            </ButtonIcon>}
        </>
    );
}



const RegularCheckout = () => {
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
        
        shippingCountry,
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
    } = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
    const filteredCountryList = !countryList ? undefined : Object.values(countryList.entities).filter((countryEntry): countryEntry is Exclude<typeof countryEntry, undefined> => !!countryEntry);
    const selectedCountry     = countryList?.entities?.[shippingCountry ?? ''];
    
    
    
    return (
        <ValidationProvider enableValidation={shippingValidation}>
            <Section className='contact' title='Contact Information'>
                <EmailInput className='email'     placeholder='Email'      required autoComplete='shipping email'          value={shippingEmail}              onChange={({target:{value}}) => dispatch(setShippingEmail(value))}     elmRef={shippingEmailInputRef} />
                <Check      className='marketingOpt' enableValidation={false}                                             active={marketingOpt} onActiveChange={({active})                 => dispatch(setMarketingOpt(active))}      >
                    Email me with news and offers
                </Check>
            </Section>
            <Section className='shipping' title='Shipping Address'>
                <DropdownListButton buttonChildren={selectedCountry?.name ?? 'Country/Region'} theme={!shippingValidation ? 'primary' : (selectedCountry ? 'success' : 'danger')} mild={true}>
                    {!!filteredCountryList && filteredCountryList.map((countryEntry, index) =>
                        <ListItem
                            // key={countryEntry.code} // the country may be duplicated in several places
                            key={index}
                            
                            active={filteredCountryList?.[index]?.code === shippingCountry}
                            onClick={() => dispatch(setShippingCountry(filteredCountryList?.[index]?.code ?? ''))}
                        >
                            {countryEntry.name}
                        </ListItem>
                    )}
                </DropdownListButton>
                
                <TextInput  className='firstName' placeholder='First Name' required autoComplete='shipping given-name'     value={shippingFirstName}          onChange={({target:{value}}) => dispatch(setShippingFirstName(value))} />
                <TextInput  className='lastName'  placeholder='Last Name'  required autoComplete='shipping family-name'    value={shippingLastName}           onChange={({target:{value}}) => dispatch(setShippingLastName(value))}  />
                <TelInput   className='phone'     placeholder='Phone'      required autoComplete='shipping tel'            value={shippingPhone}              onChange={({target:{value}}) => dispatch(setShippingPhone(value))}     />
                <TextInput  className='address'   placeholder='Address'    required autoComplete='shipping street-address' value={shippingAddress}            onChange={({target:{value}}) => dispatch(setShippingAddress(value))}   elmRef={shippingAddressInputRef} />
                <TextInput  className='city'      placeholder='City'       required autoComplete='shipping address-level2' value={shippingCity}               onChange={({target:{value}}) => dispatch(setShippingCity(value))}      />
                <TextInput  className='zone'      placeholder='State'      required autoComplete='shipping address-level1' value={shippingZone}               onChange={({target:{value}}) => dispatch(setShippingZone(value))}      />
                <TextInput  className='zip'       placeholder='ZIP Code'   required autoComplete='shipping postal-code'    value={shippingZip}                onChange={({target:{value}}) => dispatch(setShippingZip(value))}       />
                
                <VisuallyHidden className='hidden'>
                    <input type='text' tabIndex={-1} role='none'           required autoComplete='shipping country'        value={shippingCountry}            onChange={({target:{value}}) => dispatch(setShippingCountry(value))}   />
                </VisuallyHidden>
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
                    {(typeof(totalShippingCosts) === 'number') ? formatCurrency(totalShippingCosts) : 'calculated at next step'}
                </span>
            </p>
            <hr />
            <p className='currencyBlock'>
                Total: <span className='currency'>
                    {(typeof(totalShippingCosts) === 'number') ? formatCurrency(totalProductPrices + totalShippingCosts) : 'calculated at next step'}
                </span>
            </p>
        </>
    );
}
const OrderReview = () => {
    // context:
    const {checkoutStep, countryList, shippingList, shippingEmailInputRef, shippingAddressInputRef, shippingMethodOptionRef} = useCheckout();
    
    
    
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
    const dispatch = useDispatch();
    
    
    
    const selectedShipping = shippingList?.entities?.[shippingProvider ?? ''];
    
    
    
    // jsx:
    return (
        <table>
            <tbody>
                <tr>
                    <td>Contact</td>
                    <td>{shippingEmail}</td>
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
                    <td>{`${shippingAddress}, ${shippingCity}, ${shippingZone} (${shippingZip}), ${countryList?.entities?.[shippingCountry ?? '']?.name}`}</td>
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
                    <td>{`${selectedShipping?.name}${!selectedShipping?.estimate ? '' : ` - ${selectedShipping?.estimate}`}`}</td>
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
                totalShippingCosts : calculateShippingCost(totalProductWeights, shippingEntry)
            }))
            ?.sort((a, b) => (a.totalShippingCosts ?? -1) - (b.totalShippingCosts ?? -1)) // -1 means: no need to ship (digital products)
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
const PaymentMethod = () => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // context:
    const {paymentToken} = useCheckout();
    
    
    
    // jsx:
    return (
        <PayPalScriptProvider options={{
            'client-id'         : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
            'data-client-token' : paymentToken?.paymentToken,
            currency            : 'USD',
            intent              : 'capture',
        }}>
            <ExclusiveAccordion theme='primary' defaultExpandedListIndex={0} listStyle='content'>
                <AccordionItem label={<>
                    <Radio className='indicator' enableValidation={false} inheritActive={true} outlined={true} nude={true} tabIndex={-1} />
                    Credit Card
                </>} listItemComponent={<ListItem className={styles.paymentEntryHeader} />} contentComponent={<Section className={styles.paymentEntryCard} />} lazy={true} >
                    <PaymentMethodCard />
                </AccordionItem>
                <AccordionItem label={<>
                    <Radio className='indicator' enableValidation={false} inheritActive={true} outlined={true} nude={true} tabIndex={-1} />
                    PayPal
                    </>} listItemComponent={<ListItem className={styles.paymentEntryHeader} />} contentComponent={<Section className={styles.paymentEntryPaypal} />} lazy={true} >
                    <PaymentMethodPaypal />
                </AccordionItem>
            </ExclusiveAccordion>
        </PayPalScriptProvider>
    );
}
const PaymentMethodPaypal = () => {
    // jsx:
    return (
        <PayPalButtons  />
    );
}
const PaymentMethodCard = () => {
    // context:
    const {cartItems} = useCheckout();
    
    
    
    // stores:
    const {
        checkoutStep : _checkoutStep, // remove
    ...restCheckoutState} = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
    // states:
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    
    
    
    // refs:
    const safeSignRef = useRef<HTMLElement|null>(null);
    const cscSignRef  = useRef<HTMLElement|null>(null);
    
    
    
    // apis:
    const [makePayment, {isLoading, isError}] = useMakePaymentMutation();
    
    
    
    // jsx:
    return (
        <ValidationProvider enableValidation={enableValidation}>
            <Group className='number'>
                <Label theme='secondary' mild={false} className='solid'>
                    <Icon icon='credit_card' theme='primary' mild={true} />
                </Label>
                <TextInput placeholder='Card Number'               inputMode='numeric' pattern='[0-9]*' required autoComplete='cc-number' />
                <Label theme='success' mild={true} className='solid' elmRef={safeSignRef}>
                    <Icon icon='lock' />
                    <Tooltip className='tooltip' size='sm' floatingOn={safeSignRef}>
                        All transactions are secure and encrypted.
                    </Tooltip>
                </Label>
            </Group>
            <Group className='name'>
                <Label theme='secondary' mild={false} className='solid'>
                    <Icon icon='person' theme='primary' mild={true} />
                </Label>
                <TextInput placeholder='Cardholder Name'           inputMode='text'                     required autoComplete='cc-name'   />
            </Group>
            <Group className='expiry'>
                <Label theme='secondary' mild={false} className='solid'>
                    <Icon icon='date_range' theme='primary' mild={true} />
                </Label>
                <TextInput placeholder='Expiration Date (MM / YY)' inputMode='numeric' pattern='[0-9]*' required autoComplete='cc-exp'    />
            </Group>
            <Group className='csc'>
                <Label theme='secondary' mild={false} className='solid'>
                    <Icon icon='fiber_pin' theme='primary' mild={true} />
                </Label>
                <TextInput placeholder='Security Code'             inputMode='numeric' pattern='[0-9]*'          autoComplete='cc-csc'    />
                <Label theme='success' mild={true} className='solid' elmRef={cscSignRef}>
                    <Icon icon='help' />
                    <Tooltip className='tooltip' size='sm' floatingOn={cscSignRef}>
                        3-digit security code usually found on the back of your card.<br />
                        American Express cards have a 4-digit code located on the front.
                    </Tooltip>
                </Label>
            </Group>
            <hr className='horz' />
            <ButtonIcon icon={!isLoading ? 'monetization_on' : 'busy'} enabled={!isLoading} className='payNow' size='lg' gradient={true} onClick={() => {
                makePayment({
                    items : cartItems,
                    ...restCheckoutState,
                });
            }}>
                Pay Now
            </ButtonIcon>
        </ValidationProvider>        
    );
}

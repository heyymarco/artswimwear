import Head from 'next/head'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.scss'
import { Main } from '@/components/sections/Main'
import { Badge, Busy, ButtonIcon, Check, Container, Details, DropdownListButton, EmailInput, List, ListItem, Radio, TelInput, TextInput, useWindowResizeObserver, VisuallyHidden, WindowResizeCallback } from '@reusable-ui/components'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'
import { CountryEntry, PriceEntry, ProductEntry, ShippingEntry, useGetCountryListQuery, useGetPriceListQuery, useGetProductListQuery, useGetShippingListQuery } from '@/store/features/api/apiSlice'
import { formatCurrency } from '@/libs/formatters'
import ProductImage, { ProductImageProps } from '@/components/ProductImage'
import Link from 'next/link'
import { Section } from '@/components/sections/Section'
import { useEffect, useRef, useState } from 'react'
import { CartEntry, selectCartItems, showCart } from '@/store/features/cart/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { breakpoints, useEvent, ValidationProvider } from '@reusable-ui/core'
import { selectCheckoutProgress, selectShippingData, setCheckoutStep, setMarketingOpt, setShippingAddress, setShippingCity, setShippingCountry, setShippingEmail, setShippingFirstName, setShippingLastName, setShippingPhone, setShippingProvider, setShippingValidation, setShippingZip, setShippingZone } from '@/store/features/checkout/checkoutSlice'
import { EntityState } from '@reduxjs/toolkit'



// const inter = Inter({ subsets: ['latin'] })
const useCheckoutStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'@/styles/checkout')
, { id: 'checkout' });



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
    isDesktop : boolean
}
const WithDetails = ({isDesktop, children}: WithDetailsProps) => {
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
};

interface RegularCheckoutProps {
    countryList : EntityState<CountryEntry>
}
const RegularCheckout = ({countryList}: RegularCheckoutProps) => {
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
    } = useSelector(selectShippingData);
    const dispatch = useDispatch();
    
    
    
    const filteredCountryList = Object.values(countryList.entities).filter((countryEntry): countryEntry is Exclude<typeof countryEntry, undefined> => !!countryEntry);
    const selectedCountry     = countryList.entities[shippingCountry ?? ''];
    
    
    return (
        <ValidationProvider enableValidation={shippingValidation}>
            <Section className='contact' title='Contact Information'>
                <EmailInput className='email'     placeholder='Email'      required autoComplete='shipping email'          value={shippingEmail}              onChange={({target:{value}}) => dispatch(setShippingEmail(value))}     />
                <Check      className='marketingOpt' enableValidation={false}                                             active={marketingOpt} onActiveChange={({active})                 => dispatch(setMarketingOpt(active))}      >
                    Email me with news and offers
                </Check>
            </Section>
            <Section className='shipping' title='Shipping Address'>
                <DropdownListButton buttonChildren={selectedCountry?.name ?? 'Country/Region'} theme={!shippingValidation ? 'primary' : (selectedCountry ? 'success' : 'danger')} mild={true}>
                    {filteredCountryList.map((countryEntry, index) =>
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
                <TextInput  className='address'   placeholder='Address'    required autoComplete='shipping street-address' value={shippingAddress}            onChange={({target:{value}}) => dispatch(setShippingAddress(value))}   />
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

interface ProgressCheckoutProps {
    isDesktop : boolean
}
const ProgressCheckout = ({isDesktop}: ProgressCheckoutProps) => {
    const checkoutProgress = useSelector(selectCheckoutProgress);
    
    
    
    // jsx:
    return (
        <List theme={!isDesktop ? 'secondary' : 'primary'} outlined={!isDesktop} listStyle='breadcrumb' orientation='inline' size='sm'>
            <ListItem active={checkoutProgress >= 0}>Information</ListItem>
            <ListItem active={checkoutProgress >= 1}>Shipping</ListItem>
            <ListItem active={checkoutProgress >= 2}>Payment</ListItem>
        </List>
    );
}

interface NavCheckoutProps {
    regularCheckoutSectionRef : React.RefObject<HTMLElement> // getter ref
}
const NavCheckout = ({regularCheckoutSectionRef}: NavCheckoutProps) => {
    const dispatch = useDispatch();
    const checkoutProgress = useSelector(selectCheckoutProgress);
    
    
    
    // fn props:
    const prevAction = [
        { text: 'Return to cart'       , action: () => dispatch(showCart(true)) },
        { text: 'Return to information', action: () => dispatch(setCheckoutStep('info')) },
        { text: 'Return to shipping'   , action: () => dispatch(setCheckoutStep('shipping')) },
    ][checkoutProgress];
    
    const nextAction = [
        { text: 'Continue to shipping' , action: () => {
            dispatch(setShippingValidation(true));
            
            if (!!regularCheckoutSectionRef.current?.querySelector(':invalid')) return; // there is an invalid field
            
            dispatch(setCheckoutStep('shipping'));
        }},
        { text: 'Continue to payment'  , action: () => dispatch(setCheckoutStep('payment')) },
        { text: 'Pay now' , action: () => {
            // payment action
        }},
    ][checkoutProgress];
    
    
    
    // jsx:
    return (
        <>
            <ButtonIcon className='back' icon='arrow_back' theme='primary' size='md' buttonStyle='link' onClick={prevAction.action}>
                {prevAction.text}
            </ButtonIcon>
            <ButtonIcon className='next' icon='arrow_forward' theme='primary' size='lg' gradient={true} iconPosition='end' onClick={nextAction.action}>
                {nextAction.text}
            </ButtonIcon>
        </>
    );
}

interface OrderSummaryProps {
    cartItems   : CartEntry[]
    priceList   : EntityState<PriceEntry>
    productList : EntityState<ProductEntry>
    
    isDesktop   : boolean
}
const OrderSummary = ({cartItems, priceList, productList, isDesktop}: OrderSummaryProps) => {
    const styles = useCheckoutStyleSheet();
    
    
    
    // jsx:
    return (
        <>
            <WithDetails isDesktop={isDesktop}>
                <List className='orderList' listStyle='flat'>
                    {cartItems.map((item) => {
                        const productUnitPrice = priceList.entities?.[item.productId]?.price ?? undefined;
                        const product = productList.entities?.[item.productId];
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
                Subtotal products: <span className='currency'>{formatCurrency(cartItems.reduce((accum, item) => {
                    const productUnitPrice = priceList.entities?.[item.productId]?.price ?? undefined;
                    if (!productUnitPrice) return accum;
                    return accum + (productUnitPrice * item.quantity);
                }, 0))}</span>
            </p>
            <p className='currencyBlock'>
                Shipping: <span className='currency'>calculated at next step</span>
            </p>
            <hr />
            <p className='currencyBlock'>
                Total: <span className='currency'>calculated at next step</span>
            </p>
        </>
    );
}

interface OrderReviewProps {
    countryList: EntityState<CountryEntry>
}
const OrderReview = ({countryList}: OrderReviewProps) => {
    const {
        shippingEmail,
        
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
    } = useSelector(selectShippingData);
    const dispatch = useDispatch();
    
    
    
    // jsx:
    return (
        <table>
            <tbody>
                <tr>
                    <td>Contact</td>
                    <td>{shippingEmail}</td>
                    <td>
                        <ButtonIcon icon='edit' theme='primary' size='sm' buttonStyle='link' onClick={() => dispatch(setCheckoutStep('info'))}>Change</ButtonIcon>
                    </td>
                </tr>
                <tr>
                    <td>Ship to</td>
                    <td>{`${shippingAddress}, ${shippingCity}, ${shippingZone} (${shippingZip}), ${countryList.entities[shippingCountry ?? '']?.name}`}</td>
                    <td>
                        <ButtonIcon icon='edit' theme='primary' size='sm' buttonStyle='link' onClick={() => dispatch(setCheckoutStep('info'))}>Change</ButtonIcon>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

interface ShippingMethodProps {
    shippingList: EntityState<ShippingEntry>
}
const ShippingMethod = ({shippingList}: ShippingMethodProps) => {
    const {
        shippingProvider,
    } = useSelector(selectShippingData);
    const dispatch = useDispatch();
    
    
    
    const filteredShippingList = Object.values(shippingList.entities).filter((shippingEntry): shippingEntry is Exclude<typeof shippingEntry, undefined> => !!shippingEntry);
    // const selectedShipping     = shippingList.entities[shippingProvider ?? ''];
    
    
    
    // useEffect(() => {
    //     if (shippingProvider) return;
    //     dispatch(setShippingProvider());
    // }, [shippingProvider]);
    
    
    
    // jsx:
    return (
        <List theme='primary' actionCtrl={true}>
            {filteredShippingList.map((shippingEntry, index) =>
                <ListItem
                    key={index}
                    
                    active={filteredShippingList?.[index]?._id === shippingProvider}
                    onClick={() => dispatch(setShippingProvider(filteredShippingList?.[index]?._id ?? ''))}
                >
                    <Radio className='indicator' enableValidation={false} inheritActive={true} outlined={true} nude={true} />
                    <p className='name'>{shippingEntry.name}</p>
                    {!!shippingEntry.estimate && <p className='estimate'>Estimate: {shippingEntry.estimate}</p>}
                    <p className='cost'>$$$</p>
                </ListItem>
            )}
        </List>
    );
}



export default function Checkout() {
    const styles = useCheckoutStyleSheet();
    const cartItems   = useSelector(selectCartItems);
    const hasCart = !!cartItems.length;
    const {data: priceList, isLoading: isLoading1, isError: isError1} = useGetPriceListQuery();
    const {data: productList, isLoading: isLoading2, isError: isError2} = useGetProductListQuery();
    const {data: countryList, isLoading: isLoading3, isError: isError3} = useGetCountryListQuery();
    const {data: shippingList, isLoading: isLoading4, isError: isError4} = useGetShippingListQuery();
    const isLoading = isLoading1 || isLoading2 || isLoading3 || isLoading4;
    const isError = isError1 || isError2 || isError3 || isError4;
    const isCartDataReady = hasCart && !!priceList && !!productList && !!countryList && !!shippingList;
    
    const {
        checkoutStep,
    } = useSelector(selectShippingData);
    
    
    
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
    
    
    
    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
            </Head>
            <Main nude={true}>
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
                        <OrderSummary cartItems={cartItems} priceList={priceList} productList={productList} isDesktop={isDesktop} />
                    </Section>
                    
                    <Section tag='nav' className={styles.progressCheckout} theme={!isDesktop ? 'primary' : undefined} mild={!isDesktop ? false : undefined}>
                        <ProgressCheckout isDesktop={isDesktop} />
                    </Section>
                    
                    <div className={styles.currentStepLayout}>
                        {((checkoutStep === 'shipping') || (checkoutStep === 'payment')) && <>
                            <Section tag='aside' className={styles.orderReview}>
                                <OrderReview countryList={countryList} />
                            </Section>
                        </>}
                        
                        {(checkoutStep === 'info') && <>
                            <Section className={styles.checkout}>
                                <Section className={styles.expressCheckout} title='Express Checkout'>
                                </Section>
                                
                                <div className={styles.checkoutAlt}>
                                    <hr />
                                    <span>OR</span>
                                    <hr />
                                </div>
                                
                                <Section elmRef={regularCheckoutSectionRef} className={styles.regularCheckout} title='Regular Checkout'>
                                    <RegularCheckout countryList={countryList} />
                                </Section>
                            </Section>
                        </>}
                        
                        {(checkoutStep === 'shipping') && <>
                            <Section className={styles.shipping} title='Shipping Method'>
                                <ShippingMethod shippingList={shippingList} />
                            </Section>
                        </>}
                    </div>
                    
                    <Section tag='nav' className={styles.navCheckout}>
                        <NavCheckout regularCheckoutSectionRef={regularCheckoutSectionRef} />
                    </Section>
                    
                    <hr className={styles.vertLine} />
                </Container>}
            </Main>
        </>
    )
}

import Head from 'next/head'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.scss'
import { Main } from '@/components/sections/Main'
import { Badge, Busy, ButtonIcon, Check, Container, Details, DropdownListButton, EmailInput, List, ListItem, TelInput, TextInput, useWindowResizeObserver, WindowResizeCallback } from '@reusable-ui/components'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'
import { CountryEntry, useGetCountryListQuery, useGetPriceListQuery, useGetProductListQuery } from '@/store/features/api/apiSlice'
import { formatCurrency } from '@/libs/formatters'
import ProductImage, { ProductImageProps } from '@/components/ProductImage'
import Link from 'next/link'
import { Section } from '@/components/sections/Section'
import { useState } from 'react'
import { selectCartItems } from '@/store/features/cart/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { breakpoints, useEvent, ValidationProvider } from '@reusable-ui/core'
import { selectShippingData, setMarketingOpt, setShippingAddress, setShippingCity, setShippingEmail, setShippingFirstName, setShippingLastName, setShippingPhone, setShippingZip, setShippingZone } from '@/store/features/checkout/checkoutSlice'
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

interface RegularCheckoutDataProps {
    countryList : EntityState<CountryEntry>
}
const RegularCheckoutData = ({countryList}: RegularCheckoutDataProps) => {
    const {
        firstName,
        lastName,
        
        phone,
        email,
        
        country,
        address,
        city,
        zone,
        zip,
        
        marketingOpt,
    } = useSelector(selectShippingData);
    const dispatch = useDispatch();
    
    
    
    return (
        <ValidationProvider enableValidation={true}>
            <Section className='contact' title='Contact Information'>
                <EmailInput className='email'     placeholder='Email'      required autoComplete='shipping email'          value={email}              onChange={({target:{value}}) => dispatch(setShippingEmail(value))}     />
                <Check      className='marketingOpt' enableValidation={false}                                             active={marketingOpt} onActiveChange={({active})         => dispatch(setMarketingOpt(active))}      >
                    Email me with news and offers
                </Check>
            </Section>
            <Section className='shipping' title='Shipping Address'>
                <DropdownListButton buttonChildren='Country/Region'>
                    {Object.values(countryList.entities).filter((country): country is Exclude<typeof country, undefined> => !!country).map((country, index) =>
                        <ListItem key={index}>{country.name}</ListItem>
                    )}
                </DropdownListButton>
                
                <TextInput  className='firstName' placeholder='First Name' required autoComplete='shipping given-name'     value={firstName}          onChange={({target:{value}}) => dispatch(setShippingFirstName(value))} />
                <TextInput  className='lastName'  placeholder='Last Name'  required autoComplete='shipping family-name'    value={lastName}           onChange={({target:{value}}) => dispatch(setShippingLastName(value))}  />
                <TelInput   className='phone'     placeholder='Phone'      required autoComplete='shipping tel'            value={phone}              onChange={({target:{value}}) => dispatch(setShippingPhone(value))}     />
                <TextInput  className='address'   placeholder='Address'    required autoComplete='shipping street-address' value={address}            onChange={({target:{value}}) => dispatch(setShippingAddress(value))}   />
                <TextInput  className='city'      placeholder='City'       required autoComplete='shipping address-level2' value={city}               onChange={({target:{value}}) => dispatch(setShippingCity(value))}      />
                <TextInput  className='zone'      placeholder='State'      required autoComplete='shipping address-level1' value={zone}               onChange={({target:{value}}) => dispatch(setShippingZone(value))}      />
                <TextInput  className='zip'       placeholder='ZIP Code'   required autoComplete='shipping postal-code'    value={zip}                onChange={({target:{value}}) => dispatch(setShippingZip(value))}       />
                
                <input type='text' className='hidden' required autoComplete='shipping country'                             value={country}            onChange={({target:{value}}) => dispatch(setShippingZip(value))}       />
            </Section>
        </ValidationProvider>
    );
}



export default function Checkout() {
    const styles = useCheckoutStyleSheet();
    const cartItems   = useSelector(selectCartItems);
    const hasCart = !!cartItems.length;
    const {data: priceList, isLoading: isLoading1, isError: isError1} = useGetPriceListQuery();
    const {data: productList, isLoading: isLoading2, isError: isError2} = useGetProductListQuery();
    const {data: countryList, isLoading: isLoading3, isError: isError3} = useGetCountryListQuery();
    const isLoading = isLoading1 || isLoading2 || isLoading3;
    const isError = isError1 || isError2 || isError3;
    const isCartDataReady = hasCart && !!priceList && !!productList && !!countryList;
    
    
    
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
                
                {isCartDataReady && <Container className={styles.layout} theme='secondary'>
                    <Section tag='aside' className={`fill-self ${styles.orderSummary}`} title='Order Summary' theme={!isDesktop ? 'primary' : undefined}>
                        <WithDetails isDesktop={isDesktop}>
                            <List className='orderList' listStyle='flat'>
                                {cartItems.map((item) => {
                                    const productUnitPrice = priceList?.entities?.[item.productId]?.price ?? undefined;
                                    const product = productList?.entities?.[item.productId];
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
                                const productUnitPrice = priceList?.entities?.[item.productId]?.price ?? undefined;
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
                    </Section>
                    
                    <Section className={styles.expressCheckout} title='Express Checkout'>
                    </Section>
                    
                    <div className={styles.checkoutAlt}>
                        <hr />
                        <span>OR</span>
                        <hr />
                    </div>
                    
                    <Section className={styles.regularCheckout} title='Regular Checkout'>
                        <RegularCheckoutData countryList={countryList} />
                    </Section>
                    
                    <Section tag='nav' className={styles.navCheckout}>
                        <ButtonIcon className='back' icon='arrow_back' theme='primary' size='md' buttonStyle='link'>
                            <Link href='/cart'>
                                Return to cart
                            </Link>
                        </ButtonIcon>
                        <ButtonIcon className='next' icon='arrow_forward' theme='primary' size='lg' gradient={true} iconPosition='end'>
                            Continue to shipping
                        </ButtonIcon>
                    </Section>
                    
                    <hr className={styles.vertLine} />
                </Container>}
            </Main>
        </>
    )
}

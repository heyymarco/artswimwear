import Head from 'next/head'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.scss'

import { Article, Section, Main } from '@heymarco/section'

import { AccordionItem, Alert, Badge, Busy, Button, ButtonIcon, CardBody, CardFooter, CardHeader, Check, CloseButton, Collapse, Container, Details, EditableTextControl, EditableTextControlProps, EmailInput, ExclusiveAccordion, Group, Icon, Label, List, ListItem, ModalCard, ModalCardProps, Radio, TextInput, Tooltip, useWindowResizeObserver, WindowResizeCallback } from '@reusable-ui/components'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'
import { CountryEntry, PriceEntry, ProductEntry, useGeneratePaymentToken, useGetCountryList, useGetPriceList, useGetProductList, useGetMatchingShippingList, usePlaceOrder, useMakePayment, PlaceOrderOptions } from '@/store/features/api/apiSlice'
import { formatCurrency } from '@/libs/formatters'
import { ImageProps, Image } from '@heymarco/image'
import Link from 'next/link'
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { CartEntry, selectCartItems, showCart } from '@/store/features/cart/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AccessibilityProvider, breakpoints, colorValues, ThemeName, typoValues, useEvent, useIsomorphicLayoutEffect, ValidationProvider } from '@reusable-ui/core'
import { CheckoutStep, selectCheckoutProgress, selectCheckoutState, setCheckoutStep, setMarketingOpt, setPaymentToken, setShippingAddress, setShippingCity, setShippingCountry, setShippingFirstName, setShippingLastName, setShippingPhone, setShippingProvider, setShippingValidation, setShippingZip, setShippingZone, PaymentToken, setPaymentMethod, setBillingAddress, setBillingCity, setBillingCountry, setBillingFirstName, setBillingLastName, setBillingPhone, setBillingZip, setBillingZone, setBillingAsShipping, setBillingValidation, setPaymentCardValidation, setIsLoadingStep, PaymentMethod, setCustomerEmail, setCustomerNickName } from '@/store/features/checkout/checkoutSlice'
import { EntityState } from '@reduxjs/toolkit'
import type { HostedFieldsEvent, HostedFieldsHostedFieldsFieldName, OnApproveActions, OnApproveData, OnShippingChangeActions, OnShippingChangeData } from '@paypal/paypal-js'
import { PayPalScriptProvider, PayPalButtons, PayPalHostedFieldsProvider, PayPalHostedField, usePayPalHostedFields, PayPalHostedFieldProps } from '@paypal/react-paypal-js'
import { MatchingShipping, MatchingAddress, calculateShippingCost } from '@/libs/shippings'
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



interface ShowDialogMessage {
    theme   ?: ThemeName
    title   ?: string
    message  : React.ReactNode
    onClose ?: () => void
}
interface ICheckoutContext {
    cartItems                         : CartEntry[]
    hasCart                           : boolean
    checkoutStep                      : CheckoutStep
    checkoutProgress                  : number
    
    priceList                         : EntityState<PriceEntry>       | undefined
    productList                       : EntityState<ProductEntry>     | undefined
    countryList                       : EntityState<CountryEntry>     | undefined
    shippingList                      : EntityState<MatchingShipping> | undefined
    
    isLoadingPage                     : boolean
    isErrorPage                       : boolean
    isReadyPage                       : boolean
    
    isLoadingShipping                 : boolean
    isErrorShipping                   : boolean
    
    isDesktop                         : boolean
    
    regularCheckoutSectionRef         : React.MutableRefObject<HTMLElement|null>      | undefined
    shippingMethodOptionRef           : React.MutableRefObject<HTMLElement|null>      | undefined
    billingAddressSectionRef          : React.MutableRefObject<HTMLElement|null>      | undefined
    paymentCardSectionRef             : React.MutableRefObject<HTMLElement|null>      | undefined
    currentStepSectionRef             : React.MutableRefObject<HTMLElement|null>      | undefined
    navCheckoutSectionElm             : HTMLElement|null                              | undefined
    
    contactEmailInputRef              : React.MutableRefObject<HTMLInputElement|null> | undefined
    shippingAddressInputRef           : React.MutableRefObject<HTMLInputElement|null> | undefined
    cardholderInputRef                : React.MutableRefObject<HTMLInputElement|null> | undefined
    
    paymentToken                      : PaymentToken|undefined
    
    handleShippingAddressChanged      : (address: MatchingAddress) => Promise<boolean>
    handlePlaceOrder                  : (options?: PlaceOrderOptions) => Promise<string>
    handleMakePayment                 : (orderId: string) => Promise<void>
    handleOrderCompleted              : (paid: boolean) => void
    
    showDialogMessage                 : React.Dispatch<React.SetStateAction<ShowDialogMessage|false>>
    showDialogMessageFieldsError      : (invalidFields: ArrayLike<Element>|undefined) => void
    showDialogMessagePlaceOrderError  : (error: any) => void
    showDialogMessageMakePaymentError : (error: any) => void
    
    placeOrderApi                     : ReturnType<typeof usePlaceOrder>
    makePaymentApi                    : ReturnType<typeof useMakePayment>
}
const CheckoutContext = createContext<ICheckoutContext>({
    cartItems                         : [],
    hasCart                           : false,
    checkoutStep                      : 'info',
    checkoutProgress                  : 0,
    
    priceList                         : undefined,
    productList                       : undefined,
    countryList                       : undefined,
    shippingList                      : undefined,
    
    isLoadingPage                     : false,
    isErrorPage                       : false,
    isReadyPage                       : false,
    
    isLoadingShipping                 : false,
    isErrorShipping                   : false,
    
    isDesktop                         : false,
    
    regularCheckoutSectionRef         : undefined,
    shippingMethodOptionRef           : undefined,
    billingAddressSectionRef          : undefined,
    paymentCardSectionRef             : undefined,
    currentStepSectionRef             : undefined,
    navCheckoutSectionElm             : undefined,
    
    contactEmailInputRef              : undefined,
    shippingAddressInputRef           : undefined,
    cardholderInputRef                : undefined,
    
    paymentToken                      : undefined,
    
    handleShippingAddressChanged      : undefined as any,
    handlePlaceOrder                  : undefined as any,
    handleMakePayment                 : undefined as any,
    handleOrderCompleted              : undefined as any,
    
    showDialogMessage                 : undefined as any,
    showDialogMessageFieldsError      : undefined as any,
    showDialogMessagePlaceOrderError  : undefined as any,
    showDialogMessageMakePaymentError : undefined as any,
    
    placeOrderApi                     : undefined as any,
    makePaymentApi                    : undefined as any,
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
        // marketings:
        marketingOpt,
        
        
        
        // customers:
        customerNickName,
        customerEmail,
        
        
        
        // shippings:
        shippingFirstName,
        shippingLastName,
        
        shippingPhone,
        
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        shippingProvider,
        
        
        
        // bilings:
        billingAsShipping,
        
        billingFirstName,
        billingLastName,
        
        billingPhone,
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
    } = checkoutState;
    const checkoutProgress = useSelector(selectCheckoutProgress);
    const hasCart = !!cartItems.length;
    const dispatch = useDispatch();
    
    
    
    // apis:
    const                        {data: priceList      , isLoading: isLoading1, isError: isError1}  = useGetPriceList();
    const                        {data: productList    , isLoading: isLoading2, isError: isError2}  = useGetProductList();
    const                        {data: countryList    , isLoading: isLoading3, isError: isError3}  = useGetCountryList();
    const [generatePaymentToken, {data: newPaymentToken, isLoading: isLoading5, isError: isError5}] = useGeneratePaymentToken();
    
    const [getShippingByAddress, {data: shippingList   , isUninitialized: isUninitShipping, isLoading: isLoadingShipping, isError: isErrorShipping, isSuccess: isSuccessShipping}]  = useGetMatchingShippingList();
    
    const isPerformedRecoverShippingList = useRef<boolean>(false);
    const isNeedsRecoverShippingList     =                                (checkoutStep !== 'info') && isUninitShipping  && !isPerformedRecoverShippingList.current;
    const isNeedsRecoverShippingProvider = !isNeedsRecoverShippingList && (checkoutStep !== 'info') && (isErrorShipping || isSuccessShipping) && !shippingList?.entities?.[shippingProvider ?? ''];
    
    const isLoadingPage                  = isLoading1 || isLoading2 || isLoading3 ||  !existingPaymentToken || isNeedsRecoverShippingList;
    const isErrorPage                    = !isLoadingPage && (isError1   || isError2   || isError3   || (!existingPaymentToken && isError5));
    const isReadyPage                    = !isLoadingPage && (hasCart && !!priceList && !!productList && !!countryList && !!existingPaymentToken);
    
    
    
    // dom effects:
    
    // try to recover shippingList on page_refresh:
    useEffect(() => {
        // conditions:
        if (!isNeedsRecoverShippingList)     return; // already being initialized/recovered => ignore
        
        
        
        // check shipping address:
        const {
            shippingCity,
            shippingZone,
            shippingCountry,
        } = checkoutState;
        if (!shippingCity || !shippingZone || !shippingCountry) {
            // no shippingList => go back to information page:
            dispatch(setCheckoutStep('info'));
            
            
            
            // abort to initialize shippingList:
            return;
        } // if
        
        
        
        // initialize shippingList:
        isPerformedRecoverShippingList.current = true;
        getShippingByAddress({
            city    : shippingCity,
            zone    : shippingZone,
            country : shippingCountry,
        });
    }, [isNeedsRecoverShippingList, checkoutState]);
    
    // go back to shipping page if the selected shippingProvider is not in shippingList:
    useEffect(() => {
        // conditions:
        if (!isNeedsRecoverShippingProvider) return; // already recovered => ignore
        
        
        
        if (shippingList?.ids?.length) {
            // no valid selected shippingProvider -AND- have shippingList => go back to shipping page:
            dispatch(setCheckoutStep('shipping'));
        }
        else {
            // no valid selected shippingProvider -AND- no shippingList => go back to information page:
            dispatch(setCheckoutStep('info'));
        } // if
    }, [isNeedsRecoverShippingProvider, shippingList]);
    
    // auto scroll to top on checkoutStep changed:
    const isSubsequentStep = useRef<boolean>(false);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (typeof(window) === 'undefined') return; // noop on server_side
        
        
        
        // actions:
        if (isSubsequentStep.current) {
            const currentStepSectionElm = currentStepSectionRef.current;
            window.document.scrollingElement?.scrollTo({
                top      : 0,
                behavior : currentStepSectionElm ? 'auto' : 'smooth',
            });
            currentStepSectionElm?.scrollIntoView({
                block    : 'start',
                behavior : 'smooth',
            });
        } // if
        isSubsequentStep.current = true;
    }, [checkoutStep]);
    
    // auto renew payment token:
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
    const currentStepSectionRef     = useRef<HTMLElement|null>(null);
    const [navCheckoutSectionElm, setNavCheckoutSectionElm] = useState<HTMLElement|null>(null);
    
    const contactEmailInputRef      = useRef<HTMLInputElement|null>(null);
    const shippingAddressInputRef   = useRef<HTMLInputElement|null>(null);
    const cardholderInputRef        = useRef<HTMLInputElement|null>(null);
    
    
    
    // apis:
    const placeOrderApi  = usePlaceOrder();
    const [placeOrder]   = placeOrderApi;
    
    const makePaymentApi = useMakePayment();
    const [makePayment] = makePaymentApi;
    
    
    
    // handlers:
    const handleShippingAddressChanged = useEvent(async (address: MatchingAddress): Promise<boolean> => {
        try {
            const shippingList = await getShippingByAddress(address).unwrap();
            
            
            
            if (!shippingList.ids.length) {
                showDialogMessage({
                    theme   : 'danger',
                    title   : 'No Shipping Agency',
                    message : <>
                        <p>
                            We&apos;re sorry. There are <strong>no shipping agencies available</strong> for delivery to your shipping address.
                        </p>
                        <p>
                            Please contact us for further assistance.
                        </p>
                    </>
                });
                return false;
            } // if
            
            
            
            return true;
        }
        catch (error: any) {
            showDialogMessage({
                theme   : 'danger',
                title   : 'Error Calculating Shipping Cost',
                message : <>
                    <p>
                        Oops, there was an error calculating the shipping cost.
                    </p>
                    <p>
                        There was a <strong>problem contacting our server</strong>.<br />
                        Make sure your internet connection is available.
                    </p>
                    <p>
                        Please try again in a few minutes.<br />
                        If the problem still persists, please contact us manually.
                    </p>
                </>
            });
            return false;
        } // try
    });
    const handlePlaceOrder             = useEvent(async (options?: PlaceOrderOptions): Promise<string> => {
        try {
            const placeOrderResponse = await placeOrder({
                // cart item(s):
                items : cartItems,
                
                
                
                // shippings:
                shippingFirstName,
                shippingLastName,
                
                shippingPhone,
                
                shippingAddress,
                shippingCity,
                shippingZone,
                shippingZip,
                shippingCountry,
                
                shippingProvider,
                
                
                
                // options: pay manually | paymentSource (by <PayPalButtons>)
                ...options,
            }).unwrap();
            return placeOrderResponse.orderId;
        }
        catch (error: any) {
            showDialogMessagePlaceOrderError(error);
            throw error;
        } // try
    });
    const handleMakePayment            = useEvent(async (orderId: string): Promise<void> => {
        await makePayment({
            orderId,
            
            
            
            // marketings:
            marketingOpt,
            
            
            
            // customers:
            customerNickName,
            customerEmail,
            
            
            
            // bilings:
            billingFirstName : billingAsShipping ? shippingFirstName : billingFirstName,
            billingLastName  : billingAsShipping ? shippingLastName  : billingLastName,
            
            billingPhone     : billingAsShipping ? shippingPhone     : billingPhone,
            
            billingAddress   : billingAsShipping ? shippingAddress   : billingAddress,
            billingCity      : billingAsShipping ? shippingCity      : billingCity,
            billingZone      : billingAsShipping ? shippingZone      : billingZone,
            billingZip       : billingAsShipping ? shippingZip       : billingZip,
            billingCountry   : billingAsShipping ? shippingCountry   : billingCountry,
        }).unwrap();
    });
    const handleOrderCompleted         = useEvent((paid: boolean): void => {
        dispatch(setCheckoutStep(paid ? 'paid' : 'pending'));
    });
    
    
    
    // message handlers:
    const [dialogMessage, showDialogMessage] = useState<ShowDialogMessage|false>(false);
    const prevDialogMessage = useRef<ShowDialogMessage|null>(null);
    if (dialogMessage !== false) prevDialogMessage.current = dialogMessage;
    
    const showDialogMessageFieldsError      = useEvent((invalidFields: ArrayLike<Element>|undefined): void => {
        // conditions:
        if (!invalidFields?.length) return;
        
        
        
        // handlers:
        const handleClose = (): void => {
            // focus the first fieldError:
            const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), iframe';
            const firstInvalidField = invalidFields?.[0];
            const firstFocusableElm = (firstInvalidField.matches(focusableSelector) ? firstInvalidField : firstInvalidField?.querySelector(focusableSelector)) as HTMLElement|null;
            firstInvalidField.scrollIntoView({
                block    : 'start',
                behavior : 'smooth',
            });
            firstFocusableElm?.focus?.({ preventScroll: true });
        };
        
        
        
        // show message:
        const isPlural = (invalidFields?.length > 1);
        showDialogMessage({
            theme   : 'danger',
            title   : 'Error',
            message : <>
                <p>
                    There {isPlural ? 'are some' : 'is an'} invalid field{isPlural ? 's' : ''} that {isPlural ? 'need' : 'needs'} to be fixed:
                </p>
                <List listStyle='flat'>
                    {Array.from(invalidFields).map((invalidField, index) =>
                        <ListItem key={index}>
                            <>
                                <Icon
                                    icon={
                                        ((invalidField.parentElement?.previousElementSibling as HTMLElement)?.children?.[0]?.children?.[0] as HTMLElement)?.style?.getPropertyValue('--icon-image')?.slice(1, -1)
                                        ??
                                        'text_fields'
                                    }
                                    theme='primary'
                                />
                                &nbsp;
                                {(invalidField as HTMLElement).getAttribute('aria-label') || (invalidField.children[0] as HTMLInputElement).placeholder}
                            </>
                        </ListItem>
                    )}
                </List>
            </>,
            onClose : handleClose,
        });
    });
    const showDialogMessagePlaceOrderError  = useEvent((error: any): void => {
        showDialogMessage({
            theme   : 'danger',
            title   : 'Error Processing Your Order',
            message : <>
                <p>
                    Oops, there was an error processing your order.
                </p>
                <p>
                    There was a <strong>problem contacting our server</strong>.<br />
                    Make sure your internet connection is available.
                </p>
                <p>
                    Please try again in a few minutes.<br />
                    If the problem still persists, please contact us manually.
                </p>
            </>
        });
    });
    const showDialogMessageMakePaymentError = useEvent((error: any): void => {
        const errorStatus = error?.status;
        if (errorStatus === 402) {
            showDialogMessage({
                theme   : 'danger',
                title   : 'Error Processing Your Payment',
                message : <>
                    <p>
                        Sorry, we were unable to process your payment.
                    </p>
                    <p>
                        There was a <strong>problem authorizing your card</strong>.<br />
                        Make sure your card is still valid and has not reached the transaction limit.
                    </p>
                    <p>
                        Try using a different credit card and try again.<br />
                        If the problem still persists, please change to another payment method.
                    </p>
                    <Alert theme='warning' mild={false} expanded={true} controlComponent={<></>}>
                        <p>
                            Make sure your funds have not been deducted.<br />
                            If you have, please contact us for assistance.
                        </p>
                    </Alert>
                </>
            });
        }
        else {
            showDialogMessage({
                theme   : 'danger',
                title   : 'Error Processing Your Payment',
                message : <>
                    <p>
                        Oops, there was an error processing your payment.
                    </p>
                    <p>
                        There was a <strong>problem contacting our server</strong>.<br />
                        Make sure your internet connection is available.
                    </p>
                    <p>
                        Please try again in a few minutes.<br />
                        If the problem still persists, please contact us manually.
                    </p>
                    <Alert theme='warning' mild={false} expanded={true} controlComponent={<></>}>
                        <p>
                            Make sure your funds have not been deducted.<br />
                            If you have, please contact us for assistance.
                        </p>
                    </Alert>
                </>
            });
        } // if
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
        
        isLoadingPage,
        isErrorPage,
        isReadyPage,
        
        isLoadingShipping,
        isErrorShipping,
        
        isDesktop,
        
        regularCheckoutSectionRef,         // stable ref
        shippingMethodOptionRef,           // stable ref
        billingAddressSectionRef,          // stable ref
        paymentCardSectionRef,             // stable ref
        currentStepSectionRef,             // stable ref
        navCheckoutSectionElm,             // mutable ref
        
        contactEmailInputRef,              // stable ref
        shippingAddressInputRef,           // stable ref
        cardholderInputRef,                // stable ref
        
        paymentToken: existingPaymentToken,
        
        handleShippingAddressChanged,      // stable ref
        handlePlaceOrder,                  // stable ref
        handleMakePayment,                 // stable ref
        handleOrderCompleted,              // stable ref
        
        showDialogMessage,                 // stable ref
        showDialogMessageFieldsError,      // stable ref
        showDialogMessagePlaceOrderError,  // stable ref
        showDialogMessageMakePaymentError, // stable ref
        
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
        
        isLoadingPage,
        isErrorPage,
        isReadyPage,
        
        isLoadingShipping,
        isErrorShipping,
        
        isDesktop,
        
        // regularCheckoutSectionRef,         // stable ref
        // shippingMethodOptionRef,           // stable ref
        // billingAddressSectionRef,          // stable ref
        // paymentCardSectionRef,             // stable ref
        // currentStepSectionRef,             // stable ref
        navCheckoutSectionElm,                // mutable ref
        
        // contactEmailInputRef,              // stable ref
        // shippingAddressInputRef,           // stable ref
        // cardholderInputRef,                // stable ref
        
        existingPaymentToken,
        
        // handleShippingAddressChanged,      // stable ref
        // handlePlaceOrder,                  // stable ref
        // handleMakePayment,                 // stable ref
        // handleOrderCompleted,              // stable ref
        
        // showDialogMessage,                 // stable ref
        // showDialogMessageFieldsError,      // stable ref
        // showDialogMessagePlaceOrderError,  // stable ref
        // showDialogMessageMakePaymentError, // stable ref
        
        placeOrderApi,
        makePaymentApi,
    ]);
    
    
    
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
            <Main nude={true}>
                <CheckoutContext.Provider value={checkoutData}>
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
                            
                            <Section tag='nav' className={styles.navCheckout} articleComponent={<Article elmRef={setNavCheckoutSectionElm} />}>
                                <NavCheckout />
                            </Section>
                            
                            <hr className={styles.vertLine} />
                        </Container>
                    , [isReadyPage, isDesktop, checkoutStep, styles])}
                    
                    {useMemo(() =>
                        <ModalCard
                            modalCardStyle='scrollable'
                            theme={(dialogMessage ? dialogMessage.theme : prevDialogMessage.current?.theme) ?? 'primary'}
                            
                            lazy={true} expanded={!!dialogMessage}
                            
                            onExpandedChange={(event) => !event.expanded && showDialogMessage(false)}
                            onFullyCollapsed={dialogMessage ? dialogMessage.onClose : prevDialogMessage.current?.onClose}
                        >
                            <CardHeader>
                                {(dialogMessage ? dialogMessage.title : prevDialogMessage.current?.title) ?? 'Notification'}
                                <CloseButton onClick={() => showDialogMessage(false)} />
                            </CardHeader>
                            <CardBody>
                                {dialogMessage ? dialogMessage.message : prevDialogMessage.current?.message}
                            </CardBody>
                            <CardFooter>
                                <Button onClick={() => showDialogMessage(false)}>
                                    Okay
                                </Button>
                            </CardFooter>
                        </ModalCard>
                    , [dialogMessage])}
                </CheckoutContext.Provider>
            </Main>
        </>
    )
}



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
    const {checkoutStep, checkoutProgress, regularCheckoutSectionRef, handleShippingAddressChanged, showDialogMessageFieldsError} = useCheckout();
    const isOrderConfirmShown = ['pending', 'paid'].includes(checkoutStep);
    
    
    
    // stores:
    const {
        shippingCity,
        shippingZone,
        shippingCountry,
        
        
        
        isLoadingStep,
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
                showDialogMessageFieldsError(invalidFields);
                return;
            } // if
            
            
            
            // next:
            try {
                // update the UI:
                dispatch(setIsLoadingStep(true));
                
                
                
                if (await handleShippingAddressChanged({
                    city    : shippingCity,
                    zone    : shippingZone,
                    country : shippingCountry,
                })) {
                    dispatch(setCheckoutStep('shipping'));
                } // if
            }
            finally {
                // update the UI:
                dispatch(setIsLoadingStep(false));
            } // try
        }},
        { text: 'Continue to payment'  , action: () => dispatch(setCheckoutStep('payment')) },
        { text: 'Pay Now' , action: () => {
            // payment action
        }},
    ][checkoutProgress];
    
    
    
    // jsx:
    return (
        <>
            {!isOrderConfirmShown && <>
                {!isOrderConfirmShown && <ButtonIcon
                    enabled={!isLoadingStep}
                    
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
                
                {(checkoutStep !== 'payment') && <ButtonIcon
                    enabled={!isLoadingStep}
                    
                    className='next'
                    theme='primary'
                    size='lg'
                    gradient={true}
                    
                    icon={!isLoadingStep ? 'arrow_forward' : 'busy'}
                    iconPosition='end'
                    
                    onClick={nextAction.action}
                >
                    {nextAction.text}
                </ButtonIcon>}
            </>}
            
            {isOrderConfirmShown && <>
                <ButtonIcon
                    enabled={!isLoadingStep}
                    
                    className='back'
                    theme='primary'
                    size='md'
                    buttonStyle='link'
                    
                    icon='arrow_back'
                    iconPosition='start'
                    
                    onClick={() => dispatch(setCheckoutStep('payment'))}
                >
                    BACK
                </ButtonIcon>
                {/* <p>
                    <Icon icon='help' theme='primary' size='md' /> Need help? <Button theme='primary' buttonStyle='link'><Link href='/contact'>Contact Us</Link></Button>
                </p> */}
                
                <ButtonIcon
                    enabled={!isLoadingStep}
                    
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
    const {countryList, contactEmailInputRef, shippingAddressInputRef } = useCheckout();
    
    
    
    // stores:
    const {
        marketingOpt,
        
        
        
        customerNickName,
        customerEmail,
        
        
        
        shippingValidation,
        
        shippingFirstName,
        shippingLastName,
        
        shippingPhone,
        
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
                <Group className='nick'>
                    <Label theme='secondary' mild={false} className='solid'>
                        <Icon icon='chat' theme='primary' mild={true} />
                    </Label>
                    <TextInput  placeholder='Your Nick Name' required minLength={2} maxLength={30} autoComplete='nickname' autoCapitalize='words' value={customerNickName} onChange={({target:{value}}) => dispatch(setCustomerNickName(value))} />
                </Group>
                <Group className='email'>
                    <Label theme='secondary' mild={false} className='solid'>
                        <Icon icon='email' theme='primary' mild={true} />
                    </Label>
                    <EmailInput placeholder='Your Email'     required minLength={5} maxLength={50} autoComplete='email'    value={customerEmail}    onChange={({target:{value}}) => dispatch(setCustomerEmail(value))}    elmRef={contactEmailInputRef} />
                </Group>
                <Check      className='marketingOpt' enableValidation={false}                                             active={marketingOpt} onActiveChange={({active})                 => dispatch(setMarketingOpt(active))}      >
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
                                <ImageWithStatus
                                    className='prodImg'
                                    
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
            <p className='currencyBlock totalCost'>
                Total: <span className='currency'>
                    {!!selectedShipping ? formatCurrency(totalProductPrices + (totalShippingCosts ?? 0)) : 'calculated at next step'}
                </span>
            </p>
        </>
    );
}
const OrderReview = () => {
    // context:
    const {checkoutStep, contactEmailInputRef, shippingAddressInputRef, shippingMethodOptionRef} = useCheckout();
    
    
    
    // stores:
    const {
        isLoadingStep,
    } = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
    // jsx:
    return (
        <AccessibilityProvider enabled={!isLoadingStep}>
            <table>
                <tbody>
                    <tr>
                        <th>Contact</th>
                        <td><CustomerContactReview /></td>
                        <td>
                            <ButtonIcon icon='edit' theme='primary' size='sm' buttonStyle='link' onClick={() => {
                                dispatch(setCheckoutStep('info'));
                                setTimeout(() => {
                                    contactEmailInputRef?.current?.scrollIntoView({
                                        block    : 'start',
                                        behavior : 'smooth',
                                    });
                                    contactEmailInputRef?.current?.focus?.({ preventScroll: true });
                                }, 200);
                            }}>Change</ButtonIcon>
                        </td>
                    </tr>
                    <tr>
                        <th>Ship To</th>
                        <td><ShippingAddressReview /></td>
                        <td>
                            <ButtonIcon icon='edit' theme='primary' size='sm' buttonStyle='link' onClick={() => {
                                dispatch(setCheckoutStep('info'));
                                setTimeout(() => {
                                    shippingAddressInputRef?.current?.scrollIntoView({
                                        block    : 'start',
                                        behavior : 'smooth',
                                    });
                                    shippingAddressInputRef?.current?.focus?.({ preventScroll: true });
                                }, 200);
                            }}>Change</ButtonIcon>
                        </td>
                    </tr>
                    {(checkoutStep !== 'shipping') && <tr>
                        <th>Method</th>
                        <td><ShippingMethodReview /></td>
                        <td>
                            <ButtonIcon icon='edit' theme='primary' size='sm' buttonStyle='link' onClick={() => {
                                dispatch(setCheckoutStep('shipping'));
                                setTimeout(() => {
                                    shippingMethodOptionRef?.current?.scrollIntoView({
                                        block    : 'start',
                                        behavior : 'smooth',
                                    });
                                    shippingMethodOptionRef?.current?.focus?.({ preventScroll: true });
                                }, 200);
                            }}>Change</ButtonIcon>
                        </td>
                    </tr>}
                </tbody>
            </table>
        </AccessibilityProvider>
    );
}
const OrderReviewCompleted = () => {
    // stores:
    const {
        isLoadingStep,
    } = useSelector(selectCheckoutState);
    
    
    
    // jsx:
    return (
        <AccessibilityProvider enabled={!isLoadingStep}>
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
                        <td className='hasIcon'><PaymentMethodReview /></td>
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
    // stores:
    const {
        customerNickName,
        customerEmail,
    } = useSelector(selectCheckoutState);
    
    
    
    // jsx:
    return (
        <>
            {customerEmail} ({customerNickName})
        </>
    );
}
const ShippingAddressReview = () => {
    // context:
    const {countryList} = useCheckout();
    
    
    
    // stores:
    const {
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
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
const PaymentMethodReview = () => {
    // context:
    const {makePaymentApi} = useCheckout();
    
    
    
    // apis:
    const [, {data: payment}] = makePaymentApi;
    const paymentMethod = payment?.paymentMethod;
    const type          = paymentMethod?.type;
    const brand         = paymentMethod?.brand || undefined;
    const identifier    = paymentMethod?.identifier;
    
    
    
    // jsx:
    return (
        <>
            {!!brand ? <Image alt={brand} src={`/brands/${brand}.svg`} width={42} height={26} /> : (type?.toUpperCase() ?? type)}
            {!!identifier && <>&nbsp;({identifier})</>}
        </>
    );
}
const BillingAddressReview = () => {
    // context:
    const {countryList} = useCheckout();
    
    
    
    // stores:
    const {
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        billingAsShipping,
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
    } = useSelector(selectCheckoutState);
    
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
    
    
    
    // context:
    const {cartItems, priceList, shippingList, shippingMethodOptionRef} = useCheckout();
    
    
    
    // stores:
    const {
        shippingProvider,
    } = useSelector(selectCheckoutState);
    
    const selectedShipping = shippingList?.entities?.[shippingProvider ?? ''];
    
    const dispatch = useDispatch();
    
    
    
    const filteredShippingList = !shippingList ? undefined : Object.values(shippingList.entities).filter((shippingEntry): shippingEntry is Exclude<typeof shippingEntry, undefined> => !!shippingEntry);
    
    
    
    const totalProductWeights = cartItems.reduce((accum, item) => {
        const productUnitWeight = priceList?.entities?.[item.productId]?.shippingWeight;
        if (!productUnitWeight) return accum;
        return accum + (productUnitWeight * item.quantity);
    }, 0);
    
    
    
    // if no selected shipping method => auto select the cheapest one:
    useEffect(() => {
        if (selectedShipping) return; // already selected => ignore
        
        
        
        // find the cheapest shipping cost:
        const orderedConstAscending = (
            filteredShippingList
            ?.map((shippingEntry) => ({
                _id                : `${shippingEntry._id}`,
                totalShippingCosts : calculateShippingCost(totalProductWeights, shippingEntry) ?? -1, // -1 means: no need to ship (digital products)
            }))
            ?.sort((a, b) => a.totalShippingCosts - b.totalShippingCosts) // -1 means: no need to ship (digital products)
        );
        
        if (orderedConstAscending && orderedConstAscending.length >= 1) {
            dispatch(setShippingProvider(orderedConstAscending[0]._id));
        } // if
    }, [selectedShipping, filteredShippingList, totalProductWeights]);
    
    
    
    // jsx:
    return (
        <>
            {!!filteredShippingList && <List theme='primary' actionCtrl={true}>
                {filteredShippingList.map((shippingEntry) => {
                    const totalShippingCosts = calculateShippingCost(totalProductWeights, shippingEntry);
                    const isActive           = `${shippingEntry._id}` === shippingProvider;
                    
                    
                    
                    // jsx:
                    return (
                        <ListItem
                            key={`${shippingEntry._id}`}
                            className={styles.optionEntryHeader}
                            
                            active={isActive}
                            onClick={() => dispatch(setShippingProvider(`${shippingEntry._id}`))}
                            
                            elmRef={isActive ? shippingMethodOptionRef : undefined}
                        >
                            <Radio className='indicator' enableValidation={false} inheritActive={true} outlined={true} nude={true} tabIndex={-1} />
                            
                            <p className='name'>
                                {shippingEntry.name}
                            </p>
                            
                            {!!shippingEntry.estimate && <p className='estimate'>
                                Estimate: {shippingEntry.estimate}
                            </p>}
                            
                            <p className='cost'>
                                {formatCurrency(totalShippingCosts)}
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
    const {countryList, billingAddressSectionRef} = useCheckout();
    
    
    
    // stores:
    const {
        billingAsShipping,
        billingValidation,
        
        billingFirstName,
        billingLastName,
        
        billingPhone,
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
        
        
        
        paymentMethod,
        
        
        
        isLoadingStep,
    } = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
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
                    <ExclusiveAccordion enabled={!isLoadingStep} theme='primary' expandedListIndex={billingAsShipping ? 0 : 1} onExpandedChange={({expanded, listIndex}) => {
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
            </Collapse>
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
        
        
        
        isLoadingStep,
    } = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
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
            <ExclusiveAccordion enabled={!isLoadingStep} theme='primary' expandedListIndex={Math.max(0, paymentMethodList.findIndex((option) => (option === paymentMethod)))} onExpandedChange={({expanded, listIndex}) => {
                // conditions:
                if (!expanded) return;
                
                
                
                // actions:
                dispatch(setPaymentMethod(paymentMethodList[listIndex]));
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
                <AccordionItem label={<>
                    <Radio className='indicator' enableValidation={false} inheritActive={true} outlined={true} nude={true} tabIndex={-1} />
                    Bank Transfer
                    </>} listItemComponent={<ListItem className={styles.optionEntryHeader} />} contentComponent={<Section className={styles.paymentEntryManual} />} /*lazy={true} causes error*/ >
                    <PaymentMethodManual />
                </AccordionItem>
            </ExclusiveAccordion>
        </PayPalScriptProvider>
    );
}
const PaymentMethodCard = () => {
    // context:
    const {cardholderInputRef, handlePlaceOrder} = useCheckout();
    
    
    
    // stores:
    const {
        paymentMethod,
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
                        <Tooltip className='tooltip' theme='warning' size='sm' floatingOn={safeSignRef}>
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
                    <TextInput placeholder='Cardholder Name' inputMode='text' required autoComplete='cc-name' autoCapitalize='words' elmRef={cardholderInputRef} />
                    <Label theme='success' mild={true} className='solid' elmRef={nameSignRef}>
                        <Icon icon='help' />
                        <Tooltip className='tooltip' theme='warning' size='sm' floatingOn={nameSignRef}>
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
                        <Tooltip className='tooltip' theme='warning' size='sm' floatingOn={dateSignRef}>
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
                        <Tooltip className='tooltip' theme='warning' size='sm' floatingOn={cscSignRef}>
                            <p>
                                3-digit security code usually found on the back of your card.
                            </p>
                            <p>
                                American Express cards have a 4-digit code located on the front.
                            </p>
                        </Tooltip>
                    </Label>
                </Group>
                {((paymentMethod ?? 'card') === 'card') && <PortalToNavCheckoutSection>
                    <CardPaymentButton />
                </PortalToNavCheckoutSection>}
            </ValidationProvider>
        </PayPalHostedFieldsProvider>
    );
}
const PaymentMethodPaypal = () => {
    // context:
    const {handlePlaceOrder, handleMakePayment, handleOrderCompleted, showDialogMessageMakePaymentError} = useCheckout();
    
    
    
    // stores:
    const checkoutState = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
    // handlers:
    const handleFundApproved   = useEvent(async (paypalAuthentication: OnApproveData, actions: OnApproveActions): Promise<void> => {
        try {
            // update the UI:
            dispatch(setIsLoadingStep(true));
            
            
            
            // then forward the authentication to backend_API to receive the fund:
            await handleMakePayment(paypalAuthentication.orderID);
            handleOrderCompleted(/*paid:*/true);
        }
        catch (error: any) {
            showDialogMessageMakePaymentError(error);
        }
        finally {
            // update the UI:
            dispatch(setIsLoadingStep(false));
        } // try
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
                createOrder={handlePlaceOrder}
                onApprove={handleFundApproved}
                onShippingChange={handleShippingChange}
            />
        </>
    );
}
const PaymentMethodManual = () => {
    // stores:
    const {
        paymentMethod,
    } = useSelector(selectCheckoutState);
    
    
    
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
    // context:
    const {billingAddressSectionRef, paymentCardSectionRef, cardholderInputRef, handleMakePayment, handleOrderCompleted, showDialogMessageFieldsError, showDialogMessageMakePaymentError} = useCheckout();
    
    
    
    // stores:
    const {
        shippingFirstName : _shippingFirstName, // not implemented yet, because billingFirstName is not implemented
        shippingLastName  : _shippingLastName,  // not implemented yet, because billingLastName  is not implemented
        
        shippingPhone     : _shippingPhone,     // not implemented yet, because billingPhone     is not implemented
        
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        
        
        billingAsShipping,
        
        billingFirstName  : _billingFirstName,  // not implemented, already to use cardholderName
        billingLastName   : _billingLastName,   // not implemented, already to use cardholderName
        
        billingPhone      : _billingPhone,      // not implemented yet
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
        
        
        
        isLoadingStep,
    } = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
    // handlers:
    const hostedFields = usePayPalHostedFields();
    const handlePayButtonClicked = useEvent(async () => {
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        if (!billingAsShipping) await dispatch(setBillingValidation(true));
        await dispatch(setPaymentCardValidation(true));
        const invalidFields = [
            ...((!billingAsShipping ? billingAddressSectionRef?.current?.querySelectorAll?.(invalidSelector) : undefined) ?? []),
            ...(paymentCardSectionRef?.current?.querySelectorAll?.(invalidSelector) ?? []),
        ];
        if (invalidFields?.length) { // there is an/some invalid field
            showDialogMessageFieldsError(invalidFields);
            return;
        } // if
        
        
        
        // next:
        if (typeof(hostedFields.cardFields?.submit) !== 'function') return; // validate that `submit()` exists before using it
        try {
            // update the UI:
            dispatch(setIsLoadingStep(true));
            
            
            
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
            
            
            
            // then forward the authentication to backend_API to receive the fund:
            await handleMakePayment(paypalAuthentication.orderId);
            handleOrderCompleted(/*paid:*/true);
        }
        catch (error: any) {
            showDialogMessageMakePaymentError(error);
        }
        finally {
            // update the UI:
            dispatch(setIsLoadingStep(false));
        } // try
    });
    
    
    
    // jsx:
    return (
        <ButtonIcon className='next payNow' enabled={!isLoadingStep} icon={!isLoadingStep ? 'monetization_on' : 'busy'} theme='primary' size='lg' gradient={true} onClick={handlePayButtonClicked}>
            Pay Now
        </ButtonIcon>
    );
}
const ManualPaymentButton = () => {
    // context:
    const {handlePlaceOrder, handleMakePayment, handleOrderCompleted, showDialogMessagePlaceOrderError} = useCheckout();
    
    
    
    // stores:
    const {
        isLoadingStep,
    } = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
    // handlers:
    const handleFinishOrderButtonClicked = useEvent(async () => {
        try {
            // update the UI:
            dispatch(setIsLoadingStep(true));
            
            
            
            // createOrder:
            const orderId = await handlePlaceOrder({paymentSource: 'manual'});
            
            
            
            // then forward the authentication to backend_API to book the order (but not paid yet):
            await handleMakePayment(orderId);
            handleOrderCompleted(/*paid:*/false);
        }
        catch (error: any) {
            showDialogMessagePlaceOrderError(error);
        }
        finally {
            // update the UI:
            dispatch(setIsLoadingStep(false));
        } // try
    });
    
    
    
    // jsx:
    return (
        <ButtonIcon className='next finishOrder' enabled={!isLoadingStep} icon={!isLoadingStep ? 'done' : 'busy'} theme='primary' size='lg' gradient={true} onClick={handleFinishOrderButtonClicked}>
            Finish Order
        </ButtonIcon>
    );
}
interface PortalToNavCheckoutSectionProps {
    children : React.ReactNode
}
const PortalToNavCheckoutSection = (props: PortalToNavCheckoutSectionProps) => {
    // context:
    const {navCheckoutSectionElm} = useCheckout();
    
    
    
    const [isHydrated, setIsHydrated] = useState<boolean>(false);
    useEffect(() => {
        setIsHydrated(!!navCheckoutSectionElm);
    }, [navCheckoutSectionElm]);
    
    
    
    // jsx:
    return (
        <>
            {isHydrated && navCheckoutSectionElm && ReactDOM.createPortal(
                props.children,
                navCheckoutSectionElm
            )}
        </>
    );
}



const PaymentPending = () => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // stores:
    const {
        customerEmail,
    } = useSelector(selectCheckoutState);
    
    
    
    // jsx:
    return (
        <>
            <Section>
                <Alert theme='success' expanded={true} controlComponent={<></>}>
                    <p className='h5'>
                        Your order is confirmed.
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
    
    
    
    // stores:
    const {
        customerEmail,
    } = useSelector(selectCheckoutState);
    
    
    
    // jsx:
    return (
        <>
            <Section>
                <Alert theme='success' expanded={true} controlComponent={<></>}>
                    <p className='h5'>
                        Your order is confirmed and your payment is received.
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

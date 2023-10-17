import Head from 'next/head'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.scss'

import { Article, Section, Main } from '@heymarco/section'

import { AccordionItem, Alert, Badge, Busy, Button, ButtonIcon, CardBody, CardFooter, CardHeader, Check, CloseButton, Collapse, Container, Details, EditableTextControl, EditableTextControlProps, EmailInput, ExclusiveAccordion, Group, Icon, Label, List, ListItem, ModalCard, ModalCardProps, Radio, RadioProps, TextInput, Tooltip, useDialogMessage, useWindowResizeObserver, WindowResizeCallback } from '@reusable-ui/components'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'
import { PricePreview, ProductPreview, useGeneratePaymentToken, useGetCountryList, useGetPriceList, useGetProductList, useGetMatchingShippingList, usePlaceOrder, useMakePayment, PlaceOrderOptions } from '@/store/features/api/apiSlice'
import { formatCurrency } from '@/libs/formatters'
import { ImageProps, Image } from '@heymarco/image'
import Link from '@reusable-ui/next-compat-link'
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { CartEntry, selectCartItems, showCart } from '@/store/features/cart/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AccessibilityProvider, breakpoints, colorValues, ThemeName, typoValues, useEvent, useIsomorphicLayoutEffect, ValidationProvider } from '@reusable-ui/core'
import { CheckoutStep, selectCheckoutProgress, selectCheckoutState, setCheckoutStep as reduxSetCheckoutStep, setMarketingOpt, setPaymentToken, setShippingAddress, setShippingCity, setShippingCountry, setShippingFirstName, setShippingLastName, setShippingPhone, setShippingProvider, setShippingValidation, setShippingZip, setShippingZone, PaymentToken, setPaymentMethod, setBillingAddress, setBillingCity, setBillingCountry, setBillingFirstName, setBillingLastName, setBillingPhone, setBillingZip, setBillingZone, setBillingValidation, setBillingAsShipping, setPaymentValidation, setIsBusy as reduxSetIsBusy, PaymentMethod, setCustomerEmail, setCustomerNickName } from '@/store/features/checkout/checkoutSlice'
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
import { resolveMediaUrl } from '@/libs/mediaStorage.client'

// apis:
import type { CountryPreview } from '@/pages/api/countryList'



// const inter = Inter({ subsets: ['latin'] })
const useCheckoutStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'@/styles/checkout')
, { id: 'checkout' });



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



// contexts:
export interface CheckoutState {
    // states:
    checkoutStep                      : CheckoutStep
    setCheckoutStep                   : (checkoutStep: CheckoutStep) => void
    checkoutProgress                  : number
    
    isBusy                            : boolean,
    setIsBusy                         : (isBusy: boolean) => void
    
    isLoadingPage                     : boolean
    isErrorPage                       : boolean
    isReadyPage                       : boolean
    
    isLoadingShipping                 : boolean
    isErrorShipping                   : boolean
    
    isDesktop                         : boolean
    
    
    
    // data:
    cartItems                         : CartEntry[]
    hasCart                           : boolean
    
    paymentToken                      : PaymentToken|undefined
    
    
    
    // relations:
    priceList                         : EntityState<PricePreview>     | undefined
    productList                       : EntityState<ProductPreview>   | undefined
    countryList                       : EntityState<CountryPreview>   | undefined
    shippingList                      : EntityState<MatchingShipping> | undefined
    
    
    
    // sections:
    regularCheckoutSectionRef         : React.MutableRefObject<HTMLElement|null>      | undefined
    shippingMethodOptionRef           : React.MutableRefObject<HTMLElement|null>      | undefined
    billingAddressSectionRef          : React.MutableRefObject<HTMLElement|null>      | undefined
    paymentCardSectionRef             : React.MutableRefObject<HTMLElement|null>      | undefined
    currentStepSectionRef             : React.MutableRefObject<HTMLElement|null>      | undefined
    navCheckoutSectionElm             : React.MutableRefObject<HTMLElement|null>      | undefined
    
    
    
    // fields:
    contactEmailInputRef              : React.MutableRefObject<HTMLInputElement|null> | undefined
    shippingAddressInputRef           : React.MutableRefObject<HTMLInputElement|null> | undefined
    cardholderInputRef                : React.MutableRefObject<HTMLInputElement|null> | undefined
    
    
    
    // actions:
    checkShippingProviderAvailability : (address: MatchingAddress) => Promise<boolean>
    doPlaceOrder                      : (options?: PlaceOrderOptions) => Promise<string>
    doMakePayment                     : (orderId: string, paid: boolean) => Promise<void>
    
    
    
    // apis:
    placeOrderApi                     : ReturnType<typeof usePlaceOrder>
    makePaymentApi                    : ReturnType<typeof useMakePayment>
}

const CheckoutStateContext = createContext<CheckoutState>({
    // states:
    checkoutStep                      : 'info',
    setCheckoutStep                   : () => {},
    checkoutProgress                  : 0,
    
    isBusy                            : false,
    setIsBusy                         : () => {},
    
    isLoadingPage                     : false,
    isErrorPage                       : false,
    isReadyPage                       : false,
    
    isLoadingShipping                 : false,
    isErrorShipping                   : false,
    
    isDesktop                         : false,
    
    
    
    // data:
    cartItems                         : [],
    hasCart                           : false,
    
    paymentToken                      : undefined,
    
    
    
    // relations:
    priceList                         : undefined,
    productList                       : undefined,
    countryList                       : undefined,
    shippingList                      : undefined,
    
    
    
    // sections:
    regularCheckoutSectionRef         : undefined,
    shippingMethodOptionRef           : undefined,
    billingAddressSectionRef          : undefined,
    paymentCardSectionRef             : undefined,
    currentStepSectionRef             : undefined,
    navCheckoutSectionElm             : undefined,
    
    
    
    // fields:
    contactEmailInputRef              : undefined,
    shippingAddressInputRef           : undefined,
    cardholderInputRef                : undefined,
    
    
    
    // actions:
    checkShippingProviderAvailability : undefined as any,
    doPlaceOrder                      : undefined as any,
    doMakePayment                     : undefined as any,
    
    
    
    // apis:
    placeOrderApi                     : undefined as any,
    makePaymentApi                    : undefined as any,
});
export const useCheckoutState = (): CheckoutState => {
    return useContext(CheckoutStateContext);
};



// react components:
export interface CheckoutStateProps {
}
const CheckoutStateProvider = (props: React.PropsWithChildren<CheckoutStateProps>) => {
    // rest props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // stores:
    const cartItems        = useSelector(selectCartItems);
    const checkoutState    = useSelector(selectCheckoutState);
    const {
        // states:
        checkoutStep,
        isBusy,
        
        
        
        // extras:
        marketingOpt,
        
        
        
        // customer data:
        customerNickName,
        customerEmail,
        
        
        
        // shipping data:
        shippingFirstName,
        shippingLastName,
        
        shippingPhone,
        
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        shippingProvider,
        
        
        
        // billing data:
        billingAsShipping,
        
        billingFirstName,
        billingLastName,
        
        billingPhone,
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
        
        
        
        // payment data:
        paymentToken : existingPaymentToken,
    } = checkoutState;
    const checkoutProgress = useSelector(selectCheckoutProgress);
    const hasCart = !!cartItems.length;
    const dispatch = useDispatch();
    
    const setCheckoutStep = useEvent((checkoutStep: CheckoutStep): void => {
        dispatch(reduxSetCheckoutStep(checkoutStep));
    });
    const setIsBusy       = useEvent((isBusy: boolean): void => {
        dispatch(reduxSetIsBusy(isBusy));
    });
    
    
    
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
    
    
    
    // states:
    const [isDesktop, setIsDesktop] = useState<boolean>(false); // mobile first
    
    const handleWindowResize = useEvent<WindowResizeCallback>(({inlineSize: mediaCurrentWidth}) => {
        const breakpoint = breakpoints.lg;
        const newIsDesktop = (!!breakpoint && (mediaCurrentWidth >= breakpoint));
        if (isDesktop === newIsDesktop) return;
        setIsDesktop(newIsDesktop);
    });
    useWindowResizeObserver(handleWindowResize);
    
    
    
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
            setCheckoutStep('info');
            
            
            
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
            setCheckoutStep('shipping');
        }
        else {
            // no valid selected shippingProvider -AND- no shippingList => go back to information page:
            setCheckoutStep('info');
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
    
    
    
    // refs:
    const regularCheckoutSectionRef = useRef<HTMLElement|null>(null);
    const shippingMethodOptionRef   = useRef<HTMLElement|null>(null);
    const billingAddressSectionRef  = useRef<HTMLElement|null>(null);
    const paymentCardSectionRef     = useRef<HTMLElement|null>(null);
    const currentStepSectionRef     = useRef<HTMLElement|null>(null);
    const navCheckoutSectionElm     = useRef<HTMLElement|null>(null);
    
    const contactEmailInputRef      = useRef<HTMLInputElement|null>(null);
    const shippingAddressInputRef   = useRef<HTMLInputElement|null>(null);
    const cardholderInputRef        = useRef<HTMLInputElement|null>(null);
    
    
    
    // apis:
    const placeOrderApi  = usePlaceOrder();
    const [placeOrder]   = placeOrderApi;
    
    const makePaymentApi = useMakePayment();
    const [makePayment] = makePaymentApi;
    
    
    
    // dialogs:
    const {
        showMessageError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const checkShippingProviderAvailability = useEvent(async (address: MatchingAddress): Promise<boolean> => {
        try {
            const shippingList = await getShippingByAddress(address).unwrap();
            
            
            
            if (!shippingList.ids.length) {
                showMessageError({
                    title : <h1>No Shipping Agency</h1>,
                    error : <>
                        <p>
                            We&apos;re sorry. There are <strong>no shipping agencies available</strong> for delivery to your shipping address.
                        </p>
                        <p>
                            Please contact us for further assistance.
                        </p>
                    </>,
                });
                return false;
            } // if
            
            
            
            return true;
        }
        catch (error: any) {
            showMessageError({
                title : <h1>Error Calculating Shipping Cost</h1>,
                error : <>
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
                </>,
            });
            return false;
        } // try
    });
    const doPlaceOrder                      = useEvent(async (options?: PlaceOrderOptions): Promise<string> => {
        try {
            const placeOrderResponse = await placeOrder({
                // cart item(s):
                items : cartItems,
                
                
                
                // shipping data:
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
            showMessageFetchError({ error, context: 'order' });
            throw error;
        } // try
    });
    const doMakePayment                     = useEvent(async (orderId: string, paid: boolean): Promise<void> => {
        await makePayment({
            orderId,
            
            
            
            // extras:
            marketingOpt,
            
            
            
            // customer data:
            customerNickName,
            customerEmail,
            
            
            
            // billing data:
            billingFirstName : billingAsShipping ? shippingFirstName : billingFirstName,
            billingLastName  : billingAsShipping ? shippingLastName  : billingLastName,
            
            billingPhone     : billingAsShipping ? shippingPhone     : billingPhone,
            
            billingAddress   : billingAsShipping ? shippingAddress   : billingAddress,
            billingCity      : billingAsShipping ? shippingCity      : billingCity,
            billingZone      : billingAsShipping ? shippingZone      : billingZone,
            billingZip       : billingAsShipping ? shippingZip       : billingZip,
            billingCountry   : billingAsShipping ? shippingCountry   : billingCountry,
        }).unwrap();
        
        setCheckoutStep(paid ? 'paid' : 'pending');
    });
    
    
    
    const checkoutData = useMemo<CheckoutState>(() => ({
        // states:
        checkoutStep,
        setCheckoutStep,                   // stable ref
        checkoutProgress,
        
        isBusy,
        setIsBusy,                         // stable ref
        
        isLoadingPage,
        isErrorPage,
        isReadyPage,
        
        isLoadingShipping,
        isErrorShipping,
        
        isDesktop,
        
        
        
        // data:
        cartItems,
        hasCart,
        
        paymentToken: existingPaymentToken,
        
        
        
        // relations:
        priceList,
        productList,
        countryList,
        shippingList,
        
        
        
        // sections:
        regularCheckoutSectionRef,         // stable ref
        shippingMethodOptionRef,           // stable ref
        billingAddressSectionRef,          // stable ref
        paymentCardSectionRef,             // stable ref
        currentStepSectionRef,             // stable ref
        navCheckoutSectionElm,             // mutable ref
        
        
        
        // fields:
        contactEmailInputRef,              // stable ref
        shippingAddressInputRef,           // stable ref
        cardholderInputRef,                // stable ref
        
        
        
        // actions:
        checkShippingProviderAvailability, // stable ref
        doPlaceOrder,                      // stable ref
        doMakePayment,                     // stable ref
        
        
        
        // apis:
        placeOrderApi,
        makePaymentApi,
    }), [
        // states:
        checkoutStep,
        // setCheckoutStep,                   // stable ref
        checkoutProgress,
        
        isBusy,
        setIsBusy,                            // stable ref
        
        isLoadingPage,
        isErrorPage,
        isReadyPage,
        
        isLoadingShipping,
        isErrorShipping,
        
        isDesktop,
        
        
        
        // data:
        cartItems,
        hasCart,
        
        existingPaymentToken,
        
        
        
        // relations:
        priceList,
        productList,
        countryList,
        shippingList,
        
        
        
        // sections:
        // regularCheckoutSectionRef,         // stable ref
        // shippingMethodOptionRef,           // stable ref
        // billingAddressSectionRef,          // stable ref
        // paymentCardSectionRef,             // stable ref
        // currentStepSectionRef,             // stable ref
        navCheckoutSectionElm,                // mutable ref
        
        
        
        // fields:
        // contactEmailInputRef,              // stable ref
        // shippingAddressInputRef,           // stable ref
        // cardholderInputRef,                // stable ref
        
        
        
        // actions:
        // checkShippingProviderAvailability, // stable ref
        // doPlaceOrder,                      // stable ref
        // doMakePayment,                     // stable ref
        
        
        
        // apis:
        placeOrderApi,
        makePaymentApi,
    ]);
    
    
    // jsx:
    return (
        <CheckoutStateContext.Provider value={checkoutData}>
            {children}
        </CheckoutStateContext.Provider>
    )
};
export default function Checkout() {
    // jsx:
    return (
        <CheckoutStateProvider>
            <CheckoutInternal />
        </CheckoutStateProvider>
    );
}
function CheckoutInternal() {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // data:
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
            <Main nude={true}>
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
            </Main>
        </>
    );
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
    // context:
    const {checkoutStep, checkoutProgress, regularCheckoutSectionRef, checkShippingProviderAvailability} = useCheckoutState();
    const isOrderConfirmShown = ['pending', 'paid'].includes(checkoutStep);
    
    
    
    // states:
    const {
        // states:
        setCheckoutStep,
        isBusy,
        setIsBusy,
    } = useCheckoutState();
    
    // stores:
    const {
        shippingCity,
        shippingZone,
        shippingCountry,
    } = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
    // dialogs:
    const {
        showMessageFieldError,
    } = useDialogMessage();
    
    
    
    // utilities:
    const prevAction = [
        { text: 'Return to cart'       , action: () => dispatch(showCart(true))    },
        { text: 'Return to information', action: () => setCheckoutStep('info')     },
        { text: 'Return to shipping'   , action: () => setCheckoutStep('shipping') },
    ][checkoutProgress];
    
    const nextAction = [
        { text: 'Continue to shipping' , action: async () => {
            // validate:
            // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
            await dispatch(setShippingValidation(true));
            await new Promise<void>((resolve) => { // wait for a validation state applied
                setTimeout(() => {
                    setTimeout(() => {
                        resolve();
                    }, 0);
                }, 0);
            });
            const fieldErrors = regularCheckoutSectionRef?.current?.querySelectorAll?.(invalidSelector);
            if (fieldErrors?.length) { // there is an/some invalid field
                showMessageFieldError(fieldErrors);
                return;
            } // if
            
            
            
            // next:
            try {
                // update the UI:
                setIsBusy(true);
                
                
                
                if (await checkShippingProviderAvailability({
                    city    : shippingCity,
                    zone    : shippingZone,
                    country : shippingCountry,
                })) {
                    setCheckoutStep('shipping');
                } // if
            }
            finally {
                // update the UI:
                setIsBusy(false);
            } // try
        }},
        { text: 'Continue to payment'  , action: () => setCheckoutStep('payment') },
        { text: 'Pay Now' , action: () => {
            // payment action
        }},
    ][checkoutProgress];
    
    
    
    // jsx:
    return (
        <>
            {!isOrderConfirmShown && <>
                {!isOrderConfirmShown && <ButtonIcon
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
                
                {(checkoutStep !== 'payment') && <ButtonIcon
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
            
            {isOrderConfirmShown && <>
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
    const {cartItems, priceList, productList, shippingList} = useCheckoutState();
    
    
    
    // stores:
    const {
        shippingProvider,
    } = useSelector(selectCheckoutState);
    
    const selectedShipping    = shippingList?.entities?.[shippingProvider ?? ''] ?? null;
    
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
    const {checkoutStep, contactEmailInputRef, shippingAddressInputRef, shippingMethodOptionRef} = useCheckoutState();
    
    
    
    // states:
    const {
        // states:
        setCheckoutStep,
        isBusy,
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
                                setCheckoutStep('info');
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
                                setCheckoutStep('info');
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
                                setCheckoutStep('shipping');
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
    const {countryList} = useCheckoutState();
    
    
    
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
    const {shippingList} = useCheckoutState();
    
    
    
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
    const {cartItems, priceList, shippingList, shippingMethodOptionRef} = useCheckoutState();
    
    
    
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
                id                 : `${shippingEntry.id}`,
                totalShippingCosts : calculateShippingCost(totalProductWeights, shippingEntry) ?? -1, // -1 means: no need to ship (digital products)
            }))
            ?.sort((a, b) => a.totalShippingCosts - b.totalShippingCosts) // -1 means: no need to ship (digital products)
        );
        
        if (orderedConstAscending && orderedConstAscending.length >= 1) {
            dispatch(setShippingProvider(orderedConstAscending[0].id));
        } // if
    }, [selectedShipping, filteredShippingList, totalProductWeights]);
    
    
    
    // jsx:
    return (
        <>
            {!!filteredShippingList && <List theme='primary' actionCtrl={true}>
                {filteredShippingList.map((shippingEntry) => {
                    const totalShippingCosts = calculateShippingCost(totalProductWeights, shippingEntry);
                    return {...shippingEntry, totalShippingCosts};
                }).sort(({totalShippingCosts: a}, {totalShippingCosts: b}): number => (a ?? 0) - (b ?? 0)).map(({totalShippingCosts, ...shippingEntry}) => {
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
    const {countryList, billingAddressSectionRef} = useCheckoutState();
    
    
    
    // states:
    const {
        // states:
        isBusy,
    } = useCheckoutState();
    
    
    
    // stores:
    const {
        billingValidation,
        billingAsShipping,
        
        billingFirstName,
        billingLastName,
        
        billingPhone,
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
        
        
        
        paymentMethod,
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
                    <ExclusiveAccordion enabled={!isBusy} theme='primary' expandedListIndex={billingAsShipping ? 0 : 1} onExpandedChange={({expanded, listIndex}) => {
                        // conditions:
                        if (!expanded) return;
                        
                        
                        
                        // actions:
                        dispatch(setBillingAsShipping(listIndex === 0));
                        if (listIndex === 0) dispatch(setBillingValidation(false));
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
    const {paymentCardSectionRef, paymentToken} = useCheckoutState();
    
    
    
    // states:
    const {
        // states:
        isBusy,
    } = useCheckoutState();
    
    
    
    // stores:
    const {
        paymentMethod,
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
            <ExclusiveAccordion enabled={!isBusy} theme='primary' expandedListIndex={Math.max(0, paymentMethodList.findIndex((option) => (option === paymentMethod)))} onExpandedChange={({expanded, listIndex}) => {
                // conditions:
                if (!expanded) return;
                
                
                
                // actions:
                dispatch(setPaymentMethod(paymentMethodList[listIndex]));
                if (listIndex !== 0) dispatch(setPaymentValidation(false));
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
    
    
    
    // stores:
    const {
        paymentValidation,
        paymentMethod,
    } = useSelector(selectCheckoutState);
    
    
    
    // refs:
    const safeSignRef = useRef<HTMLElement|null>(null);
    const nameSignRef = useRef<HTMLElement|null>(null);
    const dateSignRef = useRef<HTMLElement|null>(null);
    const cscSignRef  = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    return (
        <PayPalHostedFieldsProvider styles={hostedFieldsStyle} createOrder={doPlaceOrder}>
            <ValidationProvider enableValidation={paymentValidation}>
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
    const {doPlaceOrder, doMakePayment} = useCheckoutState();
    
    
    
    // states:
    const {
        // states:
        setIsBusy,
    } = useCheckoutState();
    
    
    
    // stores:
    const checkoutState = useSelector(selectCheckoutState);
    
    
    
    // dialogs:
    const {
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleFundApproved   = useEvent(async (paypalAuthentication: OnApproveData, actions: OnApproveActions): Promise<void> => {
        try {
            // update the UI:
            setIsBusy(true);
            
            
            
            // then forward the authentication to backend_API to receive the fund:
            await doMakePayment(paypalAuthentication.orderID, /*paid:*/true);
        }
        catch (error: any) {
            showMessageFetchError({ error, context: 'payment' });
        }
        finally {
            // update the UI:
            setIsBusy(false);
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
                createOrder={doPlaceOrder}
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
    const {billingAddressSectionRef, paymentCardSectionRef, cardholderInputRef, doMakePayment} = useCheckoutState();
    
    
    
    // states:
    const {
        // states:
        isBusy,
        setIsBusy,
    } = useCheckoutState();
    
    
    
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
    } = useSelector(selectCheckoutState);
    const dispatch = useDispatch();
    
    
    
    // dialogs:
    const {
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const hostedFields = usePayPalHostedFields();
    const handlePayButtonClicked = useEvent(async () => {
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        if (!billingAsShipping) await dispatch(setBillingValidation(true));
        await dispatch(setPaymentValidation(true));
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        const fieldErrors = [
            ...((!billingAsShipping ? billingAddressSectionRef?.current?.querySelectorAll?.(invalidSelector) : undefined) ?? []),
            ...(paymentCardSectionRef?.current?.querySelectorAll?.(invalidSelector) ?? []),
        ];
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        // next:
        if (typeof(hostedFields.cardFields?.submit) !== 'function') return; // validate that `submit()` exists before using it
        try {
            // update the UI:
            setIsBusy(true);
            
            
            
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
            await doMakePayment(paypalAuthentication.orderId, /*paid:*/true);
        }
        catch (error: any) {
            showMessageFetchError({ error, context: 'payment' });
        }
        finally {
            // update the UI:
            setIsBusy(false);
        } // try
    });
    
    
    
    // jsx:
    return (
        <ButtonIcon className='next payNow' enabled={!isBusy} icon={!isBusy ? 'monetization_on' : 'busy'} theme='primary' size='lg' gradient={true} onClick={handlePayButtonClicked}>
            Pay Now
        </ButtonIcon>
    );
}
const ManualPaymentButton = () => {
    // context:
    const {doPlaceOrder, doMakePayment} = useCheckoutState();
    
    
    
    // states:
    const {
        // states:
        isBusy,
        setIsBusy,
    } = useCheckoutState();
    
    
    
    // dialogs:
    const {
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleFinishOrderButtonClicked = useEvent(async () => {
        try {
            // update the UI:
            setIsBusy(true);
            
            
            
            // createOrder:
            const orderId = await doPlaceOrder({paymentSource: 'manual'});
            
            
            
            // then forward the authentication to backend_API to book the order (but not paid yet):
            await doMakePayment(orderId, /*paid:*/false);
        }
        catch (error: any) {
            showMessageFetchError({ error, context: 'order' });
        }
        finally {
            // update the UI:
            setIsBusy(false);
        } // try
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

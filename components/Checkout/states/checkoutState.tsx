'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
}                           from 'react'

// redux:
import {
    useDispatch,
    useSelector,
}                           from 'react-redux'
import type {
    EntityState
}                           from '@reduxjs/toolkit'

// reusable-ui core:
import {
    // a responsive management system:
    breakpoints,
    
    
    
    // hooks:
    useIsomorphicLayoutEffect,
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // utility-components:
    WindowResizeCallback,
    useWindowResizeObserver,
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// stores:
import {
    // types:
    CartEntry,
    
    
    
    // selectors:
    selectCartItems,
}                           from '@/store/features/cart/cartSlice'
import {
    // types:
    CheckoutStep,
    PaymentToken,
    
    
    
    // dispatchers:
    setCheckoutStep  as reduxSetCheckoutStep,
    setIsBusy        as reduxSetIsBusy,
    setPaymentToken,
    
    
    
    // selectors:
    selectCheckoutState,
    selectCheckoutProgress,
}                           from '@/store/features/checkout/checkoutSlice'
import {
    // types:
    PricePreview,
    ProductPreview,
    PlaceOrderOptions,
    
    
    
    // hooks:
    useGetProductList,
    useGetPriceList,
    useGetCountryList,
    useGetMatchingShippingList,
    useGeneratePaymentToken,
    usePlaceOrder,
    useMakePayment,
}                           from '@/store/features/api/apiSlice'

// apis:
import type {
    CountryPreview,
}                           from '@/pages/api/countryList'

// internals:
import type {
    // types:
    MatchingShipping,
    MatchingAddress,
}                           from '@/libs/shippings'



// hooks:

// states:

//#region checkoutState

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
    
    
    
    // cart data:
    cartItems                         : CartEntry[]
    hasCart                           : boolean
    
    
    
    // payment data:
    paymentToken                      : PaymentToken|undefined
    
    
    
    // relation data:
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
    
    
    
    // cart data:
    cartItems                         : [],
    hasCart                           : false,
    
    
    
    // payment data:
    paymentToken                      : undefined,
    
    
    
    // relation data:
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
    
    
    
    // dispatchers:
    const dispatch        = useDispatch();
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
        
        
        
        // cart data:
        cartItems,
        hasCart,
        
        
        
        // payment data:
        paymentToken: existingPaymentToken,
        
        
        
        // relation data:
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
        
        
        
        // cart data:
        cartItems,
        hasCart,
        
        
        
        // payment data:
        existingPaymentToken,
        
        
        
        // relation data:
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
export {
    CheckoutStateProvider,
    CheckoutStateProvider as default,
}
//#endregion checkoutState

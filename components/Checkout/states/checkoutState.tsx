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
    PaymentMethod,
    
    
    
    // states:
    setCheckoutStep      as reduxSetCheckoutStep,
    setIsBusy            as reduxSetIsBusy,
    
    // extra data:
    setMarketingOpt      as reduxSetMarketingOpt,
    
    // customer data:
    setCustomerEmail     as reduxSetCustomerEmail,
    setCustomerNickName  as reduxSetCustomerNickName,
    
    // shipping data:
    setShippingFirstName as reduxSetShippingFirstName,
    setShippingLastName  as reduxSetShippingLastName,
    
    setShippingPhone     as reduxSetShippingPhone,
    
    setShippingAddress   as reduxSetShippingAddress,
    setShippingCity      as reduxSetShippingCity,
    setShippingZone      as reduxSetShippingZone,
    setShippingZip       as reduxSetShippingZip,
    setShippingCountry   as reduxSetShippingCountry,
    
    // billing data:
    setBillingAsShipping as reduxSetBillingAsShipping,
    setBillingFirstName  as reduxSetBillingFirstName,
    setBillingLastName   as reduxSetBillingLastName,
    setBillingPhone      as reduxSetBillingPhone,
    setBillingAddress    as reduxSetBillingAddress,
    setBillingCity       as reduxSetBillingCity,
    setBillingZone       as reduxSetBillingZone,
    setBillingZip        as reduxSetBillingZip,
    setBillingCountry    as reduxSetBillingCountry,
    
    // payment data:
    setPaymentToken,
    
    
    
    // selectors:
    selectCheckoutState,
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
import {
    // hooks:
    FieldHandlers,
    useFieldState,
}                           from '../hooks'



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
    
    
    
    // extra data:
    marketingOpt                      : boolean
    marketingOptHandlers              : FieldHandlers<HTMLInputElement>
    
    
    
    // customer data:
    customerNickName                  : string
    customerNickNameHandlers          : FieldHandlers<HTMLInputElement>
    
    customerEmail                     : string
    customerEmailHandlers             : FieldHandlers<HTMLInputElement>
    
    
    
    // shipping data:
    shippingValidation                : boolean
    
    
    shippingFirstName                 : string
    shippingFirstNameHandlers         : FieldHandlers<HTMLInputElement>
    
    shippingLastName                  : string
    shippingLastNameHandlers          : FieldHandlers<HTMLInputElement>
    
    
    shippingPhone                     : string
    shippingPhoneHandlers             : FieldHandlers<HTMLInputElement>
    
    
    shippingAddress                   : string
    shippingAddressHandlers           : FieldHandlers<HTMLInputElement>
    
    shippingCity                      : string
    shippingCityHandlers              : FieldHandlers<HTMLInputElement>
    
    shippingZone                      : string
    shippingZoneHandlers              : FieldHandlers<HTMLInputElement>
    
    shippingZip                       : string
    shippingZipHandlers               : FieldHandlers<HTMLInputElement>
    
    shippingCountry                   : string
    shippingCountryHandlers           : FieldHandlers<HTMLInputElement>
    
    
    shippingProvider                  : string | undefined
    
    
    
    // billing data:
    billingValidation                 : boolean
    
    
    billingAsShipping                 : boolean
    setBillingAsShipping              : React.Dispatch<React.SetStateAction<boolean>>
    
    
    billingFirstName                  : string
    billingFirstNameHandlers          : FieldHandlers<HTMLInputElement>
    
    billingLastName                   : string
    billingLastNameHandlers           : FieldHandlers<HTMLInputElement>
    
    
    billingPhone                      : string
    billingPhoneHandlers              : FieldHandlers<HTMLInputElement>
    
    
    billingAddress                    : string
    billingAddressHandlers            : FieldHandlers<HTMLInputElement>
    
    billingCity                       : string
    billingCityHandlers               : FieldHandlers<HTMLInputElement>
    
    billingZone                       : string
    billingZoneHandlers               : FieldHandlers<HTMLInputElement>
    
    billingZip                        : string
    billingZipHandlers                : FieldHandlers<HTMLInputElement>
    
    billingCountry                    : string
    billingCountryHandlers            : FieldHandlers<HTMLInputElement>
    
    
    
    // payment data:
    paymentValidation                 : boolean
    paymentMethod                     : PaymentMethod | undefined
    paymentToken                      : PaymentToken  | undefined
    
    
    
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

const noopHandler : FieldHandlers<HTMLInputElement> = { onChange: () => {} };
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
    
    
    
    // extra data:
    marketingOpt                      : true,
    marketingOptHandlers              : noopHandler,
    
    
    
    // customer data:
    customerNickName                  : '',
    customerNickNameHandlers          : noopHandler,
    
    customerEmail                     : '',
    customerEmailHandlers             : noopHandler,
    
    
    
    // shipping data:
    shippingValidation                : false,
    
    
    shippingFirstName                 : '',
    shippingFirstNameHandlers         : noopHandler,
    shippingLastName                  : '',
    shippingLastNameHandlers          : noopHandler,
    
    
    shippingPhone                     : '',
    shippingPhoneHandlers             : noopHandler,
    
    
    shippingAddress                   : '',
    shippingAddressHandlers           : noopHandler,
    shippingCity                      : '',
    shippingCityHandlers              : noopHandler,
    shippingZone                      : '',
    shippingZoneHandlers              : noopHandler,
    shippingZip                       : '',
    shippingZipHandlers               : noopHandler,
    shippingCountry                   : '',
    shippingCountryHandlers           : noopHandler,
    
    
    shippingProvider                  : undefined,
    
    
    
    // billing data:
    billingValidation                 : false,
    
    
    billingAsShipping                 : true,
    setBillingAsShipping              : noopHandler as any,
    
    
    billingFirstName                  : '',
    billingFirstNameHandlers          : noopHandler,
    
    billingLastName                   : '',
    billingLastNameHandlers           : noopHandler,
    
    
    billingPhone                      : '',
    billingPhoneHandlers              : noopHandler,
    
    
    billingAddress                    : '',
    billingAddressHandlers            : noopHandler,
    
    billingCity                       : '',
    billingCityHandlers               : noopHandler,
    
    billingZone                       : '',
    billingZoneHandlers               : noopHandler,
    
    billingZip                        : '',
    billingZipHandlers                : noopHandler,
    
    billingCountry                    : '',
    billingCountryHandlers            : noopHandler,
    
    
    
    // payment data:
    paymentValidation                 : false,
    paymentMethod                     : undefined,
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
CheckoutStateContext.displayName  = 'CheckoutState';

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
    const hasCart          = !!cartItems.length;
    
    const {
        // states:
        checkoutStep,
        isBusy,
        
        
        
        // shipping data:
        shippingValidation,
        
        shippingProvider,
        
        
        
        // billing data:
        billingValidation,
        
        
        
        // payment data:
        paymentValidation,
        paymentMethod,
        paymentToken,
    } = useSelector(selectCheckoutState);
    const checkoutProgress = ['info', 'shipping', 'payment', 'pending', 'paid'].findIndex((progress) => progress === checkoutStep);
    
    
    
    // extra data:
    const [marketingOpt      , , marketingOptHandlers     ] = useFieldState({ field: 'marketingOpt'     , dispatch: reduxSetMarketingOpt      });
    
    
    
    // customer data:
    const [customerNickName  , , customerNickNameHandlers ] = useFieldState({ field: 'customerNickName' , dispatch: reduxSetCustomerNickName  });
    const [customerEmail     , , customerEmailHandlers    ] = useFieldState({ field: 'customerEmail'    , dispatch: reduxSetCustomerEmail     });
    
    
    
    // shipping data:
    const [shippingFirstName , , shippingFirstNameHandlers] = useFieldState({ field: 'shippingFirstName', dispatch: reduxSetShippingFirstName });
    const [shippingLastName  , , shippingLastNameHandlers ] = useFieldState({ field: 'shippingLastName' , dispatch: reduxSetShippingLastName  });
    
    const [shippingPhone     , , shippingPhoneHandlers    ] = useFieldState({ field: 'shippingPhone'    , dispatch: reduxSetShippingPhone     });
    
    const [shippingAddress   , , shippingAddressHandlers  ] = useFieldState({ field: 'shippingAddress'  , dispatch: reduxSetShippingAddress   });
    const [shippingCity      , , shippingCityHandlers     ] = useFieldState({ field: 'shippingCity'     , dispatch: reduxSetShippingCity      });
    const [shippingZone      , , shippingZoneHandlers     ] = useFieldState({ field: 'shippingZone'     , dispatch: reduxSetShippingZone      });
    const [shippingZip       , , shippingZipHandlers      ] = useFieldState({ field: 'shippingZip'      , dispatch: reduxSetShippingZip       });
    const [shippingCountry   , , shippingCountryHandlers  ] = useFieldState({ field: 'shippingCountry'  , dispatch: reduxSetShippingCountry   });
    
    
    
    // billing data:
    const [billingAsShipping , setBillingAsShipping       ] = useFieldState({ field: 'billingAsShipping', dispatch: reduxSetBillingAsShipping });
    const [billingFirstName  , , billingFirstNameHandlers ] = useFieldState({ field: 'billingFirstName' , dispatch: reduxSetBillingFirstName  });
    const [billingLastName   , , billingLastNameHandlers  ] = useFieldState({ field: 'billingLastName'  , dispatch: reduxSetBillingLastName   });
    const [billingPhone      , , billingPhoneHandlers     ] = useFieldState({ field: 'billingPhone'     , dispatch: reduxSetBillingPhone      });
    const [billingAddress    , , billingAddressHandlers   ] = useFieldState({ field: 'billingAddress'   , dispatch: reduxSetBillingAddress    });
    const [billingCity       , , billingCityHandlers      ] = useFieldState({ field: 'billingCity'      , dispatch: reduxSetBillingCity       });
    const [billingZone       , , billingZoneHandlers      ] = useFieldState({ field: 'billingZone'      , dispatch: reduxSetBillingZone       });
    const [billingZip        , , billingZipHandlers       ] = useFieldState({ field: 'billingZip'       , dispatch: reduxSetBillingZip        });
    const [billingCountry    , , billingCountryHandlers   ] = useFieldState({ field: 'billingCountry'   , dispatch: reduxSetBillingCountry    });
    
    
    
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
    
    const isLoadingPage                  = isLoading1 || isLoading2 || isLoading3 ||  !paymentToken || isNeedsRecoverShippingList;
    const isErrorPage                    = !isLoadingPage && (isError1   || isError2   || isError3   || (!paymentToken && isError5));
    const isReadyPage                    = !isLoadingPage && (hasCart && !!priceList && !!productList && !!countryList && !!paymentToken);
    
    
    
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
    }, [isNeedsRecoverShippingList, shippingCity, shippingZone, shippingCountry]);
    
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
    
    
    
    // stable callbacks:
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
            
            
            
            // extra data:
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
    
    
    
    // apis:
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
        
        
        
        // extra data:
        marketingOpt,
        marketingOptHandlers,              // stable ref
        
        
        
        // customer data:
        customerNickName,
        customerNickNameHandlers,          // stable ref
        
        customerEmail,
        customerEmailHandlers,             // stable ref
        
        
        
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
        
        
        shippingProvider,
        
        
        
        // billing data:
        billingValidation,
        
        
        billingAsShipping,
        setBillingAsShipping,              // stable ref
        
        
        billingFirstName,
        billingFirstNameHandlers,          // stable ref
        
        billingLastName,
        billingLastNameHandlers,           // stable ref
        
        
        billingPhone,
        billingPhoneHandlers,              // stable ref
        
        
        billingAddress,
        billingAddressHandlers,            // stable ref
        
        billingCity,
        billingCityHandlers,               // stable ref
        
        billingZone,
        billingZoneHandlers,               // stable ref
        
        billingZip,
        billingZipHandlers,                // stable ref
        
        billingCountry,
        billingCountryHandlers,            // stable ref
        
        
        
        // payment data:
        paymentValidation,
        paymentMethod,
        paymentToken,
        
        
        
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
        
        
        
        // extra data:
        marketingOpt,
        // marketingOptHandlers,              // stable ref
        
        
        
        // customer data:
        customerNickName,
        // customerNickNameHandlers,          // stable ref
        
        customerEmail,
        // customerEmailHandlers,             // stable ref
        
        
        
        // shipping data:
        shippingValidation,
        
        
        shippingFirstName,
        // shippingFirstNameHandlers,         // stable ref
        
        shippingLastName,
        // shippingLastNameHandlers,          // stable ref
        
        
        shippingPhone,
        // shippingPhoneHandlers,             // stable ref
        
        
        shippingAddress,
        // shippingAddressHandlers,           // stable ref
        
        shippingCity,
        // shippingCityHandlers,              // stable ref
        
        shippingZone,
        // shippingZoneHandlers,              // stable ref
        
        shippingZip,
        // shippingZipHandlers,               // stable ref
        
        shippingCountry,
        // shippingCountryHandlers,           // stable ref
        
        
        shippingProvider,
        
        
        
        // billing data:
        billingValidation,
        
        
        billingAsShipping,
        // setBillingAsShipping,              // stable ref
        
        
        billingFirstName,
        // billingFirstNameHandlers,          // stable ref
        
        billingLastName,
        // billingLastNameHandlers,           // stable ref
        
        
        billingPhone,
        // billingPhoneHandlers,              // stable ref
        
        
        billingAddress,
        // billingAddressHandlers,            // stable ref
        
        billingCity,
        // billingCityHandlers,               // stable ref
        
        billingZone,
        // billingZoneHandlers,               // stable ref
        
        billingZip,
        // billingZipHandlers,                // stable ref
        
        billingCountry,
        // billingCountryHandlers,            // stable ref
        
        
        
        // payment data:
        paymentValidation,
        paymentMethod,
        paymentToken,
        
        
        
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
    );
};
export {
    CheckoutStateProvider,
    CheckoutStateProvider as default,
}
//#endregion checkoutState

'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
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
    
    
    
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
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
    CheckoutStep,
    PaymentMethod,
    PaymentToken,
    CheckoutState         as ReduxCheckoutState,
    
    
    
    // states:
    setCheckoutStep       as reduxSetCheckoutStep,
    
    // extra data:
    setMarketingOpt       as reduxSetMarketingOpt,
    
    // customer data:
    setCustomerValidation as reduxSetCustomerValidation,
    
    setCustomerEmail      as reduxSetCustomerEmail,
    setCustomerNickName   as reduxSetCustomerNickName,
    
    // shipping data:
    setShippingValidation as reduxSetShippingValidation,
    
    setShippingFirstName  as reduxSetShippingFirstName,
    setShippingLastName   as reduxSetShippingLastName,
    
    setShippingPhone      as reduxSetShippingPhone,
    
    setShippingAddress    as reduxSetShippingAddress,
    setShippingCity       as reduxSetShippingCity,
    setShippingZone       as reduxSetShippingZone,
    setShippingZip        as reduxSetShippingZip,
    setShippingCountry    as reduxSetShippingCountry,
    
    setShippingProvider   as reduxSetShippingProvider,
    
    // billing data:
    setBillingValidation  as reduxSetBillingValidation,
    
    setBillingAsShipping  as reduxSetBillingAsShipping,
    
    setBillingFirstName   as reduxSetBillingFirstName,
    setBillingLastName    as reduxSetBillingLastName,
    
    setBillingPhone       as reduxSetBillingPhone,
    
    setBillingAddress     as reduxSetBillingAddress,
    setBillingCity        as reduxSetBillingCity,
    setBillingZone        as reduxSetBillingZone,
    setBillingZip         as reduxSetBillingZip,
    setBillingCountry     as reduxSetBillingCountry,
    
    // payment data:
    setPaymentValidation  as reduxSetPaymentValidation,
    setPaymentMethod      as reduxSetPaymentMethod,
    setPaymentToken       as reduxSetPaymentToken,
    
    // actions:
    resetCheckoutData     as reduxResetCheckoutData,
    
    
    
    // selectors:
    selectCheckoutState,
}                           from '@/store/features/checkout/checkoutSlice'
import {
    // types:
    CountryPreview,
    PlaceOrderOptions,
    MakePaymentResponse,
    
    
    
    // hooks:
    useGetCountryList,
    useGetMatchingShippingList,
    useGeneratePaymentToken,
    usePlaceOrder,
    useMakePayment,
}                           from '@/store/features/api/apiSlice'

// contexts:
import {
    // types:
    CartEntry,
    ProductPreview,
    CartState,
    
    
    
    // hooks:
    useCartState,
    
    
    
    // react components:
    CartStateProvider,
}                           from '@/components/Cart'

// internals:
import type {
    // types:
    MatchingShipping,
}                           from '@/libs/shippings'
import {
    calculateShippingCost,
}                           from '@/libs/shippings'
import {
    // hooks:
    FieldHandlers,
    useFieldState,
}                           from '../hooks/fieldState'



// types:
export type {
    CartEntry,
    
    CheckoutStep,
    PaymentMethod,
    PaymentToken,
    
    ProductPreview,
    PlaceOrderOptions,
    MakePaymentResponse,
    
    CountryPreview,
    
    MatchingShipping,
}

export type BusyState =
    | false // idle
    | 'checkShipping'
    | 'transaction'

interface FinishedOrderState {
    cartItems         : CartState['cartItems'  ]
    productList       : CartState['productList']
    
    checkoutState     : ReduxCheckoutState
    totalShippingCost : number|null|undefined
    paymentState      : MakePaymentResponse
}



// utilities:
const invalidSelector = ':is(.invalidating, .invalidated)';



// hooks:

// states:

//#region checkoutState

// contexts:
export interface CheckoutStateBase {
    // states:
    checkoutStep              : CheckoutStep
    checkoutProgress          : number
    
    isBusy                    : BusyState,
    
    isCheckoutEmpty           : boolean
    isCheckoutLoading         : boolean
    isCheckoutError           : boolean
    isCheckoutReady           : boolean
    isCheckoutFinished        : boolean
    
    isDesktop                 : boolean
    
    
    
    // extra data:
    marketingOpt              : boolean
    marketingOptHandlers      : FieldHandlers<HTMLInputElement>
    
    
    
    // customer data:
    customerValidation        : boolean
    customerNickName          : string
    customerNickNameHandlers  : FieldHandlers<HTMLInputElement>
    
    customerEmail             : string
    customerEmailHandlers     : FieldHandlers<HTMLInputElement>
    
    
    
    // shipping data:
    isShippingAddressRequired : boolean
    shippingValidation        : boolean
    
    
    shippingFirstName         : string
    shippingFirstNameHandlers : FieldHandlers<HTMLInputElement>
    
    shippingLastName          : string
    shippingLastNameHandlers  : FieldHandlers<HTMLInputElement>
    
    
    shippingPhone             : string
    shippingPhoneHandlers     : FieldHandlers<HTMLInputElement>
    
    
    shippingAddress           : string
    shippingAddressHandlers   : FieldHandlers<HTMLInputElement>
    
    shippingCity              : string
    shippingCityHandlers      : FieldHandlers<HTMLInputElement>
    
    shippingZone              : string
    shippingZoneHandlers      : FieldHandlers<HTMLInputElement>
    
    shippingZip               : string
    shippingZipHandlers       : FieldHandlers<HTMLInputElement>
    
    shippingCountry           : string
    shippingCountryHandlers   : FieldHandlers<HTMLInputElement>
    
    
    shippingProvider          : string | undefined
    setShippingProvider       : (shippingProvider: string) => void
    
    totalShippingCost         : number|null|undefined // undefined: not selected yet; null: no shipping required (non physical product)
    
    
    
    // billing data:
    isBillingAddressRequired  : boolean
    billingValidation         : boolean
    
    
    billingAsShipping         : boolean
    setBillingAsShipping      : (billingAsShipping: boolean) => void
    
    
    billingFirstName          : string
    billingFirstNameHandlers  : FieldHandlers<HTMLInputElement>
    
    billingLastName           : string
    billingLastNameHandlers   : FieldHandlers<HTMLInputElement>
    
    
    billingPhone              : string
    billingPhoneHandlers      : FieldHandlers<HTMLInputElement>
    
    
    billingAddress            : string
    billingAddressHandlers    : FieldHandlers<HTMLInputElement>
    
    billingCity               : string
    billingCityHandlers       : FieldHandlers<HTMLInputElement>
    
    billingZone               : string
    billingZoneHandlers       : FieldHandlers<HTMLInputElement>
    
    billingZip                : string
    billingZipHandlers        : FieldHandlers<HTMLInputElement>
    
    billingCountry            : string
    billingCountryHandlers    : FieldHandlers<HTMLInputElement>
    
    
    
    // payment data:
    paymentValidation         : boolean
    
    paymentMethod             : PaymentMethod
    setPaymentMethod          : (paymentMethod: PaymentMethod) => void
    
    paymentToken              : PaymentToken  | undefined
    
    paymentType               : string|undefined
    paymentBrand              : string|null|undefined
    paymentIdentifier         : string|null|undefined
    
    
    
    // relation data:
    countryList               : EntityState<CountryPreview>   | undefined
    shippingList              : EntityState<MatchingShipping> | undefined
    
    
    
    // sections:
    regularCheckoutSectionRef : React.MutableRefObject<HTMLElement|null>      | undefined
    shippingMethodOptionRef   : React.MutableRefObject<HTMLElement|null>      | undefined
    billingAddressSectionRef  : React.MutableRefObject<HTMLElement|null>      | undefined
    paymentCardSectionRef     : React.MutableRefObject<HTMLElement|null>      | undefined
    currentStepSectionRef     : React.MutableRefObject<HTMLElement|null>      | undefined
    navCheckoutSectionElm     : React.MutableRefObject<HTMLElement|null>      | undefined
    
    
    
    // fields:
    contactEmailInputRef      : React.MutableRefObject<HTMLInputElement|null> | undefined
    shippingAddressInputRef   : React.MutableRefObject<HTMLInputElement|null> | undefined
    cardholderInputRef        : React.MutableRefObject<HTMLInputElement|null> | undefined
    
    
    
    // actions:
    gotoStepInformation       : (focusTo?: 'contactInfo'|'shippingAddress') => void
    gotoStepShipping          : () => Promise<boolean>
    gotoPayment               : () => Promise<boolean>
    
    doTransaction             : (transaction: (() => Promise<void>)) => Promise<boolean>
    doPlaceOrder              : (options?: PlaceOrderOptions) => Promise<string>
    doMakePayment             : (orderId: string, paid: boolean) => Promise<void>
    
    refetchCheckout           : () => void
}

export type PickAlways<T, K extends keyof T, V> = {
    [P in K] : Extract<T[P], V>
}
export type CheckoutState =
    &Omit<CheckoutStateBase, 'isCheckoutEmpty'|'isCheckoutLoading'|'isCheckoutError'|'isCheckoutReady'|'isCheckoutFinished' | 'countryList'|'paymentToken'>
    &(
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutEmpty'                                                           , true   > // if   the checkout is  empty
            &PickAlways<CheckoutStateBase, 'isCheckoutLoading'|'isCheckoutError'|'isCheckoutReady'|'isCheckoutFinished', false  > // then the checkout is  never loading|error|ready|finished
        )
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutEmpty'                                                           , false  > // if   the checkout not empty
            &PickAlways<CheckoutStateBase, 'isCheckoutLoading'|'isCheckoutError'|'isCheckoutReady'|'isCheckoutFinished', boolean> // then the checkout is  maybe loading|error|ready|finished
        )
    )
    &(
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutLoading'                                     , true   > // if   the checkout is  loading
            &PickAlways<CheckoutStateBase, 'isCheckoutError'|'isCheckoutReady'|'isCheckoutFinished', false  > // then the checkout is  never error|ready|finished
        )
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutLoading'                                     , false  > // if   the checkout not loading
            &PickAlways<CheckoutStateBase, 'isCheckoutError'|'isCheckoutReady'|'isCheckoutFinished', boolean> // then the checkout is  maybe error|ready|finished
        )
    )
    &(
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutError'                     , true   > // if   the checkout is  error
            &PickAlways<CheckoutStateBase, 'isCheckoutReady'|'isCheckoutFinished', false  > // then the checkout is  never ready|finished
        )
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutError'                     , false  > // if   the checkout not error
            &PickAlways<CheckoutStateBase, 'isCheckoutReady'|'isCheckoutFinished', boolean> // then the checkout is  maybe ready|finished
        )
    )
    &(
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutReady'           , true        > // if   the checkout is  ready
            &PickAlways<CheckoutStateBase, 'isCheckoutFinished'        , boolean     > // then the checkout is  maybe finished
            &PickAlways<CheckoutStateBase, 'countryList'|'paymentToken', {}          > // then the checkout is  always having_data
        )
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutReady'           , false       > // if   the checkout not ready
            &PickAlways<CheckoutStateBase, 'isCheckoutFinished'        , false       > // then the checkout is  never finished
            &PickAlways<CheckoutStateBase, 'countryList'|'paymentToken', {}|undefined> // then the checkout is  maybe  having_data
        )
    )

const noopHandler  : FieldHandlers<HTMLInputElement> = { onChange: () => {} };
const noopCallback = () => {};
const CheckoutStateContext = createContext<CheckoutState>({
    // states:
    checkoutStep              : 'info',
    checkoutProgress          : 0,
    
    isBusy                    : false,
    
    isCheckoutEmpty           : true,
    isCheckoutLoading         : false,
    isCheckoutError           : false,
    isCheckoutReady           : false,
    isCheckoutFinished        : false,
    
    isDesktop                 : false,
    
    
    
    // extra data:
    marketingOpt              : true,
    marketingOptHandlers      : noopHandler,
    
    
    
    // customer data:
    customerValidation        : false,
    customerNickName          : '',
    customerNickNameHandlers  : noopHandler,
    
    customerEmail             : '',
    customerEmailHandlers     : noopHandler,
    
    
    
    // shipping data:
    isShippingAddressRequired : false,
    shippingValidation        : false,
    
    
    shippingFirstName         : '',
    shippingFirstNameHandlers : noopHandler,
    shippingLastName          : '',
    shippingLastNameHandlers  : noopHandler,
    
    
    shippingPhone             : '',
    shippingPhoneHandlers     : noopHandler,
    
    
    shippingAddress           : '',
    shippingAddressHandlers   : noopHandler,
    shippingCity              : '',
    shippingCityHandlers      : noopHandler,
    shippingZone              : '',
    shippingZoneHandlers      : noopHandler,
    shippingZip               : '',
    shippingZipHandlers       : noopHandler,
    shippingCountry           : '',
    shippingCountryHandlers   : noopHandler,
    
    
    shippingProvider          : undefined,
    setShippingProvider       : noopCallback,
    
    totalShippingCost         : undefined,
    
    
    
    // billing data:
    isBillingAddressRequired  : false,
    billingValidation         : false,
    
    
    billingAsShipping         : true,
    setBillingAsShipping      : noopCallback,
    
    
    billingFirstName          : '',
    billingFirstNameHandlers  : noopHandler,
    
    billingLastName           : '',
    billingLastNameHandlers   : noopHandler,
    
    
    billingPhone              : '',
    billingPhoneHandlers      : noopHandler,
    
    
    billingAddress            : '',
    billingAddressHandlers    : noopHandler,
    
    billingCity               : '',
    billingCityHandlers       : noopHandler,
    
    billingZone               : '',
    billingZoneHandlers       : noopHandler,
    
    billingZip                : '',
    billingZipHandlers        : noopHandler,
    
    billingCountry            : '',
    billingCountryHandlers    : noopHandler,
    
    
    
    // payment data:
    paymentValidation         : false,
    
    paymentMethod             : 'card',
    setPaymentMethod          : noopCallback,
    
    paymentToken              : undefined,
    
    paymentType               : undefined,
    paymentBrand              : undefined,
    paymentIdentifier         : undefined,
    
    
    
    // relation data:
    countryList               : undefined,
    shippingList              : undefined,
    
    
    
    // sections:
    regularCheckoutSectionRef : undefined,
    shippingMethodOptionRef   : undefined,
    billingAddressSectionRef  : undefined,
    paymentCardSectionRef     : undefined,
    currentStepSectionRef     : undefined,
    navCheckoutSectionElm     : undefined,
    
    
    
    // fields:
    contactEmailInputRef      : undefined,
    shippingAddressInputRef   : undefined,
    cardholderInputRef        : undefined,
    
    
    
    // actions:
    gotoStepInformation       : noopCallback,
    gotoStepShipping          : noopCallback as any,
    gotoPayment               : noopCallback as any,
    
    doTransaction             : noopCallback as any,
    doPlaceOrder              : noopCallback as any,
    doMakePayment             : noopCallback as any,
    
    refetchCheckout           : noopCallback,
});
CheckoutStateContext.displayName  = 'CheckoutState';

export const useCheckoutState = (): CheckoutState => {
    return useContext(CheckoutStateContext);
};



// react components:
export interface CheckoutStateProps {
}
const CheckoutStateProvider = (props: React.PropsWithChildren<CheckoutStateProps>): JSX.Element|null => {
    // rest props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // states:
    const [isBusy            , setIsBusyInternal    ] = useState<BusyState>(false);
    const [finishedOrderState, setFinishedOrderState] = useState<FinishedOrderState|undefined>(undefined);
    
    
    
    // contexts:
    const {
        // states:
        isCartLoading,
        isCartError,
        
        
        
        // cart data:
        cartItems : globalCartItems,
        totalProductWeight,
        
        
        
        // relation data:
        productList: globalProductList,
        
        
        
        // actions:
        clearProductsFromCart,
        
        refetchCart,
    } = useCartState();
    const cartItems           = finishedOrderState?.cartItems     ?? globalCartItems;
    const isCheckoutEmpty     = !cartItems.length;
    
    const productList         = finishedOrderState?.productList   ?? globalProductList;
    
    
    
    // stores:
    const globalCheckoutState = useSelector(selectCheckoutState);
    const localCheckoutState  = finishedOrderState?.checkoutState ?? globalCheckoutState;
    const {
        // states:
        checkoutStep,
        
        
        
        // customer data:
        customerValidation : reduxCustomerValidation,
        
        
        
        // shipping data:
        shippingValidation : reduxShippingValidation,
        
        shippingProvider,
        
        
        
        // billing data:
        billingValidation : reduxBillingValidation,
        
        billingAsShipping : reduxBillingAsShipping,
        
        
        
        // payment data:
        paymentValidation,
        
        paymentMethod = 'card',
        
        paymentToken,
    } = localCheckoutState;
    const checkoutProgress          = ['info', 'shipping', 'payment', 'pending', 'paid'].findIndex((progress) => progress === checkoutStep);
    const isPaymentTokenValid       = !!paymentToken?.expiresAt && (paymentToken.expiresAt > Date.now());
    
    const {
        // payment data:
        type       : paymentType,
        brand      : paymentBrand,
        identifier : paymentIdentifier,
    } = finishedOrderState?.paymentState?.payment ?? {};
    
    const dispatch                  = useDispatch();
    const setCheckoutStep           = useEvent((checkoutStep: CheckoutStep): void => {
        dispatch(reduxSetCheckoutStep(checkoutStep));
    });
    
    
    
    // extra data:
    const [marketingOpt      , , marketingOptHandlers     ] = useFieldState({ state: localCheckoutState, get: 'marketingOpt'     , set: reduxSetMarketingOpt      });
    
    
    
    // customer data:
    const [customerNickName  , , customerNickNameHandlers ] = useFieldState({ state: localCheckoutState, get: 'customerNickName' , set: reduxSetCustomerNickName  });
    const [customerEmail     , , customerEmailHandlers    ] = useFieldState({ state: localCheckoutState, get: 'customerEmail'    , set: reduxSetCustomerEmail     });
    
    
    
    // shipping data:
    const [shippingFirstName , , shippingFirstNameHandlers] = useFieldState({ state: localCheckoutState, get: 'shippingFirstName', set: reduxSetShippingFirstName });
    const [shippingLastName  , , shippingLastNameHandlers ] = useFieldState({ state: localCheckoutState, get: 'shippingLastName' , set: reduxSetShippingLastName  });
    
    const [shippingPhone     , , shippingPhoneHandlers    ] = useFieldState({ state: localCheckoutState, get: 'shippingPhone'    , set: reduxSetShippingPhone     });
    
    const [shippingAddress   , , shippingAddressHandlers  ] = useFieldState({ state: localCheckoutState, get: 'shippingAddress'  , set: reduxSetShippingAddress   });
    const [shippingCity      , , shippingCityHandlers     ] = useFieldState({ state: localCheckoutState, get: 'shippingCity'     , set: reduxSetShippingCity      });
    const [shippingZone      , , shippingZoneHandlers     ] = useFieldState({ state: localCheckoutState, get: 'shippingZone'     , set: reduxSetShippingZone      });
    const [shippingZip       , , shippingZipHandlers      ] = useFieldState({ state: localCheckoutState, get: 'shippingZip'      , set: reduxSetShippingZip       });
    const [shippingCountry   , , shippingCountryHandlers  ] = useFieldState({ state: localCheckoutState, get: 'shippingCountry'  , set: reduxSetShippingCountry   });
    
    
    
    // billing data:
    const [billingFirstName  , , billingFirstNameHandlers ] = useFieldState({ state: localCheckoutState, get: 'billingFirstName' , set: reduxSetBillingFirstName  });
    const [billingLastName   , , billingLastNameHandlers  ] = useFieldState({ state: localCheckoutState, get: 'billingLastName'  , set: reduxSetBillingLastName   });
    const [billingPhone      , , billingPhoneHandlers     ] = useFieldState({ state: localCheckoutState, get: 'billingPhone'     , set: reduxSetBillingPhone      });
    const [billingAddress    , , billingAddressHandlers   ] = useFieldState({ state: localCheckoutState, get: 'billingAddress'   , set: reduxSetBillingAddress    });
    const [billingCity       , , billingCityHandlers      ] = useFieldState({ state: localCheckoutState, get: 'billingCity'      , set: reduxSetBillingCity       });
    const [billingZone       , , billingZoneHandlers      ] = useFieldState({ state: localCheckoutState, get: 'billingZone'      , set: reduxSetBillingZone       });
    const [billingZip        , , billingZipHandlers       ] = useFieldState({ state: localCheckoutState, get: 'billingZip'       , set: reduxSetBillingZip        });
    const [billingCountry    , , billingCountryHandlers   ] = useFieldState({ state: localCheckoutState, get: 'billingCountry'   , set: reduxSetBillingCountry    });
    
    
    
    // apis:
    const                        {data: countryList, isFetching: isCountryLoading, isError: isCountryError, refetch: countryRefetch}  = useGetCountryList();
    const [generatePaymentToken, {                   isLoading : isTokenLoading  , isError: isTokenError  }] = useGeneratePaymentToken();
    
    const [getShippingByAddress, {data: shippingList   , isUninitialized: isShippingUninitialized, isError: isShippingError, isSuccess: isShippingSuccess}]  = useGetMatchingShippingList();
    
    
    
    const realTotalShippingCost          = useMemo<number|null|undefined>(() => {
        // conditions:
        if (totalProductWeight === null) return null;      // non physical product => no shipping required
        if (!shippingList)               return undefined; // the shippingList data is not available yet => nothing to calculate
        const selectedShipping = shippingProvider ? shippingList.entities?.[shippingProvider] : undefined;
        if (!selectedShipping)           return undefined; // no valid selected shippingProvider => nothing to calculate
        
        
        
        // calculate the shipping cost based on the totalProductWeight and the selected shipping provider:
        return calculateShippingCost(totalProductWeight, selectedShipping);
    }, [totalProductWeight, shippingList, shippingProvider]);
    const totalShippingCost              = finishedOrderState ? finishedOrderState.totalShippingCost : realTotalShippingCost;
    
    const customerValidation             = reduxCustomerValidation;
    
    const isShippingAddressRequired      = (totalShippingCost !== null); // null => non physical product; undefined => has physical product but no shippingProvider selected; number => has physical product and has shippingProvider selected
    const shippingValidation             = isShippingAddressRequired && reduxShippingValidation;
    
    const isPerformedRecoverShippingList = useRef<boolean>(false);
    const isNeedsRecoverShippingList     =  isShippingAddressRequired  && (checkoutStep !== 'info') && isShippingUninitialized && !isPerformedRecoverShippingList.current;
    const isNeedsRecoverShippingProvider = !isNeedsRecoverShippingList && (checkoutStep !== 'info') && (isShippingError || isShippingSuccess) && !shippingList?.entities?.[shippingProvider ?? ''];
    
    const isBillingAddressRequired       = (paymentMethod === 'card'); // the billingAddress is required for 'card'
    const billingAsShipping              = isShippingAddressRequired && reduxBillingAsShipping;
    const billingValidation              = isBillingAddressRequired  && reduxBillingValidation && !billingAsShipping;
    
    
    
    const isCheckoutLoading              =  !isCheckoutEmpty   && (isCartLoading   || isCountryLoading || (isTokenLoading && !isPaymentTokenValid /* silently token loading if still have old_valid_token */)   || isNeedsRecoverShippingList); // do not report the loading state if the checkout is empty
    const hasData                        = (!!productList      && !!countryList    && isPaymentTokenValid);
    const isCheckoutError                = (!isCheckoutLoading && (isCartError     || isCountryError   || (isTokenError   && !isPaymentTokenValid /* silently token error   if still have old_valid_token */))) || !hasData /* considered as error if no data */;
    const isCheckoutReady                =  !isCheckoutLoading && !isCheckoutError && !isCheckoutEmpty;
    const isCheckoutFinished             = isCheckoutReady && ((checkoutStep === 'pending') || (checkoutStep === 'paid'));
    
    
    
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
    useIsomorphicLayoutEffect(() => {
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
    useIsomorphicLayoutEffect(() => {
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
    
    // if no selected shipping method => auto select the cheapest one:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (checkoutStep !== 'shipping') return; // only auto select when at shipping step
        if (!shippingList)               return; // the shippingList data is not available yet => nothing to select
        const selectedShipping = shippingProvider ? shippingList.entities?.[shippingProvider] : undefined;
        if (selectedShipping)            return; // already have valid selection => abort to auto_select
        
        
        
        // find the cheapest shipping cost:
        const orderedConstAscending = (
            Object.values(shippingList.entities)
            .filter((shippingEntry): shippingEntry is Exclude<typeof shippingEntry, undefined> => !!shippingEntry)
            ?.map((shippingEntry) => ({
                id                  : `${shippingEntry.id}`,
                previewShippingCost : calculateShippingCost(totalProductWeight, shippingEntry) ?? -1, // -1 means: no need to ship (digital products)
            }))
            ?.sort((a, b) => a.previewShippingCost - b.previewShippingCost) // -1 means: no need to ship (digital products)
        );
        
        if (orderedConstAscending && orderedConstAscending.length >= 1) {
            setShippingProvider(orderedConstAscending[0].id);
        } // if
    }, [checkoutStep, shippingList, shippingProvider, totalProductWeight]);
    
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
    const lastPaymentToken = useRef<PaymentToken|undefined|0>(0/* 0 = uninit */); // ensures the payment token not re-refreshed twice (especially in dev mode)
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (lastPaymentToken.current === paymentToken) return; // no change => ignore
        lastPaymentToken.current = paymentToken;               // sync
        console.log('paymentToken changed: ', paymentToken);
        
        
        
        // setups:
        const performRefreshPaymentToken = async (): Promise<number> => {
            try {
                // retry to generate a new token:
                const newPaymentToken = await generatePaymentToken().unwrap();
                
                
                
                // replace the expiring one:
                dispatch(reduxSetPaymentToken(newPaymentToken));
                lastPaymentToken.current = newPaymentToken; // prevents from re-schedule
                
                
                
                // report the next refresh duration:
                return Math.max(0, newPaymentToken.refreshAt - Date.now());
            }
            catch {
                // report the next retry duration:
                return (60 * 1000);
            } // try
        };
        
        let cancelRefresh : ReturnType<typeof setTimeout>|undefined = undefined;
        const scheduleRefreshPaymentToken = async (): Promise<void> => {
            // determine the next refresh duration:
            const paymentTokenRemainingAge = (
                !!paymentToken
                ? Math.max(0, paymentToken.refreshAt - Date.now())
                : 0
            );
            const nextRefreshDuration = (
                (paymentTokenRemainingAge > 0)
                ? paymentTokenRemainingAge
                : await performRefreshPaymentToken()
            );
            
            // schedule to refresh:
            console.log(`schedule refresh token in ${nextRefreshDuration/1000} seconds`);
            cancelRefresh = setTimeout(scheduleRefreshPaymentToken, nextRefreshDuration);
        };
        scheduleRefreshPaymentToken();
        
        
        
        // cleanups:
        return () => {
            if (cancelRefresh) clearTimeout(cancelRefresh);
        };
    }, [paymentToken]);
    
    // auto reset billing validation:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (isBillingAddressRequired) return; // billing is required                => nothing to reset
        if (!billingAsShipping)       return; // billing is different than shipping => nothing to reset
        if (!reduxBillingValidation)  return; // already reseted                    => nothing to reset
        
        
        
        // reset:
        dispatch(reduxSetBillingValidation(false));
    }, [isBillingAddressRequired, billingAsShipping, reduxBillingValidation]);
    
    // auto clear finished checkout states in redux:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if ((checkoutStep !== 'pending') && (checkoutStep !== 'paid')) return; // auto clear when state is 'pending' or 'paid'
        
        
        
        // actions:
        // clear the cart & checkout states in redux:
        if (globalCartItems    ) clearProductsFromCart();
        if (globalCheckoutState) dispatch(reduxResetCheckoutData());
    }, [checkoutStep, globalCartItems, globalCheckoutState]);
    
    
    
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
    const [placeOrder]  = usePlaceOrder();
    const [makePayment] = useMakePayment();
    
    
    
    // dialogs:
    const {
        showMessageError,
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // stable callbacks:
    const setIsBusy            = useEvent((isBusy: BusyState) => {
        checkoutState.isBusy = isBusy; /* instant update without waiting for (slow|delayed) re-render */
        setIsBusyInternal(isBusy);
    });
    
    const gotoStepInformation  = useEvent((focusTo?: 'contactInfo'|'shippingAddress'): void => {
        setCheckoutStep('info');
        
        
        
        if (focusTo) {
            const focusInputRef = (focusTo === 'contactInfo') ? contactEmailInputRef : shippingAddressInputRef;
            setTimeout(() => {
                const focusInputElm = focusInputRef.current;
                if (focusInputElm) {
                    focusInputElm.scrollIntoView({
                        block    : 'start',
                        behavior : 'smooth',
                    });
                    focusInputElm.focus({ preventScroll: true });
                } // if
            }, 200);
        } // if
    });
    const gotoStepShipping     = useEvent(async (): Promise<boolean> => {
        const goForward = (checkoutStep === 'info');
        if (goForward) { // go forward from 'info' => do validate shipping agencies
            // validate:
            // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
            dispatch(reduxSetCustomerValidation(true)); // enable customerAccount validation
            dispatch(reduxSetShippingValidation(true)); // enable billingAddress validation
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
                return false; // transaction aborted due to validation error
            } // if
            
            
            
            if (!isShippingAddressRequired) { // if only digital products => no shipping required
                // jump forward to payment method:
                setCheckoutStep('payment');
            }
            else { // if contain a/some physical product => requires shipping
                // check for suitable shippingProvider(s) for given address:
                setIsBusy('checkShipping');
                try {
                    const shippingList = await getShippingByAddress({
                        city    : shippingCity,
                        zone    : shippingZone,
                        country : shippingCountry,
                    }).unwrap();
                    
                    
                    
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
                        return false; // transaction failed due to no_shipping_agency
                    } // if
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
                    return false; // transaction failed due to fetch_error
                }
                finally {
                    setIsBusy(false);
                } // try
                
                
                
                // there is/are shippingProvider(s) available for given address => continue to select the shippingProvider(s)
                // go forward to shipping method:
                setCheckoutStep('shipping');
            } // if
        } // if
        
        
        
        if (!goForward) { // go back from 'shipping'|'payment' => focus to shipping method option control
            if (!isShippingAddressRequired) { // if only digital products => no shipping required
                // jump backward to info:
                setCheckoutStep('info');
            }
            else {
                // go backward to shipping method:
                setCheckoutStep('shipping');
                
                
                
                // focus to shipping method:
                setTimeout(() => {
                    const focusInputElm = shippingMethodOptionRef.current;
                    if (focusInputElm) {
                        focusInputElm.scrollIntoView({
                            block    : 'start',
                            behavior : 'smooth',
                        });
                        focusInputElm.focus({ preventScroll: true });
                    } // if
                }, 200);
            } // if
        } // if
        
        
        
        return true; // transaction completed
    });
    const gotoPayment          = useEvent(async (): Promise<boolean> => {
        if (!isShippingAddressRequired) { // if only digital products => validate the customer account
            // validate:
            // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
            dispatch(reduxSetCustomerValidation(true)); // enable customerAccount validation
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
                return false; // transaction aborted due to validation error
            } // if
        }
        else {
            // if physical products => the customer account is *already validated* by `gotoStepShipping()`
        } // if
        
        
        
        setCheckoutStep('payment');
        
        
        
        return true; // transaction completed
    });
    
    const setShippingProvider  = useEvent((shippingProvider: string): void => {
        dispatch(reduxSetShippingProvider(shippingProvider));
    });
    const setPaymentMethod     = useEvent((paymentMethod: PaymentMethod): void => {
        dispatch(reduxSetPaymentMethod(paymentMethod));
        
        // reset:
        if (paymentMethod !== 'card') { // 'paypal' button or 'manual' button => reset payment validation (of 'card' fields)
            dispatch(reduxSetPaymentValidation(false));
        } // if
    });
    const setBillingAsShipping = useEvent((billingAsShipping: boolean): void => {
        dispatch(reduxSetBillingAsShipping(billingAsShipping));
    });
    
    const doTransaction        = useEvent(async (transaction: (() => Promise<void>)): Promise<boolean> => {
        // conditions:
        if (checkoutState.isBusy) return false; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        
        
        
        if (isBillingAddressRequired) {
            // validate:
            // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
            if (!billingAsShipping) { // use dedicated billingAddress => enable billingAddress validation
                dispatch(reduxSetBillingValidation(true));
            } // if
            dispatch(reduxSetPaymentValidation(true)); // enable paymentForm validation
            await new Promise<void>((resolve) => { // wait for a validation state applied
                setTimeout(() => {
                    setTimeout(() => {
                        resolve();
                    }, 0);
                }, 0);
            });
            const fieldErrors = [
                // card fields:
                ...(
                    (
                        (paymentMethod === 'card')
                        ? paymentCardSectionRef?.current?.querySelectorAll?.(invalidSelector)
                        : undefined
                    )
                    ??
                    []
                ),
                
                // billing fields:
                ...(
                    (
                        !billingAsShipping
                        ? billingAddressSectionRef?.current?.querySelectorAll?.(invalidSelector)
                        : undefined
                    )
                    ??
                    []
                ),
            ];
            if (fieldErrors?.length) { // there is an/some invalid field
                showMessageFieldError(fieldErrors);
                return false; // transaction aborted due to validation error
            } // if
        } // if
        
        
        
        setIsBusy('transaction');
        try {
            await transaction();
        }
        finally {
            setIsBusy(false);
        } // try
        
        
        
        return true; // transaction completed
    });
    const doPlaceOrder         = useEvent(async (options?: PlaceOrderOptions): Promise<string> => {
        try {
            const placeOrderResponse = await placeOrder({
                // cart item(s):
                items : cartItems,
                
                
                
                // shipping data:
                ...(isShippingAddressRequired ? {
                    shippingFirstName,
                    shippingLastName,
                    
                    shippingPhone,
                    
                    shippingAddress,
                    shippingCity,
                    shippingZone,
                    shippingZip,
                    shippingCountry,
                    
                    shippingProvider,
                } : undefined),
                
                
                
                // options: pay manually | paymentSource (by <PayPalButtons>)
                ...options,
            }).unwrap();
            return placeOrderResponse.orderId;
        }
        catch (fetchError: any) {
            showMessageFetchError({ fetchError, context: 'order' });
            throw fetchError;
        } // try
    });
    const doMakePayment        = useEvent(async (orderId: string, paid: boolean): Promise<void> => {
        const paymentState = await makePayment({
            orderId,
            
            
            
            // extra data:
            marketingOpt,
            
            
            
            // customer data:
            customerNickName,
            customerEmail,
            
            
            
            // billing data:
            ...(isBillingAddressRequired ? {
                billingFirstName : billingAsShipping ? shippingFirstName : billingFirstName,
                billingLastName  : billingAsShipping ? shippingLastName  : billingLastName,
                
                billingPhone     : billingAsShipping ? shippingPhone     : billingPhone,
                
                billingAddress   : billingAsShipping ? shippingAddress   : billingAddress,
                billingCity      : billingAsShipping ? shippingCity      : billingCity,
                billingZone      : billingAsShipping ? shippingZone      : billingZone,
                billingZip       : billingAsShipping ? shippingZip       : billingZip,
                billingCountry   : billingAsShipping ? shippingCountry   : billingCountry,
            } : undefined),
        }).unwrap();
        
        
        
        // save the finished order states:
        // setCheckoutStep(paid ? 'paid' : 'pending'); // not needed this code, already handled by `setFinishedOrderState` below:
        setFinishedOrderState({ // backup the cart & checkout states in redux
            cartItems,
            productList,
            
            checkoutState : {
                ...localCheckoutState,
                checkoutStep : (paid ? 'paid' : 'pending'),
            },
            totalShippingCost,
            paymentState,
        });
        
        
        
        // clear the cart & checkout states in redux:
        clearProductsFromCart();
        dispatch(reduxResetCheckoutData());
    });
    
    const refetchCheckout      = useEvent((): void => {
        refetchCart();
        countryRefetch();
    });
    
    
    
    // apis:
    const checkoutState = useMemo<CheckoutState>(() => ({
        // states:
        checkoutStep,
        checkoutProgress,
        
        isBusy,
        
        isCheckoutEmpty    : isCheckoutEmpty    as any,
        isCheckoutLoading  : isCheckoutLoading  as any,
        isCheckoutError    : isCheckoutError    as any,
        isCheckoutReady    : isCheckoutReady    as any,
        isCheckoutFinished : isCheckoutFinished as any,
        
        isDesktop,
        
        
        
        // extra data:
        marketingOpt,
        marketingOptHandlers,      // stable ref
        
        
        
        // customer data:
        customerValidation,
        customerNickName,
        customerNickNameHandlers,  // stable ref
        
        customerEmail,
        customerEmailHandlers,     // stable ref
        
        
        
        // shipping data:
        isShippingAddressRequired,
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
        setShippingProvider,       // stable ref
        
        totalShippingCost,
        
        
        
        // billing data:
        isBillingAddressRequired,
        billingValidation,
        
        
        billingAsShipping,
        setBillingAsShipping,      // stable ref
        
        
        billingFirstName,
        billingFirstNameHandlers,  // stable ref
        
        billingLastName,
        billingLastNameHandlers,   // stable ref
        
        
        billingPhone,
        billingPhoneHandlers,      // stable ref
        
        
        billingAddress,
        billingAddressHandlers,    // stable ref
        
        billingCity,
        billingCityHandlers,       // stable ref
        
        billingZone,
        billingZoneHandlers,       // stable ref
        
        billingZip,
        billingZipHandlers,        // stable ref
        
        billingCountry,
        billingCountryHandlers,    // stable ref
        
        
        
        // payment data:
        paymentValidation,
        
        paymentMethod,
        setPaymentMethod,          // stable ref
        
        paymentToken,
        
        paymentType,
        paymentBrand,
        paymentIdentifier,
        
        
        
        // relation data:
        countryList,
        shippingList,
        
        
        
        // sections:
        regularCheckoutSectionRef, // stable ref
        shippingMethodOptionRef,   // stable ref
        billingAddressSectionRef,  // stable ref
        paymentCardSectionRef,     // stable ref
        currentStepSectionRef,     // stable ref
        navCheckoutSectionElm,     // stable ref
        
        
        
        // fields:
        contactEmailInputRef,      // stable ref
        shippingAddressInputRef,   // stable ref
        cardholderInputRef,        // stable ref
        
        
        
        // actions:
        gotoStepInformation,       // stable ref
        gotoStepShipping,          // stable ref
        gotoPayment,               // stable ref
        
        doTransaction,             // stable ref
        doPlaceOrder,              // stable ref
        doMakePayment,             // stable ref
        
        refetchCheckout,           // stable ref
    }), [
        // states:
        checkoutStep,
        checkoutProgress,
        
        isBusy,
        
        isCheckoutEmpty,
        isCheckoutLoading,
        isCheckoutError,
        isCheckoutReady,
        isCheckoutFinished,
        
        isDesktop,
        
        
        
        // extra data:
        marketingOpt,
        // marketingOptHandlers,      // stable ref
        
        
        
        // customer data:
        customerValidation,
        customerNickName,
        // customerNickNameHandlers,  // stable ref
        
        customerEmail,
        // customerEmailHandlers,     // stable ref
        
        
        
        // shipping data:
        isShippingAddressRequired,
        shippingValidation,
        
        
        shippingFirstName,
        // shippingFirstNameHandlers, // stable ref
        
        shippingLastName,
        // shippingLastNameHandlers,  // stable ref
        
        
        shippingPhone,
        // shippingPhoneHandlers,     // stable ref
        
        
        shippingAddress,
        // shippingAddressHandlers,   // stable ref
        
        shippingCity,
        // shippingCityHandlers,      // stable ref
        
        shippingZone,
        // shippingZoneHandlers,      // stable ref
        
        shippingZip,
        // shippingZipHandlers,       // stable ref
        
        shippingCountry,
        // shippingCountryHandlers,   // stable ref
        
        
        shippingProvider,
        // setShippingProvider        // stable ref,
        
        totalShippingCost,
        
        
        
        // billing data:
        isBillingAddressRequired,
        billingValidation,
        
        
        billingAsShipping,
        // setBillingAsShipping,      // stable ref
        
        
        billingFirstName,
        // billingFirstNameHandlers,  // stable ref
        
        billingLastName,
        // billingLastNameHandlers,   // stable ref
        
        
        billingPhone,
        // billingPhoneHandlers,      // stable ref
        
        
        billingAddress,
        // billingAddressHandlers,    // stable ref
        
        billingCity,
        // billingCityHandlers,       // stable ref
        
        billingZone,
        // billingZoneHandlers,       // stable ref
        
        billingZip,
        // billingZipHandlers,        // stable ref
        
        billingCountry,
        // billingCountryHandlers,    // stable ref
        
        
        
        // payment data:
        paymentValidation,
        
        paymentMethod,
        // setPaymentMethod,          // stable ref
        
        paymentToken,
        
        paymentType,
        paymentBrand,
        paymentIdentifier,
        
        
        
        // relation data:
        countryList,
        shippingList,
        
        
        
        // sections:
        // regularCheckoutSectionRef, // stable ref
        // shippingMethodOptionRef,   // stable ref
        // billingAddressSectionRef,  // stable ref
        // paymentCardSectionRef,     // stable ref
        // currentStepSectionRef,     // stable ref
        // navCheckoutSectionElm,     // stable ref
        
        
        
        // fields:
        // contactEmailInputRef,      // stable ref
        // shippingAddressInputRef,   // stable ref
        // cardholderInputRef,        // stable ref
        
        
        
        // actions:
        // gotoStepInformation,       // stable ref
        // gotoStepShipping,          // stable ref
        // gotoPayment,               // stable ref
        
        // doTransaction,             // stable ref
        // doPlaceOrder,              // stable ref
        // doMakePayment,             // stable ref
        
        refetchCheckout,              // stable ref
    ]);
    
    
    
    // jsx:
    const conditionalChildren = (
        finishedOrderState
        ? <CartStateProvider
            // mocks
            mockCartItems   = {cartItems}
            mockProductList = {productList}
        >
            {children}
        </CartStateProvider>
        : children
    );
    return (
        <CheckoutStateContext.Provider value={checkoutState}>
            <AccessibilityProvider
                // accessibilities:
                enabled={!isBusy} // disabled if busy
            >
                {conditionalChildren}
            </AccessibilityProvider>
        </CheckoutStateContext.Provider>
    );
};
export {
    CheckoutStateProvider,
    CheckoutStateProvider as default,
}
//#endregion checkoutState

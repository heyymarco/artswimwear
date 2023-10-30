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
    BusyState,
    PaymentMethod,
    PaymentToken,
    CheckoutState         as ReduxCheckoutState,
    
    
    
    // states:
    setCheckoutStep       as reduxSetCheckoutStep,
    setIsBusy             as reduxSetIsBusy,
    
    // extra data:
    setMarketingOpt       as reduxSetMarketingOpt,
    
    // customer data:
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
    ProductPreview,
    PlaceOrderOptions,
    MakePaymentResponse,
    
    
    
    // hooks:
    useGetProductList,
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
    
    
    
    // hooks:
    useCartState,
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
}                           from '../hooks'



// types:
export type {
    CartEntry,
    
    CheckoutStep,
    BusyState,
    PaymentMethod,
    PaymentToken,
    
    ProductPreview,
    PlaceOrderOptions,
    MakePaymentResponse,
    
    CountryPreview,
    
    MatchingShipping,
}

interface FinishedOrderState {
    cartItems     : CartEntry[]
    checkoutState : ReduxCheckoutState
    paymentState  : MakePaymentResponse
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
    
    isDesktop                 : boolean
    
    
    
    // extra data:
    marketingOpt              : boolean
    marketingOptHandlers      : FieldHandlers<HTMLInputElement>
    
    
    
    // customer data:
    customerNickName          : string
    customerNickNameHandlers  : FieldHandlers<HTMLInputElement>
    
    customerEmail             : string
    customerEmailHandlers     : FieldHandlers<HTMLInputElement>
    
    
    
    // shipping data:
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
    
    paymentMethod             : PaymentMethod | undefined
    setPaymentMethod          : (paymentMethod: PaymentMethod) => void
    
    paymentToken              : PaymentToken  | undefined
    
    paymentType               : string|undefined
    paymentBrand              : string|null|undefined
    paymentIdentifier         : string|null|undefined
    
    
    
    // relation data:
    productList               : EntityState<ProductPreview>   | undefined
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
    gotoPayment               : () => void
    
    doTransaction             : (transaction: (() => Promise<void>)) => Promise<boolean>
    doPlaceOrder              : (options?: PlaceOrderOptions) => Promise<string>
    doMakePayment             : (orderId: string, paid: boolean) => Promise<void>
    
    refetch                   : () => void
}

export type PickAlways<T, K extends keyof T, V> = {
    [P in K] : Extract<T[P], V>
}
export type CheckoutState =
    &Omit<CheckoutStateBase, 'isCheckoutEmpty'|'isCheckoutLoading'|'isCheckoutError'|'isCheckoutReady' | 'countryList'|'paymentToken'>
    &(
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutEmpty'                              , true   > // if   the checkout is  empty
            &PickAlways<CheckoutStateBase, 'isCheckoutLoading'|'isCheckoutError'|'isCheckoutReady', false  > // then the checkout is  never loading|error|ready
        )
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutEmpty'                              , false  > // if   the checkout not empty
            &PickAlways<CheckoutStateBase, 'isCheckoutLoading'|'isCheckoutError'|'isCheckoutReady', boolean> // then the checkout is  maybe loading|error|ready
        )
    )
    &(
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutLoading'            , true   > // if   the checkout is  loading
            &PickAlways<CheckoutStateBase, 'isCheckoutError'|'isCheckoutReady', false  > // then the checkout is  never error|ready
        )
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutLoading'            , false  > // if   the checkout not loading
            &PickAlways<CheckoutStateBase, 'isCheckoutError'|'isCheckoutReady', boolean> // then the checkout is  maybe error|ready
        )
    )
    &(
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutError', true   > // if   the checkout is  error
            &PickAlways<CheckoutStateBase, 'isCheckoutReady', false  > // then the checkout is  never ready
        )
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutError', false  > // if   the checkout not error
            &PickAlways<CheckoutStateBase, 'isCheckoutReady', boolean> // then the checkout is  maybe ready
        )
    )
    &(
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutReady', true                   > // if   the checkout is  ready
            &PickAlways<CheckoutStateBase, 'countryList'|'paymentToken', {}          > // then the checkout is  always having_data
        )
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutReady', false                  > // if   the checkout not ready
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
    
    isDesktop                 : false,
    
    
    
    // extra data:
    marketingOpt              : true,
    marketingOptHandlers      : noopHandler,
    
    
    
    // customer data:
    customerNickName          : '',
    customerNickNameHandlers  : noopHandler,
    
    customerEmail             : '',
    customerEmailHandlers     : noopHandler,
    
    
    
    // shipping data:
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
    
    paymentMethod             : undefined,
    setPaymentMethod          : noopCallback,
    
    paymentToken              : undefined,
    
    paymentType               : undefined,
    paymentBrand              : undefined,
    paymentIdentifier         : undefined,
    
    
    
    // relation data:
    productList               : undefined,
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
    gotoPayment               : noopCallback,
    
    doTransaction             : noopCallback as any,
    doPlaceOrder              : noopCallback as any,
    doMakePayment             : noopCallback as any,
    
    refetch                   : noopCallback,
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
    
    
    
    // states:
    const [finishedOrderState, setFinishedOrderState] = useState<FinishedOrderState|undefined>(undefined);
    
    
    
    // contexts:
    const {
        // cart data:
        cartItems : reduxCartItems,
        totalProductWeight,
        
        
        
        // actions:
        clearProductsFromCart,
    } = useCartState();
    const cartItems          = finishedOrderState?.cartItems     ?? reduxCartItems;
    const isCheckoutEmpty    = !cartItems.length;
    
    
    
    // stores:
    const reduxCheckoutState = useSelector(selectCheckoutState);
    const checkoutState      = finishedOrderState?.checkoutState ?? reduxCheckoutState;
    const {
        // states:
        checkoutStep,
        isBusy,
        
        
        
        // shipping data:
        shippingValidation,
        
        shippingProvider,
        
        
        
        // billing data:
        billingValidation,
        
        billingAsShipping,
        
        
        
        // payment data:
        paymentValidation,
        
        paymentMethod,
        
        paymentToken,
    } = checkoutState;
    const checkoutProgress   = ['info', 'shipping', 'payment', 'pending', 'paid'].findIndex((progress) => progress === checkoutStep);
    
    const {
        // payment data:
        type       : paymentType,
        brand      : paymentBrand,
        identifier : paymentIdentifier,
    } = finishedOrderState?.paymentState?.paymentMethod ?? {};
    
    const dispatch           = useDispatch();
    const setCheckoutStep    = useEvent((checkoutStep: CheckoutStep): void => {
        dispatch(reduxSetCheckoutStep(checkoutStep));
    });
    
    
    
    // extra data:
    const [marketingOpt      , , marketingOptHandlers     ] = useFieldState({ state: checkoutState, get: 'marketingOpt'     , set: reduxSetMarketingOpt      });
    
    
    
    // customer data:
    const [customerNickName  , , customerNickNameHandlers ] = useFieldState({ state: checkoutState, get: 'customerNickName' , set: reduxSetCustomerNickName  });
    const [customerEmail     , , customerEmailHandlers    ] = useFieldState({ state: checkoutState, get: 'customerEmail'    , set: reduxSetCustomerEmail     });
    
    
    
    // shipping data:
    const [shippingFirstName , , shippingFirstNameHandlers] = useFieldState({ state: checkoutState, get: 'shippingFirstName', set: reduxSetShippingFirstName });
    const [shippingLastName  , , shippingLastNameHandlers ] = useFieldState({ state: checkoutState, get: 'shippingLastName' , set: reduxSetShippingLastName  });
    
    const [shippingPhone     , , shippingPhoneHandlers    ] = useFieldState({ state: checkoutState, get: 'shippingPhone'    , set: reduxSetShippingPhone     });
    
    const [shippingAddress   , , shippingAddressHandlers  ] = useFieldState({ state: checkoutState, get: 'shippingAddress'  , set: reduxSetShippingAddress   });
    const [shippingCity      , , shippingCityHandlers     ] = useFieldState({ state: checkoutState, get: 'shippingCity'     , set: reduxSetShippingCity      });
    const [shippingZone      , , shippingZoneHandlers     ] = useFieldState({ state: checkoutState, get: 'shippingZone'     , set: reduxSetShippingZone      });
    const [shippingZip       , , shippingZipHandlers      ] = useFieldState({ state: checkoutState, get: 'shippingZip'      , set: reduxSetShippingZip       });
    const [shippingCountry   , , shippingCountryHandlers  ] = useFieldState({ state: checkoutState, get: 'shippingCountry'  , set: reduxSetShippingCountry   });
    
    
    
    // billing data:
    const [billingFirstName  , , billingFirstNameHandlers ] = useFieldState({ state: checkoutState, get: 'billingFirstName' , set: reduxSetBillingFirstName  });
    const [billingLastName   , , billingLastNameHandlers  ] = useFieldState({ state: checkoutState, get: 'billingLastName'  , set: reduxSetBillingLastName   });
    const [billingPhone      , , billingPhoneHandlers     ] = useFieldState({ state: checkoutState, get: 'billingPhone'     , set: reduxSetBillingPhone      });
    const [billingAddress    , , billingAddressHandlers   ] = useFieldState({ state: checkoutState, get: 'billingAddress'   , set: reduxSetBillingAddress    });
    const [billingCity       , , billingCityHandlers      ] = useFieldState({ state: checkoutState, get: 'billingCity'      , set: reduxSetBillingCity       });
    const [billingZone       , , billingZoneHandlers      ] = useFieldState({ state: checkoutState, get: 'billingZone'      , set: reduxSetBillingZone       });
    const [billingZip        , , billingZipHandlers       ] = useFieldState({ state: checkoutState, get: 'billingZip'       , set: reduxSetBillingZip        });
    const [billingCountry    , , billingCountryHandlers   ] = useFieldState({ state: checkoutState, get: 'billingCountry'   , set: reduxSetBillingCountry    });
    
    
    
    // apis:
    const                        {data: productList    , isFetching: isProductLoading, isError: isProductError, refetch: productRefetch}  = useGetProductList();
    const                        {data: countryList    , isFetching: isCountryLoading, isError: isCountryError, refetch: countryRefetch}  = useGetCountryList();
    const [generatePaymentToken, {data: newPaymentToken, isLoading : isTokenLoading  , isError: isTokenError  }] = useGeneratePaymentToken();
    
    const [getShippingByAddress, {data: shippingList   , isUninitialized: isShippingUninitialized, isError: isShippingError, isSuccess: isShippingSuccess}]  = useGetMatchingShippingList();
    
    const isPerformedRecoverShippingList = useRef<boolean>(false);
    const isNeedsRecoverShippingList     =                                (checkoutStep !== 'info') && isShippingUninitialized && !isPerformedRecoverShippingList.current;
    const isNeedsRecoverShippingProvider = !isNeedsRecoverShippingList && (checkoutStep !== 'info') && (isShippingError || isShippingSuccess) && !shippingList?.entities?.[shippingProvider ?? ''];
    
    const isCheckoutLoading              =  !isCheckoutEmpty    && isProductLoading ||  isCountryLoading || !paymentToken || isNeedsRecoverShippingList; // do not report the loading state if the checkout is empty
    const hasData                        = (!!productList && !!countryList && !!paymentToken);
    const isCheckoutError                = (!isCheckoutLoading && (isProductError   ||  isCountryError   || (isTokenError && !paymentToken /* do not considered as token_error if still have old_token */))) || !hasData /* considered as error if no data */;
    const isCheckoutReady                =  !isCheckoutLoading && !isCheckoutError  && !isCheckoutEmpty;
    
    
    
    // cart data:
    const totalShippingCost = useMemo<number|null|undefined>(() => {
        // conditions:
        if (!shippingList)               return undefined; // the shippingList data is not available yet => nothing to calculate
        const selectedShipping = shippingProvider ? shippingList.entities?.[shippingProvider] : undefined;
        if (!selectedShipping)           return undefined; // no valid selected shippingProvider => nothing to calculate
        if (totalProductWeight === null) return null;      // non physical product => no shipping required
        
        
        
        // calculate the shipping cost based on the totalProductWeight and the selected shipping provider:
        return calculateShippingCost(totalProductWeight, selectedShipping);
    }, [totalProductWeight, shippingList, shippingProvider]);
    
    
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
    const isPaymentTokenInitialized = useRef<boolean>(false);
    useEffect(() => {
        // conditions:
        if (isTokenLoading) return;
        
        
        
        // setups:
        let cancelRefresh : ReturnType<typeof setTimeout>|undefined = undefined;
        if (!isPaymentTokenInitialized.current) {
            isPaymentTokenInitialized.current = true;
            
            // the first time to generate a new token:
            console.log('initial: generate a new token');
            generatePaymentToken();
        }
        else if (isTokenError) {
            // retry to generate a new token:
            console.log('schedule retry : generate a new token');
            cancelRefresh = setTimeout(() => {
                console.log('retry : generate a new token');
                generatePaymentToken();
            }, 60 * 1000);
        }
        else if (newPaymentToken) {
            // replace the expiring one:
            dispatch(reduxSetPaymentToken(newPaymentToken));
            
            
            
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
    }, [newPaymentToken, isTokenLoading, isTokenError]);
    
    // auto clear finished checkout states in redux:
    useEffect(() => {
        // conditions:
        if ((checkoutStep !== 'pending') && (checkoutStep !== 'paid')) return; // auto clear when state is 'pending' or 'paid'
        
        
        
        // actions:
        // clear the cart & checkout states in redux:
        if (reduxCartItems    ) clearProductsFromCart();
        if (reduxCheckoutState) dispatch(reduxResetCheckoutData());
    }, [checkoutStep, reduxCartItems, reduxCheckoutState]);
    
    
    
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
            // TODO: if (totalShippingWeight !== null) // if contain a/some physical product => requires shipping
            {
                // validate:
                // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
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
            } // if
            
            
            
            dispatch(reduxSetIsBusy('checkShipping'));
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
                dispatch(reduxSetIsBusy(false));
            } // try
        } // if
        
        
        
        setCheckoutStep('shipping');
        
        
        
        if (!goForward) { // go back from 'shipping'|'payment' => focus to shipping method option control
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
        
        
        
        return true; // transaction completed
    });
    const gotoPayment          = useEvent((): void => {
        setCheckoutStep('payment');
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
        
        // reset:
        if (billingAsShipping) { // the billingAddress is the same as shippingAddress => reset billingAddress validation
            dispatch(reduxSetBillingValidation(false));
        } // if
    });
    
    const doTransaction        = useEvent(async (transaction: (() => Promise<void>)): Promise<boolean> => {
        if (paymentMethod !== 'paypal') { // paymentMethod 'card' & paymentMethod 'manual' => requires valid billing fields
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
        
        
        
        dispatch(reduxSetIsBusy('transaction'));
        try {
            await transaction();
        }
        finally {
            dispatch(reduxSetIsBusy(false));
        } // try
        
        
        
        return true; // transaction completed
    });
    const doPlaceOrder         = useEvent(async (options?: PlaceOrderOptions): Promise<string> => {
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
    const doMakePayment        = useEvent(async (orderId: string, paid: boolean): Promise<void> => {
        const paymentState = await makePayment({
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
        
        
        
        // save the finished order states:
        // setCheckoutStep(paid ? 'paid' : 'pending'); // not needed this code, already handled by `setFinishedOrderState` below:
        setFinishedOrderState({ // backup the cart & checkout states in redux
            cartItems,
            checkoutState : {
                ...checkoutState,
                checkoutStep : (paid ? 'paid' : 'pending'),
                isBusy       : false,
            },
            paymentState,
        });
        
        
        
        // clear the cart & checkout states in redux:
        clearProductsFromCart();
        dispatch(reduxResetCheckoutData());
    });
    const refetch              = useEvent((): void => {
        productRefetch();
        countryRefetch();
        generatePaymentToken();
    });
    
    
    
    // apis:
    const checkoutData = useMemo<CheckoutState>(() => ({
        // states:
        checkoutStep,
        checkoutProgress,
        
        isBusy,
        
        isCheckoutEmpty   : isCheckoutEmpty   as any,
        isCheckoutLoading : isCheckoutLoading as any,
        isCheckoutError   : isCheckoutError   as any,
        isCheckoutReady   : isCheckoutReady   as any,
        
        isDesktop,
        
        
        
        // extra data:
        marketingOpt,
        marketingOptHandlers,      // stable ref
        
        
        
        // customer data:
        customerNickName,
        customerNickNameHandlers,  // stable ref
        
        customerEmail,
        customerEmailHandlers,     // stable ref
        
        
        
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
        setShippingProvider,       // stable ref
        
        totalShippingCost,
        
        
        
        // billing data:
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
        productList,
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
        
        refetch,                   // stable ref
    }), [
        // states:
        checkoutStep,
        checkoutProgress,
        
        isBusy,
        
        isCheckoutEmpty,
        isCheckoutLoading,
        isCheckoutError,
        isCheckoutReady,
        
        isDesktop,
        
        
        
        // extra data:
        marketingOpt,
        // marketingOptHandlers,      // stable ref
        
        
        
        // customer data:
        customerNickName,
        // customerNickNameHandlers,  // stable ref
        
        customerEmail,
        // customerEmailHandlers,     // stable ref
        
        
        
        // shipping data:
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
        productList,
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
        
        refetch,                      // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <CheckoutStateContext.Provider value={checkoutData}>
            <AccessibilityProvider
                // accessibilities:
                enabled={!isBusy} // disabled if busy
            >
                {children}
            </AccessibilityProvider>
        </CheckoutStateContext.Provider>
    );
};
export {
    CheckoutStateProvider,
    CheckoutStateProvider as default,
}
//#endregion checkoutState

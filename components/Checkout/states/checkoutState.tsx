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
    
    
    
    // a set of client-side functions.:
    isClientSide,
    
    
    
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMountedFlag,
    
    
    
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

// models:
import {
    type ShippingAddressDetail,
    type BillingAddressDetail,
    
    type CheckoutStep,
    type PaymentMethod,
    
    type FinishedOrderState,
    type BusyState,
    
    calculateCheckoutProgress,
}                           from '@/models'
// stores:
import {
    // types:
    PaymentToken,
    CheckoutState         as ReduxCheckoutState,
    
    
    
    // version control:
    resetIfInvalid        as reduxResetIfInvalid,
    
    
    
    // states:
    setCheckoutStep       as reduxSetCheckoutStep,
    
    // extra data:
    setMarketingOpt       as reduxSetMarketingOpt,
    
    // customer data:
    setCustomerValidation as reduxSetCustomerValidation,
    
    setCustomerEmail      as reduxSetCustomerEmail,
    setCustomerName       as reduxSetCustomerName,
    
    // shipping data:
    setShippingValidation as reduxSetShippingValidation,
    setShippingAddress    as reduxSetShippingAddress,
    setShippingProvider   as reduxSetShippingProvider,
    
    // billing data:
    setBillingValidation  as reduxSetBillingValidation,
    setBillingAsShipping  as reduxSetBillingAsShipping,
    setBillingAddress     as reduxSetBillingAddress,
    
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
    DraftOrderDetail,
    PaymentDetail,
    PlaceOrderOptions,
    
    MakePaymentOptions,
    LimitedStockItem,
    
    
    
    // hooks:
    useGetCountryList,
    useGetMatchingShippingList,
    useGeneratePaymentToken,
    usePlaceOrder,
    useMakePayment,
    useShowPrevOrder,
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
    FieldSetter,
    FieldHandlers,
    useFieldState,
}                           from '../hooks/fieldState'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



// types:
export type {
    CartEntry,
    
    CheckoutStep,
    PaymentMethod,
    PaymentToken,
    
    ProductPreview,
    PaymentDetail,
    PlaceOrderOptions,
    
    MakePaymentOptions,
    
    CountryPreview,
    
    MatchingShipping,
}



// utilities:
const invalidSelector = ':is(.invalidating, .invalidated):not([aria-invalid="false"])';



// hooks:

// states:

//#region checkoutState

// contexts:
export interface CheckoutStateBase {
    // states:
    checkoutStep                 : CheckoutStep
    checkoutProgress             : number
    
    isBusy                       : BusyState,
    
    isCheckoutEmpty              : boolean
    isCheckoutLoading            : boolean
    isCheckoutError              : boolean
    isCheckoutReady              : boolean
    isCheckoutFinished           : boolean
    
    isDesktop                    : boolean
    
    
    
    // extra data:
    marketingOpt                 : boolean
    marketingOptHandlers         : FieldHandlers<HTMLInputElement>
    
    
    
    // customer data:
    customerValidation           : boolean
    customerName                 : string
    setCustomerName              : FieldSetter<'customerName'>
    
    customerEmail                : string
    setCustomerEmail             : FieldSetter<'customerEmail'>
    
    
    
    // shipping data:
    isShippingAddressRequired    : boolean
    shippingValidation           : boolean
    
    shippingAddress              : ShippingAddressDetail|null
    setShippingAddress           : (address: ShippingAddressDetail|null) => void
    
    shippingProvider             : string | undefined
    setShippingProvider          : (shippingProvider: string) => void
    
    totalShippingCost            : number|null|undefined // undefined: not selected yet; null: no shipping required (non physical product)
    
    
    
    // billing data:
    isBillingAddressRequired     : boolean
    billingValidation            : boolean
    
    billingAsShipping            : boolean
    setBillingAsShipping         : (billingAsShipping: boolean) => void
    
    billingAddress               : BillingAddressDetail|null
    setBillingAddress            : (address: BillingAddressDetail|null) => void
    
    
    
    // payment data:
    appropriatePaymentProcessors : (typeof checkoutConfigClient.payment.preferredProcessors)
    
    paymentValidation            : boolean
    
    paymentMethod                : PaymentMethod
    setPaymentMethod             : (paymentMethod: PaymentMethod) => void
    
    paymentToken                 : PaymentToken | undefined
    
    paymentType                  : string|undefined
    paymentBrand                 : string|null|undefined
    paymentIdentifier            : string|null|undefined
    
    
    
    // relation data:
    countryList                  : EntityState<CountryPreview>   | undefined
    shippingList                 : EntityState<MatchingShipping> | undefined
    
    
    
    // sections:
    regularCheckoutSectionRef    : React.MutableRefObject<HTMLElement|null>      | undefined
    shippingMethodOptionRef      : React.MutableRefObject<HTMLElement|null>      | undefined
    billingAddressSectionRef     : React.MutableRefObject<HTMLElement|null>      | undefined
    paymentCardSectionRef        : React.MutableRefObject<HTMLFormElement|null>  | undefined
    currentStepSectionRef        : React.MutableRefObject<HTMLElement|null>      | undefined
    
    
    
    // fields:
    contactEmailInputRef         : React.MutableRefObject<HTMLInputElement|null> | undefined
    shippingAddressInputRef      : React.MutableRefObject<HTMLInputElement|null> | undefined
    
    
    
    // actions:
    gotoStepInformation          : (focusTo?: 'contactInfo'|'shippingAddress') => void
    gotoStepShipping             : () => Promise<boolean>
    gotoPayment                  : () => Promise<boolean>
    gotoFinished                 : (paymentDetail: PaymentDetail, paid: boolean) => void
    
    doTransaction                : (transaction: (() => Promise<void>)) => Promise<boolean>
    doPlaceOrder                 : (options?: PlaceOrderOptions) => Promise<DraftOrderDetail|undefined>
    doMakePayment                : (orderId: string, paid: boolean, options?: MakePaymentOptions) => Promise<void>
    
    refetchCheckout              : () => void
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
const noopSetter   : FieldSetter<any> = () => {};
const noopCallback = () => {};
const CheckoutStateContext = createContext<CheckoutState>({
    // states:
    checkoutStep                 : 'info',
    checkoutProgress             : 0,
    
    isBusy                       : false,
    
    isCheckoutEmpty              : true,
    isCheckoutLoading            : false,
    isCheckoutError              : false,
    isCheckoutReady              : false,
    isCheckoutFinished           : false,
    
    isDesktop                    : false,
    
    
    
    // extra data:
    marketingOpt                 : true,
    marketingOptHandlers         : noopHandler,
    
    
    
    // customer data:
    customerValidation           : false,
    customerName                 : '',
    setCustomerName              : noopSetter,
    
    customerEmail                : '',
    setCustomerEmail             : noopSetter,
    
    
    
    // shipping data:
    isShippingAddressRequired    : false,
    shippingValidation           : false,
    
    shippingAddress              : null,
    setShippingAddress           : noopCallback,
    
    shippingProvider             : undefined,
    setShippingProvider          : noopCallback,
    
    totalShippingCost            : undefined,
    
    
    
    // billing data:
    isBillingAddressRequired     : false,
    billingValidation            : false,
    
    billingAsShipping            : true,
    setBillingAsShipping         : noopCallback,
    
    billingAddress               : null,
    setBillingAddress            : noopCallback,
    
    
    
    // payment data:
    appropriatePaymentProcessors : [],
    
    paymentValidation            : false,
    
    paymentMethod                : '',
    setPaymentMethod             : noopCallback,
    
    paymentToken                 : undefined,
    
    paymentType                  : undefined,
    paymentBrand                 : undefined,
    paymentIdentifier            : undefined,
    
    
    
    // relation data:
    countryList                  : undefined,
    shippingList                 : undefined,
    
    
    
    // sections:
    regularCheckoutSectionRef    : undefined,
    shippingMethodOptionRef      : undefined,
    billingAddressSectionRef     : undefined,
    paymentCardSectionRef        : undefined,
    currentStepSectionRef        : undefined,
    
    
    
    // fields:
    contactEmailInputRef         : undefined,
    shippingAddressInputRef      : undefined,
    
    
    
    // actions:
    gotoStepInformation          : noopCallback,
    gotoStepShipping             : noopCallback as any,
    gotoPayment                  : noopCallback as any,
    gotoFinished                 : noopCallback as any,
    
    doTransaction                : noopCallback as any,
    doPlaceOrder                 : noopCallback as any,
    doMakePayment                : noopCallback as any,
    
    refetchCheckout              : noopCallback,
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
    const [prevOrderId]                               = useState<string|undefined>(() => {
        // conditions:
        if (!isClientSide) return undefined;
        
        
        
        // actions:
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get('orderId') || undefined;
    });
    
    
    
    // contexts:
    const {
        // states:
        isCartLoading,
        isCartError,
        
        
        
        // accessibilities:
        currency,
        
        
        
        // cart data:
        cartItems : globalCartItems,
        totalProductWeight,
        
        
        
        // relation data:
        productList: globalProductList,
        
        
        
        // actions:
        clearProductsFromCart,
        trimProductsFromCart,
        
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
        
        paymentMethod = '',
    } = localCheckoutState;
    
    const {
        paymentToken,
    } = globalCheckoutState;
    
    const appropriatePaymentProcessors = useMemo((): CheckoutState['appropriatePaymentProcessors'] => {
        return (
            checkoutConfigClient.payment.preferredProcessors
            .map((paymentProcessorName) => [
                paymentProcessorName,
                checkoutConfigClient.payment.processors[paymentProcessorName]
            ] as const)
            .filter(([paymentProcessorName, {enabled, supportedCurrencies}]) =>
                enabled
                &&
                supportedCurrencies.includes(currency)
            )
            .map(([name, value]) => name)
        );
    }, [currency]);
    
    const checkoutProgress            = calculateCheckoutProgress(checkoutStep);
    const isPaymentTokenValid         = !!paymentToken?.expiresAt && (paymentToken.expiresAt > Date.now());
    
    const {
        // payment data:
        type       : paymentType,
        brand      : paymentBrand,
        identifier : paymentIdentifier,
    } = finishedOrderState?.paymentDetail ?? {};
    
    const dispatch                    = useDispatch();
    const setCheckoutStep             = useEvent((checkoutStep: CheckoutStep): void => {
        dispatch(reduxSetCheckoutStep(checkoutStep));
    });
    
    
    
    // extra data:
    const [marketingOpt   , , marketingOptHandlers] = useFieldState({ state: localCheckoutState, get: 'marketingOpt'     , set: reduxSetMarketingOpt      });
    
    
    
    // customer data:
    const [customerName   , setCustomerName       ] = useFieldState({ state: localCheckoutState, get: 'customerName'     , set: reduxSetCustomerName      });
    const [customerEmail  , setCustomerEmail      ] = useFieldState({ state: localCheckoutState, get: 'customerEmail'    , set: reduxSetCustomerEmail     });
    
    
    
    // shipping data:
    const [shippingAddress, setShippingAddress    ] = useFieldState({ state: localCheckoutState, get: 'shippingAddress'  , set: reduxSetShippingAddress   });
    
    
    
    // billing data:
    const [billingAddress , setBillingAddress     ] = useFieldState({ state: localCheckoutState, get: 'billingAddress'   , set: reduxSetBillingAddress    });
    
    
    
    // apis:
    const [showPrevOrder       , {data: prevOrderData, isLoading : isPrevOrderLoading, isError: isPrevOrderError}] = useShowPrevOrder();
    const                        {data: countryList  , isFetching: isCountryLoading  , isError: isCountryError, refetch: countryRefetch}  = useGetCountryList();
    const [generatePaymentToken, {                     isLoading : isTokenLoading    , isError: isTokenError  }] = useGeneratePaymentToken();
    
    const [getShippingByAddress, {data: shippingList , isUninitialized: isShippingUninitialized, isError: isShippingError, isSuccess: isShippingSuccess}]  = useGetMatchingShippingList();
    
    
    
    const realTotalShippingCost          = useMemo<number|null|undefined>(() => {
        // conditions:
        if (totalProductWeight === null) return null;      // non physical product => no shipping required
        if (!shippingList)               return undefined; // the shippingList data is not available yet => nothing to calculate
        const selectedShipping = shippingProvider ? shippingList.entities?.[shippingProvider] : undefined;
        if (!selectedShipping)           return undefined; // no valid selected shippingProvider => nothing to calculate
        
        
        
        // calculate the shipping cost based on the totalProductWeight and the selected shipping provider:
        return calculateShippingCost(selectedShipping, totalProductWeight);
    }, [totalProductWeight, shippingList, shippingProvider]);
    const totalShippingCost              = finishedOrderState?.totalShippingCost ?? realTotalShippingCost;
    
    const customerValidation             = reduxCustomerValidation;
    
    const isShippingAddressRequired      = (totalShippingCost !== null); // null => non physical product; undefined => has physical product but no shippingProvider selected; number => has physical product and has shippingProvider selected
    const shippingValidation             = isShippingAddressRequired && reduxShippingValidation;
    
    const isPerformedRecoverShippingList = useRef<boolean>(false);
    const isNeedsRecoverShippingList     =  isShippingAddressRequired  && (checkoutStep !== 'info') && isShippingUninitialized && !isPerformedRecoverShippingList.current;
    const isNeedsRecoverShippingProvider = !isNeedsRecoverShippingList && (checkoutStep !== 'info') && (isShippingError || isShippingSuccess) && !shippingList?.entities?.[shippingProvider ?? ''];
    
    const isBillingAddressRequired       = (paymentMethod === 'card'); // the billingAddress is required for 'card'
    const billingAsShipping              = isShippingAddressRequired && reduxBillingAsShipping;
    const billingValidation              = isBillingAddressRequired  && reduxBillingValidation && !billingAsShipping;
    
    
    
    const isPaymentStep                  = (checkoutStep === 'payment');
    const isLastCheckoutStep             = (checkoutStep === 'pending') || (checkoutStep === 'paid');
    const isCheckoutLoading              = (
        !isCheckoutEmpty // has cartItem(s) to display, if no cartItem(s) => nothing to load
        &&
        (
            // have any loading(s):
            
            isCartLoading
            ||
            isPrevOrderLoading
            ||
            isCountryLoading
            ||
            (
                isTokenLoading                // paymentToken is loading
                &&
                !isPaymentTokenValid          // silently paymentToken loading if still have valid oldPaymentToken (has backup)
                &&
                (isBusy !== 'preparePayment') // silently paymentToken loading if the business is triggered by next_button (the busy indicator belong to the next_button's icon)
            )
            ||
            isNeedsRecoverShippingList // still recovering shippingList
        )
    );
    const hasData                        = (
        !!productList           // must have productList data
        &&
        !!countryList           // must have countryList data
        &&
        (
            isPaymentTokenValid // must have valid paymentToken
            ||
            !isPaymentStep      // EXCEPT if NOT at_payment_step, the paymentToken is no longer required at this step (no matter valid or invalid)
        )
    );
    const isCheckoutError                = (
        (
            !isCheckoutLoading // while still LOADING => consider as NOT error
            &&
            (
                // have any error(s):
                
                isCartError
                ||
                isPrevOrderError
                ||
                isCountryError
                ||
                (
                    isTokenError         // paymentToken is error
                    &&
                    !isPaymentTokenValid // oldPaymentToken is also invalid (no backup)
                    &&
                    !isPaymentStep       // IGNORE paymentToken error if NOT at_payment_step, the paymentToken is no longer required at this step (no matter valid or invalid)
                )
            )
        )
        
        ||
        
        // considered as error if no data, even if no_error_occured, because we cannot display anything without data
        !hasData
    );
    const isCheckoutReady                = (
        !isCheckoutLoading // not still LOADING
        &&
        !isCheckoutError   // not having ERROR
        &&
        !isCheckoutEmpty   // has cartItem(s) to display
    );
    const isCheckoutFinished             = (
        isCheckoutReady    // must have READY state
        &&
        isLastCheckoutStep // must at_the_last_step
    );
    
    
    
    // states:
    const [isDesktop, setIsDesktop] = useState<boolean>(false); // mobile first
    
    const handleWindowResize = useEvent<WindowResizeCallback>(({inlineSize: mediaCurrentWidth}) => {
        const breakpoint = breakpoints.lg;
        const newIsDesktop = (!!breakpoint && (mediaCurrentWidth >= breakpoint));
        if (isDesktop === newIsDesktop) return;
        setIsDesktop(newIsDesktop);
    });
    useWindowResizeObserver(handleWindowResize);
    
    
    
    // effects:
    
    // show the prev completed order if `?orderId=foo` param specified:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!prevOrderId) return;
        
        
        
        // actions:
        showPrevOrder({orderId: prevOrderId});
    }, [prevOrderId]);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!prevOrderData) return;
        
        
        
        // actions:
        setFinishedOrderState(prevOrderData); // restore the cart & checkout states from fetch to react state
    }, [prevOrderData]);
    
    // auto reset reduct state if was invalid:
    useIsomorphicLayoutEffect(() => {
        dispatch(reduxResetIfInvalid());
    }, []);
    
    // try to recover shippingList on page_refresh:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!isNeedsRecoverShippingList)     return; // already being initialized/recovered => ignore
        
        
        
        // check shipping address:
        if (!shippingAddress || !shippingAddress.country || !shippingAddress.state || !shippingAddress.city) {
            // no shippingList => go back to information page:
            setCheckoutStep('info');
            
            
            
            // abort to initialize shippingList:
            return;
        } // if
        
        
        
        // initialize shippingList:
        isPerformedRecoverShippingList.current = true;
        getShippingByAddress({
            country : shippingAddress.country,
            state   : shippingAddress.state,
            city    : shippingAddress.city,
        });
    }, [isNeedsRecoverShippingList, shippingAddress]);
    
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
                previewShippingCost : calculateShippingCost(shippingEntry, totalProductWeight) ?? -1, // -1 means: no need to ship (digital products)
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
    
    // auto renew paymentToken:
    const isMounted                        = useMountedFlag();
    const schedulingRefreshPaymentTokenRef = useRef<ReturnType<typeof setTimeout>|null>(null);
    const scheduleRefreshPaymentToken      = useEvent(async (): Promise<void> => {
        // conditions:
        if (!isMounted.current) return; // the component was unloaded before schedule performed => do nothing
        
        
        
        // determine the next refresh duration:
        const paymentTokenRemainingAge = (
            !!paymentToken
            ? Math.max(0, paymentToken.refreshAt - Date.now())
            : 0
        );
        const nextRefreshDuration = (
            (paymentTokenRemainingAge > 0) // still have valid oldPaymentToken
            ? paymentTokenRemainingAge // re-use valid oldPaymentToken
            : await (async (): Promise<number> => { // create newPaymentToken
                try {
                    // retry to generate a new paymentToken:
                    const newPaymentToken = await generatePaymentToken().unwrap();
                    
                    
                    
                    // replace the expiring one:
                    dispatch(reduxSetPaymentToken(newPaymentToken));
                    
                    
                    
                    // report the next refresh duration:
                    console.log('paymentToken renewed', {
                        expiresAt: newPaymentToken ? new Date(newPaymentToken.expiresAt).toLocaleString() : null,
                        refreshAt: newPaymentToken ? new Date(newPaymentToken.refreshAt).toLocaleString() : null,
                    });
                    return Math.max(0, newPaymentToken.refreshAt - Date.now());
                }
                catch (error: any) {
                    // report the next retry duration:
                    console.log('failed to renew paymentToken: ', error);
                    return (60 * 1000);
                } // try
            })()
        );
        
        
        
        // conditions:
        if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
        
        
        
        // re-schedule:
        if (schedulingRefreshPaymentTokenRef.current) clearTimeout(schedulingRefreshPaymentTokenRef.current); // abort prev schedule (if any)
        
        console.log(`schedule refresh paymentToken in ${nextRefreshDuration/1000} seconds`);
        schedulingRefreshPaymentTokenRef.current = setTimeout(() => {
            scheduleRefreshPaymentToken()
            .then(() => {
                console.log('schedule refresh paymentToken PERFORMED');
            });
        }, nextRefreshDuration);
    });
    
    const isScheduleTriggeredRef           = useRef<boolean>(false);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!isPaymentStep) return; // no paymentToken renewal when NOT at_payment_step
        if (isScheduleTriggeredRef.current) return; // already triggered => ignore
        isScheduleTriggeredRef.current = true; // mark as triggered
        
        
        
        // setups:
        // trigger to start schedule:
        scheduleRefreshPaymentToken();
        
        
        
        // cleanups:
        return () => {
            if (schedulingRefreshPaymentTokenRef.current) clearTimeout(schedulingRefreshPaymentTokenRef.current); // abort prev schedule (if any)
        };
    }, [isPaymentStep, paymentToken, isPaymentTokenValid]);
    
    // auto reset billing validation:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (isBillingAddressRequired) return; // billing is required                => nothing to reset
        if (!billingAsShipping)       return; // billing is different than shipping => nothing to reset
        if (!reduxBillingValidation)  return; // already reseted                    => nothing to reset
        
        
        
        // reset:
        dispatch(reduxSetBillingValidation(false));
    }, [isBillingAddressRequired, billingAsShipping, reduxBillingValidation]);
    
    // pooling for available stocks:
    useIsomorphicLayoutEffect((): (() => void)|undefined => {
        // conditions:
        if ((checkoutStep === 'pending') || (checkoutStep === 'paid')) return; // no pooling when state is 'pending' or 'paid'
        
        
        
        // actions:
        let schedulingAborted     = false;
        let schedulingVerifyStock : ReturnType<typeof setTimeout>|undefined = undefined;
        const scheduleVerifyStock = async (): Promise<void> => {
            // conditions:
            if (schedulingAborted) return;
            
            
            
            // actions:
            await verifyStock();
            
            
            
            // conditions:
            if (schedulingAborted) return;
            
            
            
            // re-schedule:
            schedulingVerifyStock = setTimeout(scheduleVerifyStock, 60 * 1000); // pooling every a minute
        };
        // first-schedule & avoids double re-run in StrictMode:
        Promise.resolve().then(scheduleVerifyStock);
        
        
        
        // cleanups:
        return () => {
            schedulingAborted = true;
            if (schedulingVerifyStock) clearTimeout(schedulingVerifyStock);
        };
    }, [checkoutStep]);
    
    
    
    // refs:
    const regularCheckoutSectionRef = useRef<HTMLElement|null>(null);
    const shippingMethodOptionRef   = useRef<HTMLElement|null>(null);
    const billingAddressSectionRef  = useRef<HTMLElement|null>(null);
    const paymentCardSectionRef     = useRef<HTMLFormElement|null>(null);
    const currentStepSectionRef     = useRef<HTMLElement|null>(null);
    
    const contactEmailInputRef      = useRef<HTMLInputElement|null>(null);
    const shippingAddressInputRef   = useRef<HTMLInputElement|null>(null);
    
    
    
    // apis:
    const [placeOrder ] = usePlaceOrder();
    const [makePayment] = useMakePayment();
    
    
    
    // dialogs:
    const {
        showMessageError,
        showMessageFieldError,
        showMessageNotification,
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
            dispatch(reduxSetShippingValidation(true)); // enable shippingAddress validation
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
                    const shippingList = !shippingAddress ? undefined : await getShippingByAddress({
                        country : shippingAddress.country,
                        state   : shippingAddress.state,
                        city    : shippingAddress.city,
                    }).unwrap();
                    
                    
                    
                    if (!shippingList?.ids.length) {
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
        // const goForward = ... // always go_forward, never go_backward after finishing the payment
        if (!isShippingAddressRequired) { // if only digital products => validate the customer account
            // validate:
            // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
            dispatch(reduxSetCustomerValidation(true)); // enable customerAccount validation
            // dispatch(reduxSetShippingValidation(true)); // enable shippingAddress validation // NO shippingAddress validation required, because NOT have physical product(s)
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
        
        
        
        // update and wait for paymentToken to avoid whole_page_spinning_busy:
        setIsBusy('preparePayment');
        try {
            await scheduleRefreshPaymentToken();
        }
        catch {
            // ignore any error => just display whole_page_error
        }
        finally {
            setIsBusy(false);
        } // try
        
        
        
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
                dispatch(reduxSetBillingValidation(true)); // enable billingAddress validation
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
    const doPlaceOrder         = useEvent(async (options?: PlaceOrderOptions): Promise<DraftOrderDetail|undefined> => {
        try {
            const draftOrderDetailOrPaymentDetail = await placeOrder({
                // currency options:
                currency, // informs the customer's currency, so we know the selected currency when he/she made an order
                
                
                
                // cart item(s):
                items : cartItems,
                
                
                
                ...((!options?.simulateOrder) ? {
                    // extra data:
                    marketingOpt,
                    
                    
                    
                    // customer data:
                    customerName,
                    customerEmail,
                } : undefined),
                
                
                
                // shipping data:
                ...((!options?.simulateOrder && isShippingAddressRequired) ? {
                    shippingAddress,
                    
                    shippingProvider,
                } : undefined),
                
                
                
                // billing data:
                ...((!options?.simulateOrder && isBillingAddressRequired) ? {
                    billingAddress : billingAsShipping ? shippingAddress : billingAddress,
                } : undefined),
                
                
                
                // options: pay manually | paymentSource (by <PayPalButtons>)
                ...options,
            }).unwrap();
            
            
            
            if (!('orderId' in draftOrderDetailOrPaymentDetail)) {
                gotoFinished(draftOrderDetailOrPaymentDetail, /*paid:*/(draftOrderDetailOrPaymentDetail.type !== 'MANUAL')); // buggy
                return undefined;
            }
            else {
                return draftOrderDetailOrPaymentDetail;
            } // if
        }
        catch (fetchError: any) {
            await trimProductsFromCart(fetchError?.data?.limitedStockItems, {
                showConfirm         : true,
                showPaymentCanceled : (options?.paymentSource !== 'manual'),
            });
            
            
            
            throw fetchError;
        } // try
    });
    const verifyStockPromise   = useRef<Promise<boolean>|number|undefined>(undefined);
    const verifyStock          = useEvent(async (): Promise<boolean> => {
        const verifyStockPromised = verifyStockPromise.current;
        if (verifyStockPromised instanceof Promise) { // if prev verifyStock is already running => wait until resolved
            console.log('bulk await');
            return await verifyStockPromised; // resolved
        } // if
        
        
        
        const newVerifyStockPromise = (async (): Promise<boolean> => {
            // limits the request rate:
            if (typeof(verifyStockPromised) === 'number') {
                const lastRequestDuration = performance.now() - verifyStockPromised.valueOf();
                const waitFor = (10 * 1000) - lastRequestDuration;
                if (waitFor > 0) {
                    console.log('waitFor: ',  waitFor / 1000);
                    await new Promise<void>((resolved) => {
                        setTimeout(resolved, waitFor);
                    });
                    console.log('ready');
                } // if
            } // if
            
            
            
            if (!cartItems.length) return true; // if cart is empty => always success
            try {
                await placeOrder({
                    // currency options:
                    // currency, // no need to inform the currency, we just check for the available stocks
                    
                    
                    
                    // cart item(s):
                    items : cartItems,
                    
                    
                    
                    // options:
                    simulateOrder: true,
                }).unwrap();
                return true;
            }
            catch (fetchError: any) {
                await trimProductsFromCart(fetchError?.data?.limitedStockItems, {
                        showConfirm         : true,
                        showPaymentCanceled : false,
                });
                
                
                
                return false;
            } // try
        })();
        verifyStockPromise.current = newVerifyStockPromise; // setup
        try {
            return await newVerifyStockPromise; // resolved
        }
        finally {
            verifyStockPromise.current = performance.now(); // limits the future request rate
        } // try
    });
    const doMakePayment        = useEvent(async (orderId: string, paid: boolean, options?: MakePaymentOptions): Promise<void> => {
        if (options?.cancelOrder) {
            console.log('canceling order...');
            await makePayment({
                orderId,
                
                
                
                // options: cancel the order
                cancelOrder: true,
            }).unwrap();
            console.log('canceled');
            return;
        } // if
        
        
        
        const paymentDetail = await makePayment({
            orderId,
            
            
            
            // billing data:
            ...(isBillingAddressRequired ? {
                billingAddress : billingAsShipping ? shippingAddress : billingAddress,
            } : undefined),
            
            
            
            // options: cancelOrder
            ...options,
        }).unwrap();
        
        
        
        gotoFinished(paymentDetail, paid);
    });
    const gotoFinished         = useEvent((paymentDetail: PaymentDetail, paid: boolean): void => {
        // save the finished order states:
        // setCheckoutStep(paid ? 'paid' : 'pending'); // not needed this code, already handled by `setFinishedOrderState` below:
        const soldProductIds = new Set<string|number>(
            cartItems
            .map(({productId}) => productId)
        );
        const finishedOrderState : FinishedOrderState = {
            cartItems,
            productList : {
                // the minimal version of `productList`, only contains the sold items:
                
                ids      : productList?.ids.filter((id) => soldProductIds.has(id)) ?? [],
                entities : Object.fromEntries(
                    Object.entries(productList?.entities ?? {})
                    .filter(([key]) => soldProductIds.has(key))
                ),
            },
            
            checkoutState : {
                ...localCheckoutState,
                checkoutStep : (paid ? 'paid' : 'pending'),
            },
            totalShippingCost,
            paymentDetail,
        };
        setFinishedOrderState(finishedOrderState); // backup the cart & checkout states from redux to react state
        
        
        
        // discard used paymentToken:
        dispatch(reduxSetPaymentToken(undefined));
        
        
        
        // clear the cart & checkout states in redux:
        clearProductsFromCart();
        dispatch(reduxResetCheckoutData());
    });
    
    const refetchCheckout      = useEvent((): void => {
        refetchCart();
        countryRefetch();
        if (prevOrderId) showPrevOrder({orderId: prevOrderId});
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
        marketingOptHandlers,         // stable ref
        
        
        
        // customer data:
        customerValidation,
        customerName,
        setCustomerName,              // stable ref
        
        customerEmail,
        setCustomerEmail,             // stable ref
        
        
        
        // shipping data:
        isShippingAddressRequired,
        shippingValidation,
        
        shippingAddress,
        setShippingAddress,           // stable ref
        
        shippingProvider,
        setShippingProvider,          // stable ref
        
        totalShippingCost,
        
        
        
        // billing data:
        isBillingAddressRequired,
        billingValidation,
        
        billingAsShipping,
        setBillingAsShipping,         // stable ref
        
        billingAddress,
        setBillingAddress,            // stable ref
        
        
        
        // payment data:
        appropriatePaymentProcessors,
        
        paymentValidation,
        
        paymentMethod,
        setPaymentMethod,             // stable ref
        
        paymentToken,
        
        paymentType,
        paymentBrand,
        paymentIdentifier,
        
        
        
        // relation data:
        countryList,
        shippingList,
        
        
        
        // sections:
        regularCheckoutSectionRef,    // stable ref
        shippingMethodOptionRef,      // stable ref
        billingAddressSectionRef,     // stable ref
        paymentCardSectionRef,        // stable ref
        currentStepSectionRef,        // stable ref
        
        
        
        // fields:
        contactEmailInputRef,         // stable ref
        shippingAddressInputRef,      // stable ref
        
        
        
        // actions:
        gotoStepInformation,          // stable ref
        gotoStepShipping,             // stable ref
        gotoPayment,                  // stable ref
        gotoFinished,                 // stable ref
        
        doTransaction,                // stable ref
        doPlaceOrder,                 // stable ref
        doMakePayment,                // stable ref
        
        refetchCheckout,              // stable ref
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
        customerName,
        // setCustomerName,           // stable ref
        
        customerEmail,
        // setCustomerEmail,          // stable ref
        
        
        
        // shipping data:
        isShippingAddressRequired,
        shippingValidation,
        
        shippingAddress,
        // setShippingAddress,        // stable ref
        
        shippingProvider,
        // setShippingProvider        // stable ref,
        
        totalShippingCost,
        
        
        
        // billing data:
        isBillingAddressRequired,
        billingValidation,
        
        billingAsShipping,
        // setBillingAsShipping,      // stable ref
        
        billingAddress,
        // setBillingAddress,         // stable ref
        
        
        
        // payment data:
        appropriatePaymentProcessors,
        
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
        
        
        
        // fields:
        // contactEmailInputRef,      // stable ref
        // shippingAddressInputRef,   // stable ref
        
        
        
        // actions:
        // gotoStepInformation,       // stable ref
        // gotoStepShipping,          // stable ref
        // gotoPayment,               // stable ref
        // gotoFinished,              // stable ref
        
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

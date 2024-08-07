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
    // simple-components:
    ButtonIcon,
    
    
    
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
    type TotalShippingCostStatus,
    type PaymentMethod,
    
    type FinishedOrderState,
    type BusyState,
    
    type CountryPreview,
    
    calculateCheckoutProgress,
}                           from '@/models'
// stores:
import {
    // types:
    PaymentSession,
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
    setPaymentSession     as reduxSetPaymentSession,
    
    // actions:
    resetCheckoutData     as reduxResetCheckoutData,
    
    
    
    // selectors:
    selectCheckoutState,
}                           from '@/store/features/checkout/checkoutSlice'
import {
    // types:
    DraftOrderDetail,
    PaymentDetail,
    PlaceOrderOptions,
    
    MakePaymentOptions,
    LimitedStockItem,
    
    
    
    // hooks:
    useGetMatchingShippingList,
    useRefreshMatchingShippingList,
    useGeneratePaymentSession,
    // usePlaceOrder,
    // useMakePayment,
    useShowPrevOrder,
    
    
    
    // apis:
    placeOrder,
    makePayment,
}                           from '@/store/features/api/apiSlice'
import {
    // hooks:
    useAppDispatch,
    useAppSelector,
}                           from '@/store/hooks'

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

// errors:
import {
    ErrorDeclined,
}                           from '@/errors'

// internals:
import type {
    // types:
    MatchingShipping,
}                           from '@/libs/shippings/shippings'
import {
    calculateShippingCost,
}                           from '@/libs/shippings/shippings'
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
    PaymentSession,
    
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

// types:
export const enum AuthenticatedResult {
    /**
     * The user is not authenticated until the timeout expires.
     */
    EXPIRED    = -2,
    /**
     * The user has decided to cancel the transaction.
     */
    CANCELED   = -1,
    /**
     * An error occured.  
     * Usually using invalid card.
     */
    FAILED     = 0,
    
    /**
     * Requires to capture the funds in server side.
     */
    AUTHORIZED = 1,
    /**
     * The transaction was successful but the funds have not yet settled your account.
     */
    PENDING    = 2,
    /**
     * The transaction was successful and the funds have settled your account.
     */
    CAPTURED   = 3,
}
export interface StartTransactionArg {
    // handlers:
    doPlaceOrder          : () => Promise<DraftOrderDetail|true>
    doAuthenticate       ?: (draftOrderDetail: DraftOrderDetail) => Promise<AuthenticatedResult>
    
    
    
    // messages:
    messageFailed         : React.ReactNode
    messageCanceled      ?: React.ReactNode
    messageExpired       ?: React.ReactNode
    messageDeclined       : React.ReactNode | ((errorMessage: string) => React.ReactNode)
    messageDeclinedRetry ?: React.ReactNode | ((errorMessage: string) => React.ReactNode)
}

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
    totalShippingCostStatus      : TotalShippingCostStatus
    
    
    
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
    
    paymentSession               : PaymentSession|undefined
    
    paymentType                  : string|undefined
    paymentBrand                 : string|null|undefined
    paymentIdentifier            : string|null|undefined
    
    
    
    // relation data:
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
    
    startTransaction             : (arg: StartTransactionArg) => Promise<boolean>
    doTransaction                : (transaction: (() => Promise<void>)) => Promise<boolean>
    doPlaceOrder                 : (options?: PlaceOrderOptions) => Promise<DraftOrderDetail|true>
    doMakePayment                : (orderId: string, paid: boolean, options?: MakePaymentOptions) => Promise<void>
    
    refetchCheckout              : () => void
}

export type PickAlways<T, K extends keyof T, V> = {
    [P in K] : Extract<T[P], V>
}
export type CheckoutState =
    &Omit<CheckoutStateBase, 'isCheckoutEmpty'|'isCheckoutLoading'|'isCheckoutError'|'isCheckoutReady'|'isCheckoutFinished' | 'paymentSession'>
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
            &PickAlways<CheckoutStateBase, 'isCheckoutReady'   , true        > // if   the checkout is  ready
            &PickAlways<CheckoutStateBase, 'isCheckoutFinished', boolean     > // then the checkout is  maybe finished
            &PickAlways<CheckoutStateBase, 'paymentSession'    , {}          > // then the checkout is  always having_data
        )
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutReady'   , false       > // if   the checkout not ready
            &PickAlways<CheckoutStateBase, 'isCheckoutFinished', false       > // then the checkout is  never finished
            &PickAlways<CheckoutStateBase, 'paymentSession'    , {}|undefined> // then the checkout is  maybe  having_data
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
    totalShippingCostStatus      : 'ready',
    
    
    
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
    
    paymentSession               : undefined,
    
    paymentType                  : undefined,
    paymentBrand                 : undefined,
    paymentIdentifier            : undefined,
    
    
    
    // relation data:
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
    
    startTransaction             : noopCallback as any,
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
    const isMounted                                   = useMountedFlag();
    
    
    
    // contexts:
    const {
        // states:
        // isCartEmpty, // do NOT rely on `isCartEmpty`, instead use own `cartItems.length`, because when the order is finished, the cartItem(s) will be GONE, we need to see the LAST state stored in `finishedOrderState`
        isCartLoading,
        isCartError,
        
        
        
        // accessibilities:
        currency,
        
        
        
        // cart data:
        cartItems : globalCartItems,
        totalProductWeight,
        totalProductWeightStepped,
        
        
        
        // relation data:
        productList: globalProductList,
        
        
        
        // actions:
        clearProductsFromCart,
        trimProductsFromCart,
        
        refetchCart,
    } = useCartState();
    const cartItems           = finishedOrderState ? finishedOrderState.cartItems     : globalCartItems;
    
    const productList         = finishedOrderState ? finishedOrderState.productList   : globalProductList;
    
    
    
    // stores:
    const globalCheckoutState = useAppSelector(selectCheckoutState);
    const localCheckoutState  = finishedOrderState ? finishedOrderState.checkoutState : globalCheckoutState;
    const {
        // states:
        checkoutStep,
        
        
        
        // extra data:
        marketingOpt,
        
        
        
        // customer data:
        customerValidation,
        
        customerName,
        customerEmail,
        
        
        
        // shipping data:
        shippingValidation : shippingValidationRaw,
        
        shippingAddress,
        
        shippingProvider,
        
        
        
        // billing data:
        billingValidation  : billingValidationRaw,
        billingAsShipping  : billingAsShippingRaw,
        
        billingAddress,
        
        
        
        // payment data:
        paymentValidation,
        
        paymentMethod = '',
    } = localCheckoutState;
    
    const {
        paymentSession,
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
    const isPaymentSessionValid       = !!paymentSession?.expiresAt && (paymentSession.expiresAt > Date.now());
    
    const {
        // payment data:
        type       : paymentType,
        brand      : paymentBrand,
        identifier : paymentIdentifier,
    } = finishedOrderState?.paymentDetail ?? {};
    
    const dispatch                    = useAppDispatch();
    const setCheckoutStep             = useEvent((checkoutStep: CheckoutStep): void => {
        dispatch(reduxSetCheckoutStep(checkoutStep));
    });
    
    
    
    // extra data:
    const [, , marketingOptHandlers] = useFieldState({ state: localCheckoutState, get: 'marketingOpt'     , set: reduxSetMarketingOpt      });
    
    
    
    // customer data:
    const [, setCustomerName       ] = useFieldState({ state: localCheckoutState, get: 'customerName'     , set: reduxSetCustomerName      });
    const [, setCustomerEmail      ] = useFieldState({ state: localCheckoutState, get: 'customerEmail'    , set: reduxSetCustomerEmail     });
    
    
    
    // shipping data:
    const [, setShippingAddress    ] = useFieldState({ state: localCheckoutState, get: 'shippingAddress'  , set: reduxSetShippingAddress   });
    
    
    
    // billing data:
    const [, setBillingAddress     ] = useFieldState({ state: localCheckoutState, get: 'billingAddress'   , set: reduxSetBillingAddress    });
    
    
    
    // apis:
    const [showPrevOrder           , {data: prevOrderData, isLoading : isPrevOrderLoading     , isError: isPrevOrderError     }] = useShowPrevOrder();
    const [getShippingByAddress    , {data: shippingList , isLoading : isShippingLoading      , isError: isShippingError , isUninitialized : isShippingUninitialized}] = useGetMatchingShippingList();
    const [refreshShippingByAddress                                                                                            ] = useRefreshMatchingShippingList();
    const [generatePaymentSession  , {                     isLoading : isPaymentSessionLoading, isError: isPaymentSessionError}] = useGeneratePaymentSession();
    
    
    
    const [realTotalShippingCost  , setRealTotalShippingCost  ] = useState<number|null|undefined>(undefined);
    const [totalShippingCostStatus, setTotalShippingCostStatus] = useState<TotalShippingCostStatus>('ready');
    
    // re-calculate shippingCost when totalWeight changed -or- available shippingList changed -or- selected shippingProvider changed:
    useIsomorphicLayoutEffect(() => {
        setTotalShippingCostStatus('ready');
        
        
        
        // conditions:
        if (totalProductWeight === undefined) { // unable to calculate due to incomplete loading of related data => nothing to calculate
            setRealTotalShippingCost(undefined);
            return;
        } // if
        if (totalProductWeight === null) {      // non physical product => no shipping required
            setRealTotalShippingCost(null);
            return;
        }
        if (!shippingList) {                    // the shippingList data is not available yet => nothing to calculate
            setRealTotalShippingCost(undefined);
            return;
        } // if
        
        const selectedShipping = shippingProvider ? shippingList.entities?.[shippingProvider] : undefined;
        if (!selectedShipping) {                // no valid selected shippingProvider => nothing to calculate
            setRealTotalShippingCost(undefined);
            return;
        } // if
        
        
        
        // calculate the shipping cost based on the totalProductWeight and the selected shipping provider:
        const shippingCost = calculateShippingCost(selectedShipping, totalProductWeight);
        setRealTotalShippingCost(shippingCost);
    }, [shippingList, shippingProvider, totalProductWeight]);
    
    // refresh shippingList when totalWeight changed:
    const prevTotalProductWeightSteppedRef  = useRef<number|null|undefined>(totalProductWeightStepped);
    const prevRefreshShippingByAddressIdRef = useRef<string|undefined>(undefined);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (prevTotalProductWeightSteppedRef.current === totalProductWeightStepped) {
            return; // no totalWeight changes => ignore
        }
        else {
            prevTotalProductWeightSteppedRef.current = totalProductWeightStepped; // track the changes
        } // if
        
        if ((checkoutStep === 'info') || (checkoutStep === 'pending') || (checkoutStep === 'paid')) return;
        if (!isShippingAddressRequired) return;
        if (!shippingAddress) return;
        
        if (totalProductWeightStepped === undefined) { // unable to calculate due to incomplete loading of related data => nothing to calculate
            setRealTotalShippingCost(undefined);
            return;
        } // if
        if (totalProductWeightStepped === null) {      // non physical product => no shipping required
            setRealTotalShippingCost(null);
            return;
        }
        if (!shippingList) {                           // the shippingList data is not available yet => nothing to calculate
            setRealTotalShippingCost(undefined);
            return;
        } // if
        
        const selectedShipping = shippingProvider ? shippingList.entities?.[shippingProvider] : undefined;
        if (!selectedShipping) {                       // no valid selected shippingProvider => nothing to calculate
            setRealTotalShippingCost(undefined);
            return;
        } // if
        if (Array.isArray(selectedShipping.rates) && (checkoutStep !== 'shipping')) return; // a dynamic shippingRates is selected => no need to refresh the staticRates, except when on shipping step: always refresh the shippingList rates
        
        
        
        // actions:
        let refreshShippingByAddressPromise : ReturnType<typeof refreshShippingByAddress>|undefined = undefined;
        const performRefresh = async (): Promise<void> => {
            try {
                setTotalShippingCostStatus('loading');
                
                
                
                refreshShippingByAddressPromise = refreshShippingByAddress({
                    ...shippingAddress,
                    totalProductWeight : totalProductWeightStepped ?? 0, // the `totalProductWeightStepped` should be number, because of `isNeedsRecoverShippingList` condition => `isShippingAddressRequired` condition
                });
                prevRefreshShippingByAddressIdRef.current = refreshShippingByAddressPromise.requestId;
                await refreshShippingByAddressPromise.unwrap();
            }
            catch (error: any) {
                if (!isMounted.current) return; // the component was unloaded before schedule performed => do nothing
                if (refreshShippingByAddressPromise && (prevRefreshShippingByAddressIdRef.current === refreshShippingByAddressPromise.requestId)) {
                    prevRefreshShippingByAddressIdRef.current = undefined;
                    setTotalShippingCostStatus('obsolete');
                } // if
                
                
                
                if (error.name === 'AbortError') return;
                
                
                
                const answer = await showMessageError<'retry'|'cancel'>({
                    error : <>
                        <p>
                            Unable to recalculate the shipping cost.
                        </p>
                        <p>
                            We were unable to retrieve data from the server.
                        </p>
                    </>,
                    options : {
                        retry  : <ButtonIcon theme='success' icon='refresh' autoFocus={true}>Retry</ButtonIcon>,
                        cancel : <ButtonIcon theme='secondary' icon='cancel'>Cancel</ButtonIcon>,
                    },
                });
                switch (answer) {
                    case 'retry':
                        performRefresh();
                        break;
                    
                    default :
                        /* if (checkoutStep !== 'info') */ gotoStepInformation(/* focusTo: */'shippingAddress');
                        break;
                } // switch
            } // try
        };
        performRefresh();
        
        
        
        // cleanups:
        return () => {
            refreshShippingByAddressPromise?.abort();
        };
    }, [checkoutStep, shippingList, shippingProvider, totalProductWeightStepped, shippingAddress]);
    
    // if the selected shipping method lost due to shippingList update => warn to the user that the selection is no longer available:
    const prevSelectedShippingProviderRef = useRef<MatchingShipping|undefined>(undefined);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        const prevSelectedShippingProvider = prevSelectedShippingProviderRef.current;
        const selectedShipping = shippingProvider ? shippingList?.entities?.[shippingProvider] : undefined;
        if (prevSelectedShippingProviderRef.current === selectedShipping) {
            return; // no selected shippingProvider changes => ignore
        }
        else {
            prevSelectedShippingProviderRef.current = selectedShipping; // track the changes
        } // if
        
        if (checkoutStep === 'info') return;       // on the first step => nothing to go back => ignore
        if (selectedShipping) return;              // still have a VALID SELECTED shippingProvider => ignore
        if (!prevSelectedShippingProvider) return; // not having prev selected shippingProvider => NOTHING TO LOSE => ignore
        
        
        
        // actions:
        showMessageError({ // fire & forget
            theme : 'warning',
            error : <>
                <p>
                    The shipping method you selected: <strong>{prevSelectedShippingProvider.name}</strong> is no longer available.
                </p>
                <p>
                    Please select another one.
                </p>
            </>,
        });
        
        
        
        if (!shippingList?.ids?.length) { // there's NO shippingMethod available => go back to the first step
            /* if (checkoutStep !== 'info') */ gotoStepInformation(/* focusTo: */'shippingAddress');
        }
        else { // there's SOME shippingMethod available => go back to the second step
            gotoStepShipping();
        } // if
    }, [checkoutStep, shippingList, shippingProvider]);
    
    const totalShippingCost              = finishedOrderState ? finishedOrderState?.totalShippingCost : realTotalShippingCost;
    
    const isShippingAddressRequired      = finishedOrderState ? finishedOrderState.isShippingAddressRequired : (
        (totalProductWeight === undefined)
        ? false                         // undefined => unknown_kind_product due to incomplete loading of related data => assumes as non physical product (prevents reset shippingProvider => go back to 'info'|'shipping' page)
        : (totalProductWeight !== null) // null => non physical product; ; number (not null) => has physical product
    );
    const shippingValidation             = (
        shippingValidationRaw
        &&
        isShippingAddressRequired // ENABLE shippingValidation if shipping_address_REQUIRED
    );
    
    const isNeedsRecoverShippingList     = (
        isShippingUninitialized     // never recovered, just run ONCE
        &&
        (checkoutStep !== 'info')   // not at the_first_step (cannot go back any further)
        &&
        isShippingAddressRequired   // has physical product to ship
        &&
        !shippingList               // there is NO shippingList data
    );
    const isNeedsResetShippingProvider   = (
        (checkoutStep !== 'info')   // not at the_first_step (cannot go back any further)
        &&
        isShippingAddressRequired   // has physical product to ship
        &&
        !isNeedsRecoverShippingList // the matching shippingList is not being recovered (can be recovered AFTER the matching shippingList is recovered first)
        &&
        !isShippingLoading          // the matching shippingList is not loading
        &&
        !isShippingError            // the matching shippingList is not error
        &&
        !shippingList?.entities?.[shippingProvider ?? ''] // no longer having a valid matching shippingProvider
    );
    
    const isBillingAddressRequired       = (paymentMethod === 'card'); // the billingAddress is REQUIRED for 'card'
    const billingAsShipping              = (
        billingAsShippingRaw
        &&
        isShippingAddressRequired // ENABLE OPTION_billingAsShipping if shipping_address_REQUIRED
    );
    const billingValidation              = (
        billingValidationRaw
        &&
        isBillingAddressRequired  // ENABLE billingValidation if billing_address_REQUIRED
        &&
        !billingAsShipping        // ENABLE billingValidation if OPTION_billingAsShipping is NOT_SELECTED
    );
    
    
    
    const isPaymentStep                  = (checkoutStep === 'payment');
    const isLastCheckoutStep             = (checkoutStep === 'pending') || (checkoutStep === 'paid');
    const isCheckoutEmpty                = (
        // isCartEmpty     // do NOT rely on `isCartEmpty`
        !cartItems.length  // instead use own `cartItems.length`, because when the order is finished, the cartItem(s) will be GONE, we need to see the LAST state stored in `finishedOrderState`
        
        /* isOther1Empty */
        /* isOther2Empty */
        /* isOther3Empty */
    );
    const isCheckoutLoading              = (
        !isCheckoutEmpty // has cartItem(s) to display, if no cartItem(s) => nothing to load
        &&
        (
            // have any loading(s):
            
            isCartLoading
            ||
            isPrevOrderLoading
            ||
            (
                isShippingAddressRequired     // IGNORE shippingLoading if no shipping required
                &&
                isShippingLoading
                &&
                (isBusy !== 'checkShipping')  // silently shipping loading if the business is triggered by next_button (the busy indicator belong to the next_button's icon)
            )
            ||
            (
                isPaymentSessionLoading       // paymentSession is loading
                &&
                !isPaymentSessionValid        // silently paymentSession loading if still have valid oldPaymentSession (has backup)
                &&
                (isBusy !== 'preparePayment') // silently paymentSession loading if the business is triggered by next_button (the busy indicator belong to the next_button's icon)
            )
            ||
            isNeedsRecoverShippingList        // still recovering shippingList
            ||
            isNeedsResetShippingProvider      // still resetting selected shippingProvider
        )
    );
    // if (isCheckoutLoading) console.log('LOADING: ', Object.entries({
    //     isCartLoading,
    //     isPrevOrderLoading,
    //     isShippingLoading : isShippingAddressRequired && isShippingLoading && (isBusy !== 'checkShipping'),
    //     isTokenLoading : isTokenLoading && !isPaymentSessionValid && (isBusy !== 'preparePayment'),
    //     isNeedsRecoverShippingList,
    //     isNeedsResetShippingProvider,
    // }).filter(([, val]) => (val === true)).map(([key]) => key));
    const isCheckoutError                = (
        !isCheckoutLoading // while still LOADING => consider as NOT error
        &&
        (
            // have any error(s):
            
            isCartError
            ||
            isPrevOrderError
            ||
            (
                isShippingAddressRequired // IGNORE shippingLoading if no shipping required
                &&
                isShippingError
            )
            ||
            (
                isPaymentSessionError     // paymentSession is error
                &&
                !isPaymentSessionValid    // oldPaymentSession is also invalid (no backup)
                &&
                !isPaymentStep            // IGNORE paymentSession error if NOT at_payment_step, the paymentSession is no longer required at this step (no matter valid or invalid)
            )
        )
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
    // if (isCheckoutError) console.log('ERROR: ', Object.entries({
    //     isCartError,
    //     isPrevOrderError,
    //     isShippingError : isShippingAddressRequired && isShippingError,
    //     isTokenError : isTokenError && !isPaymentSessionValid && !isPaymentStep,
    // }).filter(([, val]) => (val === true)).map(([key]) => key));
    // if (isCheckoutReady) console.log('checkout is READY');
    
    
    
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
        if (!isNeedsRecoverShippingList) return; // already being initialized/recovered => ignore
        
        
        
        // check shipping address:
        if (
            !shippingAddress
            ||
            !shippingAddress.country
            ||
            !shippingAddress.state
            ||
            !shippingAddress.city
            // ||
            // !shippingAddress.zip // optional
            ||
            !shippingAddress.address
            
            ||
            
            !shippingAddress.firstName
            ||
            !shippingAddress.lastName
            ||
            !shippingAddress.phone
        ) {
            // no shippingList => go back to information page:
            setCheckoutStep('info');
            
            
            
            // abort to initialize shippingList:
            return;
        } // if
        
        
        
        // initialize shippingList:
        console.log('recovering shippingList...');
        getShippingByAddress({
            ...shippingAddress,
            totalProductWeight : totalProductWeightStepped ?? 0, // the `totalProductWeightStepped` should be number, because of `isNeedsRecoverShippingList` condition => `isShippingAddressRequired` condition
        });
    }, [isNeedsRecoverShippingList, shippingAddress, totalProductWeight]);
    
    // go back to shipping page if the selected shippingProvider is not in shippingList:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!isNeedsResetShippingProvider) return; // already recovered => ignore
        
        
        
        console.log('resetting selected shippingProvider...');
        if (shippingList?.ids?.length) {
            // NOT HAVING VALID selected matching shippingProvider -AND- HAVE shippingList to select => go back to shipping page:
            setCheckoutStep('shipping');
        }
        else {
            // NOT HAVING VALID selected matching shippingProvider -AND- NO   shippingList to select => go back to information page:
            setCheckoutStep('info');
        } // if
    }, [isNeedsResetShippingProvider, shippingList]);
    
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
            .map((shippingEntry) => ({
                id                  : `${shippingEntry.id}`,
                previewShippingCost : calculateShippingCost(shippingEntry, totalProductWeight) ?? -1, // -1 means: no need to ship (digital products)
            }))
            .sort(({previewShippingCost: a}, {previewShippingCost: b}) => (a - b))
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
    
    // auto renew paymentSession:
    const isPaymentSessionRequired                    = (
        !!checkoutConfigClient.payment.processors.paypal.enabled
        &&
        !!process.env.NEXT_PUBLIC_PAYPAL_ID
    );
    const schedulingRefreshPaymentSessionRef          = useRef<ReturnType<typeof setTimeout>|null>(null);
    const scheduleRefreshPaymentSession               = useEvent(async (): Promise<void> => {
        // conditions:
        if (!isPaymentSessionRequired) return; // no paymentSession required => do nothing
        if (!isMounted.current) return; // the component was unloaded before schedule performed => do nothing
        
        
        
        // determine the next refresh duration:
        const paymentSessionRemainingAge = (
            !!paymentSession
            ? Math.max(0, paymentSession.refreshAt - Date.now())
            : 0
        );
        const nextRefreshDuration = (
            (paymentSessionRemainingAge > 0) // still have valid oldPaymentSession
            ? paymentSessionRemainingAge // re-use valid oldPaymentSession
            : await (async (): Promise<number> => { // create newPaymentSession
                try {
                    // retry to generate a new paymentSession:
                    const newPaymentSession = await generatePaymentSession().unwrap();
                    
                    
                    
                    // replace the expiring one:
                    dispatch(reduxSetPaymentSession(newPaymentSession));
                    
                    
                    
                    // report the next refresh duration:
                    console.log('paymentSession renewed', {
                        expiresAt: newPaymentSession ? new Date(newPaymentSession.expiresAt).toLocaleString() : null,
                        refreshAt: newPaymentSession ? new Date(newPaymentSession.refreshAt).toLocaleString() : null,
                    });
                    return Math.max(0, newPaymentSession.refreshAt - Date.now());
                }
                catch (error: any) {
                    // report the next retry duration:
                    console.log('failed to renew paymentSession: ', error);
                    return (60 * 1000);
                } // try
            })()
        );
        
        
        
        // conditions:
        if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
        
        
        
        // re-schedule:
        if (schedulingRefreshPaymentSessionRef.current) clearTimeout(schedulingRefreshPaymentSessionRef.current); // abort prev schedule (if any)
        
        console.log(`schedule refresh paymentSession in ${nextRefreshDuration/1000} seconds`);
        schedulingRefreshPaymentSessionRef.current = setTimeout(() => {
            scheduleRefreshPaymentSession()
            .then(() => {
                console.log('schedule refresh paymentSession PERFORMED');
            });
        }, nextRefreshDuration);
    });
    
    const isScheduleRefreshPaymentSessionTriggeredRef = useRef<boolean>(false);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!isPaymentSessionRequired) return; // no paymentSession required => ignore
        if (!isPaymentStep) return; // no paymentSession renewal when NOT at_payment_step
        if (isScheduleRefreshPaymentSessionTriggeredRef.current) return; // already triggered => ignore
        isScheduleRefreshPaymentSessionTriggeredRef.current = true;      // mark as triggered
        
        
        
        // setups:
        // trigger to start schedule:
        scheduleRefreshPaymentSession();
        
        
        
        // cleanups:
        return () => {
            if (schedulingRefreshPaymentSessionRef.current) clearTimeout(schedulingRefreshPaymentSessionRef.current); // abort prev schedule (if any)
        };
    }, [isPaymentSessionRequired, isPaymentStep, paymentSession, isPaymentSessionValid]);
    
    // auto reset billing validation:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (isBillingAddressRequired) return; // billing is required                => nothing to reset
        if (!billingAsShipping)       return; // billing is different than shipping => nothing to reset
        if (!billingValidationRaw)    return; // already reseted                    => nothing to reset
        
        
        
        // reset:
        dispatch(reduxSetBillingValidation(false)); // reset `billingValidationRaw`
    }, [isBillingAddressRequired, billingAsShipping, billingValidationRaw]);
    
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
    
    
    
    // // apis:
    // const [placeOrder ] = usePlaceOrder();
    // const [makePayment] = useMakePayment();
    
    
    
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
        if (goForward) { // go forward from 'info' => do validate shipping carriers
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
                        ...shippingAddress,
                        totalProductWeight : totalProductWeightStepped ?? 0, // the `totalProductWeightStepped` should be number, because of `isShippingAddressRequired` condition
                    }).unwrap();
                    
                    
                    
                    if (!shippingList?.ids.length) {
                        showMessageError({
                            title : <h1>No Shipping Method</h1>,
                            error : <>
                                <p>
                                    We&apos;re sorry. There are <strong>no shipping method available</strong> for delivery to your shipping address.
                                </p>
                                <p>
                                    Please verify that the <strong>country</strong>, <strong>state</strong>, <strong>city</strong>, and <strong>zip code</strong> are typed correctly, and then try again.
                                </p>
                                <p>
                                    If the problem persists, please contact us for further assistance.
                                </p>
                            </>,
                        });
                        return false; // transaction failed due to no_shipping_carriers
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
        
        
        
        // update and wait for paymentSession to avoid whole_page_spinning_busy:
        setIsBusy('preparePayment');
        try {
            await scheduleRefreshPaymentSession();
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
    
    const startTransaction     = useEvent(async (arg: StartTransactionArg): Promise<boolean> => {
        // args:
        const {
            // handlers:
            doPlaceOrder,
            doAuthenticate,
            
            
            
            // messages:
            messageFailed,
            messageCanceled      = <>
                <p>
                    The transaction has been <strong>canceled</strong> by the user.
                </p>
                <p>
                    <strong>No funds</strong> have been deducted.
                </p>
            </>,
            messageExpired       = messageCanceled,
            messageDeclined,
            messageDeclinedRetry = messageDeclined,
        } = arg;
        
        
        
        // actions:
        return await doTransaction(async (): Promise<void> => {
            try {
                // createOrder:
                const draftOrderDetail = await doPlaceOrder(); // if returns `DraftOrderDetail` => assumes a DraftOrder has been created
                if (draftOrderDetail === true) return; // immediately paid => no need further action
                if (!doAuthenticate) return; // the nextAction callback is not defined => no need further action
                
                
                
                let rawOrderId = draftOrderDetail.orderId;
                let authenticatedResult : AuthenticatedResult;
                try {
                    authenticatedResult = await doAuthenticate(draftOrderDetail);
                    rawOrderId = draftOrderDetail.orderId; // the `draftOrderDetail.orderId` may be updated during `doAuthenticate()` call.
                }
                catch (error: any) { // an unexpected authentication error occured
                    // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                    doCancelDraftOrder(rawOrderId);
                    
                    throw error;
                } // try
                
                
                
                switch (authenticatedResult) {
                    case AuthenticatedResult.FAILED     : {
                        // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                        doCancelDraftOrder(rawOrderId);
                        
                        
                        
                        showMessageError({
                            error: messageFailed,
                        });
                        break;
                    }
                    
                    case AuthenticatedResult.CANCELED   : {
                        // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                        doCancelDraftOrder(rawOrderId);
                        
                        
                        
                        showMessageError({
                            error: messageCanceled,
                        });
                        break;
                    }
                    case AuthenticatedResult.EXPIRED    : {
                        // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                        doCancelDraftOrder(rawOrderId);
                        
                        
                        
                        showMessageError({
                            error: messageExpired,
                        });
                        break;
                    }
                    
                    
                    
                    case AuthenticatedResult.AUTHORIZED : { // will be manually capture on server_side
                        // then forward the authentication to backend_API to receive the fund:
                        if (rawOrderId /* ignore empty string */) await doMakePayment(rawOrderId, /*paid:*/true);
                        break;
                    }
                    
                    
                    
                    case AuthenticatedResult.PENDING    :
                    case AuthenticatedResult.CAPTURED   : { // has been CAPTURED (maybe delayed), just needs DISPLAY paid page
                        // gotoFinished(); // TODO: DISPLAY paid page
                        break;
                    }
                    
                    
                    
                    default : { // an unexpected authentication result occured
                        // notify to cancel transaction, so the draftOrder (if any) will be reverted:
                        doCancelDraftOrder(rawOrderId);
                        
                        
                        
                        throw Error('Oops, an error occured!');
                    }
                } // switch
            }
            catch (fetchError: any) {
                if ((fetchError instanceof ErrorDeclined) || (fetchError?.status === 402)) {
                    const errorMessage : string = fetchError?.message ?? fetchError?.data?.error ?? '';
                    showMessageError({
                        error : (
                            fetchError.shouldRetry
                            ? ((typeof(messageDeclinedRetry) !== 'function') ? messageDeclinedRetry : messageDeclinedRetry(errorMessage))
                            : ((typeof(messageDeclined     ) !== 'function') ? messageDeclined      : messageDeclined(errorMessage))
                        ),
                    });
                }
                else if (!fetchError?.data?.limitedStockItems) showMessageFetchError({ fetchError, context: 'payment' /* context: 'order' */ });
                // TODO: re-generate PaypalPaymentSession
            } // try
        });
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
    const doPlaceOrder         = useEvent(async (options?: PlaceOrderOptions): Promise<DraftOrderDetail|true> => {
        try {
            const draftOrderDetailOrPaymentDetail = await dispatch(placeOrder({
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
            })).unwrap();
            
            
            
            if (!('orderId' in draftOrderDetailOrPaymentDetail)) {
                gotoFinished(draftOrderDetailOrPaymentDetail, /*paid:*/(draftOrderDetailOrPaymentDetail.type !== 'MANUAL')); // buggy
                return true; // paid
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
                await dispatch(placeOrder({
                    // currency options:
                    // currency, // no need to inform the currency, we just check for the available stocks
                    
                    
                    
                    // cart item(s):
                    items : cartItems,
                    
                    
                    
                    // options:
                    simulateOrder: true,
                })).unwrap();
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
            await dispatch(makePayment({
                orderId,
                
                
                
                // options: cancel the order
                cancelOrder: true,
            })).unwrap();
            console.log('canceled');
            return;
        } // if
        
        
        
        const paymentDetail = await dispatch(makePayment({
            orderId,
            
            
            
            // billing data:
            ...(isBillingAddressRequired ? {
                billingAddress : billingAsShipping ? shippingAddress : billingAddress,
            } : undefined),
            
            
            
            // options: cancelOrder
            ...options,
        })).unwrap();
        
        
        
        gotoFinished(paymentDetail, paid);
    });
    const doCancelDraftOrder   = useEvent(async (orderId: string): Promise<void> => {
        // conditions:
        if (!orderId) return; // empty string => ignore
        
        
        
        try {
            // notify to cancel transaction, so the draftOrder (if any) will be reverted:
            await doMakePayment(orderId, /*paid:*/false, { cancelOrder: true });
        }
        catch {
            // ignore any error
        } // try
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
            
            isShippingAddressRequired,
        };
        setFinishedOrderState(finishedOrderState); // backup the cart & checkout states from redux to react state
        
        
        
        // discard used paymentSession:
        dispatch(reduxSetPaymentSession(undefined));
        
        
        
        // clear the cart & checkout states in redux:
        clearProductsFromCart();
        dispatch(reduxResetCheckoutData());
    });
    
    const refetchCheckout      = useEvent((): void => {
        refetchCart();
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
        totalShippingCostStatus,
        
        
        
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
        
        paymentSession,
        
        paymentType,
        paymentBrand,
        paymentIdentifier,
        
        
        
        // relation data:
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
        
        startTransaction,             // stable ref
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
        // setShippingProvider        // stable ref
        
        totalShippingCost,
        totalShippingCostStatus,
        
        
        
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
        
        paymentSession,
        
        paymentType,
        paymentBrand,
        paymentIdentifier,
        
        
        
        // relation data:
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
        
        // startTransaction,          // stable ref
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

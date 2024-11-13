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

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// redux:
import {
    type EntityState
}                           from '@reduxjs/toolkit'
import {
    type MutationDefinition,
    type MutationActionCreatorResult,
}                           from '@reduxjs/toolkit/query'

// reusable-ui core:
import {
    // a responsive management system:
    breakpoints,
    
    
    
    // a set of client-side functions.:
    isClientSide,
    
    
    
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    EventHandler,
    useMountedFlag,
    type TimerPromise,
    useSetTimeout,
    
    
    
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
    // types:
    type ShippingAddressDetail,
    type BillingAddressDetail,
    
    type PaymentDetail,
    
    type CustomerOrGuestPreview,
    type CustomerPreferenceDetail,
    
    type CheckoutStep,
    type TotalShippingCostStatus,
    type PaymentMethod,
    type PlaceOrderRequestOptions,
    type PlaceOrderDetail,
    type MakePaymentOptions,
    type FinishedOrderState,
    type BusyState,
    type CheckoutSession,
    
    type CartDetail,
    type CartUpdateRequest,
    
    
    
    // utilities:
    calculateCheckoutProgress,
}                           from '@/models'
// stores:
import {
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
    setShippingProviderId as reduxSetShippingProviderId,
    
    // billing data:
    setBillingValidation  as reduxSetBillingValidation,
    setBillingAsShipping  as reduxSetBillingAsShipping,
    setBillingAddress     as reduxSetBillingAddress,
    
    // payment data:
    setPaymentValidation  as reduxSetPaymentValidation,
    setPaymentMethod      as reduxSetPaymentMethod,
    setPaymentSession     as reduxSetPaymentSession,
    
    // backups:
    resetCheckout         as reduxResetCheckout,
    restoreCheckout       as reduxRestoreCheckout,
    
    
    
    // selectors:
    selectCheckoutSession,
    selectIsInitialCheckoutState,
}                           from '@/store/features/checkout/checkoutSlice'
import {
    // hooks:
    useGetMatchingShippingList,
    useRefreshMatchingShippingList,
    useGeneratePaymentSession,
    useShowPrevOrder,
    
    
    
    // apis:
    backupCart,
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
    // hooks:
    useCartState,
    useRestoredCartEvent,
    
    
    
    // react components:
    CartStateProvider,
}                           from '@/components/Cart'

// errors:
import {
    ErrorDeclined,
}                           from '@/errors'

// internals:
import {
    // types:
    type MatchingShipping,
}                           from '@/libs/shippings/shippings'
import {
    calculateShippingCost,
}                           from '@/libs/shippings/shippings'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



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
    doPlaceOrder          : () => Promise<PlaceOrderDetail|true>
    doAuthenticate        : (placeOrderDetail: PlaceOrderDetail) => Promise<AuthenticatedResult>
    
    
    
    // messages:
    messageFailed         : React.ReactNode
    messageCanceled      ?: React.ReactNode
    messageExpired       ?: React.ReactNode
    messageDeclined       : React.ReactNode | ((errorMessage: string) => React.ReactNode)
    messageDeclinedRetry ?: React.ReactNode | ((errorMessage: string) => React.ReactNode)
}

// contexts:
export interface CheckoutStateBase
    extends
        Omit<CheckoutSession,
            // version control:
            |'version'
        >
{
    // states:
    checkoutProgress             : number
    
    isBusy                       : BusyState,
    
    isCheckoutEmpty              : boolean
    isCheckoutLoading            : boolean
    isCheckoutError              : boolean
    isCheckoutReady              : boolean
    isCheckoutFinished           : boolean
    
    isDesktop                    : boolean
    
    
    
    // extra data:
    setMarketingOpt              : EventHandler<boolean|null>
    
    
    
    // customer data:
    setCustomerName              : EventHandler<string>
    setCustomerEmail             : EventHandler<string>
    
    
    
    // shipping data:
    isShippingAddressRequired    : boolean
    
    setShippingAddress           : (address: ShippingAddressDetail|null) => void
    
    setShippingProviderId        : (shippingProviderId: string|null) => void
    
    totalShippingCost            : number|null|undefined // undefined: not selected yet; null: no shipping required (non physical product)
    totalShippingCostStatus      : TotalShippingCostStatus
    
    
    
    // billing data:
    isBillingAddressRequired     : boolean
    
    setBillingAsShipping         : (billingAsShipping: boolean) => void
    
    setBillingAddress            : (address: BillingAddressDetail|null) => void
    
    
    
    // payment data:
    appropriatePaymentProcessors : (typeof checkoutConfigClient.payment.preferredProcessors)
    
    setPaymentMethod             : (paymentMethod: PaymentMethod|null) => void
    
    paymentType                  : string|undefined
    paymentBrand                 : string|null|undefined
    paymentIdentifier            : string|null|undefined
    
    
    
    // relation data:
    shippingList                 : EntityState<MatchingShipping> | undefined
    
    
    
    // sections:
    customerInfoSectionRef       : React.MutableRefObject<HTMLElement|null>      | undefined
    shippingAddressSectionRef    : React.MutableRefObject<HTMLElement|null>      | undefined
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
    doPlaceOrder                 : (options?: PlaceOrderRequestOptions) => Promise<PlaceOrderDetail|true>
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
            &PickAlways<CheckoutStateBase, 'isCheckoutReady'   , true   > // if   the checkout is  ready
            &PickAlways<CheckoutStateBase, 'isCheckoutFinished', boolean> // then the checkout is  maybe finished
            &PickAlways<CheckoutStateBase, 'paymentSession'    , {}     > // then the checkout is  always having_data
        )
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutReady'   , false  > // if   the checkout not ready
            &PickAlways<CheckoutStateBase, 'isCheckoutFinished', false  > // then the checkout is  never finished
            &PickAlways<CheckoutStateBase, 'paymentSession'    , {}|null> // then the checkout is  maybe  having_data
        )
    )

const noopSetter   : EventHandler<unknown> = () => {};
const noopCallback = () => {};
const CheckoutStateContext = createContext<CheckoutState>({
    // states:
    checkoutStep                 : 'INFO',
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
    setMarketingOpt              : noopSetter,
    
    
    
    // customer data:
    customerValidation           : false,
    customer                     : undefined,
    setCustomerName              : noopSetter,
    setCustomerEmail             : noopSetter,
    
    
    
    // shipping data:
    isShippingAddressRequired    : false,
    shippingValidation           : false,
    
    shippingAddress              : null,
    setShippingAddress           : noopCallback,
    
    shippingProviderId           : null,
    setShippingProviderId        : noopCallback,
    
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
    
    paymentMethod                : null,
    setPaymentMethod             : noopCallback,
    
    paymentSession               : null,
    
    paymentType                  : undefined,
    paymentBrand                 : undefined,
    paymentIdentifier            : undefined,
    
    
    
    // relation data:
    shippingList                 : undefined,
    
    
    
    // sections:
    customerInfoSectionRef       : undefined,
    shippingAddressSectionRef    : undefined,
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
    
    
    
    // utilities:
    const setTimeoutAsync = useSetTimeout();
    
    
    
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
    
    
    
    // sessions:
    const { data: session, status: sessionStatus } = useSession();
    
    
    
    // contexts:
    const cartState = useCartState();
    const {
        // states:
        // isCartEmpty, // do NOT rely on `isCartEmpty`, instead use own `cartItems.length`, because when the order is finished, the cartItem(s) will be GONE, we need to see the LAST state stored in `finishedOrderState`
        isCartLoading,
        isCartError,
        
        
        
        // accessibilities:
        currency : globalCartCurrency,
        
        
        
        // cart data:
        items : globalCartItems,
        totalProductWeight,
        totalProductWeightStepped,
        
        
        
        // relation data:
        productPreviews: globalProductPreviews,
        
        
        
        // actions:
        trimProductsFromCart,
        
        refetchCart,
        
        resetCart,
    } = cartState;
    const currency              = finishedOrderState ? finishedOrderState.cartState.currency : globalCartCurrency;
    const cartItems             = finishedOrderState ? finishedOrderState.cartState.items    : globalCartItems;
    const productPreviews       = finishedOrderState ? finishedOrderState.productPreviews    : globalProductPreviews;
    
    
    
    // stores:
    const isInitialCheckoutState = useAppSelector(selectIsInitialCheckoutState);
    const globalCheckoutSession  = useAppSelector(selectCheckoutSession);
    const localCheckoutSession   = finishedOrderState ? finishedOrderState.checkoutSession : globalCheckoutSession;
    const {
        // @ts-ignore
        _persist, // remove
        
        
        
        // states:
        checkoutStep,
        
        
        
        // extra data:
        marketingOpt,
        
        
        
        // customer data:
        customerValidation,
        
        customer,
        
        
        
        // shipping data:
        shippingValidation : shippingValidationRaw,
        
        shippingAddress,
        
        shippingProviderId,
        
        
        
        // billing data:
        billingValidation  : billingValidationRaw,
        billingAsShipping  : billingAsShippingRaw,
        
        billingAddress,
        
        
        
        // payment data:
        paymentValidation,
        
        paymentMethod,
    } = localCheckoutSession;
    
    const {
        paymentSession,
    } = globalCheckoutSession;
    
    const appropriatePaymentProcessors = useMemo<CheckoutState['appropriatePaymentProcessors']>((): CheckoutState['appropriatePaymentProcessors'] => {
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
    const setMarketingOpt    = useEvent<CheckoutState['setMarketingOpt']>((newValue) => {
        dispatch(reduxSetMarketingOpt(newValue));
    });
    
    
    
    // customer data:
    const setCustomerName    = useEvent<CheckoutState['setCustomerName']>((newValue) => {
        dispatch(reduxSetCustomerName(newValue));
    });
    const setCustomerEmail   = useEvent<CheckoutState['setCustomerEmail']>((newValue) => {
        dispatch(reduxSetCustomerEmail(newValue));
    });
    
    
    
    // shipping data:
    const setShippingAddress = useEvent<CheckoutState['setShippingAddress']>((newValue) => {
        dispatch(reduxSetShippingAddress(newValue));
    });
    
    
    
    // billing data:
    const setBillingAddress  = useEvent<CheckoutState['setBillingAddress']>((newValue) => {
        dispatch(reduxSetBillingAddress(newValue));
    });
    
    
    
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
        
        const selectedShipping = shippingProviderId ? shippingList.entities?.[shippingProviderId] : undefined;
        if (!selectedShipping) {                // no valid selected shippingProvider => nothing to calculate
            setRealTotalShippingCost(undefined);
            return;
        } // if
        
        
        
        // calculate the shipping cost based on the totalProductWeight and the selected shipping provider:
        const shippingCost = calculateShippingCost(selectedShipping, totalProductWeight);
        setRealTotalShippingCost(shippingCost);
    }, [shippingList, shippingProviderId, totalProductWeight]);
    
    // refresh shippingList when totalWeight changed:
    const prevTotalProductWeightSteppedRef  = useRef<number|null|undefined>(totalProductWeightStepped);
    const prevRefreshShippingByAddressIdRef = useRef<number>(0);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (prevTotalProductWeightSteppedRef.current === totalProductWeightStepped) {
            return; // no totalWeight changes => ignore
        }
        else {
            prevTotalProductWeightSteppedRef.current = totalProductWeightStepped; // track the changes
        } // if
        
        if ((checkoutStep === 'INFO') || (checkoutStep === 'PENDING') || (checkoutStep === 'PAID')) return;
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
        
        const selectedShipping = shippingProviderId ? shippingList.entities?.[shippingProviderId] : undefined;
        if (!selectedShipping) {                       // no valid selected shippingProvider => nothing to calculate
            setRealTotalShippingCost(undefined);
            return;
        } // if
        if (Array.isArray(selectedShipping.rates) && (checkoutStep !== 'SHIPPING')) return; // a dynamic shippingRates is selected => no need to refresh the staticRates, except when on shipping step: always refresh the shippingList rates
        
        
        
        // actions:
        let refreshShippingByAddressPromise : ReturnType<typeof refreshShippingByAddress>|undefined|null = undefined;
        const performRefresh = async (): Promise<void> => {
            const prevRefreshShippingByAddressId = (++prevRefreshShippingByAddressIdRef.current);
            try {
                setTotalShippingCostStatus('loading');
                
                
                
                // wait for 1 second before performing `refreshShippingByAddress()`:
                if (!(await setTimeoutAsync(1000))) return; // the component was unloaded before the timer runs => do nothing
                if (refreshShippingByAddressPromise === null) return; // marked as aborted => do nothing
                
                
                
                refreshShippingByAddressPromise = refreshShippingByAddress({
                    ...shippingAddress,
                    totalProductWeight : totalProductWeightStepped ?? 0, // the `totalProductWeightStepped` should be number, because of `isNeedsRecoverShippingList` condition => `isShippingAddressRequired` condition
                });
                await refreshShippingByAddressPromise.unwrap();
            }
            catch (error: any) {
                // conditions:
                if (!isMounted.current) return; // the component was unloaded before schedule performed => do nothing
                if (prevRefreshShippingByAddressIdRef.current === prevRefreshShippingByAddressId) {
                    setTotalShippingCostStatus('obsolete');
                } // if
                
                if (error?.name === 'AbortError') return;
                
                
                
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
                        /* if (checkoutStep !== 'INFO') */ gotoStepInformation(/* focusTo: */'shippingAddress');
                        break;
                } // switch
            } // try
        };
        performRefresh();
        
        
        
        // cleanups:
        return () => {
            refreshShippingByAddressPromise?.abort();
            refreshShippingByAddressPromise = null; // mark as aborted
        };
    }, [checkoutStep, shippingList, shippingProviderId, totalProductWeightStepped, shippingAddress]);
    
    // if the selected shipping method lost due to shippingList update => warn to the user that the selection is no longer available:
    const prevSelectedShippingProviderRef = useRef<MatchingShipping|undefined>(undefined);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        const prevSelectedShippingProvider = prevSelectedShippingProviderRef.current;
        const selectedShipping = shippingProviderId ? shippingList?.entities?.[shippingProviderId] : undefined;
        if (prevSelectedShippingProviderRef.current === selectedShipping) {
            return; // no selected shippingProvider changes => ignore
        }
        else {
            prevSelectedShippingProviderRef.current = selectedShipping; // track the changes
        } // if
        
        if (checkoutStep === 'INFO') return;       // on the first step => nothing to go back => ignore
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
            /* if (checkoutStep !== 'INFO') */ gotoStepInformation(/* focusTo: */'shippingAddress');
        }
        else { // there's SOME shippingMethod available => go back to the second step
            gotoStepShipping();
        } // if
    }, [checkoutStep, shippingList, shippingProviderId]);
    
    const totalShippingCost              = finishedOrderState ? finishedOrderState?.totalShippingCost : realTotalShippingCost;
    
    const isShippingAddressRequired      = finishedOrderState ? finishedOrderState.isShippingAddressRequired : (
        (totalProductWeight === undefined)
        ? false                         // undefined => unknown_kind_product due to incomplete loading of related data => assumes as non physical product (prevents reset shippingProvider => go back to 'INFO'|'SHIPPING' page)
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
        (checkoutStep !== 'INFO')   // not at the_first_step (cannot go back any further)
        &&
        isShippingAddressRequired   // has physical product to ship
        &&
        !shippingList               // there is NO shippingList data
    );
    const isNeedsResetShippingProvider   = (
        (checkoutStep !== 'INFO')   // not at the_first_step (cannot go back any further)
        &&
        isShippingAddressRequired   // has physical product to ship
        &&
        !isNeedsRecoverShippingList // the matching shippingList is not being recovered (can be recovered AFTER the matching shippingList is recovered first)
        &&
        !isShippingLoading          // the matching shippingList is not loading
        &&
        !isShippingError            // the matching shippingList is not error
        &&
        !shippingList?.entities?.[shippingProviderId ?? ''] // no longer having a valid matching shippingProvider
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
    
    
    
    // statuses:
    const isPaymentStep                  = (checkoutStep === 'PAYMENT');
    const isLastCheckoutStep             = (checkoutStep === 'PENDING') || (checkoutStep === 'PAID');
    const isCheckoutEmpty                = (
        // isCartEmpty     // do NOT rely on `isCartEmpty`
        !cartItems.length  // instead use own `cartItems.length`, because when the order is finished, the cartItem(s) will be GONE, we need to see the LAST state stored in `finishedOrderState`
        
        /* isOther1Empty */
        /* isOther2Empty */
        /* isOther3Empty */
    );
    const isPaymentSessionRequired       = (
        !!checkoutConfigClient.payment.processors.paypal.enabled
        &&
        !!process.env.NEXT_PUBLIC_PAYPAL_ID
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
                (isBusy !== 'checkShipping')  // IGNORE shippingLoading if the business is triggered by next_button (the busy indicator belong to the next_button's icon)
                &&
                isShippingLoading
            )
            ||
            (
                isPaymentSessionRequired      // IGNORE paymentSession loading if no paymentSession required
                &&
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
                isShippingAddressRequired // IGNORE shippingError if no shipping required
                &&
                (checkoutStep !== 'INFO') // IGNORE shippingError if on the info step (the `shippingList` data is NOT YET required)
                &&
                isShippingError
            )
            ||
            (
                isPaymentSessionRequired  // IGNORE paymentSession error if no paymentSession required
                &&
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
    
    // auto reset the checkout session when the cart is empty:
    const prevIsCheckoutEmptyRef = useRef<boolean>(isCheckoutEmpty);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (prevIsCheckoutEmptyRef.current === isCheckoutEmpty) return; // already the same => ignore
        prevIsCheckoutEmptyRef.current = isCheckoutEmpty;               // sync
        
        if (!isCheckoutEmpty) return; // only interested of empty checkout state
        
        
        
        // actions:
        dispatch(reduxResetCheckout());
    }, [isCheckoutEmpty]);
    
    // auto restore the cart session when the customer loggedIn:
    const handleCartRestored    = useEvent<EventHandler<(CartDetail & Pick<CustomerPreferenceDetail, 'marketingOpt'>)|null>>((restoredCartDetail) => {
        // conditions:
        if (!isInitialCheckoutState) return; // do not restore the state if already been modified
        const restoredCheckoutDetail = restoredCartDetail?.checkout;
        if (!restoredCheckoutDetail) return; // no data to restore => use initial state => ignore
        
        
        
        // actions:
        // restore the checkout state:
        dispatch(reduxRestoreCheckout({
            ...restoredCheckoutDetail,
            marketingOpt : restoredCartDetail.marketingOpt,
        }));
        
        // restoring the checkout state causing the `globalCheckoutSession` mutated, we need to re-sync the last checkoutStep|shippingMethod|paymentMethod to avoid __wrong_change_detection__:
        prevCheckoutStepRef.current       = restoredCheckoutDetail.checkoutStep;       // sync
        prevShippingProviderIdRef.current = restoredCheckoutDetail.shippingProviderId; // sync
        prevPaymentMethodRef.current      = restoredCheckoutDetail.paymentMethod;      // sync
    });
    useRestoredCartEvent(handleCartRestored);
    
    // auto backup the checkout session when the global checkoutStep|shippingMethod|paymentMethod changed:
    const prevCheckoutStepRef       = useRef<typeof globalCheckoutSession.checkoutStep>(globalCheckoutSession.checkoutStep);
    const prevShippingProviderIdRef = useRef<typeof globalCheckoutSession.shippingProviderId>(globalCheckoutSession.shippingProviderId);
    const prevPaymentMethodRef      = useRef<typeof globalCheckoutSession.paymentMethod>(globalCheckoutSession.paymentMethod);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (
            (prevCheckoutStepRef.current       === globalCheckoutSession.checkoutStep)
            &&
            (prevShippingProviderIdRef.current === globalCheckoutSession.shippingProviderId)
            &&
            (prevPaymentMethodRef.current      === globalCheckoutSession.paymentMethod)
        ) return;                                                                     // already the same => ignore
        prevCheckoutStepRef.current       = globalCheckoutSession.checkoutStep;       // sync
        prevShippingProviderIdRef.current = globalCheckoutSession.shippingProviderId; // sync
        prevPaymentMethodRef.current      = globalCheckoutSession.paymentMethod;      // sync
        
        
        
        // do not backoup the last checkout step, since it's not useful to restore:
        if ((globalCheckoutSession.checkoutStep === 'PENDING') || (globalCheckoutSession.checkoutStep === 'PAID')) return;
        
        
        
        // actions:
        let backupCartPromise : MutationActionCreatorResult<MutationDefinition<CartUpdateRequest, any, never, unknown, 'api'>>|undefined|null = undefined;
        (async (): Promise<void> => {
            // wait for 1 second before performing `refreshShippingByAddress()`:
            if (!(await setTimeoutAsync(1000))) return; // the component was unloaded before the timer runs => do nothing
            if (backupCartPromise === null) return; // marked as aborted => do nothing
            
            
            
            backupCartPromise = dispatch(backupCart({
                currency     : cartState.currency,
                items        : cartState.items,
                checkout     : {
                    checkoutStep       : globalCheckoutSession.checkoutStep,
                    shippingAddress    : globalCheckoutSession.shippingAddress,
                    shippingProviderId : globalCheckoutSession.shippingProviderId,
                    billingAsShipping  : globalCheckoutSession.billingAsShipping,
                    billingAddress     : globalCheckoutSession.billingAddress,
                    paymentMethod      : globalCheckoutSession.paymentMethod,
                },
                marketingOpt : marketingOpt,
            } satisfies CartUpdateRequest, {
                track: true, // must be true in order to get the response result for updating the `restoreCart()`'s cache
            }));
        })();
        
        
        
        // cleanups:
        return () => {
            backupCartPromise?.abort();
            backupCartPromise = null; // mark as aborted
        };
    }, [globalCheckoutSession, cartState]);
    
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
            setCheckoutStep('INFO');
            
            
            
            // abort to initialize shippingList:
            return;
        } // if
        
        
        
        // initialize shippingList:
        console.log('recovering shippingList...');
        getShippingByAddress({ // fire and forget
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
            setCheckoutStep('SHIPPING');
        }
        else {
            // NOT HAVING VALID selected matching shippingProvider -AND- NO   shippingList to select => go back to information page:
            setCheckoutStep('INFO');
        } // if
    }, [isNeedsResetShippingProvider, shippingList]);
    
    // if no selected shipping method => auto select the cheapest one:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (checkoutStep !== 'SHIPPING') return; // only auto select when at shipping step
        if (!shippingList)               return; // the shippingList data is not available yet => nothing to select
        const selectedShipping = shippingProviderId ? shippingList.entities?.[shippingProviderId] : undefined;
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
            setShippingProviderId(orderedConstAscending[0].id);
        } // if
    }, [checkoutStep, shippingList, shippingProviderId, totalProductWeight]);
    
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
                behavior : (
                    currentStepSectionElm
                    ? 'auto'   // when the currentStepSectionElm exist => first: immediately scroll to top most
                    : 'smooth' // or smoothly scroll to top most if the currentStepSectionElm doesn't exist
                ),
            });
            if (currentStepSectionElm) { // when the currentStepSectionElm exist => then: smoothly scroll to that section
                setTimeoutAsync(0).then((isDone) => {
                    // conditions:
                    if (!isDone) return; // the component was unloaded before the timer runs => do nothing
                    
                    
                    
                    // actions:
                    currentStepSectionElm.scrollIntoView({
                        block    : 'start',
                        behavior : 'smooth',
                    });
                });
            } // if
        } // if
        isSubsequentStep.current = true;
    }, [checkoutStep]);
    
    // auto renew paymentSession:
    const schedulingRefreshPaymentSessionRef          = useRef<TimerPromise<boolean>|null>(null);
    const scheduleRefreshPaymentSession               = useEvent(async (): Promise<boolean> => {
        // conditions:
        if (!isPaymentSessionRequired) return false; // no paymentSession required => do nothing
        if (!isMounted.current)        return false; // the component was unloaded before schedule performed => do nothing
        
        
        
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
        
        
        
        /* now the new paymentSession has been generated (if the old one is expired) */
        
        
        
        try {
            return true; // success
        }
        finally {
            // runs aside task:
            ((): void => { // re-schedule (if needed):
                // conditions:
                if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
                
                
                
                // re-schedule:
                if (schedulingRefreshPaymentSessionRef.current) { // abort prev schedule (if any)
                    schedulingRefreshPaymentSessionRef.current.abort();
                    schedulingRefreshPaymentSessionRef.current = null;
                } // if
                
                console.log(`schedule refresh paymentSession in ${nextRefreshDuration/1000} seconds`);
                const schedulingRefreshPaymentSession = setTimeoutAsync(nextRefreshDuration);
                schedulingRefreshPaymentSession.then((isDone): void => {
                    // conditions:
                    if (!isDone) return; // the component was unloaded before the timer runs => do nothing
                    
                    
                    
                    scheduleRefreshPaymentSession()
                    .then(() => {
                        console.log('schedule refresh paymentSession PERFORMED: ');
                    });
                });
                schedulingRefreshPaymentSessionRef.current = schedulingRefreshPaymentSession;
            })();
        } // try
    });
    
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!isPaymentSessionRequired) return; // no paymentSession required => ignore
        if (!isPaymentStep)            return; // no paymentSession renewal when NOT at_payment_step
        
        
        
        // setups:
        // trigger to start schedule:
        scheduleRefreshPaymentSession(); // fire & forget
        
        
        
        // cleanups:
        return () => {
            if (schedulingRefreshPaymentSessionRef.current) { // abort prev schedule (if any)
                schedulingRefreshPaymentSessionRef.current.abort();
                schedulingRefreshPaymentSessionRef.current = null;
            } // if
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
        if ((checkoutStep === 'PENDING') || (checkoutStep === 'PAID')) return; // no pooling when state is 'PENDING' or 'PAID'
        
        
        
        // actions:
        let schedulingAborted     = false;
        const scheduleVerifyStock = async (): Promise<void> => {
            // conditions:
            if (schedulingAborted) return;
            
            
            
            // actions:
            await verifyStock();
            
            
            
            // conditions:
            if (schedulingAborted) return;
            
            
            
            // re-schedule:
            setTimeoutAsync(60 * 1000) // pooling every a minute
            .then((isDone) => {
                // conditions:
                if (!isDone) return; // the component was unloaded before the timer runs => do nothing
                
                
                
                // actions:
                scheduleVerifyStock();
            });
        };
        // first-schedule & avoids double re-run in StrictMode:
        Promise.resolve().then(scheduleVerifyStock);
        
        
        
        // cleanups:
        return () => {
            schedulingAborted = true;
        };
    }, [checkoutStep]);
    
    
    
    // refs:
    const customerInfoSectionRef    = useRef<HTMLElement|null>(null);
    const shippingAddressSectionRef = useRef<HTMLElement|null>(null);
    const shippingMethodOptionRef   = useRef<HTMLElement|null>(null);
    const billingAddressSectionRef  = useRef<HTMLElement|null>(null);
    const paymentCardSectionRef     = useRef<HTMLFormElement|null>(null);
    const currentStepSectionRef     = useRef<HTMLElement|null>(null);
    
    const contactEmailInputRef      = useRef<HTMLInputElement|null>(null);
    const shippingAddressInputRef   = useRef<HTMLInputElement|null>(null);
    
    
    
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
        setCheckoutStep('INFO');
        
        
        
        if (focusTo) {
            const focusInputRef = (
                (focusTo === 'contactInfo')
                ? (
                    (sessionStatus === 'authenticated')
                    ? customerInfoSectionRef // for sign in as customer => scroll to 'Contact Information'
                    : contactEmailInputRef   // for sign in as guest    => scroll and focus to email input
                )
                : shippingAddressInputRef
            );
            
            setTimeoutAsync(200)
            .then((isDone) => {
                // conditions:
                if (!isDone) return; // the component was unloaded before the timer runs => do nothing
                
                
                
                // actions:
                const focusInputElm = focusInputRef.current;
                if (focusInputElm) {
                    focusInputElm.scrollIntoView({
                        block    : 'start',
                        behavior : 'smooth',
                    });
                    focusInputElm.focus({ preventScroll: true });
                } // if
            });
        } // if
    });
    const gotoStepShipping     = useEvent(async (): Promise<boolean> => {
        const goForward = (checkoutStep === 'INFO');
        if (goForward) { // go forward from 'INFO' => do validate shipping carriers
            // validate:
            // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
            dispatch(reduxSetCustomerValidation(true)); // enable customerAccount validation
            dispatch(reduxSetShippingValidation(true)); // enable shippingAddress validation
            
            // wait for a validation state applied:
            if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
            if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
            const fieldErrors = [
                // customer info fields:
                ...(
                    (
                        (sessionStatus === 'unauthenticated')
                        
                        // sign in as guest:
                        ? customerInfoSectionRef?.current?.querySelectorAll?.(invalidSelector)
                        
                        // sign in as customer:
                        : undefined // nothing to validate
                    )
                    ??
                    []
                ),
                
                // shipping address fields:
                ...(
                    shippingAddressSectionRef?.current?.querySelectorAll?.(invalidSelector)
                    ??
                    []
                ),
            ];
            if (fieldErrors?.length) { // there is an/some invalid field
                showMessageFieldError(fieldErrors);
                return false; // transaction aborted due to validation error
            } // if
            
            
            
            if (!isShippingAddressRequired) { // if only digital products => no shipping required
                // jump forward to payment method:
                await gotoPayment();
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
                setCheckoutStep('SHIPPING');
            } // if
        } // if
        
        
        
        if (!goForward) { // go back from 'SHIPPING'|'PAYMENT' => focus to shipping method option control
            if (!isShippingAddressRequired) { // if only digital products => no shipping required
                // jump backward to info:
                setCheckoutStep('INFO');
            }
            else {
                // go backward to shipping method:
                setCheckoutStep('SHIPPING');
                
                
                
                // focus to shipping method:
                setTimeoutAsync(200)
                .then((isDone) => {
                    // conditions:
                    if (!isDone) return; // the component was unloaded before the timer runs => do nothing
                    
                    
                    
                    // actions:
                    const focusInputElm = shippingMethodOptionRef.current;
                    if (focusInputElm) {
                        focusInputElm.scrollIntoView({
                            block    : 'start',
                            behavior : 'smooth',
                        });
                        focusInputElm.focus({ preventScroll: true });
                    } // if
                });
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
            
            // wait for a validation state applied:
            if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
            if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
            const fieldErrors = shippingAddressSectionRef?.current?.querySelectorAll?.(invalidSelector);
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
            await scheduleRefreshPaymentSession(); // fire & await
        }
        catch {
            // ignore any error => just display whole_page_error
        }
        finally {
            setIsBusy(false);
        } // try
        
        
        
        setCheckoutStep('PAYMENT');
        
        
        
        return true; // transaction completed
    });
    
    const setShippingProviderId = useEvent((shippingProviderId: string|null): void => {
        dispatch(reduxSetShippingProviderId(shippingProviderId));
    });
    const setPaymentMethod     = useEvent((paymentMethod: PaymentMethod|null): void => {
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
                const placeOrderDetail = await doPlaceOrder(); // if returns `PlaceOrderDetail` => assumes a DraftOrder has been created
                if (placeOrderDetail === true) return; // immediately paid => no need further action
                
                
                
                let rawOrderId = placeOrderDetail.orderId;
                let authenticatedResult : AuthenticatedResult;
                try {
                    authenticatedResult = await doAuthenticate(placeOrderDetail);
                    rawOrderId = placeOrderDetail.orderId; // the `placeOrderDetail.orderId` may be updated during `doAuthenticate()` call.
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
                // TODO: re-generate CheckoutPaymentSessionDetail
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
            
            // wait for a validation state applied:
            if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
            if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
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
                
                // billing address fields:
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
    const doPlaceOrder         = useEvent(async (options?: PlaceOrderRequestOptions): Promise<PlaceOrderDetail|true> => {
        try {
            const placeOrderDetailOrPaymentDetail = await dispatch(placeOrder({
                // currency options:
                currency, // informs the customer's currency, so we know the selected currency when he/she made an order
                
                
                
                // cart item(s):
                items : cartItems,
                
                
                
                ...((!options?.simulateOrder) ? {
                    // extra data:
                    marketingOpt,
                    
                    
                    
                    // customer data:
                    ...((sessionStatus === 'unauthenticated') ? {
                        customer, // provide the guest data if not authenticated (sign in as a guest)
                    } : undefined),
                } : undefined),
                
                
                
                // shipping data:
                ...((!options?.simulateOrder && isShippingAddressRequired) ? {
                    shippingAddress,
                    
                    shippingProviderId,
                } : undefined),
                
                
                
                // billing data:
                ...((!options?.simulateOrder && isBillingAddressRequired) ? {
                    billingAddress : billingAsShipping ? shippingAddress : billingAddress,
                } : undefined),
                
                
                
                // options: pay manually | paymentSource (by <PayPalButtons>)
                ...options,
            })).unwrap();
            
            
            
            if (!('orderId' in placeOrderDetailOrPaymentDetail)) {
                gotoFinished(placeOrderDetailOrPaymentDetail, /*paid:*/(placeOrderDetailOrPaymentDetail.type !== 'MANUAL')); // buggy
                return true; // paid
            }
            else {
                return placeOrderDetailOrPaymentDetail;
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
                    if (!(await setTimeoutAsync(waitFor))) return false; // the component was unloaded before the timer runs => do nothing
                    console.log('ready');
                } // if
            } // if
            
            
            
            if (!cartItems.length) return true; // if cart is empty => always success
            try {
                await dispatch(placeOrder({
                    // currency options:
                    currency,
                    
                    
                    
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
        // setCheckoutStep(paid ? 'PAID' : 'PENDING'); // not needed this code, already handled by `setFinishedOrderState` below:
        const soldProductIds = new Set<string|number>(
            cartItems
            .map(({productId}) => productId)
        );
        const finishedOrderState : FinishedOrderState = {
            cartState       : {
                items    : cartItems,
                currency : currency,
            },
            productPreviews : productPreviews,
            
            checkoutSession : {
                ...localCheckoutSession,
                customer     : session?.user ? ({ name: session.user.name, email: session.user.email } satisfies CustomerOrGuestPreview) : localCheckoutSession.customer,
                checkoutStep : (paid ? 'PAID' : 'PENDING'),
            },
            totalShippingCost,
            paymentDetail,
            
            isShippingAddressRequired,
        };
        setFinishedOrderState(finishedOrderState); // backup the cart & checkout states from redux to react state
        
        
        
        // discard used paymentSession:
        dispatch(reduxSetPaymentSession(null));
        
        
        
        // clear the cart & checkout states in redux:
        resetCart();
        dispatch(reduxResetCheckout());
    });
    
    const refetchCheckout      = useEvent((): void => {
        refetchCart();
        
        if (isPrevOrderError && !isPrevOrderLoading && prevOrderId) {
            showPrevOrder({orderId: prevOrderId});
        } // if
        
        if (isShippingError && !isShippingLoading && isShippingAddressRequired && shippingAddress) {
            getShippingByAddress({ // fire and forget
                ...shippingAddress,
                totalProductWeight : totalProductWeightStepped ?? 0, // the `totalProductWeightStepped` should be number, because of `isNeedsRecoverShippingList` condition => `isShippingAddressRequired` condition
            });
        } // if
        
        if (isPaymentSessionError && !isPaymentSessionLoading && isPaymentSessionRequired && !isPaymentSessionValid /* (no backup) */) {
            scheduleRefreshPaymentSession(); // fire & forget
        } // if
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
        setMarketingOpt,              // stable ref
        
        
        
        // customer data:
        customerValidation,
        customer,
        setCustomerName,              // stable ref
        setCustomerEmail,             // stable ref
        
        
        
        // shipping data:
        isShippingAddressRequired,
        shippingValidation,
        
        shippingAddress,
        setShippingAddress,           // stable ref
        
        shippingProviderId,
        setShippingProviderId,        // stable ref
        
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
        customerInfoSectionRef,       // stable ref
        shippingAddressSectionRef,    // stable ref
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
        // setMarketingOpt,           // stable ref
        
        
        
        // customer data:
        customerValidation,
        
        customer,
        // setCustomerName,           // stable ref
        // setCustomerEmail,          // stable ref
        
        
        
        // shipping data:
        isShippingAddressRequired,
        shippingValidation,
        
        shippingAddress,
        // setShippingAddress,        // stable ref
        
        shippingProviderId,
        // setShippingProviderId      // stable ref
        
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
        // customerInfoSectionRef,    // stable ref
        // shippingAddressSectionRef, // stable ref
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
            // mocks:
            mockCartState       = {finishedOrderState.cartState}
            mockProductPreviews = {finishedOrderState.productPreviews}
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

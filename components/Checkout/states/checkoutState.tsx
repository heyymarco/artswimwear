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
    produce,
}                           from 'immer'
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
    type ProductPreview,
    
    type ShippingAddressDetail,
    type BillingAddressDetail,
    
    type PaymentDetail,
    
    type CustomerOrGuestPreview,
    type CustomerPreferenceDetail,
    
    type CheckoutStep,
    type TotalShippingCostStatus,
    type PaymentOption,
    type PlaceOrderRequestOptions,
    type PlaceOrderDetail,
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
    setPaymentOption      as reduxSetPaymentOption,
    
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
import {
    type PrepareTransactionArg,
    type TransactionArg,
    TransactionStateProvider,
}                           from '@/components/payments/states'

// internals:
import {
    // types:
    type MatchingShipping,
}                           from '@/libs/shippings/shippings'
import {
    calculateShippingCost,
}                           from '@/libs/shippings/shippings'
import {
    getInvalidFields,
}                           from '@/libs/css-selectors'



// hooks:

// states:

//#region checkoutState

// contexts:
export interface CheckoutStateBase
    extends
        Omit<CheckoutSession,
            // version control:
            |'version'
            
            
            
            // billing data:
            |'billingValidation'
            
            
            
            // payment data:
            |'paymentValidation'
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
    setPaymentOption             : (paymentOption: PaymentOption|null) => void
    
    paymentType                  : string|undefined
    paymentBrand                 : string|null|undefined
    paymentIdentifier            : string|null|undefined
    
    
    
    // relation data:
    shippingList                 : EntityState<MatchingShipping, string> | undefined
    
    
    
    // sections:
    customerInfoSectionRef       : React.MutableRefObject<HTMLElement|null>      | undefined
    shippingAddressSectionRef    : React.MutableRefObject<HTMLElement|null>      | undefined
    shippingMethodOptionRef      : React.MutableRefObject<HTMLElement|null>      | undefined
    currentStepSectionRef        : React.MutableRefObject<HTMLElement|null>      | undefined
    
    
    
    // fields:
    contactEmailInputRef         : React.MutableRefObject<HTMLInputElement|null> | undefined
    shippingAddressInputRef      : React.MutableRefObject<HTMLInputElement|null> | undefined
    
    
    
    // actions:
    gotoStepInformation          : (focusTo?: 'contactInfo'|'shippingAddress') => void
    gotoStepShipping             : () => Promise<boolean>
    gotoPayment                  : () => Promise<boolean>
    
    refetchCheckout              : () => void
}

export type PickAlways<T, K extends keyof T, V> = {
    [P in K] : Extract<T[P], V>
}
export type CheckoutState =
    &Omit<CheckoutStateBase, 'isCheckoutEmpty'|'isCheckoutLoading'|'isCheckoutError'|'isCheckoutReady'|'isCheckoutFinished'>
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
        )
        |(
            &PickAlways<CheckoutStateBase, 'isCheckoutReady'   , false  > // if   the checkout not ready
            &PickAlways<CheckoutStateBase, 'isCheckoutFinished', false  > // then the checkout is  never finished
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
    
    billingAsShipping            : true,
    setBillingAsShipping         : noopCallback,
    
    billingAddress               : null,
    setBillingAddress            : noopCallback,
    
    
    
    // payment data:
    paymentOption                : null,
    setPaymentOption             : noopCallback,
    
    paymentType                  : undefined,
    paymentBrand                 : undefined,
    paymentIdentifier            : undefined,
    
    
    
    // relation data:
    shippingList                 : undefined,
    
    
    
    // sections:
    customerInfoSectionRef       : undefined,
    shippingAddressSectionRef    : undefined,
    shippingMethodOptionRef      : undefined,
    currentStepSectionRef        : undefined,
    
    
    
    // fields:
    contactEmailInputRef         : undefined,
    shippingAddressInputRef      : undefined,
    
    
    
    // actions:
    gotoStepInformation          : noopCallback,
    gotoStepShipping             : noopCallback as any,
    gotoPayment                  : noopCallback as any,
    
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
        paymentValidation  : paymentValidationRaw,
        
        paymentOption,
    } = localCheckoutSession;
    
    const checkoutProgress            = calculateCheckoutProgress(checkoutStep);
    
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
    
    const paymentValidation              = (
        paymentValidationRaw
        &&
        (paymentOption === 'CARD')
    );
    
    const isBillingAddressRequired       = (paymentOption === 'CARD'); // the billingAddress is REQUIRED for 'CARD'
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
    // const isPaymentStep                  = (checkoutStep === 'PAYMENT');
    const isLastCheckoutStep             = (checkoutStep === 'PENDING') || (checkoutStep === 'PAID');
    const isCheckoutEmpty                = (
        !(isPrevOrderLoading || isPrevOrderError) // assumes as NOT_EMPTY is restoring prev order
        &&
        (
            // isCartEmpty     // do NOT rely on `isCartEmpty`
            !cartItems.length  // instead use own `cartItems.length`, because when the order is finished, the cartItem(s) will be GONE, we need to see the LAST state stored in `finishedOrderState`
            
            /* isOther1Empty */
            /* isOther2Empty */
            /* isOther3Empty */
        )
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
                (isBusy !== 'CHECK_SHIPPING') // IGNORE shippingLoading if the business is triggered by next_button (the busy indicator belong to the next_button's icon)
                &&
                isShippingLoading
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
    //     isShippingLoading : isShippingAddressRequired && isShippingLoading && (isBusy !== 'CHECK_SHIPPING'),
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
        const prevOrderDataFixed = produce(prevOrderData, (draft) => {
            if (!(draft.productPreviews instanceof Map)) {
                draft.productPreviews = new Map<string, ProductPreview>(draft.productPreviews );
            } // if
        });
        setFinishedOrderState(prevOrderDataFixed); // restore the cart & checkout states from fetch to react state
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
        
        // restoring the checkout state causing the `globalCheckoutSession` mutated, we need to re-sync the last checkoutStep|shippingMethod|paymentOption to avoid __wrong_change_detection__:
        prevCheckoutStepRef.current       = restoredCheckoutDetail.checkoutStep;       // sync
        prevShippingProviderIdRef.current = restoredCheckoutDetail.shippingProviderId; // sync
        prevPaymentOptionRef.current      = restoredCheckoutDetail.paymentOption;      // sync
    });
    useRestoredCartEvent(handleCartRestored);
    
    // auto backup the checkout session when the global checkoutStep|shippingMethod|paymentOption changed:
    const prevCheckoutStepRef       = useRef<typeof globalCheckoutSession.checkoutStep>(globalCheckoutSession.checkoutStep);
    const prevShippingProviderIdRef = useRef<typeof globalCheckoutSession.shippingProviderId>(globalCheckoutSession.shippingProviderId);
    const prevPaymentOptionRef      = useRef<typeof globalCheckoutSession.paymentOption>(globalCheckoutSession.paymentOption);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (
            (prevCheckoutStepRef.current       === globalCheckoutSession.checkoutStep)
            &&
            (prevShippingProviderIdRef.current === globalCheckoutSession.shippingProviderId)
            &&
            (prevPaymentOptionRef.current      === globalCheckoutSession.paymentOption)
        ) return;                                                                     // already the same => ignore
        prevCheckoutStepRef.current       = globalCheckoutSession.checkoutStep;       // sync
        prevShippingProviderIdRef.current = globalCheckoutSession.shippingProviderId; // sync
        prevPaymentOptionRef.current      = globalCheckoutSession.paymentOption;      // sync
        
        
        
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
                    paymentOption      : globalCheckoutSession.paymentOption,
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
    const currentStepSectionRef     = useRef<HTMLElement|null>(null);
    
    const contactEmailInputRef      = useRef<HTMLInputElement|null>(null);
    const shippingAddressInputRef   = useRef<HTMLInputElement|null>(null);
    
    
    
    // dialogs:
    const {
        showMessageError,
        showMessageFieldError,
    } = useDialogMessage();
    
    
    
    // stable callbacks:
    const setIsBusy                = useEvent((isBusy: BusyState) => {
        checkoutState.isBusy = isBusy; /* instant update without waiting for (slow|delayed) re-render */
        setIsBusyInternal(isBusy);
    });
    
    const gotoStepInformation      = useEvent((focusTo?: 'contactInfo'|'shippingAddress'): void => {
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
    const gotoStepShipping         = useEvent(async (): Promise<boolean> => {
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
                        ? getInvalidFields(customerInfoSectionRef?.current)
                        
                        // sign in as customer:
                        : undefined // nothing to validate
                    )
                    ??
                    []
                ),
                
                // shipping address fields:
                ...(
                    getInvalidFields(shippingAddressSectionRef?.current)
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
                setIsBusy('CHECK_SHIPPING');
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
    const gotoPayment              = useEvent(async (): Promise<boolean> => {
        // const goForward = ... // always go_forward, never go_backward after finishing the payment
        if (!isShippingAddressRequired) { // if only digital products => validate the customer account
            // validate:
            // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
            dispatch(reduxSetCustomerValidation(true)); // enable customerAccount validation
            // dispatch(reduxSetShippingValidation(true)); // enable shippingAddress validation // NO shippingAddress validation required, because NOT have physical product(s)
            
            // wait for a validation state applied:
            if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
            if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
            const fieldErrors = getInvalidFields(shippingAddressSectionRef?.current);
            if (fieldErrors?.length) { // there is an/some invalid field
                showMessageFieldError(fieldErrors);
                return false; // transaction aborted due to validation error
            } // if
        }
        else {
            // if physical products => the customer account is *already validated* by `gotoStepShipping()`
        } // if
        
        
        
        setCheckoutStep('PAYMENT');
        
        
        
        return true; // transaction completed
    });
    
    const setShippingProviderId    = useEvent((shippingProviderId: string|null): void => {
        dispatch(reduxSetShippingProviderId(shippingProviderId));
    });
    const setPaymentOption         = useEvent((paymentOption: PaymentOption|null): void => {
        dispatch(reduxSetPaymentOption(paymentOption));
        
        // reset:
        if (paymentOption !== 'CARD') { // 'paypal' button or 'manual' button => reset payment validation (of 'CARD' fields)
            dispatch(reduxSetPaymentValidation(false));
        } // if
    });
    const setBillingAsShipping     = useEvent((billingAsShipping: boolean): void => {
        dispatch(reduxSetBillingAsShipping(billingAsShipping));
    });
    
    const handlePrepareTransaction = useEvent(async (arg: PrepareTransactionArg): Promise<boolean> => {
        // options:
        const {
            performValidate = true,
        } = arg;
        
        
        
        // conditions:
        if (checkoutState.isBusy)     return false; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        if (!performValidate)         return true; // opted not performing validation => always ready
        if (paymentOption !== 'CARD') return true; // not a card payment => nothing to prepare => always ready
        
        
        
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        dispatch(reduxSetPaymentValidation(true)); // enable paymentForm validation
        dispatch(reduxSetBillingValidation(true)); // enable billingAddress validation
        
        // wait for a validation state applied:
        if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
        if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
        
        return true; // ready
    });
    const handleTransaction        = useEvent(async (arg: TransactionArg): Promise<void> => {
        // conditions:
        if (checkoutState.isBusy) return; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        
        
        
        // options:
        const {
            paymentOption,
            transaction,
        } = arg;
        
        
        
        setIsBusy(paymentOption);
        try {
            await transaction();
        }
        finally {
            setIsBusy(false);
        } // try
    });
    const handlePlaceOrder         = useEvent(async (options?: PlaceOrderRequestOptions): Promise<PlaceOrderDetail|PaymentDetail> => {
        try {
            return await dispatch(placeOrder({
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
        }
        catch (fetchError: any) {
            await trimProductsFromCart(fetchError?.data?.limitedStockItems, {
                showConfirm         : true,
                showPaymentCanceled : (options?.paymentSource !== 'manual'),
            });
            
            
            
            throw fetchError;
        } // try
    });
    const handleCancelOrder        = useEvent(async (orderId: string): Promise<void> => {
        // conditions:
        if (!orderId) return; // empty string => ignore
        
        
        
        try {
            // notify to cancel transaction, so the draftOrder (if any) will be reverted:
            console.log('canceling order...');
            await dispatch(makePayment({
                orderId,
                
                
                
                // options: cancel the order
                cancelOrder: true,
            })).unwrap();
            console.log('canceled');
        }
        catch {
            // ignore any error
        } // try
    });
    const handleMakePayment        = useEvent(async (orderId: string): Promise<PaymentDetail> => {
        return dispatch(makePayment({
            orderId,
            
            
            
            // billing data:
            ...(isBillingAddressRequired ? {
                billingAddress : billingAsShipping ? shippingAddress : billingAddress,
            } : undefined),
        })).unwrap();
    });
    const handleFinishOrder        = useEvent((paymentDetail: PaymentDetail): void => {
        // save the finished order states:
        // setCheckoutStep(paid ? 'PAID' : 'PENDING'); // not needed this code, already handled by `setFinishedOrderState` below:
        const finishedOrderState : FinishedOrderState = {
            cartState       : {
                items    : cartItems,
                currency : currency,
            },
            productPreviews : productPreviews,
            
            checkoutSession : {
                ...localCheckoutSession,
                customer     : session?.user ? ({ name: session.user.name, email: session.user.email } satisfies CustomerOrGuestPreview) : localCheckoutSession.customer,
                checkoutStep : ((paymentDetail.type !== 'MANUAL') ? 'PAID' : 'PENDING'),
            },
            totalShippingCost,
            paymentDetail,
            
            isShippingAddressRequired,
        };
        setFinishedOrderState(finishedOrderState); // backup the cart & checkout states from redux to react state
        
        
        
        // clear the cart & checkout states in redux:
        resetCart();
        dispatch(reduxResetCheckout());
    });
    
    const verifyStockPromise       = useRef<Promise<boolean>|number|undefined>(undefined);
    const verifyStock              = useEvent(async (): Promise<boolean> => {
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
    
    const refetchCheckout          = useEvent((): void => {
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
        
        billingAsShipping,
        setBillingAsShipping,         // stable ref
        
        billingAddress,
        setBillingAddress,            // stable ref
        
        
        
        // payment data:
        paymentOption,
        setPaymentOption,             // stable ref
        
        paymentType,
        paymentBrand,
        paymentIdentifier,
        
        
        
        // relation data:
        shippingList,
        
        
        
        // sections:
        customerInfoSectionRef,       // stable ref
        shippingAddressSectionRef,    // stable ref
        shippingMethodOptionRef,      // stable ref
        currentStepSectionRef,        // stable ref
        
        
        
        // fields:
        contactEmailInputRef,         // stable ref
        shippingAddressInputRef,      // stable ref
        
        
        
        // actions:
        gotoStepInformation,          // stable ref
        gotoStepShipping,             // stable ref
        gotoPayment,                  // stable ref
        
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
        
        billingAsShipping,
        // setBillingAsShipping,      // stable ref
        
        billingAddress,
        // setBillingAddress,         // stable ref
        
        
        
        // payment data:
        paymentOption,
        // setPaymentOption,          // stable ref
        
        paymentType,
        paymentBrand,
        paymentIdentifier,
        
        
        
        // relation data:
        shippingList,
        
        
        
        // sections:
        // customerInfoSectionRef,    // stable ref
        // shippingAddressSectionRef, // stable ref
        // shippingMethodOptionRef,   // stable ref
        // currentStepSectionRef,     // stable ref
        
        
        
        // fields:
        // contactEmailInputRef,      // stable ref
        // shippingAddressInputRef,   // stable ref
        
        
        
        // actions:
        // gotoStepInformation,       // stable ref
        // gotoStepShipping,          // stable ref
        // gotoPayment,               // stable ref
        
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
                <TransactionStateProvider
                    // payment data:
                    paymentValidation={paymentValidation}
                    
                    
                    
                    // billing data:
                    billingValidation={billingValidation}
                    billingAddress={billingAsShipping ? shippingAddress : billingAddress}
                    
                    
                    
                    // states:
                    isTransactionReady={(totalShippingCostStatus === 'ready')}
                    
                    
                    
                    // actions:
                    onPrepareTransaction={handlePrepareTransaction}
                    onTransaction={handleTransaction}
                    onPlaceOrder={handlePlaceOrder}
                    onCancelOrder={handleCancelOrder}
                    onMakePayment={handleMakePayment}
                    onFinishOrder={handleFinishOrder}
                >
                    {conditionalChildren}
                </TransactionStateProvider>
            </AccessibilityProvider>
        </CheckoutStateContext.Provider>
    );
};
export {
    CheckoutStateProvider,
    CheckoutStateProvider as default,
}
//#endregion checkoutState

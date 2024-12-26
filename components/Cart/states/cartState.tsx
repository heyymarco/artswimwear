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
    type QueryDefinition,
    type MutationDefinition,
    type QueryActionCreatorResult,
    type MutationActionCreatorResult,
}                           from '@reduxjs/toolkit/query'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    type EventHandler,
    useMountedFlag,
    useSetTimeout,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    ViewOutOfStock,
}                           from '../components/carts/ViewOutOfStock'

// utilities:
import {
    trimNumber,
}                           from '@/libs/formatters'

// models:
import {
    type ProductPreview,
    type ProductPricePart,
    type LimitedStockItem,
    
    type CustomerPreferenceDetail,
    
    type CartDetail,
    type CartSession,
    type CartUpdateRequest,
}                           from '@/models'

// stores:
import {
    // version control:
    resetIfInvalid        as reduxResetIfInvalid,
    
    
    
    // auth:
    setHasLoggedIn        as reduxSetHasLoggedIn,
    
    
    
    // states:
    showCart              as reduxShowCart,
    hideCart              as reduxHideCart,
    
    
    
    // accessibilities:
    setCurrency           as reduxSetCurrency,
    
    
    
    // cart data:
    addProductToCart      as reduxAddProductToCart,
    deleteProductFromCart as reduxDeleteProductFromCart,
    changeProductFromCart as reduxChangeProductFromCart,
    clearProductsFromCart as reduxClearProductsFromCart,
    trimProductsFromCart  as reduxTrimProductsFromCart,
    
    
    
    // backups:
    resetCart             as reduxResetCart,
    restoreCart           as reduxRestoreCart,
    
    
    
    // selectors:
    selectCartSession,
}                           from '@/store/features/cart/cartSlice'
import {
    // apis:
    useGetProductPreview,
    
    restoreCart,
    backupCart,
}                           from '@/store/features/api/apiSlice'
import {
    // hooks:
    useAppDispatch,
    useAppSelector,
}                           from '@/store/hooks'



// hooks:

// states:

//#region checkoutState

// contexts:
export interface CartStateBase
    extends
        Omit<CartSession,
            // version control:
            |'version'
            
            // auth:
            |'hasLoggedIn'
        >
{
    // states:
    isCartEmpty               : boolean
    isCartLoading             : boolean
    isCartError               : boolean
    isCartReady               : boolean
    
    
    
    // accessibilities:
    setCurrency               : (currency: string|undefined) => void
    
    
    
    // cart data:
    totalProductQuantity      : number
    totalProductWeight        : number|null        | undefined
    totalProductWeightStepped : number|null        | undefined
    productPriceParts         : ProductPricePart[] | undefined
    hasPhysicalProduct        : boolean            | undefined
    
    
    
    // relation data:
    productPreviews           : Map<string, ProductPreview> | null | undefined
    
    
    
    // actions:
    addProductToCart          : (productId: string, variantIds: string[], quantity?: number) => void
    deleteProductFromCart     : (productId: string, variantIds: string[], options?: { showConfirm?: boolean }) => Promise<void>
    changeProductFromCart     : (productId: string, variantIds: string[], quantity: number, options?: { showConfirm?: boolean }) => Promise<void>
    clearProductsFromCart     : () => void
    trimProductsFromCart      : (limitedStockItems: LimitedStockItem[], options?: { showConfirm?: boolean, showPaymentCanceled?: boolean }) => Promise<void>
    
    showCart                  : () => void
    hideCart                  : () => void
    
    refetchCart               : () => void
    
    resetCart                 : () => void
    
    
    
    // events:
    lastRestoredCartDetailRef : React.MutableRefObject<(CartDetail & Pick<CustomerPreferenceDetail, 'marketingOpt'>)|null|undefined>
    restoredCartEventHandlers : Set<EventHandler<(CartDetail & Pick<CustomerPreferenceDetail, 'marketingOpt'>)|null>>
}

export type PickAlways<T, K extends keyof T, V> = {
    [P in K] : Extract<T[P], V>
}
export type CartState =
    &Omit<CartStateBase, 'isCartEmpty'|'isCartLoading'|'isCartError'|'isCartReady' | 'productPreviews'>
    &(
        |(
            &PickAlways<CartStateBase, 'isCartEmpty'                              , true   > // if   the cart is  empty
            &PickAlways<CartStateBase, 'isCartLoading'|'isCartError'|'isCartReady', false  > // then the cart is  never loading|error|ready
        )
        |(
            &PickAlways<CartStateBase, 'isCartEmpty'                              , false  > // if   the cart not empty
            &PickAlways<CartStateBase, 'isCartLoading'|'isCartError'|'isCartReady', boolean> // then the cart is  maybe loading|error|ready
        )
    )
    &(
        |(
            &PickAlways<CartStateBase, 'isCartLoading'            , true   > // if   the cart is  loading
            &PickAlways<CartStateBase, 'isCartError'|'isCartReady', false  > // then the cart is  never error|ready
        )
        |(
            &PickAlways<CartStateBase, 'isCartLoading'            , false  > // if   the cart not loading
            &PickAlways<CartStateBase, 'isCartError'|'isCartReady', boolean> // then the cart is  maybe error|ready
        )
    )
    &(
        |(
            &PickAlways<CartStateBase, 'isCartError', true   > // if   the cart is  error
            &PickAlways<CartStateBase, 'isCartReady', false  > // then the cart is  never ready
        )
        |(
            &PickAlways<CartStateBase, 'isCartError', false  > // if   the cart not error
            &PickAlways<CartStateBase, 'isCartReady', boolean> // then the cart is  maybe ready
        )
    )
    &(
        |(
            &PickAlways<CartStateBase, 'isCartReady', true                 > // if   the cart is  ready
            &PickAlways<CartStateBase, 'productPreviews', {}               > // then the cart is  always having_data
        )
        |(
            &PickAlways<CartStateBase, 'isCartReady', false                > // if   the cart not ready
            &PickAlways<CartStateBase, 'productPreviews', {}|null|undefined> // then the cart is  maybe  having_data
        )
    )

const noopCallback      = (): void => {};
const noopCallbackAsync = async (): Promise<void> => {};
const CartStateContext = createContext<CartState>({
    // states:
    isCartShown               : false,
    
    isCartEmpty               : true,
    isCartLoading             : false,
    isCartError               : false,
    isCartReady               : false,
    
    
    
    // accessibilities:
    currency                  : '',
    setCurrency               : noopCallback,
    
    
    
    // cart data:
    items                     : [],
    totalProductQuantity      : 0,
    totalProductWeight        : undefined,
    totalProductWeightStepped : undefined,
    productPriceParts         : undefined,
    hasPhysicalProduct        : undefined,
    
    
    
    // relation data:
    productPreviews           : undefined,
    
    
    
    // actions:
    addProductToCart          : noopCallback,
    deleteProductFromCart     : noopCallbackAsync,
    changeProductFromCart     : noopCallbackAsync,
    clearProductsFromCart     : noopCallback,
    trimProductsFromCart      : noopCallbackAsync,
    
    showCart                  : noopCallback,
    hideCart                  : noopCallback,
    
    refetchCart               : noopCallback,
    
    resetCart                 : noopCallback,
    
    
    
    // events:
    lastRestoredCartDetailRef : undefined as any,
    restoredCartEventHandlers : undefined as any
});
CartStateContext.displayName  = 'CartState';

export const useCartState = (): CartState => {
    return useContext(CartStateContext);
};
export const useRestoredCartEvent = (eventHandler: EventHandler<(CartDetail & Pick<CustomerPreferenceDetail, 'marketingOpt'>)|null>): void => {
    // contexts:
    const {
        // events:
        lastRestoredCartDetailRef,
        restoredCartEventHandlers,
    } = useCartState();
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        // setups:
        restoredCartEventHandlers.add(eventHandler);
        const lastRestoredCartDetail = lastRestoredCartDetailRef.current;
        if (lastRestoredCartDetail !== undefined) {
            eventHandler(lastRestoredCartDetail);
        } // if
        
        
        
        // cleanups:
        return () => {
            restoredCartEventHandlers.delete(eventHandler);
        };
    }, []);
};



// react components:
export interface CartStateProps {
    // mocks:
    mockCartState       ?: Pick<CartState, 'items'|'currency'>
    mockProductPreviews ?: CartState['productPreviews']
}
const CartStateProvider = (props: React.PropsWithChildren<CartStateProps>) => {
    // rest props:
    const {
        // mocks:
        mockCartState,
        mockProductPreviews,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // utilities:
    const setTimeoutAsync = useSetTimeout();
    
    
    
    // states:
    const lastRestoredCartDetailRef   = useRef<(CartDetail & Pick<CustomerPreferenceDetail, 'marketingOpt'>)|null|undefined>(undefined);
    const [restoredCartEventHandlers] = useState<Set<EventHandler<(CartDetail & Pick<CustomerPreferenceDetail, 'marketingOpt'>)|null>>>(() => new Set<EventHandler<(CartDetail & Pick<CustomerPreferenceDetail, 'marketingOpt'>)|null>>());
    
    
    
    // sessions:
    const { status: sessionStatus } = useSession();
    
    
    
    // stores:
    const globalCartSession = useAppSelector(selectCartSession);
    const localCartSession  = (
        mockCartState
        ? (({ ...mockCartState, isCartShown: false } satisfies CartSession) as CartSession)
        : globalCartSession
    );
    const {
        // @ts-ignore
        _persist, // remove
        
        
        
        // auth:
        hasLoggedIn = false,
        
        
        
        // states:
        isCartShown,
        
        
        
        // accessibilities:
        currency,
        
        
        
        // cart data:
        items,
    } = localCartSession;
    
    const dispatch          = useAppDispatch();
    
    
    
    // states:
    const [productPreviewGeneration, setProductPreviewGeneration] = useState<number>(0);
    const [productPreviewMap       , setProductPreviewMap       ] = useState<Map<string, ProductPreview|ProductWatchdogFail>>(() => new Map<string, ProductPreview|ProductWatchdogFail>());
    const [realProductPreviews     , setRealProductPreviews     ] = useState<Map<string, ProductPreview> /* = ready */ | null /* = error */ | undefined /* = loading|uninitialized */>(undefined);
    useIsomorphicLayoutEffect(() => {
        if (!items.length) {
            setRealProductPreviews(new Map<string, ProductPreview>()); // ready with empty productList
            setProductPreviewMap(new Map<string, ProductPreview|ProductWatchdogFail>()); // empty map of productList
            return;
        } // if
        
        
        
        setProductPreviewMap((currentProductPreviewMap) => {
            const productIds = items.map(({productId}) => productId);
            const newProductPreviewMap = new Map<string, ProductPreview|ProductWatchdogFail>( // preserve the current recognized productPreview(s)
                Array.from(currentProductPreviewMap.entries())
                .filter(([productId]) => productIds.includes(productId)) // filter the current recognized productPreview(s) by the incoming productIds
            );
            
            
            
            let modified = (newProductPreviewMap.size !== currentProductPreviewMap.size); // the newProductPreviewMap is different compared to the currentProductPreviewMap
            for (const productId of productIds) {
                if (!newProductPreviewMap.has(productId)) {
                    newProductPreviewMap.set(productId, ProductWatchdogFail.Loading); // new incoming productId => mark as loading, we want the `handleProductWatchdogUpdate` to re-mark the incoming productId with `ProductPreview|ProductWatchdogFail`
                    modified = true; // the newProductPreviewMap is marked as different compared to the currentProductPreviewMap
                } // if
            } // for
            if (modified) updateRealProductPreviews(newProductPreviewMap); // the newProductPreviewMap is marked as different compared to the currentProductPreviewMap => update the realProductPreviews
            
            
            
            return (
                modified
                ? newProductPreviewMap     // if newProductPreviewMap is different compared to the currentProductPreviewMap => return the newProductPreviewMap
                : currentProductPreviewMap // if newProductPreviewMap is the same  compared to the currentProductPreviewMap => return the currentProductPreviewMap to avoid re-render
            );
        });
    }, [items]);
    const handleProductWatchdogUpdate = useEvent<EventHandler<ProductWatchdogEvent>>(({productId, data}) => {
        if (productPreviewMap.has(productId)) productPreviewMap.set(productId, data);
        
        
        
        // update realProductPreviews:
        const validProductPreviews = updateRealProductPreviews(productPreviewMap);
        if (!validProductPreviews) return; // has a/some productPreviews with /* = error */ or /* = loading|uninitialized */ => nothing to do further
        
        
        
        // remove invalid products from cart:
        const invalidProducts = items.filter(({productId, variantIds}) => {
            if (!validProductPreviews.has(productId)) return true; // invalid
            
            const validVariantGroups = validProductPreviews.get(productId)?.variantGroups ?? [];
            const validVariantIds    = validVariantGroups.flat().map(({id}) => id)   ?? [];
            if (variantIds.length !== validVariantGroups.length) return true; // invalid
            if (!variantIds.every((variantId) => validVariantIds.includes(variantId))) return true; // invalid
            
            return false; // valid
        });
        if (invalidProducts.length) {
            trimProductsFromCart(
                invalidProducts
                .map(({productId, variantIds}) => ({
                    productId  : productId,
                    variantIds : variantIds,
                    stock      : 0,
                }))
            );
        } // if
    });
    const updateRealProductPreviews   = useEvent((currentProductPreviewMap: Map<string, ProductPreview|ProductWatchdogFail>): Map<string, ProductPreview>|false => {
        const productPreviewArr    = Array.from(currentProductPreviewMap.entries());
        const validProductPreviews = new Map<string, ProductPreview>();
        for (const [productId, data] of productPreviewArr) {
            switch (data) {
                case ProductWatchdogFail.Error       : setRealProductPreviews(null)      ; return false; // has a/some productPreviews with /* = error */
                case ProductWatchdogFail.Loading     : setRealProductPreviews(undefined) ; return false; // has a/some productPreviews with /* = loading|uninitialized */
                case ProductWatchdogFail.Unavailable : continue;                                         // ignore a/some deleted productPreviews
                default                              : validProductPreviews.set(productId, data);
            } // switch
        } // for
        setRealProductPreviews(validProductPreviews); // all productPreviews are loaded (except the deleted ones)
        
        
        
        return validProductPreviews;
    });
    const realIsProductLoading        = (realProductPreviews === /* = loading|uninitialized */ undefined);
    const realIsProductError          = (realProductPreviews === /* = error */ null);
    const productPreviews             = mockProductPreviews        ??        realProductPreviews;
    const isProductLoading            = mockProductPreviews ?    false     : realIsProductLoading;
    const isProductError              = mockProductPreviews ?    false     : realIsProductError;
    
    
    
    // statuses:
    const isCartEmpty   = (
        !items.length
        /* isOther1Empty */
        /* isOther2Empty */
        /* isOther3Empty */
    );
    const isCartLoading = (
        !isCartEmpty // has cartItem(s) to display, if no cartItem(s) => nothing to load
        &&
        (
            // have any loading(s):
            
            isProductLoading
            /* isOther1Loading */
            /* isOther2Loading */
            /* isOther3Loading */
        )
    );
    const isCartError   = (
        !isCartLoading // while still LOADING => consider as NOT error
        &&
        (
            // have any error(s):
            
            isProductError
            /* isOther1Error */
            /* isOther2Error */
            /* isOther3Error */
        )
    );
    const isCartReady   =  (
        !isCartLoading // not still LOADING
        &&
        !isCartError   // not having ERROR
        &&
        !isCartEmpty   // has cartItem(s) to display
    );
    
    
    
    // cart data:
    const totalProductQuantity = useMemo<number>(() => {
        let totalProductQuantity : number = 0;
        for (const {quantity} of items) {
            totalProductQuantity += quantity;
        } // for
        return totalProductQuantity;
    }, [items]);
    
    const {productPriceParts, totalProductWeight} = useMemo<{productPriceParts: ProductPricePart[]|undefined, totalProductWeight: number|null|undefined}>(() => {
        const productPriceParts  : ProductPricePart[] = [];
        let   totalProductWeight : number|null        = null;
        for (const {productId, variantIds, quantity} of items) {
            const product = productPreviews?.get(productId);
            if (!product) {
                return {
                    productPriceParts  : undefined, // difficulty getting product data => the subPrice(s)  cannot be populated  => undefined
                    totalProductWeight : undefined, // difficulty getting product data => the total weight cannot be calculated => undefined
                };
            };
            
            
            
            const selectedVariants = (
                product.variantGroups
                .map((variants) =>
                    variants.find(({id: variantId}) =>
                        variantIds.includes(variantId)
                    )
                )
            );
            if (!selectedVariants.every((selectedVariant): selectedVariant is Exclude<typeof selectedVariant, undefined> => (selectedVariants !== undefined))) {
                // one/some required variants are not selected => invalid product
                return {
                    productPriceParts  : undefined, // difficulty getting product data => the subPrice(s)  cannot be populated  => undefined
                    totalProductWeight : undefined, // difficulty getting product data => the total weight cannot be calculated => undefined
                };
            } // if
            
            
            
            const unitPriceParts   = (
                [
                    // base price:
                    product.price,
                    
                    // additional prices, based on selected variants:
                    ...selectedVariants.map(({price}) => price),
                ]
                .filter((pricePart): pricePart is Exclude<typeof pricePart, null> => (pricePart !== null))
            );
            productPriceParts.push({
                priceParts : unitPriceParts,
                quantity   : quantity,
            });
            
            
            
            const unitWeight       = (
                [
                    // base shippingWeight:
                    product.shippingWeight,
                    
                    // additional shippingWeight, based on selected variants:
                    ...selectedVariants.map(({shippingWeight}) => shippingWeight),
                ]
                .reduce<number|null>((accum, value): number|null => {
                    if (value === null) return accum;
                    if (accum === null) return value;
                    return (accum + value);
                }, null)
            );
            if (unitWeight !== null) { // not a physical product => ignore
                if (totalProductWeight === null) totalProductWeight = 0; // has a/some physical products => reset the counter from zero if null
                totalProductWeight += (unitWeight * quantity);           // may produces ugly_fractional_decimal
                totalProductWeight = trimNumber(totalProductWeight);     // decimalize accumulated numbers to avoid producing ugly_fractional_decimal
            } // if
        } // for
        return {
            productPriceParts,
            totalProductWeight,
        };
    }, [items, productPreviews]);
    
    const totalProductWeightStepped = useMemo<number|null|undefined>(() => {
        if ((totalProductWeight === undefined) || (totalProductWeight === null)) return totalProductWeight;
        return (
            Math.round(totalProductWeight / 0.25)
            * 0.25
        );
    }, [totalProductWeight]);
    
    const hasPhysicalProduct : boolean|undefined = (
        (totalProductWeight === undefined)
        ? undefined                        // unknown : because incomplete loading of related data
        : (totalProductWeight !== null)    // known   : null => no physical product(s), number => has physical product(s)
    );
    
    
    
    // dialogs:
    const {
        showMessageError,
    } = useDialogMessage();
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    // auto reset reduct state if was invalid:
    useIsomorphicLayoutEffect(() => {
        dispatch(reduxResetIfInvalid());
    }, []);
    
    // auto restore the cart session when the customer loggedIn:
    // auto reset   the cart session when the customer loggedOut:
    const prevSessionStatusRef      = useRef<typeof sessionStatus>(sessionStatus);
    const prevRestoreCartPromiseRef = useRef<QueryActionCreatorResult<QueryDefinition<void, any, never, CartDetail|null, 'api'>>|undefined>(undefined);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        
        // workaround for double re-render:
        if (prevSessionStatusRef.current === sessionStatus) return; // already the same => ignore
        prevSessionStatusRef.current = sessionStatus;               // sync
        
        if (sessionStatus === 'loading') return;   // only interested on FULLY loggedIn|loggedOut, ignore the loading (transition) state
        
        // workaround for detecting loggedIn status change (suffers from page refresh/redirect caused by next-auth):
        const isLoggedIn = (sessionStatus === 'authenticated');
        if (hasLoggedIn === isLoggedIn)  return;   // already the same => ignore
        dispatch(reduxSetHasLoggedIn(isLoggedIn)); // sync
        
        
        
        // manual cleanups:
        // workaround for DOUBLE re-render => DOUBLE cleanups
        prevRestoreCartPromiseRef.current?.abort();
        prevRestoreCartPromiseRef.current = undefined;
        
        
        
        // actions:
        if (isLoggedIn) {
            // changes from `loggedIn` to `loggedOut`:
            const performRestore = async (): Promise<void> => {
                const restoreCartPromise = dispatch(restoreCart(undefined, {
                    forceRefetch : true, // do not take from cached result in order to get the latest state
                    subscribe    : true, // must be true in order to get the response result
                }));
                prevRestoreCartPromiseRef.current = restoreCartPromise;
                
                
                
                try {
                    const restoredCartDetail = await restoreCartPromise.unwrap();
                    lastRestoredCartDetailRef.current = restoredCartDetail;
                    
                    
                    
                    // conditions:
                    if (!isMounted.current) return; // the component was unloaded before schedule performed => do nothing
                    
                    
                    
                    // actions:
                    if (restoredCartDetail !== null) {
                        // restore the cart state:
                        dispatch(reduxRestoreCart(restoredCartDetail));
                        
                        // restoring the cart state causing the `globalCartSession` mutated, we need to re-sync the last currency|items to avoid __wrong_change_detection__:
                        prevCurrencyRef.current = restoredCartDetail.currency; // sync
                        prevItemsRef.current    = restoredCartDetail.items;    // sync
                        
                        // broadcast the CartRestored event to event listeners:
                        for (const restoredEventHandler of restoredCartEventHandlers) {
                            restoredEventHandler(restoredCartDetail);
                        } // for
                    };
                }
                catch (error: any) {
                    // conditions:
                    if (!isMounted.current) return; // the component was unloaded before schedule performed => do nothing
                    if (error?.name === 'AbortError') return;
                    
                    
                    
                    const answer = await showMessageError<'retry'|'cancel'>({
                        error : <>
                            <p>
                                Unable to restore <strong>your last shopping cart</strong>.
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
                            performRestore();
                            break;
                        
                        default :
                            // nothing to do
                            break;
                    } // switch
                } // try
            };
            performRestore(); // fire and forget
        }
        else {
            lastRestoredCartDetailRef.current = undefined;
            
            // changes from `loggedIn` to `loggedOut`:
            dispatch(reduxResetCart());
        } // if
        
        
        
        // // cleanups:
        // problematic of DOUBLE re-render => DOUBLE cleanups, we use `manual cleanups` above
        // return () => {
        //     restoreCartPromise?.abort();
        //     restoreCartPromise = null;
        // };
    }, [hasLoggedIn, sessionStatus]);
    
    // auto backup the cart session when the global currency|items changed:
    const prevCurrencyRef = useRef<typeof globalCartSession.currency>(globalCartSession.currency);
    const prevItemsRef    = useRef<typeof globalCartSession.items>(globalCartSession.items);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (
            (prevCurrencyRef.current === globalCartSession.currency)
            &&
            (prevItemsRef.current    === globalCartSession.items)
        ) return;                                             // already the same => ignore
        prevCurrencyRef.current = globalCartSession.currency; // sync
        prevItemsRef.current    = globalCartSession.items;    // sync
        
        
        
        // actions:
        let backupCartPromise : MutationActionCreatorResult<MutationDefinition<CartUpdateRequest, any, never, unknown, 'api'>>|undefined|null = undefined;
        (async (): Promise<void> => {
            // wait for 1 second before performing `refreshShippingByAddress()`:
            if (!(await setTimeoutAsync(1000))) return; // the component was unloaded before the timer runs => do nothing
            if (backupCartPromise === null) return; // marked as aborted => do nothing
            
            
            
            backupCartPromise = dispatch(backupCart({
                currency : globalCartSession.currency,
                items    : globalCartSession.items,
            } satisfies CartUpdateRequest, {
                track: true, // must be true in order to get the response result for updating the `restoreCart()`'s cache
            }));
        })();
        
        
        
        // cleanups:
        return () => {
            backupCartPromise?.abort();
            backupCartPromise = null; // mark as aborted
        };
    }, [globalCartSession]);
    
    
    
    // dialogs:
    const {
        showMessage,
        showMessageNotification,
    } = useDialogMessage();
    
    
    
    // stable callbacks:
    const setCurrency           = useEvent((currency: string|undefined): void => {
        // actions:
        dispatch(reduxSetCurrency(currency));
    });
    
    const addProductToCart      = useEvent((productId: string, variantIds: string[], quantity: number = 1): void => {
        // actions:
        dispatch(reduxAddProductToCart({ productId, variantIds, quantity }));
    });
    const deleteProductFromCart = useEvent(async (productId: string, variantIds: string[], options?: { showConfirm?: boolean }): Promise<void> => {
        // conditions:
        if (options?.showConfirm ?? true) {
            if (
                (await showMessage<'yes'|'no'>({
                    theme    : 'warning',
                    // si ze     : 'sm',
                    title    : <h1>Delete Confirmation</h1>,
                    message  : <p>
                        Are you sure to remove product:<br />
                        <strong>{productPreviews?.get(productId)?.name ?? 'UNKNOWN PRODUCT'}</strong><br />from the cart?
                    </p>,
                    options  : {
                        yes  : <ButtonIcon icon='check'          theme='primary'>Yes</ButtonIcon>,
                        no   : <ButtonIcon icon='not_interested' theme='secondary' autoFocus={true}>No</ButtonIcon>,
                    },
                    // viewport : cartBodyRef,
                }))
                !==
                'yes'
            ) return;
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
        } // if
        
        
        
        // actions:
        dispatch(reduxDeleteProductFromCart({ productId, variantIds }));
    });
    const changeProductFromCart = useEvent(async (productId: string, variantIds: string[], quantity: number, options?: { showConfirm?: boolean }): Promise<void> => {
        // actions:
        if (quantity > 0) {
            dispatch(reduxChangeProductFromCart({ productId, variantIds, quantity }));
        }
        else {
            await deleteProductFromCart(productId, variantIds, options);
        } // if
    });
    const clearProductsFromCart = useEvent((): void => {
        // actions:
        dispatch(reduxClearProductsFromCart());
    });
    const trimProductsFromCart  = useEvent(async (limitedStockItems: LimitedStockItem[], options?: { showConfirm?: boolean, showPaymentCanceled?: boolean }): Promise<void> => {
        // conditions:
        if (!limitedStockItems?.length) return;
        
        
        
        // actions:
        dispatch(reduxTrimProductsFromCart(limitedStockItems));
        
        
        
        // report changes:
        if (options?.showConfirm ?? true) {
            const hasNotAvailable = limitedStockItems.some(({stock}) => (stock <= 0));
            const hasOutOfStock   = limitedStockItems.some(({stock}) => (stock >  0));
            const hasBoth         = hasNotAvailable && hasOutOfStock;
            const isPlural        = limitedStockItems.length > 1;
            await showMessageNotification({
                theme        : 'warning',
                title        : <h1>Out of Stock</h1>,
                notification : <>
                    <p>
                        There {isPlural ? 'are some products' : 'is a product'} that {isPlural ? 'are' : 'is'} <strong>out of stock</strong>.
                    </p>
                    <p>
                        We have {hasNotAvailable && <strong>deleted</strong>}{hasBoth && '/'}{hasOutOfStock && <><strong>reduced</strong> the quantity of</>} the {isPlural? 'products' : 'product'} in your shopping cart.
                    </p>
                    {(options?.showPaymentCanceled ?? false) && <>
                        <p>
                            We have <strong>canceled your previous transaction</strong> and <strong>your funds have not been deducted</strong>.
                        </p>
                        <p>
                            Please try ordering again with the new order quantity.
                        </p>
                    </>}
                    <ViewOutOfStock
                        // variants:
                        theme='primary'
                        
                        
                        
                        // data:
                        limitedStockItems={limitedStockItems}
                        
                        
                        
                        // relation data:
                        productPreviews={productPreviews}
                    />
                </>
            });
        } // if
    });
    
    const showCart              = useEvent((): void => {
        // actions:
        dispatch(reduxShowCart());
    });
    const hideCart              = useEvent((): void => {
        // actions:
        dispatch(reduxHideCart());
    });
    
    const refetchCart           = useEvent((): void => {
        if (realIsProductError && !realIsProductLoading && !mockProductPreviews) setProductPreviewGeneration((current) => (current + 1)); // force to re-create the `productPreviewPromises`
    });
    const resetCart             = useEvent((): void => {
        lastRestoredCartDetailRef.current = undefined;
        
        dispatch(reduxResetCart());
    });
    
    
    
    // apis:
    const cartState = useMemo<CartState>(() => ({
        // states:
        isCartShown,
        
        isCartEmpty   : isCartEmpty   as any,
        isCartLoading : isCartLoading as any,
        isCartError   : isCartError   as any,
        isCartReady   : isCartReady   as any,
        
        
        
        // accessibilities:
        currency,
        setCurrency,                  // stable ref
        
        
        
        // cart data:
        items,
        totalProductQuantity,
        totalProductWeight,
        totalProductWeightStepped,
        productPriceParts,
        hasPhysicalProduct,
        
        
        
        // relation data:
        productPreviews,
        
        
        
        // actions:
        addProductToCart,             // stable ref
        deleteProductFromCart,        // stable ref
        changeProductFromCart,        // stable ref
        clearProductsFromCart,        // stable ref
        trimProductsFromCart,         // stable ref
        
        showCart,                     // stable ref
        hideCart,                     // stable ref
        
        refetchCart,                  // stable ref
        
        resetCart,                    // stable ref
        
        
        
        // events:
        lastRestoredCartDetailRef,    // stable ref
        restoredCartEventHandlers,    // stable ref
    }), [
        // states:
        isCartShown,
        
        isCartEmpty,
        isCartLoading,
        isCartError,
        isCartReady,
        
        
        
        // accessibilities:
        currency,
        // setCurrency,               // stable ref
        
        
        
        // cart data:
        items,
        totalProductQuantity,
        totalProductWeight,
        totalProductWeightStepped,
        productPriceParts,
        hasPhysicalProduct,
        
        
        
        // relation data:
        productPreviews,
        
        
        
        // actions:
        // addProductToCart,          // stable ref
        // deleteProductFromCart,     // stable ref
        // changeProductFromCart,     // stable ref
        // clearProductsFromCart,     // stable ref
        // trimProductsFromCart,      // stable ref
        
        // showCart,                  // stable ref
        // hideCart,                  // stable ref
        
        // refetchCart,               // stable ref
        
        // resetCart,                 // stable ref
        
        
        
        // events:
        // lastRestoredCartDetailRef, // stable ref
        // restoredCartEventHandlers, // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <CartStateContext.Provider value={cartState}>
            {Array.from(productPreviewMap.keys()).map((productId) =>
                <ProductWatchdog
                    // identifiers:
                    key={`${productId}:${productPreviewGeneration}`}
                    
                    
                    
                    // data:
                    productId={productId}
                    
                    
                    
                    // handlers:
                    onUpdate={handleProductWatchdogUpdate}
                />
            )}
            {children}
        </CartStateContext.Provider>
    );
};
export {
    CartStateProvider,
    CartStateProvider as default,
}



const enum ProductWatchdogFail {
    Loading     = 0,
    Error       = 1,
    Unavailable = 2,
}
interface ProductWatchdogEvent {
    // data:
    productId : string
    data      : ProductPreview|ProductWatchdogFail
}
interface ProductWatchdogProps {
    // data:
    productId : string
    
    
    
    // handlers:
    onUpdate  : EventHandler<ProductWatchdogEvent>
}
const ProductWatchdog = (props: ProductWatchdogProps): null => {
    // props:
    const {
        // data:
        productId,
        
        
        
        // handlers:
        onUpdate,
    } = props;
    
    
    
    // apis:
    const { data: product, error } = useGetProductPreview(productId, {
        // forceRefetch           : false,              // take from cache (if available)
        // subscribe              : true,               // must be true in order to get the response result
        // subscriptionOptions    : {
        // },
        pollingInterval    : 1 * 60 * 60 * 1000, // How frequently to automatically re-fetch data (in milliseconds).
        refetchOnFocus     : false,              // This setting allows you to control whether RTK Query will try to refetch all subscribed queries after the application window regains focus.
        refetchOnReconnect : false,              // This setting allows you to control whether RTK Query will try to refetch all subscribed queries after regaining a network connection.
    });
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        if (product) {
            onUpdate({ productId, data: product });
        }
        else if (error) {
            onUpdate({ productId, data: ProductWatchdogFail.Error });
        }
        else {
            onUpdate({ productId, data: ProductWatchdogFail.Loading });
        } // if
    }, [product, error]);
    
    
    
    // jsx:
    return null;
};
//#endregion checkoutState

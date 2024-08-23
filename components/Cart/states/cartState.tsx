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
    useState,
}                           from 'react'

// redux:
import type {
    EntityState
}                           from '@reduxjs/toolkit'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMountedFlag,
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
    type CartItem,
}                           from '@/models'

// stores:
import {
    // version control:
    resetIfInvalid        as reduxResetIfInvalid,
    
    
    
    // accessibilities:
    setCurrency           as reduxSetCurrency,
    
    
    
    // cart data:
    addProductToCart      as reduxAddProductToCart,
    deleteProductFromCart as reduxDeleteProductFromCart,
    changeProductFromCart as reduxChangeProductFromCart,
    clearProductsFromCart as reduxClearProductsFromCart,
    trimProductsFromCart  as reduxTrimProductsFromCart,
    
    
    
    // cart dialogs:
    showCart              as reduxShowCart,
    
    
    
    // selectors:
    selectCurrency,
    selectCartItems,
    selectIsCartShown,
}                           from '@/store/features/cart/cartSlice'
import {
    // types:
    ProductPreview,
    ProductPricePart,
    LimitedStockItem,
    
    
    
    // hooks:
    useGetProductList,
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
export interface CartStateBase {
    // states:
    isCartShown               : boolean
    
    isCartEmpty               : boolean
    isCartLoading             : boolean
    isCartError               : boolean
    isCartReady               : boolean
    
    
    
    // accessibilities:
    currency                  : string
    setCurrency               : (currency: string|undefined) => void
    
    
    
    // cart data:
    cartItems                 : CartItem[]
    totalProductQuantity      : number
    totalProductWeight        : number|null        | undefined
    totalProductWeightStepped : number|null        | undefined
    productPriceParts         : ProductPricePart[] | undefined
    hasPhysicalProduct        : boolean            | undefined
    
    
    
    // relation data:
    productList               : EntityState<ProductPreview> | undefined
    
    
    
    // actions:
    addProductToCart          : (productId: string, variantIds: string[], quantity?: number) => void
    deleteProductFromCart     : (productId: string, variantIds: string[], options?: { showConfirm?: boolean }) => Promise<void>
    changeProductFromCart     : (productId: string, variantIds: string[], quantity: number, options?: { showConfirm?: boolean }) => Promise<void>
    clearProductsFromCart     : () => void
    trimProductsFromCart      : (limitedStockItems: LimitedStockItem[], options?: { showConfirm?: boolean, showPaymentCanceled?: boolean }) => Promise<void>
    
    showCart                  : () => void
    hideCart                  : () => void
    
    refetchCart               : () => void
}

export type PickAlways<T, K extends keyof T, V> = {
    [P in K] : Extract<T[P], V>
}
export type CartState =
    &Omit<CartStateBase, 'isCartEmpty'|'isCartLoading'|'isCartError'|'isCartReady' | 'productList'>
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
            &PickAlways<CartStateBase, 'isCartReady', true        > // if   the cart is  ready
            &PickAlways<CartStateBase, 'productList', {}          > // then the cart is  always having_data
        )
        |(
            &PickAlways<CartStateBase, 'isCartReady', false       > // if   the cart not ready
            &PickAlways<CartStateBase, 'productList', {}|undefined> // then the cart is  maybe  having_data
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
    cartItems                 : [],
    totalProductQuantity      : 0,
    totalProductWeight        : undefined,
    totalProductWeightStepped : undefined,
    productPriceParts         : undefined,
    hasPhysicalProduct        : undefined,
    
    
    
    // relation data:
    productList               : undefined,
    
    
    
    // actions:
    addProductToCart          : noopCallback,
    deleteProductFromCart     : noopCallbackAsync,
    changeProductFromCart     : noopCallbackAsync,
    clearProductsFromCart     : noopCallback,
    trimProductsFromCart      : noopCallbackAsync,
    
    showCart                  : noopCallback,
    hideCart                  : noopCallback,
    
    refetchCart               : noopCallback,
});
CartStateContext.displayName  = 'CartState';

export const useCartState = (): CartState => {
    return useContext(CartStateContext);
};



// react components:
export interface CartStateProps {
    // mocks:
    mockCartItems   ?: CartState['cartItems'  ]
    mockProductList ?: CartState['productList']
}
const CartStateProvider = (props: React.PropsWithChildren<CartStateProps>) => {
    // rest props:
    const {
        // mocks:
        mockCartItems,
        mockProductList,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // stores:
    const currency      = useAppSelector(selectCurrency);
    
    const realCartItems = useAppSelector(selectCartItems);
    const cartItems     = mockCartItems ?? realCartItems;
    
    const isCartShown   = useAppSelector(selectIsCartShown);
    
    const dispatch      = useAppDispatch();
    
    
    
    // apis:
    const {data: realProductList, isFetching: realIsProductLoading, isError: realIsProductError, refetch: realRefetchCart} = useGetProductList();
    const productList      = mockProductList        ??        realProductList;
    const isProductLoading = mockProductList ?    false     : realIsProductLoading;
    const isProductError   = mockProductList ?    false     : realIsProductError;
    const refetchCart      = mockProductList ? noopCallback : realRefetchCart;
    
    const isCartEmpty   = (
        !cartItems.length
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
        for (const {quantity} of cartItems) {
            totalProductQuantity += quantity;
        } // for
        return totalProductQuantity;
    }, [cartItems]);
    
    const {productPriceParts, totalProductWeight} = useMemo<{productPriceParts: ProductPricePart[]|undefined, totalProductWeight: number|null|undefined}>(() => {
        const productPriceParts  : ProductPricePart[] = [];
        let   totalProductWeight : number|null        = null;
        for (const {productId, variantIds, quantity} of cartItems) {
            const product = productList?.entities?.[productId];
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
    }, [cartItems, productList]);
    
    const totalProductWeightStepped = useMemo(() => {
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
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    useIsomorphicLayoutEffect(() => {
        dispatch(reduxResetIfInvalid());
    }, []);
    
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!isCartReady)      return; // do not clean up when the related data is still loading
        if (!cartItems.length) return; // no item(s) in the cart => nothing to clean up
        if (!productList)      return; // the productList is not yet loaded => do not clean up now
        
        
        
        // clean up invalid productId(s):
        const invalidProducts = cartItems.filter(({productId, variantIds}) => {
            const validProductIds = productList.ids;
            if (!validProductIds.includes(productId)) return true; // invalid
            
            const validVariantGroups = productList.entities[productId]?.variantGroups ?? [];
            const validVariantIds    = validVariantGroups.flat().map(({id}) => id)    ?? [];
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
    }, [isCartReady, cartItems, productList]);
    
    
    
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
                        <strong>{productList?.entities?.[productId]?.name ?? 'UNKNOWN PRODUCT'}</strong><br />from the cart?
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
                        productList={productList}
                    />
                </>
            });
        } // if
    });
    
    const showCart              = useEvent((): void => {
        // actions:
        dispatch(reduxShowCart(true));
    });
    const hideCart              = useEvent((): void => {
        // actions:
        dispatch(reduxShowCart(false));
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
        setCurrency,           // stable ref
        
        
        
        // cart data:
        cartItems,
        totalProductQuantity,
        totalProductWeight,
        totalProductWeightStepped,
        productPriceParts,
        hasPhysicalProduct,
        
        
        
        // relation data:
        productList,
        
        
        
        // actions:
        addProductToCart,      // stable ref
        deleteProductFromCart, // stable ref
        changeProductFromCart, // stable ref
        clearProductsFromCart, // stable ref
        trimProductsFromCart,  // stable ref
        
        showCart,              // stable ref
        hideCart,              // stable ref
        
        refetchCart,           // stable ref
    }), [
        // states:
        isCartShown,
        
        isCartEmpty,
        isCartLoading,
        isCartError,
        isCartReady,
        
        
        
        // accessibilities:
        currency,
        // setCurrency,           // stable ref
        
        
        
        // cart data:
        cartItems,
        totalProductQuantity,
        totalProductWeight,
        totalProductWeightStepped,
        productPriceParts,
        hasPhysicalProduct,
        
        
        
        // relation data:
        productList,
        
        
        
        // actions:
        // addProductToCart,      // stable ref
        // deleteProductFromCart, // stable ref
        // changeProductFromCart, // stable ref
        // clearProductsFromCart, // stable ref
        // trimProductsFromCart,  // stable ref
        
        // showCart,              // stable ref
        // hideCart,              // stable ref
        
        refetchCart,              // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <CartStateContext.Provider value={cartState}>
            {children}
        </CartStateContext.Provider>
    );
};
export {
    CartStateProvider,
    CartStateProvider as default,
}
//#endregion checkoutState

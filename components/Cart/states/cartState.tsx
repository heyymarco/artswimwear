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

// stores:
import {
    // types:
    CartEntry,
    
    
    
    // cart data:
    addProductToCart      as reduxAddProductToCart,
    deleteProductFromCart as reduxDeleteProductFromCart,
    changeProductFromCart as reduxChangeProductFromCart,
    clearProductsFromCart as reduxClearProductsFromCart,
    trimProductsFromCart  as reduxTrimProductsFromCart,
    
    
    
    // cart dialogs:
    showCart              as reduxShowCart,
    
    
    
    // selectors:
    selectCartItems,
    selectIsCartShown,
}                           from '@/store/features/cart/cartSlice'
import {
    // types:
    ProductPreview,
    LimitedStockItem,
    
    
    
    // hooks:
    useGetProductList,
}                           from '@/store/features/api/apiSlice'



// types:
export type {
    CartEntry,
    ProductPreview,
}



// hooks:

// states:

//#region checkoutState

// contexts:
export interface CartStateBase {
    // states:
    isCartShown           : boolean
    
    isCartEmpty           : boolean
    isCartLoading         : boolean
    isCartError           : boolean
    isCartReady           : boolean
    
    
    
    // cart data:
    cartItems             : CartEntry[]
    totalProductQuantity  : number
    totalProductWeight    : number|null
    totalProductPrice     : number
    hasPhysicalProduct    : boolean
    
    
    
    // relation data:
    productList           : EntityState<ProductPreview> | undefined
    
    
    
    // actions:
    addProductToCart      : (productId: string, quantity?: number) => void
    deleteProductFromCart : (productId: string, options?: { showConfirm?: boolean }) => Promise<void>
    changeProductFromCart : (productId: string, quantity: number, options?: { showConfirm?: boolean }) => Promise<void>
    clearProductsFromCart : () => void
    trimProductsFromCart  : (limitedStockItems: LimitedStockItem[], options?: { showConfirm?: boolean, showPaymentCanceled?: boolean }) => Promise<void>
    
    showCart              : () => void
    hideCart              : () => void
    
    refetchCart           : () => void
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
    isCartShown           : false,
    
    isCartEmpty           : true,
    isCartLoading         : false,
    isCartError           : false,
    isCartReady           : false,
    
    
    
    // cart data:
    cartItems             : [],
    totalProductQuantity  : 0,
    totalProductWeight    : null,
    totalProductPrice     : 0,
    hasPhysicalProduct    : false,
    
    
    
    // relation data:
    productList           : undefined,
    
    
    
    // actions:
    addProductToCart      : noopCallback,
    deleteProductFromCart : noopCallbackAsync,
    changeProductFromCart : noopCallbackAsync,
    clearProductsFromCart : noopCallback,
    trimProductsFromCart  : noopCallbackAsync,
    
    showCart              : noopCallback,
    hideCart              : noopCallback,
    
    refetchCart           : noopCallback,
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
    const realCartItems = useSelector(selectCartItems);
    const cartItems     = mockCartItems ?? realCartItems;
    const isCartEmpty   = !cartItems.length;
    
    const isCartShown   = useSelector(selectIsCartShown);
    
    const dispatch      = useDispatch();
    
    
    
    // apis:
    const {data: realProductList, isFetching: realIsProductLoading, isError: realIsProductError, refetch: realRefetchCart} = useGetProductList();
    const productList      = mockProductList        ??        realProductList;
    const isProductLoading = mockProductList ?    false     : realIsProductLoading;
    const isProductError   = mockProductList ?    false     : realIsProductError;
    const refetchCart      = mockProductList ? noopCallback : realRefetchCart;
    
    const isCartLoading =  !isCartEmpty   && (isProductLoading); // do not report the loading state if the cart is empty
    const hasData       = (!!productList);
    const isCartError   = (!isCartLoading && (isProductError)) || !hasData /* considered as error if no data */;
    const isCartReady   =  !isCartLoading &&  !isCartError     && !isCartEmpty;
    
    
    
    // cart data:
    const totalProductQuantity = useMemo<number>(() => {
        let totalProductQuantity : number = 0;
        for (const {quantity} of cartItems) {
            totalProductQuantity += quantity;
        } // for
        return totalProductQuantity;
    }, [cartItems]);
    
    const {totalProductWeight, totalProductPrice} = useMemo<{totalProductWeight: number|null, totalProductPrice: number}>(() => {
        let totalProductWeight : number|null = null;
        let totalProductPrice  : number      = 0;
        for (const {productId, quantity} of cartItems) {
            const product = productList?.entities?.[productId];
            if (!product) continue;
            const {price, shippingWeight} = product;
            
            
            
            if (shippingWeight !== null) { // not a physical product => ignore
                if (totalProductWeight === null) totalProductWeight = 0; // has a/some physical products => reset the counter from zero if null
                totalProductWeight += (shippingWeight * quantity);
            } // if
            
            
            
            totalProductPrice += (price * quantity);
        } // for
        return {
            totalProductWeight,
            totalProductPrice,
        };
    }, [cartItems, productList]);
    
    const hasPhysicalProduct = (totalProductWeight !== null);
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!isCartReady)      return; // do not clean up when the related data is still loading
        if (!cartItems.length) return; // no item(s) in the cart => nothing to clean up
        if (!productList)      return; // the productList is not yet loaded => do not clean up now
        
        
        
        // clean up invalid productId(s):
        const invalidProductIds = cartItems.map(({productId}) => productId).filter((productId) => !productList.ids.includes(productId));
        if (invalidProductIds.length) {
            trimProductsFromCart(
                invalidProductIds
                .map((invalidProductId) => ({
                    productId : invalidProductId,
                    stock     : 0,
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
    const addProductToCart      = useEvent((productId: string, quantity: number = 1): void => {
        // actions:
        dispatch(reduxAddProductToCart({ productId, quantity }));
    });
    const deleteProductFromCart = useEvent(async (productId: string, options?: { showConfirm?: boolean }): Promise<void> => {
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
        dispatch(reduxDeleteProductFromCart({ productId }));
    });
    const changeProductFromCart = useEvent(async (productId: string, quantity: number, options?: { showConfirm?: boolean }): Promise<void> => {
        // actions:
        if (quantity > 0) {
            dispatch(reduxChangeProductFromCart({ productId, quantity }));
        }
        else {
            await deleteProductFromCart(productId, options);
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
        
        
        
        // cart data:
        cartItems,
        totalProductQuantity,
        totalProductWeight,
        totalProductPrice,
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
        
        
        
        // cart data:
        cartItems,
        totalProductQuantity,
        totalProductWeight,
        totalProductPrice,
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

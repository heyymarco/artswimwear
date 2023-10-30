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

// stores:
import {
    // types:
    CartEntry,
    
    
    
    // cart data:
    addToCart           as reduxAddToCart,
    removeFromCart      as reduxRemoveFromCart,
    setCartItemQuantity as reduxSetCartItemQuantity,
    clearCart           as reduxClearCart,
    
    
    
    // cart dialogs:
    showCart            as reduxShowCart,
    
    
    
    // selectors:
    selectCartItems,
    selectIsCartShown,
}                           from '@/store/features/cart/cartSlice'
import {
    // types:
    ProductPreview,
    
    
    
    // hooks:
    useGetProductList,
}                           from '@/store/features/api/apiSlice'



// types:
export type {
    CartEntry,
}



// hooks:

// states:

//#region checkoutState

// contexts:
export interface CartState {
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
    
    
    
    // relation data:
    productList           : EntityState<ProductPreview>   | undefined
    
    
    
    // actions:
    addProductToCart      : (productId: string, quantity?: number) => void
    deleteProductFromCart : (productId: string) => void
    changeProductFromCart : (productId: string, quantity: number) => void
    clearProductsFromCart : () => void
    
    showCart              : () => void
    hideCart              : () => void
    
    refetch               : () => void
}

const noopCallback = () => {};
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
    
    
    
    // relation data:
    productList           : undefined,
    
    
    
    // actions:
    addProductToCart      : noopCallback,
    deleteProductFromCart : noopCallback,
    changeProductFromCart : noopCallback,
    clearProductsFromCart : noopCallback,
    
    showCart              : noopCallback,
    hideCart              : noopCallback,
    
    refetch               : noopCallback,
});
CartStateContext.displayName  = 'CartState';

export const useCartState = (): CartState => {
    return useContext(CartStateContext);
};



// react components:
export interface CartStateProps {
}
const CartStateProvider = (props: React.PropsWithChildren<CartStateProps>) => {
    // rest props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // stores:
    const cartItems   = useSelector(selectCartItems);
    const isCartEmpty = !cartItems.length;
    
    const isCartShown = useSelector(selectIsCartShown);
    
    const dispatch    = useDispatch();
    
    
    
    // apis:
    const {data: productList, isFetching: isProductLoading, isError: isProductError, refetch} = useGetProductList();
    
    const isCartLoading = !isCartEmpty   && (isProductLoading); // do not report the loading state if the cart is empty
    const hasData       = (!!productList);
    const isCartError   = (!isCartLoading && (isProductError)) || !hasData /* considered as error if no data */;
    const isCartReady   = !isCartLoading && !isCartEmpty;
    
    
    
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
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // dialogs:
    const {
        showMessage,
    } = useDialogMessage();
    
    
    
    // stable callbacks:
    const addProductToCart      = useEvent((productId: string, quantity: number = 1): void => {
        // actions:
        dispatch(reduxAddToCart({ productId, quantity }));
    });
    const deleteProductFromCart = useEvent(async (productId: string): Promise<void> => {
        // conditions:
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
        
        
        
        // actions:
        dispatch(reduxRemoveFromCart({ productId }));
    });
    const changeProductFromCart = useEvent((productId: string, quantity: number): void => {
        // actions:
        if (quantity > 0) {
            dispatch(reduxSetCartItemQuantity({ productId, quantity }));
        }
        else {
            deleteProductFromCart(productId);
        } // if
    });
    const clearProductsFromCart = useEvent((): void => {
        // actions:
        dispatch(reduxClearCart());
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
    const cartData = useMemo<CartState>(() => ({
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
        
        
        
        // relation data:
        productList,
        
        
        
        // actions:
        addProductToCart,      // stable ref
        deleteProductFromCart, // stable ref
        changeProductFromCart, // stable ref
        clearProductsFromCart, // stable ref
        
        showCart,              // stable ref
        hideCart,              // stable ref
        
        refetch,               // stable ref
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
        
        
        
        // relation data:
        productList,
        
        
        
        // actions:
        // addProductToCart,      // stable ref
        // deleteProductFromCart, // stable ref
        // changeProductFromCart, // stable ref
        // clearProductsFromCart, // stable ref
        
        // showCart,              // stable ref
        // hideCart,              // stable ref
        
        refetch,                  // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <CartStateContext.Provider value={cartData}>
            {children}
        </CartStateContext.Provider>
    );
};
export {
    CartStateProvider,
    CartStateProvider as default,
}
//#endregion checkoutState

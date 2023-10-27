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
    isCartShown        : boolean
    
    isLoadingPage      : boolean
    isErrorPage        : boolean
    isReadyPage        : boolean
    
    
    
    // cart data:
    cartItems          : CartEntry[]
    hasCart            : boolean
    totalProductWeight : number|null
    totalProductPrice  : number
    
    
    
    // relation data:
    productList        : EntityState<ProductPreview>   | undefined
    
    
    
    // actions:
    addItem            : (productId: string, quantity?: number) => void
    deleteItem         : (productId: string) => void
    changeItem         : (productId: string, quantity: number) => void
    clearItems         : () => void
    
    showCart           : () => void
    hideCart           : () => void
}

const noopCallback = () => {};
const CartStateContext = createContext<CartState>({
    // states:
    isCartShown        : false,
    
    isLoadingPage      : false,
    isErrorPage        : false,
    isReadyPage        : false,
    
    
    
    // cart data:
    cartItems          : [],
    hasCart            : false,
    totalProductWeight : null,
    totalProductPrice  : 0,
    
    
    
    // relation data:
    productList        : undefined,
    
    
    
    // actions:
    addItem            : noopCallback,
    deleteItem         : noopCallback,
    changeItem         : noopCallback,
    clearItems         : noopCallback,
    
    showCart           : noopCallback,
    hideCart           : noopCallback,
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
    const hasCart     = !!cartItems.length;
    
    const isCartShown = useSelector(selectIsCartShown);
    
    const dispatch    = useDispatch();
    
    
    
    // apis:
    const {data: productList, isLoading: isLoadingProduct, isError: isErrorProduct} = useGetProductList();
    
    const isLoadingPage =                    isLoadingProduct;
    const isErrorPage   = !isLoadingPage && (isErrorProduct);
    const isReadyPage   = !isLoadingPage && (hasCart && !!productList);
    
    
    
    // cart data:
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
    const addItem    = useEvent((productId: string, quantity: number = 1): void => {
        // actions:
        dispatch(reduxAddToCart({ productId, quantity }));
    });
    const deleteItem = useEvent(async (productId: string): Promise<void> => {
        // conditions:
        if (
            (await showMessage<'yes'|'no'>({
                theme    : 'warning',
                size     : 'sm',
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
    const changeItem = useEvent((productId: string, quantity: number): void => {
        // actions:
        if (quantity > 0) {
            dispatch(reduxSetCartItemQuantity({ productId, quantity }));
        }
        else {
            deleteItem(productId);
        } // if
    });
    const clearItems = useEvent((): void => {
        // actions:
        dispatch(reduxClearCart());
    });
    
    const showCart   = useEvent((): void => {
        // actions:
        dispatch(reduxShowCart(true));
    });
    const hideCart   = useEvent((): void => {
        // actions:
        dispatch(reduxShowCart(false));
    });
    
    
    
    // apis:
    const cartData = useMemo<CartState>(() => ({
        // states:
        isCartShown,
        
        isLoadingPage,
        isErrorPage,
        isReadyPage,
        
        
        
        // cart data:
        cartItems,
        hasCart,
        totalProductWeight,
        totalProductPrice,
        
        
        
        // relation data:
        productList,
        
        
        
        // actions:
        addItem,    // stable ref
        deleteItem, // stable ref
        changeItem, // stable ref
        clearItems, // stable ref
        
        showCart,   // stable ref
        hideCart,   // stable ref
    }), [
        // states:
        isCartShown,
        
        isLoadingPage,
        isErrorPage,
        isReadyPage,
        
        
        
        // cart data:
        cartItems,
        hasCart,
        totalProductWeight,
        totalProductPrice,
        
        
        
        // relation data:
        productList,
        
        
        
        // actions:
        // addItem,    // stable ref
        // deleteItem, // stable ref
        // changeItem, // stable ref
        // clearItems, // stable ref
        
        // showCart,   // stable ref
        // hideCart,   // stable ref
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

// redux:
import {
    createSlice,
    PayloadAction,
}                           from '@reduxjs/toolkit'

// stores:
import type {
    // types:
    RootState,
}                           from '../../store'
import type {
    // types:
    LimitedStockItem,
}                           from '@/store/features/api/apiSlice'

// models:
import {
    type CartDetail,
    type CartItemPreview,
    type CartSession,
}                           from '@/models'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



const initialState : CartSession = {
    // version control:
    version      : 5,
    
    
    
    // auth:
    hasLoggedIn  : false,
    
    
    
    // states:
    isCartShown  : false,
    
    
    
    // accessibilities:
    currency     : checkoutConfigClient.payment.defaultCurrency,
    
    
    
    // cart data:
    items        : [],
};
export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // version control:
        resetIfInvalid        : (state) => {
            if ((state.version === 5) && (!state.items.length || Array.isArray(state.items[0].variantIds))) return state; // valid   => ignore
            return initialState; // invalid => reset
        },
        
        
        
        // auth:
        setHasLoggedIn        : (state, {payload: hasLoggedIn}: PayloadAction<boolean>) => {
            state.hasLoggedIn = hasLoggedIn;
        },
        
        
        
        // states:
        showCart              : (state) => {
            state.isCartShown = true;
        },
        hideCart              : (state) => {
            state.isCartShown = false;
        },
        
        
        
        // accessibilities:
        setCurrency           : (state, {payload: currency = checkoutConfigClient.payment.defaultCurrency}: PayloadAction<string|undefined>) => {
            state.currency = currency;
        },
        
        
        
        // cart data:
        addProductToCart      : ({items}, {payload: {productId, variantIds, quantity = 1}}: PayloadAction<CartItemPreview>) => {
            const existingCartItem = items.find((cartItem) =>
                (cartItem.productId === productId)
                &&
                (cartItem.variantIds.length === variantIds.length)
                &&
                cartItem.variantIds.every((variantId) => variantIds.includes(variantId))
            );
            if (!existingCartItem) {
                if (quantity > 0) {
                    items.push({  // add new
                        productId,
                        variantIds,
                        quantity, // non_zero quantity
                    });
                } // if
            }
            else {
                existingCartItem.quantity += quantity;
            } // if
        },
        deleteProductFromCart : ({items}, {payload: {productId, variantIds}}: PayloadAction<Pick<CartItemPreview, 'productId'|'variantIds'>>) => {
            const itemIndex = items.findIndex((cartItem) =>
                (cartItem.productId === productId)
                &&
                (cartItem.variantIds.length === variantIds.length)
                &&
                cartItem.variantIds.every((variantId) => variantIds.includes(variantId))
            );
            if (itemIndex >= 0) items.splice(itemIndex, 1); // remove at a specified index
        },
        changeProductFromCart : ({items}, {payload: {productId, variantIds, quantity}}: PayloadAction<CartItemPreview>) => {
            const existingCartItem = items.find((cartItem) =>
                (cartItem.productId === productId)
                &&
                (cartItem.variantIds.length === variantIds.length)
                &&
                cartItem.variantIds.every((variantId) => variantIds.includes(variantId))
            );
            if (!existingCartItem) {
                if (quantity > 0) {
                    items.push({  // add new
                        productId,
                        variantIds,
                        quantity, // non_zero quantity
                    });
                } // if
            }
            else {
                if (quantity > 0) {
                    existingCartItem.quantity = quantity;
                }
                else {
                    const itemIndex = items.findIndex((cartItem) => (cartItem === existingCartItem));
                    if (itemIndex >= 0) items.splice(itemIndex, 1); // remove at a specified index
                } // if
            } // if
        },
        clearProductsFromCart : ({items}) => {
            items.splice(0); // remove all
        },
        trimProductsFromCart  : ({items}, {payload: limitedStockItems}: PayloadAction<LimitedStockItem[]|null|undefined>) => {
            // conditions:
            if (!limitedStockItems?.length) return;
            
            
            
            // update cart:
            for (const {productId, variantIds, stock} of limitedStockItems) {
                const existingCartItem = items.find((cartItem) =>
                    (cartItem.productId === productId)
                    &&
                    (cartItem.variantIds.length === variantIds.length)
                    &&
                    cartItem.variantIds.every((variantId) => variantIds.includes(variantId))
                );
                if (!existingCartItem) continue;
                
                
                
                const quantity = Math.min(existingCartItem.quantity, Math.max(0, stock));
                if (quantity > 0) {
                    existingCartItem.quantity = quantity;
                }
                else {
                    const itemIndex = items.findIndex((cartItem) => (cartItem === existingCartItem));
                    if (itemIndex >= 0) items.splice(itemIndex, 1); // remove at a specified index
                } // if
            } // for
        },
        resetCart             : (state) => {
            return initialState; // invalid => reset
        },
        restoreCart           : (state, {payload: {currency, items}}: PayloadAction<Omit<CartDetail, 'checkout'>>) => {
            return {
                ...initialState,
                hasLoggedIn : state.hasLoggedIn,
                currency,
                items,
            };
        },
    },
});



export default cartSlice.reducer;
export const {
    // version control:
    resetIfInvalid,
    
    
    
    // auth:
    setHasLoggedIn,
    
    
    
    // states:
    showCart,
    hideCart,
    
    
    
    // accessibilities:
    setCurrency,
    
    
    
    // cart data:
    addProductToCart,
    deleteProductFromCart,
    changeProductFromCart,
    clearProductsFromCart,
    trimProductsFromCart,
    resetCart,
    restoreCart,
} = cartSlice.actions;



// selectors:
export const selectCartSession = (state: RootState): CartSession => {
    return state.cart;
};

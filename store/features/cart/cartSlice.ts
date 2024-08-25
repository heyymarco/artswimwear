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
}                           from '@/models'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



export interface CartSession
    extends
        CartDetail
{
    // version control:
    version  ?: number,
    
    
    
    // cart dialogs:
    showCart  : boolean
}

const initialState : CartSession = {
    // version control:
    version   : 5,
    
    
    
    // accessibilities:
    currency  : checkoutConfigClient.payment.defaultCurrency,
    
    
    
    // cart data:
    items     : [],
    
    
    
    // cart dialogs:
    showCart  : false,
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
        
        
        
        // cart dialogs:
        toggleCart            : (state) => {
            state.showCart = !state.showCart;
        },
        showCart              : (state, {payload: setShown}: PayloadAction<boolean>) => {
            state.showCart = setShown;
        },
    },
});



export default cartSlice.reducer;
export const {
    // version control:
    resetIfInvalid,
    
    
    
    // accessibilities:
    setCurrency,
    
    
    
    // cart data:
    addProductToCart,
    deleteProductFromCart,
    changeProductFromCart,
    clearProductsFromCart,
    trimProductsFromCart,
    
    
    
    // cart dialogs:
    toggleCart,
    showCart,
} = cartSlice.actions;



// selectors:
export const selectCurrency    = (state: RootState) => {
    return state.cart.currency;
};
export const selectCartItems   = (state: RootState) => {
    return state.cart.items;
};
export const selectIsCartShown = (state: RootState) => {
    return state.cart.showCart;
};

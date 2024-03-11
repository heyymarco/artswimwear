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

// apis:
import type {
    CartEntry,
    CartData,
}                           from '@/app/api/checkout/route'
export type {
    CartEntry,
    CartData,
}                           from '@/app/api/checkout/route'



export interface CartState
    extends
        CartData
{
    // version control:
    version  ?: number,
    
    
    
    // cart dialogs:
    showCart  : boolean
}

const initialState : CartState = {
    // version control:
    version   : 2,
    
    
    
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
            if ((state.version === 2) && (!state.items.length || Array.isArray(state.items[0].productVariantIds))) return state; // valid   => ignore
            return initialState; // invalid => reset
        },
        
        
        
        // cart data:
        addProductToCart      : ({items}, {payload: {productId, productVariantIds, quantity = 1}}: PayloadAction<CartEntry>) => {
            const existingEntry = items.find((entry) =>
                (entry.productId === productId)
                &&
                (entry.productVariantIds.length === productVariantIds.length)
                &&
                entry.productVariantIds.every((productVariantId) => productVariantIds.includes(productVariantId))
            );
            if (!existingEntry) {
                if (quantity > 0) {
                    items.push({  // add new
                        productId,
                        productVariantIds,
                        quantity, // non_zero quantity
                    });
                } // if
            }
            else {
                existingEntry.quantity += quantity;
            } // if
        },
        deleteProductFromCart : ({items}, {payload: {productId, productVariantIds}}: PayloadAction<Pick<CartEntry, 'productId'|'productVariantIds'>>) => {
            const itemIndex = items.findIndex((entry) =>
                (entry.productId === productId)
                &&
                (entry.productVariantIds.length === productVariantIds.length)
                &&
                entry.productVariantIds.every((productVariantId) => productVariantIds.includes(productVariantId))
            );
            if (itemIndex >= 0) items.splice(itemIndex, 1); // remove at a specified index
        },
        changeProductFromCart : ({items}, {payload: {productId, productVariantIds, quantity}}: PayloadAction<CartEntry>) => {
            const existingEntry = items.find((entry) =>
                (entry.productId === productId)
                &&
                (entry.productVariantIds.length === productVariantIds.length)
                &&
                entry.productVariantIds.every((productVariantId) => productVariantIds.includes(productVariantId))
            );
            if (!existingEntry) {
                if (quantity > 0) {
                    items.push({  // add new
                        productId,
                        productVariantIds,
                        quantity, // non_zero quantity
                    });
                } // if
            }
            else {
                if (quantity > 0) {
                    existingEntry.quantity = quantity;
                }
                else {
                    const itemIndex = items.findIndex((entry) => (entry === existingEntry));
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
            for (const {productId, productVariantIds, stock} of limitedStockItems) {
                const existingEntry = items.find((entry) =>
                    (entry.productId === productId)
                    &&
                    (entry.productVariantIds.length === productVariantIds.length)
                    &&
                    entry.productVariantIds.every((productVariantId) => productVariantIds.includes(productVariantId))
                );
                if (!existingEntry) continue;
                
                
                
                const quantity = Math.min(existingEntry.quantity, Math.max(0, stock));
                if (quantity > 0) {
                    existingEntry.quantity = quantity;
                }
                else {
                    const itemIndex = items.findIndex((entry) => (entry === existingEntry));
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
export const selectCartTotalQuantity = (state: RootState) => {
    let counter = 0;
    for (const item of state.cart.items) counter += item.quantity;
    return counter;
};
export const selectCartItems         = (state: RootState) => {
    return state.cart.items;
};
export const selectIsCartShown       = (state: RootState) => {
    return state.cart.showCart;
};

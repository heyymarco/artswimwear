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

// configs:
import {
    paymentConfig,
}                           from '@/payment.config'



export interface CartState
    extends
        CartData
{
    // version control:
    version           ?: number,
    
    
    
    // accessibilities:
    preferredCurrency  : string
    
    
    
    // cart dialogs:
    showCart           : boolean
}

const initialState : CartState = {
    // version control:
    version            : 2,
    
    
    
    // accessibilities:
    preferredCurrency  : paymentConfig.defaultPaymentCurrency,
    
    
    
    // cart data:
    items              : [],
    
    
    
    // cart dialogs:
    showCart           : false,
};
export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // version control:
        resetIfInvalid        : (state) => {
            if ((state.version === 2) && (!state.items.length || Array.isArray(state.items[0].variantIds))) return state; // valid   => ignore
            return initialState; // invalid => reset
        },
        
        
        
        // accessibilities:
        setPreferredCurrency  : (state, {payload: preferredCurrency = paymentConfig.defaultPaymentCurrency}: PayloadAction<string|undefined>) => {
            state.preferredCurrency = preferredCurrency;
        },
        
        
        
        // cart data:
        addProductToCart      : ({items}, {payload: {productId, variantIds, quantity = 1}}: PayloadAction<CartEntry>) => {
            const existingEntry = items.find((entry) =>
                (entry.productId === productId)
                &&
                (entry.variantIds.length === variantIds.length)
                &&
                entry.variantIds.every((variantId) => variantIds.includes(variantId))
            );
            if (!existingEntry) {
                if (quantity > 0) {
                    items.push({  // add new
                        productId,
                        variantIds,
                        quantity, // non_zero quantity
                    });
                } // if
            }
            else {
                existingEntry.quantity += quantity;
            } // if
        },
        deleteProductFromCart : ({items}, {payload: {productId, variantIds}}: PayloadAction<Pick<CartEntry, 'productId'|'variantIds'>>) => {
            const itemIndex = items.findIndex((entry) =>
                (entry.productId === productId)
                &&
                (entry.variantIds.length === variantIds.length)
                &&
                entry.variantIds.every((variantId) => variantIds.includes(variantId))
            );
            if (itemIndex >= 0) items.splice(itemIndex, 1); // remove at a specified index
        },
        changeProductFromCart : ({items}, {payload: {productId, variantIds, quantity}}: PayloadAction<CartEntry>) => {
            const existingEntry = items.find((entry) =>
                (entry.productId === productId)
                &&
                (entry.variantIds.length === variantIds.length)
                &&
                entry.variantIds.every((variantId) => variantIds.includes(variantId))
            );
            if (!existingEntry) {
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
            for (const {productId, variantIds, stock} of limitedStockItems) {
                const existingEntry = items.find((entry) =>
                    (entry.productId === productId)
                    &&
                    (entry.variantIds.length === variantIds.length)
                    &&
                    entry.variantIds.every((variantId) => variantIds.includes(variantId))
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
    
    
    
    // accessibilities:
    setPreferredCurrency,
    
    
    
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
export const selectPreferredCurrency = (state: RootState) => {
    return state.cart.preferredCurrency;
};
export const selectCartItems         = (state: RootState) => {
    return state.cart.items;
};
export const selectIsCartShown       = (state: RootState) => {
    return state.cart.showCart;
};

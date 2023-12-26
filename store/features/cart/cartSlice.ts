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
    // cart dialogs:
    showCart  : boolean
}

const initialState : CartState = {
    // cart data:
    items     : [],
    
    
    
    // cart dialogs:
    showCart  : false,
};
export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // cart data:
        addProductToCart      : ({items}, {payload: {productId, quantity = 1}}: PayloadAction<CartEntry>) => {
            const existingEntry = items.find((entry) => entry.productId === productId);
            if (!existingEntry) {
                if (quantity > 0) {
                    items.push({  // add new
                        productId,
                        quantity, // non_zero quantity
                    });
                } // if
            }
            else {
                existingEntry.quantity += quantity;
            } // if
        },
        deleteProductFromCart : ({items}, {payload: {productId}}: PayloadAction<Pick<CartEntry, 'productId'>>) => {
            const itemIndex = items.findIndex((entry) => entry.productId === productId);
            if (itemIndex >= 0) items.splice(itemIndex, 1); // remove at a specified index
        },
        changeProductFromCart : ({items}, {payload: {productId, quantity}}: PayloadAction<CartEntry>) => {
            const existingEntry = items.find((entry) => entry.productId === productId);
            if (!existingEntry) {
                if (quantity > 0) {
                    items.push({  // add new
                        productId,
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
    // cart data:
    addProductToCart,
    deleteProductFromCart,
    changeProductFromCart,
    clearProductsFromCart,
    
    
    
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

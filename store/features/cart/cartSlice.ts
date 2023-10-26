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



export interface CartEntry {
    productId : string
    quantity  : number
}
export interface CartState {
    items     : CartEntry[],
    showCart  : boolean
}

const initialState : CartState = {
    items    : [],
    showCart : false,
};
export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart           : ({items}, {payload: {productId, quantity = 1}}: PayloadAction<CartEntry>) => {
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
        removeFromCart      : ({items}, {payload: {productId}}: PayloadAction<Pick<CartEntry, 'productId'>>) => {
            const itemIndex = items.findIndex((entry) => entry.productId === productId);
            if (itemIndex >= 0) items.splice(itemIndex, 1); // remove at a specified index
        },
        setCartItemQuantity : ({items}, {payload: {productId, quantity}}: PayloadAction<CartEntry>) => {
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
        clearCart           : ({items}) => {
            items.splice(0); // remove all
        },
        
        
        
        toggleCart          : (state) => {
            state.showCart = !state.showCart;
        },
        showCart            : (state, {payload: setShown}: PayloadAction<boolean>) => {
            state.showCart = setShown;
        },
    },
});



export default cartSlice.reducer;
export const {
    addToCart,
    removeFromCart,
    setCartItemQuantity,
    clearCart,
    
    
    
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

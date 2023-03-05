import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../store';



export interface CartEntry {
    productId : string
    quantity  : number
}
export interface CartState {
    items    : CartEntry[],
    showCart : boolean
}

const initialState: CartState = {
    items    : [],
    showCart : false,
};
export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: ({items}, {payload: {productId, quantity = 1}}: PayloadAction<CartEntry>) => {
            const existingEntry = items.find((entry) => entry.productId === productId);
            if (!existingEntry) {
                items.push({
                    productId,
                    quantity,
                });
            }
            else {
                existingEntry.quantity += quantity;
            } // if
            console.log('item added!')
        },
        clearCart: ({items}) => {
            items.splice(0);
        },
        toggleCart: (state) => {
            state.showCart = !state.showCart;
        },
    },
});



export default cartSlice.reducer;
export const { addToCart, clearCart, toggleCart } = cartSlice.actions;



// selectors:
export const selectCartTotalQuantity = (state: RootState) => {
    let counter = 0;
    for (const item of state.cart.items) counter += item.quantity;
    return counter;
};

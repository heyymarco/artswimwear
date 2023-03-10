import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { apiSlice } from './features/api/apiSlice'
import cartReducer from './features/cart/cartSlice'
import checkoutReducer from './features/checkout/checkoutSlice'
import { persistReducer, persistStore } from 'redux-persist'
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'



export const store = configureStore({
    reducer    : {
        cart                   : persistReducer({ key: 'cart'    , storage }, cartReducer    ) as unknown as typeof cartReducer,
        checkout               : persistReducer({ key: 'checkout', storage }, checkoutReducer) as unknown as typeof checkoutReducer,
        [apiSlice.reducerPath] : apiSlice.reducer,
    },
    middleware : (getDefaultMiddleware) => {
        return (
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            })
            .concat(
                apiSlice.middleware,
            )
        );
    },
    devTools   : true,
});
export const persistor = persistStore(store)



// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>

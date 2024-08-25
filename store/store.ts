import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { apiSlice } from './features/api/apiSlice'
import cartReducer from './features/cart/cartSlice'
import checkoutReducer from './features/checkout/checkoutSlice'
import { persistReducer, persistStore } from 'redux-persist'
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage/session'
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync'
// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



export const store = configureStore({
    reducer    : {
        cart                   : persistReducer({ key: 'cart'    , storage                                }, cartReducer    ) as unknown as typeof cartReducer,
        checkout               : persistReducer({ key: 'checkout', storage, blacklist: ['paymentSession'] }, checkoutReducer) as unknown as typeof checkoutReducer,
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
            .concat(
                createStateSyncMiddleware({
                    channel   : checkoutConfigClient.business.url,
                    predicate(action) {
                        const actionType = action.type;
                        // blacklist:
                        if (actionType.startsWith('cart/showCart')) return false;
                        if (actionType.startsWith('cart/hideCart')) return false;
                        
                        // whitelist:
                        if (actionType.startsWith('cart/'))         return true;
                        if (actionType.startsWith('checkout/'))     return true;
                        
                        
                        
                        // defaults to blacklist:
                        console.log('predicate: ', actionType);
                        return false;
                    },
                })
            )
        );
    },
    devTools   : true,
});
export const persistor = persistStore(store);
initMessageListener(store);



export type AppStore = typeof store

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

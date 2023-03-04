import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { apiSlice } from './features/api/apiSlice';



export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath] : apiSlice.reducer,
    },
    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(
        apiSlice.middleware,
    ),
    devTools   : true,
});



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

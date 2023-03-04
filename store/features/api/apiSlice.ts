import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery : fetchBaseQuery({
        baseUrl: '/api'
    }),
    endpoints : (builder) => ({
        getProductList: builder.query<any[], void>({
            query : () => 'product',
        }),
    }),
});



export const {
    useGetProductListQuery,
} = apiSlice;

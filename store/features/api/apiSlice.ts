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
        getProductDetail: builder.query<any[], string>({
            query : (productPath: string) => `product?path=${productPath}`,
        }),
    }),
});



export const {
    useGetProductListQuery,
    useGetProductDetailQuery,
} = apiSlice;

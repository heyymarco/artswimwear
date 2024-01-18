import { createEntityAdapter, EntityState }         from '@reduxjs/toolkit'
import type { PrefetchOptions }                     from '@reduxjs/toolkit/dist/query/core/module'
import { BaseQueryFn, createApi, fetchBaseQuery }   from '@reduxjs/toolkit/query/react'
import type { CartState }                           from '../cart/cartSlice'
import type { CheckoutState }         from '../checkout/checkoutSlice'
import type { CreateOrderData }                     from '@paypal/paypal-js'
import type { MatchingShipping, MatchingAddress }   from '@/libs/shippings'

// types:
import type {
    PaginationArgs,
    Pagination,
    
    MutationArgs,
}                           from '@/libs/types'

// apis:
import type {
    CountryPreview,
}                               from '@/app/api/countries/route'
export type {
    CountryPreview,
}                               from '@/app/api/countries/route'
import type {
    ProductPreview,
    ProductDetail,
}                               from '@/app/api/products/route'
export type {
    ProductPreview,
    ProductDetail,
}                               from '@/app/api/products/route'
import type {
    PaymentToken,
    
    // PlaceOrderOptions,
    PlaceOrderData,
    DraftOrderDetail,
    
    AuthenticationPaymentData,
    PaymentDetail,
    
    PaymentConfirmationRequest,
    PaymentConfirmationDetail,
    
    ShippingTrackingRequest,
    ShippingTrackingDetail,
}                               from '@/app/api/checkout/route'
export type {
    PaymentToken,
    
    PlaceOrderOptions,
    PlaceOrderData,
    DraftOrderDetail,
    
    AuthenticationPaymentData,
    PaymentDetail,
    
    PaymentConfirmationRequest,
    PaymentConfirmationDetail,
    
    ShippingTrackingRequest,
    ShippingTrackingDetail,
    
    LimitedStockItem,
}                               from '@/app/api/checkout/route'
import type { CustomerDetail }  from '@/app/api/(protected)/customer/route'
export type { CustomerDetail }  from '@/app/api/(protected)/customer/route'

// other libs:
import {
    default as axios,
    AxiosRequestConfig,
    CanceledError,
    AxiosError,
}                           from 'axios'



const productListAdapter = createEntityAdapter<ProductPreview>({
    selectId : (productPreview) => productPreview.id,
});

const countryListAdapter = createEntityAdapter<CountryPreview>({
    selectId : (countryEntry) => countryEntry.code,
});

const shippingListAdapter = createEntityAdapter<MatchingShipping>({
    selectId : (shippingEntry) => `${shippingEntry.id}`,
});



const axiosBaseQuery = (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
): BaseQueryFn<
    AxiosRequestConfig<any> & { body ?: {}, abortSignal?: AbortSignal },
    unknown,
    unknown
> => {
    return async ({ url, body, data, abortSignal, signal, ...restAxiosRequestConfig }) => {
        try {
            const result = await axios({
                ...restAxiosRequestConfig,
                url    : `${baseUrl}/${url}`,
                data   : data ?? body,
                signal : signal ?? abortSignal,
            });
            
            return {
                data: result.data,
            };
        }
        catch (error) {
            if (error instanceof CanceledError) {
                const canceledError = error;
                return {
                    error : {
                        status : 0, // non_standard HTTP status code: a request was aborted
                        data   : canceledError.message,
                    },
                };
            } // if
            
            
            
            let axiosError = error as AxiosError;
            return {
                error: {
                    status : axiosError.response?.status,
                    data   : axiosError.response?.data || axiosError.message,
                },
            };
        }
    };
};

export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery : axiosBaseQuery({
        baseUrl: `${process.env.WEBSITE_URL ?? ''}/api`
    }),
    endpoints : (builder) => ({
        getProductList          : builder.query<EntityState<ProductPreview>, void>({
            query : () => ({
                url    : 'products',
                method : 'GET',
            }),
            transformResponse(response: ProductPreview[]) {
                return productListAdapter.addMany(productListAdapter.getInitialState(), response);
            },
        }),
        getProductDetail        : builder.query<ProductDetail, string>({
            query : (productPath: string) => ({
                url    : `products?path=${productPath}`,
                method : 'GET',
            }),
        }),
        
        
        
        getCountryList          : builder.query<EntityState<CountryPreview>, void>({
            query : () => ({
                url    : 'countries',
                method : 'GET',
            }),
            transformResponse(response: CountryPreview[]) {
                return countryListAdapter.addMany(countryListAdapter.getInitialState(), response);
            },
        }),
        
        
        
        getMatchingShippingList : builder.mutation<EntityState<MatchingShipping>, MatchingAddress>({
            query : (address) => ({
                url    : 'shippings',
                method : 'POST',
                body   : address,
            }),
            transformResponse(response: MatchingShipping[]) {
                return shippingListAdapter.addMany(shippingListAdapter.getInitialState(), response);
            },
        }),
        
        
        
        generatePaymentToken    : builder.mutation<PaymentToken, void>({
            query : () => ({
                url    : 'checkout',
                method : 'GET',
            }),
        }),
        placeOrder              : builder.mutation<DraftOrderDetail, PlaceOrderData>({
            query : (orderData) => ({
                url    : 'checkout',
                method : 'POST',
                body   : orderData,
            }),
        }),
        makePayment             : builder.mutation<PaymentDetail, AuthenticationPaymentData>({
            query : (paymentData) => ({
                url    : 'checkout',
                method : 'PATCH',
                body   : paymentData,
            }),
        }),
        paymentConfirmation     : builder.mutation<PaymentConfirmationDetail, PaymentConfirmationRequest>({
            query : (paymentConfirmationDetail) => ({
                url    : 'checkout',
                method : 'PATCH',
                body   : paymentConfirmationDetail,
            }),
        }),
        shippingTracking        : builder.mutation<ShippingTrackingDetail, ShippingTrackingRequest>({
            query : (shippingTrackingRequest) => ({
                url    : 'checkout',
                method : 'PATCH',
                body   : shippingTrackingRequest,
            }),
        }),
        
        
        
        updateCustomer          : builder.mutation<CustomerDetail, MutationArgs<CustomerDetail>>({
            query: (patch) => ({
                url    : 'customer',
                method : 'PATCH',
                body   : patch
            }),
        }),
        availableUsername       : builder.mutation<boolean, string>({
            query: (username) => ({
                url    : `customer/check-username?username=${encodeURIComponent(username)}`, // cloned from @heymarco/next-auth, because this api was disabled in auth.config.shared
                method : 'GET',
            }),
        }),
    }),
});



export const {
    useGetProductListQuery             : useGetProductList,
    useGetProductDetailQuery           : useGetProductDetail,
    
    useGetCountryListQuery             : useGetCountryList,
    
    useGetMatchingShippingListMutation : useGetMatchingShippingList,
    
    useGeneratePaymentTokenMutation    : useGeneratePaymentToken,
    usePlaceOrderMutation              : usePlaceOrder,
    useMakePaymentMutation             : useMakePayment,
    usePaymentConfirmationMutation     : usePaymentConfirmation,
    useShippingTrackingMutation        : useShippingTracking,
    
    useUpdateCustomerMutation          : useUpdateCustomer,
    useAvailableUsernameMutation       : useAvailableUsername,
} = apiSlice;

export const usePrefetchProductList   = (options?: PrefetchOptions) => apiSlice.usePrefetch('getProductList'  , options);
export const usePrefetchProductDetail = (options?: PrefetchOptions) => apiSlice.usePrefetch('getProductDetail', options);
export const usePrefetchCountryList   = (options?: PrefetchOptions) => apiSlice.usePrefetch('getCountryList'  , options);



// // selectors:
// export const {
//     selectById : getProductPrice,
// } = priceListAdapter.getSelectors<RootState>(
//     (state) => state.api as any
// );

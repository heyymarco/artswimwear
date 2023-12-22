import { createEntityAdapter, EntityState }         from '@reduxjs/toolkit'
import type { PrefetchOptions }                     from '@reduxjs/toolkit/dist/query/core/module'
import { createApi, fetchBaseQuery }                from '@reduxjs/toolkit/query/react'
import type { CartState }                           from '../cart/cartSlice'
import type { CheckoutState }         from '../checkout/checkoutSlice'
import type { CreateOrderData }                     from '@paypal/paypal-js'
import type { MatchingShipping, MatchingAddress }   from '@/libs/shippings'

// apis:
import type {
    CountryPreview,
}                           from '@/app/api/countries/route'
export type {
    CountryPreview,
}                           from '@/app/api/countries/route'
import type {
    ProductPreview,
    ProductDetail,
}                           from '@/app/api/products/route'
export type {
    ProductPreview,
    ProductDetail,
}                           from '@/app/api/products/route'
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
}                           from '@/app/api/checkout/route'
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
    
    OutOfStockItem,
}                           from '@/app/api/checkout/route'



const productListAdapter = createEntityAdapter<ProductPreview>({
    selectId : (productPreview) => productPreview.id,
});

const countryListAdapter = createEntityAdapter<CountryPreview>({
    selectId : (countryEntry) => countryEntry.code,
});

const shippingListAdapter = createEntityAdapter<MatchingShipping>({
    selectId : (shippingEntry) => `${shippingEntry.id}`,
});



export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery : fetchBaseQuery({
        baseUrl: `${process.env.WEBSITE_URL ?? ''}/api`
    }),
    endpoints : (builder) => ({
        getProductList          : builder.query<EntityState<ProductPreview>, void>({
            query : () => 'products',
            transformResponse(response: ProductPreview[]) {
                return productListAdapter.addMany(productListAdapter.getInitialState(), response);
            },
        }),
        getProductDetail        : builder.query<ProductDetail, string>({
            query : (productPath: string) => `products?path=${productPath}`,
        }),
        
        
        
        getCountryList          : builder.query<EntityState<CountryPreview>, void>({
            query : () => 'countries',
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

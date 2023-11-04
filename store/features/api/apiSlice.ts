import { createEntityAdapter, EntityState }         from '@reduxjs/toolkit'
import type { PrefetchOptions }                     from '@reduxjs/toolkit/dist/query/core/module'
import { createApi, fetchBaseQuery }                from '@reduxjs/toolkit/query/react'
import type { CartState }                           from '../cart/cartSlice'
import type { PaymentToken, CheckoutState }         from '../checkout/checkoutSlice'
import type { CreateOrderData }                     from '@paypal/paypal-js'
import type { MatchingShipping, MatchingAddress }   from '@/libs/shippings'

// models:
import type {
    Payment,
}                           from '@prisma/client'

// apis:
import type { CountryPreview }                  from '@/app/api/countries/route'
export type { CountryPreview }                  from '@/app/api/countries/route'
export type { ShippingPreview }                 from '@/app/api/shippings/route'
import type { ProductPreview, ProductDetail}    from '@/app/api/products/route'
export type { ProductPreview, ProductDetail}    from '@/app/api/products/route'



const productListAdapter = createEntityAdapter<ProductPreview>({
    selectId : (productPreview) => productPreview.id,
});

const countryListAdapter = createEntityAdapter<CountryPreview>({
    selectId : (countryEntry) => countryEntry.code,
});

const shippingListAdapter = createEntityAdapter<MatchingShipping>({
    selectId : (shippingEntry) => `${shippingEntry.id}`,
});

export type { PaymentToken }

export interface PlaceOrderOptions extends Omit<Partial<CreateOrderData>, 'paymentSource'> {
    paymentSource ?: Partial<CreateOrderData>['paymentSource']|'manual'
}
export interface PlaceOrderData
    extends
        Omit<CartState,     // cart item(s)
            |'showCart'
        >,
        Pick<CheckoutState, // shippings
            |'shippingFirstName'
            |'shippingLastName'
            
            |'shippingPhone'
            
            |'shippingAddress'
            |'shippingCity'
            |'shippingZone'
            |'shippingZip'
            |'shippingCountry'
            
            |'shippingProvider'
        >,
        PlaceOrderOptions   // options: pay manually | paymentSource
{
}
export interface PlaceOrderResponse
{
    orderId : string
}

export interface AuthenticationPaymentData
    extends
        Pick<CheckoutState, // marketings
            |'marketingOpt'
        >,
        Pick<CheckoutState, // customers
            |'customerNickName'
            |'customerEmail'
        >,
        Pick<CheckoutState, // bilings
            |'billingFirstName'
            |'billingLastName'
            
            |'billingPhone'
            
            |'billingAddress'
            |'billingCity'
            |'billingZone'
            |'billingZip'
            |'billingCountry'
        >
{
    orderId : string
}
export interface MakePaymentResponse
{
    payment : Omit<Payment, 'billingAddress'>
}



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
                url    : 'payments',
                method : 'GET',
            }),
        }),
        placeOrder              : builder.mutation<PlaceOrderResponse, PlaceOrderData>({
            query : (orderData) => ({
                url    : 'payments',
                method : 'POST',
                body   : orderData,
            }),
        }),
        makePayment             : builder.mutation<MakePaymentResponse, AuthenticationPaymentData>({
            query : (paymentData) => ({
                url    : 'payments',
                method : 'PATCH',
                body   : paymentData,
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

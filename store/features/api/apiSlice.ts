import { createEntityAdapter, EntityState }                         from '@reduxjs/toolkit'
import type { PrefetchOptions }                                     from '@reduxjs/toolkit/dist/query/core/module'
import { BaseQueryFn, createApi, fetchBaseQuery }                   from '@reduxjs/toolkit/query/react'
import type { QuerySubState }                                       from '@reduxjs/toolkit/dist/query/core/apiState'
import type { BaseEndpointDefinition, MutationCacheLifecycleApi }   from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import type { MatchingShipping }                                    from '@/libs/shippings/shippings'

// types:
import {
    type Pagination,
    type PaginationArgs,
    type MutationArgs,
}                           from '@/libs/types'

// models:
import {
    type PlaceOrderRequest,
    
    type ShippingAddressDetail,
    type PaymentDetail,
    type FinishedOrderState,
    type CountryPreview,
    type CustomerDetail,
    
    type ShipmentRequest,
    type ShipmentDetail,
    
    type PaymentConfirmationRequest,
    type PaymentConfirmationDetail,
    
    type CustomerPreferenceData,
    type CustomerPreferenceDetail,
    
    type CartDetail,
    type CartUpdateRequest,
    type CheckoutPaymentSessionDetail,
    
    type PublicOrderDetail,
    
    type ShippingPreview,
    
    type WishlistDetail,
    type WishlistGroupDetail,
    
    type CreateWishlistGroupRequest,
    type UpdateWishlistGroupRequest,
    type DeleteWishlistGroupRequest,
    
    type GetWishlistRequest,
    type CreateOrUpdateWishlistRequest,
    type DeleteWishlistRequest,
}                           from '@/models'
export {
    type PaymentDetail,
}                           from '@/models'

// apis:
import type {
    ProductPreview,
    ProductDetail,
}                               from '@/app/api/products/route'
export type {
    VariantPreview,
    VariantDetail,
    VariantGroupDetail,
    
    ProductPreview,
    ProductDetail,
    
    ProductPricePart,
}                               from '@/app/api/products/route'
import type {
    DraftOrderDetail,
    
    // MakePaymentOptions,
    MakePaymentData,
    
    ShowOrderRequest,
}                               from '@/app/api/checkout/route'
export type {
    DraftOrderDetail,
    
    MakePaymentOptions,
    MakePaymentData,
    
    ShowOrderRequest,
    
    LimitedStockItem,
}                               from '@/app/api/checkout/route'

import type { ImageId }         from '@/app/api/(protected)/uploads/route'
export type { ImageId }         from '@/app/api/(protected)/uploads/route'

// other libs:
import {
    default as axios,
    AxiosRequestConfig,
    CanceledError,
    AxiosError,
}                           from 'axios'



const productListAdapter          = createEntityAdapter<ProductPreview>({
    selectId : (productPreview) => productPreview.id,
});
const countryListAdapter          = createEntityAdapter<CountryPreview>({
    selectId : (countryEntry) => countryEntry.code,
});
const shippingListAdapter         = createEntityAdapter<ShippingPreview>({
    selectId : (shippingPreview) => shippingPreview.id,
});
const matchingShippingListAdapter = createEntityAdapter<MatchingShipping>({
    selectId : (shippingEntry) => `${shippingEntry.id}`,
});
const wishlistGroupListAdapter    = createEntityAdapter<WishlistGroupDetail>({
    selectId : (wishlistGroup) => wishlistGroup.id,
});
const wishlistListAdapter         = createEntityAdapter<WishlistDetail['productId']>({
    selectId : (productId) => productId,
});



const axiosBaseQuery = (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
): BaseQueryFn<
    AxiosRequestConfig<any> & { body ?: {}, abortSignal?: AbortSignal },
    unknown,
    unknown
> => {
    return async ({ url, body, data, abortSignal, signal, ...restAxiosRequestConfig }, api) => {
        try {
            const result = await axios({
                ...restAxiosRequestConfig,
                url    : `${baseUrl}/${url}`,
                data   : data ?? body,
                signal : signal ?? abortSignal ?? api.signal,
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
        baseUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/api`
    }),
    tagTypes  : ['Preferences', 'WishlistGroup', 'Wishlist'],
    endpoints : (builder) => ({
        getProductList              : builder.query<EntityState<ProductPreview>, void>({
            query : () => ({
                url    : 'products',
                method : 'GET',
            }),
            transformResponse(response: ProductPreview[]) {
                return productListAdapter.addMany(productListAdapter.getInitialState(), response);
            },
        }),
        getProductDetail            : builder.query<ProductDetail, string>({
            query : (productPath: string) => ({
                url    : `products?path=${productPath}`,
                method : 'GET',
            }),
        }),
        
        
        
        getShippingList             : builder.query<EntityState<ShippingPreview>, void>({
            query : () => ({
                url    : 'shippings',
                method : 'GET',
            }),
            transformResponse(response: ShippingPreview[]) {
                return shippingListAdapter.addMany(shippingListAdapter.getInitialState(), response);
            },
        }),
        getCountryList              : builder.query<EntityState<CountryPreview>, void>({
            query : () => ({
                url    : 'shippings/countries',
                method : 'GET',
            }),
            transformResponse(response: CountryPreview[]) {
                return countryListAdapter.addMany(countryListAdapter.getInitialState(), response);
            },
        }),
        getStateList                : builder.query<string[], { countryCode: string }>({
            query : ({countryCode}) => ({
                url    : `shippings/states?countryCode=${encodeURIComponent(countryCode)}`,
                method : 'GET',
            }),
        }),
        getCityList                 : builder.query<string[], { countryCode: string, state: string }>({
            query : ({countryCode, state}) => ({
                url    : `shippings/cities?countryCode=${encodeURIComponent(countryCode)}&state=${encodeURIComponent(state)}`,
                method : 'GET',
            }),
        }),
        
        
        
        getMatchingShippingList     : builder.query<EntityState<MatchingShipping>, ShippingAddressDetail & { totalProductWeight: number }>({
            query : (shippingAddressDetail) => ({
                url    : 'matching-shippings',
                method : 'POST',
                body   : shippingAddressDetail,
            }),
            transformResponse(response: MatchingShipping[]) {
                return matchingShippingListAdapter.addMany(matchingShippingListAdapter.getInitialState(), response);
            },
        }),
        refreshMatchingShippingList : builder.mutation<EntityState<MatchingShipping>, ShippingAddressDetail & { totalProductWeight: number }>({
            query : (shippingAddressDetail) => ({
                url    : 'matching-shippings',
                method : 'PATCH',
                body   : shippingAddressDetail,
            }),
            transformResponse(response: MatchingShipping[]) {
                return matchingShippingListAdapter.addMany(matchingShippingListAdapter.getInitialState(), response);
            },
            
            async onCacheEntryAdded(arg, api) {
                // updated TEntry data:
                const { data: mutatedEntities } = await api.cacheDataLoaded;
                
                
                
                // find related TEntry data(s):
                const state          = api.getState();
                const allQueryCaches = state.api.queries;
                const endpointName   = 'getMatchingShippingList';
                const queryCaches    = (
                    Object.values(allQueryCaches)
                    .filter((allQueryCache): allQueryCache is QuerySubState<BaseEndpointDefinition<ShippingAddressDetail, BaseQueryFn<AxiosRequestConfig<any>>, EntityState<MatchingShipping>>> =>
                        !!allQueryCache
                        &&
                        (allQueryCache.endpointName === endpointName)
                    )
                );
                
                
                
                const currentQueryCaches = (
                    queryCaches
                    .filter(({originalArgs}) =>
                        !!originalArgs
                        &&
                        (originalArgs.country   === arg.country)
                        &&
                        (originalArgs.state     === arg.state)
                        &&
                        (originalArgs.city      === arg.city)
                        &&
                        (originalArgs.zip       === arg.zip)
                        
                        // not contributing of determining shipping cost:
                        // &&
                        // (originalArgs.address   === arg.address)
                        // 
                        // &&
                        // 
                        // (originalArgs.firstName === arg.firstName)
                        // &&
                        // (originalArgs.lastName  === arg.lastName)
                        // &&
                        // (originalArgs.phone     === arg.phone)
                    )
                );
                
                // reconstructuring the mutated pagination, so the invalidatesTag can be avoided:
                if (currentQueryCaches.length) {
                    for (const currentQueryCache of currentQueryCaches) {
                        // update cache:
                        api.dispatch(
                            apiSlice.util.updateQueryData(endpointName, currentQueryCache.originalArgs as any, (currentQueryCacheData) => {
                                const currentDynamicRates = (
                                    (Object.values(currentQueryCacheData.entities) as MatchingShipping[])
                                    .filter((entity): entity is Exclude<typeof entity, undefined> => (entity !== undefined))
                                    .filter((matchingShipping) =>
                                        Array.isArray(matchingShipping.rates) // do not delete dynamic rates
                                    )
                                );
                                const combinedRates = [
                                    ...currentDynamicRates,
                                    ...(Object.values(mutatedEntities.entities) as MatchingShipping[])
                                ];
                                const newData = matchingShippingListAdapter.addMany(matchingShippingListAdapter.getInitialState(), combinedRates);
                                return newData;
                            })
                        );
                    } // for
                } // if
            },
        }),
        
        
        
        restoreCart                 : builder.query<(CartDetail & Pick<CustomerPreferenceDetail, 'marketingOpt'>)|null, void>({
            query : () => ({
                url    : 'cart',
                method : 'GET',
            }),
        }),
        backupCart                  : builder.mutation<void, CartUpdateRequest>({
            query : (cartRequest) => ({
                url    : 'cart',
                method : 'PATCH',
                body   : cartRequest,
            }),
            
            async onCacheEntryAdded(arg, api) {
                // find related TEntry data(s):
                const state          = api.getState();
                const allQueryCaches = state.api.queries;
                const endpointName   = 'restoreCart';
                const queryCaches    = (
                    Object.values(allQueryCaches)
                    .filter((allQueryCache): allQueryCache is QuerySubState<BaseEndpointDefinition<ShippingAddressDetail, BaseQueryFn<AxiosRequestConfig<any>>, EntityState<MatchingShipping>>> =>
                        !!allQueryCache
                        &&
                        (allQueryCache.endpointName === endpointName)
                    )
                );
                
                
                
                const currentQueryCaches = (
                    queryCaches
                    // assumes there's only ONE kind call of `restoreCart(no_arg)`, so we not need to `filter()`
                );
                
                // reconstructuring the mutated pagination, so the invalidatesTag can be avoided:
                if (currentQueryCaches.length) {
                    for (const currentQueryCache of currentQueryCaches) {
                        // update cache:
                        api.dispatch(
                            apiSlice.util.updateQueryData(endpointName, currentQueryCache.originalArgs as any, (currentQueryCacheData) => {
                                const {
                                    checkout = (currentQueryCacheData?.checkout ?? null),
                                    marketingOpt,
                                    ...restBackupData
                                } = arg;
                                
                                
                                
                                const newRestore : (CartDetail & Pick<CustomerPreferenceDetail, 'marketingOpt'>) = {
                                    checkout,
                                    marketingOpt : marketingOpt ?? null,
                                    ...restBackupData,
                                };
                                return newRestore;
                            })
                        );
                    } // for
                } // if
            },
        }),
        
        
        
        generatePaymentSession      : builder.query<CheckoutPaymentSessionDetail, void>({
            query : () => ({
                url    : 'checkout',
                method : 'GET',
            }),
        }),
        placeOrder                  : builder.mutation<DraftOrderDetail|PaymentDetail, PlaceOrderRequest>({
            query : (orderData) => ({
                url    : 'checkout',
                method : 'POST',
                body   : orderData,
            }),
        }),
        makePayment                 : builder.mutation<PaymentDetail, MakePaymentData>({
            query : (paymentData) => ({
                url    : 'checkout',
                method : 'PATCH',
                body   : paymentData,
            }),
        }),
        showPrevOrder               : builder.mutation<FinishedOrderState, ShowOrderRequest>({
            query : ({orderId}) => ({
                url    : `checkout?orderId=${encodeURIComponent(orderId)}`,
                method : 'PUT',
            }),
        }),
        paymentConfirmation         : builder.mutation<PaymentConfirmationDetail, PaymentConfirmationRequest>({
            query : (paymentConfirmationDetail) => ({
                url    : 'checkout/payment-confirmation',
                method : 'POST',
                body   : paymentConfirmationDetail,
            }),
        }),
        getShipment                 : builder.query<ShipmentDetail, ShipmentRequest>({
            query : (shipmentRequest) => ({
                url    : 'checkout/shipment',
                method : 'POST',
                body   : shipmentRequest,
            }),
        }),
        
        
        
        updateCustomer              : builder.mutation<CustomerDetail, MutationArgs<CustomerDetail>>({
            query: (patch) => ({
                url    : 'customer',
                method : 'PATCH',
                body   : patch
            }),
        }),
        availableUsername           : builder.query<boolean, string>({
            query: (username) => ({
                url    : `customer/check-username?username=${encodeURIComponent(username)}`, // cloned from @heymarco/next-auth, because this api was disabled in auth.config.shared
                method : 'GET',
            }),
        }),
        notProhibitedUsername       : builder.query<boolean, string>({
            query: (username) => ({
                url    : `customer/check-username?username=${encodeURIComponent(username)}`, // cloned from @heymarco/next-auth, because this api was disabled in auth.config.shared
                method : 'PUT',
            }),
        }),
        
        getOrderHistoryPage         : builder.query<Pagination<PublicOrderDetail>, PaginationArgs>({
            query : (paginationArg) => ({
                url    : 'order-history',
                method : 'POST',
                body   : paginationArg,
            }),
        }),
        
        
        
        getPreference               : builder.query<CustomerPreferenceDetail, void>({
            query : () => ({
                url    : 'preferences',
                method : 'GET',
            }),
            providesTags: (result, error, page)  => {
                return [
                    {
                        type : 'Preferences',
                        id   : 'PREFERENCES',
                    },
                ];
            },
        }),
        updatePreference            : builder.mutation<CustomerPreferenceDetail, Partial<CustomerPreferenceData>>({
            query: (patch) => ({
                url    : 'preferences',
                method : 'PATCH',
                body   : patch
            }),
            invalidatesTags: (preference, error, arg) => [
                {
                    type : 'Preferences',
                    id   : 'PREFERENCES',
                },
            ],
        }),
        
        postImage                   : builder.mutation<ImageId, { image: File, folder?: string, onUploadProgress?: (percentage: number) => void, abortSignal?: AbortSignal }>({
            query: ({ image, folder, onUploadProgress, abortSignal }) => ({
                url     : 'uploads',
                method  : 'POST',
                headers : { 'content-type': 'multipart/form-data' },
                body    : ((): FormData => {
                    const formData = new FormData();
                    formData.append('image' , image);
                    if (folder) formData.append('folder', folder);
                    return formData;
                })(),
                onUploadProgress(event) {
                    onUploadProgress?.(
                        (event.loaded * 100) / (event.total ?? 100)
                    );
                },
                abortSignal,
            }),
        }),
        deleteImage                 : builder.mutation<ImageId[], { imageId: string[] }>({
            query: ({ imageId }) => ({
                url     : 'uploads',
                method  : 'PATCH',
                body    : {
                    image : imageId,
                },
            }),
        }),
        
        getWishlistGroups           : builder.query<EntityState<WishlistGroupDetail>, void>({
            query: () => ({
                url         : 'wishlists/groups',
                method      : 'GET',
            }),
            transformResponse(response: WishlistGroupDetail[]) {
                return wishlistGroupListAdapter.addMany(wishlistGroupListAdapter.getInitialState(), response);
            },
            providesTags    : (wishlistGroupList, error, arg) => !wishlistGroupList ? [] : wishlistGroupList.ids.map((id) => ({
                type : 'WishlistGroup',
                id   : `${id}`,
            })),
        }),
        createWishlistGroup         : builder.mutation<WishlistGroupDetail, CreateWishlistGroupRequest>({
            query: (arg) => ({
                url         : 'wishlists/groups',
                method      : 'POST',
                body        : arg,
            }),
            invalidatesTags : (wishlistGroup, error, arg) => !wishlistGroup ? [] : [{
                type        : 'WishlistGroup',
                id          : wishlistGroup.id,
            }],
        }),
        updateWishlistGroup         : builder.mutation<WishlistGroupDetail, UpdateWishlistGroupRequest>({
            query: (arg) => ({
                url         : 'wishlists/groups',
                method      : 'PATCH',
                body        : arg,
            }),
            invalidatesTags : (wishlistGroup, error, arg) => !wishlistGroup ? [] : [{
                type        : 'WishlistGroup',
                id          : wishlistGroup.id,
            }],
        }),
        deleteWishlistGroup         : builder.mutation<WishlistGroupDetail, DeleteWishlistGroupRequest>({
            query: (arg) => ({
                url         : `wishlists/groups?id=${encodeURIComponent(arg.id)}`,
                method      : 'DELETE',
            }),
            invalidatesTags : (wishlistGroup, error, arg) => !wishlistGroup ? [] : [{
                type        : 'WishlistGroup',
                id          : wishlistGroup.id,
            }],
        }),
        
        getWishlists                : builder.query<EntityState<WishlistDetail['productId']>, GetWishlistRequest>({
            query: ({groupId}) => ({
                url         : `wishlists?groupId=${(groupId === null) ? null : encodeURIComponent(groupId)}`,
                method      : 'GET',
            }),
            transformResponse(response: WishlistDetail['productId'][]) {
                return wishlistListAdapter.addMany(wishlistListAdapter.getInitialState(), response);
            },
            providesTags    : (wishlistList, error, arg) => !wishlistList ? [] : wishlistList.ids.map((id) => ({
                type : 'Wishlist',
                id   : `${id}`,
            })),
        }),
        updateWishlist              : builder.mutation<WishlistDetail['productId'], CreateOrUpdateWishlistRequest>({
            query: (arg) => ({
                url         : 'wishlists',
                method      : 'PATCH',
                body        : arg,
            }),
            invalidatesTags : (productIds, error, arg) => !productIds ? [] : [{
                type        : 'Wishlist',
                id          : productIds,
            }],
        }),
        deleteWishlist              : builder.mutation<WishlistDetail['productId'], DeleteWishlistRequest>({
            query: (arg) => ({
                url         : `wishlists?id=${encodeURIComponent(arg.productId)}`,
                method      : 'DELETE',
            }),
            invalidatesTags : (productIds, error, arg) => !productIds ? [] : [{
                type        : 'Wishlist',
                id          : productIds,
            }],
        }),
    }),
});



export const {
    useGetProductListQuery                 : useGetProductList,
    useGetProductDetailQuery               : useGetProductDetail,
    
    useGetShippingListQuery                : useGetShippingList,
    useGetCountryListQuery                 : useGetCountryList,
    // useLazyGetStateListQuery               : useGetStateList,
    // useLazyGetCityListQuery                : useGetCityList,
    
    useLazyGetMatchingShippingListQuery    : useGetMatchingShippingList,
    useRefreshMatchingShippingListMutation : useRefreshMatchingShippingList,
    
    // useLazyRestoreCartQuery                : useRestoreCart,
    // useBackupCartMutation                  : useBackupCart,
    useLazyGeneratePaymentSessionQuery     : useGeneratePaymentSession,
    // usePlaceOrderMutation                  : usePlaceOrder,
    // useMakePaymentMutation                 : useMakePayment,
    useShowPrevOrderMutation               : useShowPrevOrder,
    usePaymentConfirmationMutation         : usePaymentConfirmation,
    useLazyGetShipmentQuery                : useGetShipment,
    
    useUpdateCustomerMutation              : useUpdateCustomer,
    useLazyAvailableUsernameQuery          : useAvailableUsername,
    useLazyNotProhibitedUsernameQuery      : useNotProhibitedUsername,
    // useLazyAvailableEmailQuery             : useAvailableEmail, // TODO
    
    useGetOrderHistoryPageQuery            : useGetOrderHistoryPage,
    
    useGetPreferenceQuery                  : useGetPreference,
    useUpdatePreferenceMutation            : useUpdatePreference,
    
    usePostImageMutation                   : usePostImage,
    useDeleteImageMutation                 : useDeleteImage,
    
    useGetWishlistGroupsQuery              : useGetWishlistGroups,
    useCreateWishlistGroupMutation         : useCreateWishlistGroup,
    useUpdateWishlistGroupMutation         : useUpdateWishlistGroup,
    useDeleteWishlistGroupMutation         : useDeleteWishlistGroup,
    
    useGetWishlistsQuery                   : useGetWishlists,
    useUpdateWishlistMutation              : useUpdateWishlist,
    useDeleteWishlistMutation              : useDeleteWishlist,
} = apiSlice;

export const {
    restoreCart    : { initiate : restoreCart    },
    backupCart     : { initiate : backupCart     },
    placeOrder     : { initiate : placeOrder     },
    makePayment    : { initiate : makePayment    },
    
    getCountryList : { initiate : getCountryList },
    getStateList   : { initiate : getStateList   },
    getCityList    : { initiate : getCityList    },
} = apiSlice.endpoints;

export const usePrefetchProductList   = (options?: PrefetchOptions) => apiSlice.usePrefetch('getProductList'  , options);
export const usePrefetchProductDetail = (options?: PrefetchOptions) => apiSlice.usePrefetch('getProductDetail', options);
export const usePrefetchCountryList   = (options?: PrefetchOptions) => apiSlice.usePrefetch('getCountryList'  , options);



// // selectors:
// export const {
//     selectById : getProductPrice,
// } = priceListAdapter.getSelectors<RootState>(
//     (state) => state.api as any
// );

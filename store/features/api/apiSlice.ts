// redux:
import {
    type EntityState,
    
    createEntityAdapter,
}                           from '@reduxjs/toolkit'
import {
    type BaseQueryFn,
    
    createApi,
}                           from '@reduxjs/toolkit/query/react'
import {
    type MutationLifecycleApi,
}                           from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import {
    type PrefetchOptions,
}                           from '@reduxjs/toolkit/dist/query/core/module'

// types:
import {
    type MatchingShipping,
}                           from '@/libs/shippings/shippings'

// models:
import {
    type Model,
    
    type PaginationArgs,
    type Pagination,
    
    type MutationArgs,
    
    type ProductPreview,
    type ProductDetail,
    
    type ShippingPreview,
    type ShippingAddressDetail,
    type CountryPreview,
    
    type PaymentDetail,
    type PublicOrderDetail,
    
    type PaymentConfirmationRequest,
    type PaymentConfirmationDetail,
    
    type ShipmentRequest,
    type ShipmentDetail,
    
    type CustomerDetail,
    type CustomerPreferenceData,
    type CustomerPreferenceDetail,
    
    type CartDetail,
    type CartUpdateRequest,
    type CheckoutPaymentSessionDetail,
    
    type FinishedOrderState,
    type PlaceOrderRequest,
    type PlaceOrderDetail,
    type MakePaymentRequest,
    type ShowOrderRequest,
    
    type WishDetail,
    type WishGroupDetail,
    
    type UpdateWishGroupRequest,
    type DeleteWishGroupRequest,
    
    type GetWishPageRequest,
    type GetWishPageResponse,
    type CreateOrUpdateWishRequest,
    type DeleteWishRequest,
}                           from '@/models'

import {
    type ImageId,
}                               from '@/app/api/(protected)/uploads/route'

// other libs:
import {
    type AxiosRequestConfig,
    type AxiosError,
    
    default as axios,
    CanceledError,
}                           from 'axios'



const countryListAdapter          = createEntityAdapter<CountryPreview>({
    selectId : (countryEntry) => countryEntry.code,
});
const shippingListAdapter         = createEntityAdapter<ShippingPreview>({
    selectId : (shippingPreview) => shippingPreview.id,
});
const matchingShippingListAdapter = createEntityAdapter<MatchingShipping>({
    selectId : (shippingEntry) => `${shippingEntry.id}`,
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
    tagTypes  : ['ProductPage', 'Wishable', 'PreferenceData', 'WishGroupPage', 'WishPage', 'OfWishGroupable'],
    endpoints : (builder) => ({
        getProductPage              : builder.query<Pagination<ProductPreview>, PaginationArgs>({
            query: (arg) => ({
                url    : 'products',
                method : 'POST',
                body   : arg,
            }),
            providesTags: (data, error, arg) => [
                { type: 'ProductPage', id: arg.page },
                
                ...(data?.entities ?? []).map(({ id }) =>
                    ({ type: 'Wishable', id: id })
                ) satisfies { type: 'Wishable', id: string }[],
            ],
        }),
        
        getProductPreview           : builder.query<ProductPreview, string>({
            query : (arg: string) => ({
                url    : `products?id=${encodeURIComponent(arg)}`,
                method : 'GET',
            }),
            providesTags: (data, error, arg) => [{ type: 'Wishable', id: arg }],
        }),
        getProductDetail            : builder.query<ProductDetail, string>({
            query : (arg: string) => ({
                url    : `products?path=${encodeURIComponent(arg)}`,
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
            
            onQueryStarted: async (arg, api) => {
                // updated TEntry data:
                const { data: mutatedEntities } = await api.queryFulfilled;
                
                
                
                // find related TEntry data(s):
                const state          = api.getState();
                const allQueryCaches = state.api.queries;
                const endpointName   = 'getMatchingShippingList';
                const queryCaches    = (
                    Object.values(allQueryCaches)
                    .filter((allQueryCache): allQueryCache is Exclude<typeof allQueryCache, undefined> =>
                        (allQueryCache !== undefined)
                        &&
                        (allQueryCache.endpointName === endpointName)
                        &&
                        (allQueryCache.data !== undefined)
                    )
                );
                
                
                
                const updatedCollectionQueryCaches = (
                    queryCaches
                    .filter(({originalArgs}) =>
                        (originalArgs !== undefined)
                        &&
                        ((originalArgs as ShippingAddressDetail).country   === arg.country)
                        &&
                        ((originalArgs as ShippingAddressDetail).state     === arg.state)
                        &&
                        ((originalArgs as ShippingAddressDetail).city      === arg.city)
                        &&
                        ((originalArgs as ShippingAddressDetail).zip       === arg.zip)
                        
                        // not contributing of determining shipping cost:
                        // &&
                        // ((originalArgs as ShippingAddressDetail).address   === arg.address)
                        // 
                        // &&
                        // 
                        // ((originalArgs as ShippingAddressDetail).firstName === arg.firstName)
                        // &&
                        // ((originalArgs as ShippingAddressDetail).lastName  === arg.lastName)
                        // &&
                        // ((originalArgs as ShippingAddressDetail).phone     === arg.phone)
                    )
                );
                
                // reconstructuring the mutated entry, so the invalidatesTag can be avoided:
                for (const { originalArgs } of updatedCollectionQueryCaches) {
                    api.dispatch(
                        apiSlice.util.updateQueryData(endpointName, originalArgs as any, (currentQueryCacheData) => {
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
            
            onQueryStarted: async (arg, api) => {
                // find related TEntry data(s):
                const state          = api.getState();
                const allQueryCaches = state.api.queries;
                const endpointName   = 'restoreCart';
                const queryCaches    = (
                    Object.values(allQueryCaches)
                    .filter((allQueryCache): allQueryCache is Exclude<typeof allQueryCache, undefined> =>
                        (allQueryCache !== undefined)
                        &&
                        (allQueryCache.endpointName === endpointName)
                        &&
                        (allQueryCache.data !== undefined)
                    )
                );
                
                
                
                const updatedCollectionQueryCaches = (
                    queryCaches
                    // assumes there's only ONE kind call of `restoreCart(no_arg)`, so we not need to `filter()`
                );
                
                // reconstructuring the mutated entry, so the invalidatesTag can be avoided:
                for (const { originalArgs } of updatedCollectionQueryCaches) {
                    api.dispatch(
                        apiSlice.util.updateQueryData(endpointName, originalArgs as any, (currentQueryCacheData) => {
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
            },
        }),
        
        
        
        generatePaymentSession      : builder.query<CheckoutPaymentSessionDetail, void>({
            query : () => ({
                url    : 'checkout',
                method : 'GET',
            }),
        }),
        placeOrder                  : builder.mutation<PlaceOrderDetail|PaymentDetail, PlaceOrderRequest>({
            query : (orderData) => ({
                url    : 'checkout',
                method : 'POST',
                body   : orderData,
            }),
        }),
        makePayment                 : builder.mutation<PaymentDetail, MakePaymentRequest>({
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
            query : (arg) => ({
                url    : 'customer/order-history',
                method : 'POST',
                body   : arg,
            }),
        }),
        
        
        
        getPreference               : builder.query<CustomerPreferenceDetail, void>({
            query : () => ({
                url    : 'customer/preferences',
                method : 'GET',
            }),
            providesTags: ['PreferenceData'],
        }),
        updatePreference            : builder.mutation<CustomerPreferenceDetail, Partial<CustomerPreferenceData>>({
            query: (patch) => ({
                url    : 'customer/preferences',
                method : 'PATCH',
                body   : patch
            }),
            invalidatesTags: ['PreferenceData'],
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
        
        
        
        getWishGroupPage            : builder.query<Pagination<WishGroupDetail>, PaginationArgs>({
            query: (arg) => ({
                url         : 'customer/wishes/groups',
                method      : 'POST',
                body   : arg,
            }),
            providesTags: (data, error, arg) => [{ type: 'WishGroupPage', id: arg.page }],
        }),
        updateWishGroup             : builder.mutation<WishGroupDetail, UpdateWishGroupRequest>({
            query: (arg) => ({
                url         : 'customer/wishes/groups',
                method      : 'PATCH',
                body        : arg,
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getWishGroupPage', (arg.id === '') ? 'CREATE' : 'UPDATE', 'WishGroupPage');
            },
        }),
        deleteWishGroup             : builder.mutation<WishGroupDetail, DeleteWishGroupRequest>({
            query: (arg) => ({
                url         : `customer/wishes/groups?id=${encodeURIComponent(arg.id)}&deleteBoth=${encodeURIComponent(arg.deleteBoth ?? false)}`,
                method      : 'DELETE',
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getWishGroupPage', 'DELETE', 'WishGroupPage');
            },
            invalidatesTags: (data, error, arg) => [
                // invalidate the related_affected_pagination_of_wishGroup (specific wishGroup):
                { type: 'OfWishGroupable', id: arg.id /* `string`: grouped wishes */ },
                
                // if deleteBoth is checked => affects the related_affected_wish and the all_wishes_wishGroup:
                ...((!arg.deleteBoth ? [] : [
                    // because the related_affected_wishes are UNKNOWN, we simply invalidate ALL wishes:
                    'Wishable',
                    
                    // invalidate the related_affected_pagination_of_wishGroup (all wishes wishGroup):
                    { type: 'OfWishGroupable', id: undefined /* `undefined`: all wishes (grouped + ungrouped) */ },
                ]) satisfies ({ type: 'OfWishGroupable', id: undefined }|'Wishable')[]),
            ],
        }),
        availableWishGroupName      : builder.query<boolean, string>({
            query: (arg) => ({
                url    : `customer/wishes/groups/check-name?name=${encodeURIComponent(arg)}`,
                method : 'GET',
            }),
        }),
        
        
        
        getWishPage                 : builder.query<GetWishPageResponse, PaginationArgs & GetWishPageRequest>({
            query: (arg) => ({
                url         : 'customer/wishes',
                method      : 'POST',
                body        : arg,
            }),
            providesTags: (data, error, arg) => [
                { type: 'WishPage'       , id: arg.page    },
                { type: 'OfWishGroupable', id: arg.groupId },
                
                ...(data?.entities ?? []).map(({ id }) =>
                    ({ type: 'Wishable', id: id })
                ) satisfies { type: 'Wishable', id: string }[],
            ],
        }),
        updateWish                  : builder.mutation<WishDetail['productId'], CreateOrUpdateWishRequest & { originalGroupId: string|null }>({
            query: (arg) => ({
                url         : 'customer/wishes',
                method      : 'PATCH',
                body        : arg,
            }),
            onQueryStarted: async (arg, api) => {
                //#region optimistic update
                /*
                const patchResult = api.dispatch(
                    apiSlice.util.updateQueryData('getWishes', undefined, (data) => {
                        // conditions:
                        if (data.ids.includes(arg.productId)) return; // already added => no need to update => nothing to do
                        
                        
                        
                        // update:
                        wishListAdapter.upsertOne(data, arg.productId);
                    })
                );
                api.queryFulfilled.catch(() => {
                    patchResult.undo();
                    
                    api.dispatch(
                        apiSlice.util.invalidateTags(['WishPage'])
                    );
                });
                */
                
                // update related_affected_wish in `getProductPage`:
                const wishedProduct : Pick<ProductPreview, 'id'|'wished'> = { id: arg.productId, wished: arg.groupId };
                cumulativeUpdatePaginationCache(api, 'getProductPage'    , 'UPDATE', 'ProductPage', { providedMutatedEntry: wishedProduct as any });
                
                // update related_affected_wish in `getProductPreview`:
                api.dispatch(
                    apiSlice.util.updateQueryData('getProductPreview', arg.productId, (data) => {
                        data.wished = arg.groupId;
                    })
                );
                
                // upsert related_affected_pagination_of_wishGroup in `getWishPage('all')`:
                cumulativeUpdatePaginationCache(api, 'getWishPage'       , 'UPDATE_OR_INVALIDATE', 'WishPage'   , { providedMutatedEntry: wishedProduct as any, predicate: (originalArgs: unknown) => ((originalArgs as GetWishPageRequest).groupId === undefined) });
                if (arg.groupId) { // if the user select the OPTIONAL WishGroup => add to WishGroup too
                    // upsert related_affected_pagination_of_wishGroup in `getWishPage('to_group_id')`:
                    cumulativeUpdatePaginationCache(api, 'getWishPage'       , 'UPDATE_OR_INVALIDATE', 'WishPage'   , { providedMutatedEntry: wishedProduct as any, predicate: (originalArgs: unknown) => ((originalArgs as GetWishPageRequest).groupId === arg.groupId) });
                } // if
                if (arg.originalGroupId && (arg.originalGroupId !== arg.groupId)) { // if the wish is MOVED from old_group to new_group => DELETE the wish from old_group
                    // upsert related_affected_pagination_of_wishGroup in `getWishPage('from_group_id')`:
                    cumulativeUpdatePaginationCache(api, 'getWishPage'       , 'DELETE', 'WishPage'   , { providedMutatedEntry: wishedProduct as any, predicate: (originalArgs: unknown) => ((originalArgs as GetWishPageRequest).groupId === arg.originalGroupId) });
                } // if
                
                
                
                // when the optimistic update fails => invalidates the related_affected_wish and the related_affected_wishGroup:
                api.queryFulfilled.catch(() => {
                    api.dispatch(
                        apiSlice.util.invalidateTags([
                            // invalidate the related_affected_wish:
                            { type: 'Wishable'       , id: arg.productId },
                            
                            // invalidate the related_affected_pagination_of_wishGroup:
                            { type: 'OfWishGroupable', id: undefined     },
                            ...(((arg.groupId)                                                  ? [{ type: 'OfWishGroupable', id: arg.groupId         }] : []) satisfies { type: 'OfWishGroupable', id: string }[]),
                            ...(((arg.originalGroupId && (arg.originalGroupId !== arg.groupId)) ? [{ type: 'OfWishGroupable', id: arg.originalGroupId }] : []) satisfies { type: 'OfWishGroupable', id: string }[]),
                        ])
                    );
                });
                //#endregion optimistic update
            },
        }),
        deleteWish                  : builder.mutation<WishDetail['productId'], DeleteWishRequest & { originalGroupId: string|null }>({
            query: (arg) => ({
                url         : `customer/wishes?productId=${encodeURIComponent(arg.productId)}`,
                method      : 'DELETE',
            }),
            onQueryStarted: async (arg, api) => {
                //#region optimistic update
                /*
                const patchResult = api.dispatch(
                    apiSlice.util.updateQueryData('getWishes', undefined, (data) => {
                        // conditions:
                        if (!data.ids.includes(arg.productId)) return; // already removed => no need to update => nothing to do
                        
                        
                        
                        // update:
                        wishListAdapter.removeOne(data, arg.productId);
                    })
                );
                api.queryFulfilled.catch(() => {
                    patchResult.undo();
                    
                    api.dispatch(
                        apiSlice.util.invalidateTags(['WishPage'])
                    );
                });
                */
                
                // update related_affected_wish in `getProductPage`:
                const unwishedProduct : Pick<ProductPreview, 'id'|'wished'> = { id: arg.productId, wished: undefined };
                cumulativeUpdatePaginationCache(api, 'getProductPage'    , 'UPDATE', 'ProductPage', { providedMutatedEntry: unwishedProduct as any });
                
                // update related_affected_wish in `getProductPreview`:
                api.dispatch(
                    apiSlice.util.updateQueryData('getProductPreview', arg.productId, (data) => {
                        data.wished = undefined;
                    })
                );
                
                // delete related_affected_pagination_of_wishGroup in `getWishPage('all')`:
                cumulativeUpdatePaginationCache(api, 'getWishPage'       , 'DELETE', 'WishPage'   , { providedMutatedEntry: unwishedProduct as any, predicate: (originalArgs: unknown) => ((originalArgs as GetWishPageRequest).groupId === undefined) });
                if (arg.originalGroupId) { // if the wish is having existing_group => DELETE the wish from existing_group
                    // delete related_affected_pagination_of_wishGroup in `getWishPage('from_group_id')`:
                    cumulativeUpdatePaginationCache(api, 'getWishPage'       , 'DELETE', 'WishPage'   , { providedMutatedEntry: unwishedProduct as any, predicate: (originalArgs: unknown) => ((originalArgs as GetWishPageRequest).groupId === arg.originalGroupId) });
                } // if
                
                
                
                // when the optimistic update fails => invalidates the related_affected_wish and the related_affected_wishGroup:
                api.queryFulfilled.catch(() => {
                    api.dispatch(
                        apiSlice.util.invalidateTags([
                            // invalidate the related_affected_wish:
                            { type: 'Wishable'       , id: arg.productId },
                            
                            // invalidate the related_affected_pagination_of_wishGroup:
                            { type: 'OfWishGroupable', id: undefined     },
                            ...(((arg.originalGroupId) ? [{ type: 'OfWishGroupable', id: arg.originalGroupId }] : []) satisfies { type: 'OfWishGroupable', id: string }[]),
                        ])
                    );
                });
                //#endregion optimistic update
            },
        }),
    }),
});



export const {
    useGetProductPageQuery                 : useGetProductPage,
    
    useGetProductPreviewQuery              : useGetProductPreview,
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
    
    
    
    useGetWishGroupPageQuery               : useGetWishGroupPage,
    useUpdateWishGroupMutation             : useUpdateWishGroup,
    useDeleteWishGroupMutation             : useDeleteWishGroup,
    useLazyAvailableWishGroupNameQuery     : useAvailableWishGroupName,
    
    
    
    useGetWishPageQuery                    : useGetWishPage,
    useUpdateWishMutation                  : useUpdateWish,
    useDeleteWishMutation                  : useDeleteWish,
} = apiSlice;

export const {
    getProductPreview : { initiate : getProductPreview },
    
    
    
    getCountryList    : { initiate : getCountryList    },
    getStateList      : { initiate : getStateList      },
    getCityList       : { initiate : getCityList       },
    
    
    
    restoreCart       : { initiate : restoreCart       },
    backupCart        : { initiate : backupCart        },
    
    
    
    placeOrder        : { initiate : placeOrder        },
    makePayment       : { initiate : makePayment       },
} = apiSlice.endpoints;

export const usePrefetchProductDetail = (options?: PrefetchOptions) => apiSlice.usePrefetch('getProductDetail', options);
export const usePrefetchCountryList   = (options?: PrefetchOptions) => apiSlice.usePrefetch('getCountryList'  , options);



// utilities:
const selectTotalFromData   = (data: unknown): number => {
    return (
        ('ids' in (data as EntityState<unknown>|Pagination<unknown>))
        ? (data as EntityState<unknown>).ids.length
        : (data as Pagination<unknown>).total
    );
};
const selectEntriesFromData = <TEntry extends Model|string>(data: unknown): TEntry[] => {
    const items = (
        ('ids' in (data as EntityState<TEntry>|Pagination<TEntry>))
        ? Object.values((data as EntityState<TEntry>).entities).filter((entity) : entity is Exclude<typeof entity, undefined> => (entity !== undefined))
        : (data as Pagination<TEntry>).entities
    );
    return items;
};
const selectIdFromEntry     = <TEntry extends Model|string>(entry: TEntry): string => {
    return (typeof(entry) === 'string') ? entry : entry.id;
};
const selectIndexOfId       = <TEntry extends Model|string>(data: unknown, id: string): number => {
    return (
        ('ids' in (data as EntityState<TEntry>|Pagination<TEntry>))
        ? (
            (data as EntityState<TEntry>).ids
            .findIndex((searchId) =>
                (searchId === id)
            )
        )
        : (
            (data as Pagination<TEntry>).entities
            .findIndex((searchEntry) =>
                (selectIdFromEntry<TEntry>(searchEntry) === id)
            )
        )
    );
};
const selectRangeFromArg    = (originalArg: unknown): { indexStart: number, indexEnd: number, page: number, perPage: number } => {
    const paginationArgs = originalArg as PaginationArgs;
    const {
        page,
        perPage,
    } = paginationArgs;
    
    
    
    /*
        index   [page, perpage]     indexStart              indexEnd
        012	    [1, 3]              (1 - 1) * 3   = 0       (0 + 3) - 1   = 2
        345	    [2, 3]              (2 - 1) * 3   = 3       (3 + 3) - 1   = 5
        678	    [3, 3]              (3 - 1) * 3   = 6       (6 + 3) - 1   = 8
    */
    const indexStart = (page - 1) * perPage; // the entry_index of the first_entry of current pagination
    const indexEnd   = indexStart + (perPage - 1);
    return {
        indexStart,
        indexEnd,
        page,
        perPage,
    };
};

type PaginationUpdateType =
    |'CREATE'
    |'UPDATE'
    |'UPSERT'
    |'UPDATE_OR_INVALIDATE'
    |'DELETE'
interface PaginationUpdateOptions<TEntry extends Model|string> {
    providedMutatedEntry ?: TEntry
    predicate            ?: (originalArgs: unknown) => boolean
}
const cumulativeUpdatePaginationCache = async <TEntry extends Model|string, TQueryArg, TBaseQuery extends BaseQueryFn>(api: MutationLifecycleApi<TQueryArg, TBaseQuery, TEntry, 'api'>, endpointName: Extract<keyof (typeof apiSlice)['endpoints'], 'getProductPage'|'getWishGroupPage'|'getWishPage'>, updateType: PaginationUpdateType, invalidateTag: Extract<Parameters<typeof apiSlice.util.invalidateTags>[0][number], string>, options?: PaginationUpdateOptions<TEntry>) => {
    // options
    const {
        providedMutatedEntry,
        predicate,
    } = options ?? {};
    
    
    
    // mutated TEntry data:
    const mutatedEntry : TEntry|undefined = (providedMutatedEntry !== undefined) ? providedMutatedEntry : await (async (): Promise<TEntry|undefined> => {
        try {
            const { data: mutatedEntry } = await api.queryFulfilled;
            return mutatedEntry;
        }
        catch {
            return undefined;
        } // try
    })();
    if (mutatedEntry === undefined) return; // api request aborted|failed => nothing to update
    const mutatedId = selectIdFromEntry<TEntry>(mutatedEntry);
    
    
    
    // find related TEntry data(s):
    const state                 = api.getState();
    const allQueryCaches        = state.api.queries;
    const collectionQueryCaches = (
        Object.values(allQueryCaches)
        .filter((allQueryCache): allQueryCache is Exclude<typeof allQueryCache, undefined> =>
            (allQueryCache !== undefined)
            &&
            (allQueryCache.endpointName === endpointName)
            &&
            (allQueryCache.data !== undefined)
            &&
            ((predicate === undefined) || predicate(allQueryCache.originalArgs))
        )
    );
    
    
    
    const lastCollectionQueryCache       = collectionQueryCaches.length ? collectionQueryCaches[collectionQueryCaches.length - 1] : undefined;
    if (lastCollectionQueryCache === undefined) {
        // there's no queryCaches to update => nothing to do
        return;
    } // if
    const validTotalEntries              = selectTotalFromData(lastCollectionQueryCache.data);
    const hasInvalidCollectionQueryCache = collectionQueryCaches.some(({ data }) =>
        (selectTotalFromData(data) !== validTotalEntries)
    );
    if (hasInvalidCollectionQueryCache) {
        // the queryCaches has a/some inconsistent data => panic => clear all the caches and (may) trigger the rtk to re-fetch
        
        // clear caches:
        api.dispatch(
            apiSlice.util.invalidateTags([invalidateTag])
        );
        return; // panic => cannot further reconstruct
    } // if
    
    
    
    /* update existing data: SIMPLE: the number of collection_items is unchanged */
    if ((updateType === 'UPDATE') || (updateType === 'UPSERT') || (updateType === 'UPDATE_OR_INVALIDATE')) {
        const mutatedPaginationIndices = (
            collectionQueryCaches
            .map(({ originalArgs, data }) => ({
                indexStart        : selectRangeFromArg(originalArgs).indexStart,
                indexLocalMutated : selectIndexOfId<TEntry>(data, mutatedId),
            }))
            .filter(({ indexLocalMutated }) =>
                (indexLocalMutated >= 0) // is FOUND
            )
            .map(({ indexStart, indexLocalMutated }) =>
                (indexStart + indexLocalMutated) // convert local index to global index
            )
        );
        const uniqueMutatedPaginationIndices = Array.from(new Set<number>(mutatedPaginationIndices));
        if (uniqueMutatedPaginationIndices.length === 0) { // not found
            if (updateType === 'UPDATE_OR_INVALIDATE') {
                // UNABLE to update current pagination cache => invalidate all caches:
                api.dispatch(
                    apiSlice.util.invalidateTags([invalidateTag])
                );
                return; // invalidated => done
            }
            else if (updateType === 'UPSERT') { // UPSERT
                // nothing to update => fallback to CREATE mode:
                return cumulativeUpdatePaginationCache(api, endpointName, 'CREATE', invalidateTag, options);
            }
            else { // UPDATE
                return; // nothing to update => nothing to do
            } // if
        }
        else if (uniqueMutatedPaginationIndices.length !== 1) { // ambigous
            // all the mutated queryCaches should have ONE valid mutated index, otherwise => panic => clear all the caches and (may) trigger the rtk to re-fetch
            
            // clear caches:
            api.dispatch(
                apiSlice.util.invalidateTags([invalidateTag])
            );
            return; // panic => cannot further reconstruct
        } // if
        const indexMutated = uniqueMutatedPaginationIndices[0];
        
        
        
        const mutatedCollectionQueryCaches = (
            collectionQueryCaches
            .filter(({ originalArgs, data }) => {
                const {
                    indexStart,
                } = selectRangeFromArg(originalArgs);
                const indexLast = (
                    indexStart
                    +
                    (selectTotalFromData(data) - 1)
                );
                
                
                
                return (
                    ((indexMutated >= indexStart) && (indexMutated <= indexLast)) // the updated_pagination => within indexStart to indexLast
                );
            })
        );
        
        
        
        // reconstructuring the updated entry, so the invalidatesTag can be avoided:
        
        
        
        // update cache:
        for (const { originalArgs } of mutatedCollectionQueryCaches) {
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as PaginationArgs, (data) => {
                    const currentEntryIndex = selectIndexOfId<TEntry>(data, mutatedId);
                    if (currentEntryIndex < 0) return; // not found => nothing to update
                    const currentEntry = (data.entities as unknown as TEntry[])[currentEntryIndex];
                    (data.entities as unknown as TEntry[])[currentEntryIndex] = (
                        ((typeof(currentEntry) === 'object') && (typeof(mutatedEntry) === 'object'))
                        ? {
                            ...currentEntry,
                            ...mutatedEntry, // partially|fully replace oldEntry with mutatedEntry
                        }
                        : mutatedEntry       // fully           replace oldEntry with mutatedEntry
                    );
                })
            );
        } // for
    }
    
    /* add new data: COMPLEX: the number of collection_items is scaled_up */
    else if (updateType === 'CREATE') {
        /*
            Adding a_new_entry causing the restPagination(s) shifted their entries to neighboringPagination(s).
            [876] [543] [210] + 9 => [987] [654] [321] [0]
            page1 page2 page3        page1 page2 page3 pageTail
        */
        const shiftedCollectionQueryCaches = collectionQueryCaches;
        
        
        
        // reconstructuring the shifted entries, so the invalidatesTag can be avoided:
        
        
        
        //#region BACKUP the entries from paginations (which will be shifted) 
        const mergedEntryList : TEntry[] = []; // use an `Array<TEntry>` instead of `Map<number, TEntry>`, so we can SHIFT the key easily
        for (const { originalArgs, data } of shiftedCollectionQueryCaches) {
            const {
                indexStart, // the global first_entry_index
                indexEnd,   // the global last_entry_index
            } = selectRangeFromArg(originalArgs);
            
            
            
            /*
                Assumes the next paginations having the same perPage size:
                Only the last_entry of current pagination is useful for backup.
                After the whole `mergedEntryList` shifted_down, the last_entry becomes the first_entry of the next pagination chains.
            */
            const paginationEntries = selectEntriesFromData<TEntry>(data);
            const relativeIndexEnd = indexEnd - indexStart; // a zero based starting index, select the LAST pagination entry
            const entryEnd = (relativeIndexEnd < paginationEntries.length) ? paginationEntries[relativeIndexEnd] : undefined;
            if (entryEnd !== undefined) mergedEntryList[indexEnd] = entryEnd; // if exists, copy the LAST pagination entry
        } // for
        //#endregion BACKUP the entries from paginations (which will be shifted) 
        
        
        
        // INSERT the new_entry at the BEGINNING of the list:
        mergedEntryList.unshift(mutatedEntry);
        // re-calculate the total entries:
        const newTotalEntries = validTotalEntries + 1;
        
        
        
        //#region RESTORE the shifted paginations from the backup
        for (const { originalArgs } of shiftedCollectionQueryCaches) {
            const {
                indexStart, // the global first_entry_index
                page,
                perPage,
            } = selectRangeFromArg(originalArgs);
            
            const entryStart = mergedEntryList[indexStart] as TEntry|undefined; // take the *valid* first_entry of current pagination, the old_first_entry...the_2nd_last_entry will be 2nd_first_entry...last_entry
            
            
            
            if (entryStart === undefined) {
                // UNABLE to reconstruct current pagination cache => invalidate the cache:
                api.dispatch(
                    apiSlice.util.invalidateTags([{ type: invalidateTag, id: page }])
                );
            }
            else {
                // reconstruct current pagination cache:
                api.dispatch(
                    apiSlice.util.updateQueryData(endpointName, originalArgs as PaginationArgs, (data) => {
                        // RESTORE the entryStart at the BEGINNING of the pagination:
                        (data.entities as unknown as TEntry[]).unshift(entryStart);
                        
                        
                        
                        // update the total data:
                        data.total = newTotalEntries;
                        
                        
                        
                        // if OVERFLOW pagination size => remove the last entry:
                        if (data.entities.length > perPage) {
                            data.entities.pop();
                        } // if
                    })
                );
            } // if
        } // for
        //#endregion RESTORE the shifted paginations from the backup
    }
    
    /* delete existing data: COMPLEX: the number of collection_items is scaled_down */
    else {
        const deletedPaginationIndices = (
            collectionQueryCaches
            .map(({ originalArgs, data }) => ({
                indexStart        : selectRangeFromArg(originalArgs).indexStart,
                indexLocalDeleted : selectIndexOfId<TEntry>(data, mutatedId),
            }))
            .filter(({ indexLocalDeleted }) =>
                (indexLocalDeleted >= 0) // is FOUND
            )
            .map(({ indexStart, indexLocalDeleted }) =>
                (indexStart + indexLocalDeleted) // convert local index to global index
            )
        );
        const uniqueDeletedPaginationIndices = Array.from(new Set<number>(deletedPaginationIndices));
        if (uniqueDeletedPaginationIndices.length === 0) { // not found
            return; // nothing to delete => nothing to do
        }
        else if (uniqueDeletedPaginationIndices.length !== 1) { // ambigous
            // all the deleted queryCaches should have ONE valid deleted index, otherwise => panic => clear all the caches and (may) trigger the rtk to re-fetch
            
            // clear caches:
            api.dispatch(
                apiSlice.util.invalidateTags([invalidateTag])
            );
            return; // panic => cannot further reconstruct
        } // if
        const indexDeleted = uniqueDeletedPaginationIndices[0];
        
        
        
        const shiftedCollectionQueryCaches = (
            collectionQueryCaches
            .filter(({ originalArgs, data }) => {
                const {
                    indexStart,
                } = selectRangeFromArg(originalArgs);
                const indexLast = (
                    indexStart
                    +
                    (selectTotalFromData(data) - 1)
                );
                
                
                
                return (
                    ((indexDeleted >= indexStart) && (indexDeleted <= indexLast)) // the deleted_pagination => within indexStart to indexLast
                    ||
                    (indexStart > indexDeleted) // the shifted_up_pagination => below the deleted_pagination
                );
            })
        );
        
        
        
        // reconstructuring the deleted entry, so the invalidatesTag can be avoided:
        
        
        
        //#region BACKUP the entries from paginations (which will be shifted) 
        const mergedEntryList : TEntry[] = []; // use an `Array<TEntry>` instead of `Map<number, TEntry>`, so we can SHIFT the key easily
        for (const { originalArgs, data } of shiftedCollectionQueryCaches) {
            const {
                indexStart, // the global first_entry_index
            } = selectRangeFromArg(originalArgs);
            
            
            
            /*
                Assumes the prev paginations having the same perPage size:
                Only the first_entry of current pagination is useful for backup.
                After the whole `mergedEntryList` shifted_up, the first_entry becomes the last_entry of the prev pagination chains.
            */
            const paginationEntries = selectEntriesFromData<TEntry>(data);
            const entryStart = paginationEntries[0] as TEntry|undefined; // a zero based starting index, select the FIRST pagination entry
            if (entryStart !== undefined) mergedEntryList[indexStart] = entryStart; // if exists, copy the FIRST pagination entry
        } // for
        //#endregion BACKUP the entries from paginations (which will be shifted) 
        
        
        
        // REMOVE the del_entry at the DELETED_INDEX of the list:
        mergedEntryList.splice(indexDeleted, 1);
        // re-calculate the total entries:
        const newTotalEntries = validTotalEntries - 1;
        
        
        
        //#region RESTORE the shifted paginations from the backup
        for (const { originalArgs, data } of shiftedCollectionQueryCaches) {
            const {
                indexStart, // the global first_entry_index
                indexEnd,   // the global last_entry_index
                page,
            } = selectRangeFromArg(originalArgs);
            const indexLast = (
                indexStart
                +
                (selectTotalFromData(data) - 1)
            );
            
            const entryEnd = mergedEntryList[indexEnd] as TEntry|undefined; // take the *valid* last_entry of current pagination, the old_2nd_first_entry...the_last_entry will be first_entry...2nd_last_entry
            
            
            
            // reconstruct current pagination cache:
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as PaginationArgs, (data) => {
                    // Shift up at the top/middle of pagination:
                    if ((indexDeleted >= indexStart) && (indexDeleted <= indexLast)) { // the deleted_pagination => within indexStart to indexLast
                        // REMOVE the deleted entry at specific index:
                        const relativeIndexDeleted = indexDeleted - indexStart;
                        data.entities.splice(relativeIndexDeleted, 1);
                    }
                    else { // the shifted_up_pagination => below the deleted_pagination
                        // because ONE entry in prev pagination has been DELETED => ALL subsequent paginations are SHIFTED_UP:
                        // REMOVE the first entry for shifting:
                        data.entities.shift();
                    } // if
                    
                    
                    
                    // a shifting compensation to maintain pagination size (if possible):
                    // RESTORE the entryStart at the END of the pagination:
                    if (entryEnd !== undefined /* if possible */) (data.entities as unknown as TEntry[]).push(entryEnd);
                    
                    
                    
                    // update the total data:
                    data.total = newTotalEntries;
                    
                    
                    
                    // if UNDERFLOW (empty) pagination size => invalidate the cache:
                    if (!data.entities.length) {
                        api.dispatch(
                            apiSlice.util.invalidateTags([{ type: invalidateTag, id: page }])
                        );
                    } // if
                })
            );
        } // for
        //#endregion RESTORE the shifted paginations from the backup
    } // if
};

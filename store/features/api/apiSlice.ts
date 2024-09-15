// redux:
import {
    type Dictionary,
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
import {
    type Model,
    
    type PaginationArgs,
    type Pagination,
    
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
    type AxiosRequestConfig,
    type AxiosError,
    
    default as axios,
    CanceledError,
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
    tagTypes  : ['Preference', 'WishlistGroup', 'Wishlist'],
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
            providesTags: ['Preference'],
        }),
        updatePreference            : builder.mutation<CustomerPreferenceDetail, Partial<CustomerPreferenceData>>({
            query: (patch) => ({
                url    : 'preferences',
                method : 'PATCH',
                body   : patch
            }),
            invalidatesTags: ['Preference'],
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
            providesTags: ['WishlistGroup'],
        }),
        createWishlistGroup         : builder.mutation<WishlistGroupDetail, CreateWishlistGroupRequest>({
            query: (arg) => ({
                url         : 'wishlists/groups',
                method      : 'POST',
                body        : arg,
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdateEntityCache(api, 'getWishlistGroups', 'UPSERT', 'WishlistGroup');
            },
        }),
        updateWishlistGroup         : builder.mutation<WishlistGroupDetail, UpdateWishlistGroupRequest>({
            query: (arg) => ({
                url         : 'wishlists/groups',
                method      : 'PATCH',
                body        : arg,
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdateEntityCache(api, 'getWishlistGroups', 'UPSERT', 'WishlistGroup');
            },
        }),
        deleteWishlistGroup         : builder.mutation<WishlistGroupDetail, DeleteWishlistGroupRequest>({
            query: (arg) => ({
                url         : `wishlists/groups?id=${encodeURIComponent(arg.id)}`,
                method      : 'DELETE',
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdateEntityCache(api, 'getWishlistGroups', 'DELETE', 'WishlistGroup');
            },
        }),
        
        getWishlists                : builder.query<EntityState<WishlistDetail['productId']>, GetWishlistRequest>({
            query: ({groupId}) => ({
                url         : `wishlists?groupId=${(typeof(groupId) !== 'string') ? groupId : encodeURIComponent(groupId)}`,
                method      : 'GET',
            }),
            transformResponse(response: WishlistDetail['productId'][]) {
                return wishlistListAdapter.addMany(wishlistListAdapter.getInitialState(), response);
            },
            providesTags: (data, error, arg) => [{ type: 'Wishlist', id: `${arg.groupId}` }],
        }),
        updateWishlist              : builder.mutation<WishlistDetail['productId'], CreateOrUpdateWishlistRequest>({
            query: (arg) => ({
                url         : 'wishlists',
                method      : 'PATCH',
                body        : arg,
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdateEntityCache(api, 'getWishlists', 'UPSERT', 'Wishlist');
            },
        }),
        deleteWishlist              : builder.mutation<WishlistDetail['productId'], DeleteWishlistRequest>({
            query: (arg) => ({
                url         : `wishlists?productId=${encodeURIComponent(arg.productId)}`,
                method      : 'DELETE',
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdateEntityCache(api, 'getWishlists', 'DELETE', 'Wishlist');
            },
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
    
    useLazyGetWishlistsQuery               : useGetWishlists,
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

type EntityUpdateType =
    |'UPSERT'
    |'DELETE'
const cumulativeUpdateEntityCache     = async <TEntry extends Model|string, TQueryArg, TBaseQuery extends BaseQueryFn>(api: MutationLifecycleApi<TQueryArg, TBaseQuery, TEntry, 'api'>, endpointName: Extract<keyof (typeof apiSlice)['endpoints'], 'getWishlistGroups'|'getWishlists'>, updateType: EntityUpdateType, invalidateTag: Extract<Parameters<typeof apiSlice.util.invalidateTags>[0][number], string>) => {
    // mutated TEntry data:
    const mutatedEntry = await (async (): Promise<TEntry|undefined> => {
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
    
    
    
    /* update existing data -or- add new data: COMPLEX: the number of collection_items MAY scaled_up */
    if (updateType === 'UPSERT') {
        const shiftedCollectionQueryCaches = collectionQueryCaches;
        
        
        
        // reconstructuring the shifted entries, so the invalidatesTag can be avoided:
        
        
        
        //#region INSERT the new entry to the cache's entity
        for (const { originalArgs } of shiftedCollectionQueryCaches) {
            // reconstruct current entity cache:
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as any, (data) => {
                    if (selectIndexOfId<TEntry>(data, mutatedId) >= 0) { // is FOUND
                        // UPDATE the existing entry:
                        (data.entities as Dictionary<TEntry>)[mutatedId] = mutatedEntry; // replace oldEntry with mutatedEntry
                    }
                    else {
                        // INSERT the new entry:
                        (data.entities as Dictionary<TEntry>) = {
                            [mutatedId] : mutatedEntry, // place the inserted entry to the first property
                            ...data.entities as Dictionary<TEntry>,
                        } satisfies Dictionary<TEntry>;
                        
                        
                        
                        // INSERT the new entry's id at the BEGINNING of the ids:
                        data.ids.unshift(mutatedId);
                    } // if
                })
            );
        } // for
        //#endregion INSERT the new entry to the cache's entity
    }
    
    /* delete existing data: COMPLEX: the number of collection_items is scaled_down */
    else {
        const shiftedCollectionQueryCaches = (
            collectionQueryCaches
            .filter(({ data }) =>
                (selectIndexOfId<TEntry>(data, mutatedId) >= 0) // is FOUND
            )
        );
        
        
        
        // reconstructuring the deleted entry, so the invalidatesTag can be avoided:
        
        
        
        //#region REMOVE the deleted entry from the cache's entity
        for (const { originalArgs } of shiftedCollectionQueryCaches) {
            // reconstruct current entity cache:
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as any, (data) => {
                    // REMOVE the deleted entry:
                    delete (data.entities as Dictionary<TEntry>)[mutatedId];
                    
                    
                    
                    // REMOVE the deleted entry's id at the BEGINNING of the ids:
                    const indexOfId = selectIndexOfId<TEntry>(data, mutatedId);
                    if (indexOfId >= 0) data.ids.splice(indexOfId, 1);
                })
            );
        } // for
        //#endregion REMOVE the deleted entry from the cache's entity
    } // if
};

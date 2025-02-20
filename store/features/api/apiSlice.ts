// redux:
import {
    type EntityState,
    
    createEntityAdapter,
}                           from '@reduxjs/toolkit'
import {
    type QuerySubState,
    type BaseQueryFn,
    type BaseEndpointDefinition,
    QueryStatus,
    
    createApi,
}                           from '@reduxjs/toolkit/query/react'

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
    type GetProductPageRequest,
    type SearchProductsPageRequest,
    
    type CategoryDetail,
    type CategoryPageRequest,
    type CategoryPreviewPagination,
    
    type ShippingPreview,
    type ShippingAddressDetail,
    type CountryPreview,
    
    type PaymentDetail,
    type PublicOrderDetail,
    
    type PaymentConfirmationRequest,
    type PaymentConfirmationDetail,
    type AffectedPaymentMethods,
    
    type ShipmentRequest,
    type ShipmentDetail,
    
    type CustomerDetail,
    type CustomerPreferenceData,
    type CustomerPreferenceDetail,
    
    type CartDetail,
    type CartUpdateRequest,
    
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
    type CreateOrUpdateWishParam,
    type CreateOrUpdateWishRequest,
    type DeleteWishParam,
    
    type PaymentMethodSetupDetail,
    type PaymentMethodDetail,
    type PaymentMethodUpdateRequest,
    type PaymentMethodSetupRequest,
    type PaymentMethodSortRequest,
    type PaymentMethodSortDetail,
    type PaymentMethodOfCurrencyRequest,
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



const shippingListAdapter         = createEntityAdapter<ShippingPreview, string>({
    selectId : (shippingPreview) => shippingPreview.id,
});
const matchingShippingListAdapter = createEntityAdapter<MatchingShipping, string>({
    selectId : (shipping) => `${shipping.id}`,
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
    tagTypes  : ['ProductPage', 'CategoryPage', 'Wishable', 'PreferenceData', 'WishGroupPage', 'WishPage', 'OfWishGroupable', 'PaymentMethod', 'PaymentMethodList'],
    endpoints : (builder) => ({
        getProductPage              : builder.query<Pagination<ProductPreview>, GetProductPageRequest>({
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
            keepUnusedDataFor: 3600, // 1 hour in seconds
        }),
        searchProducts              : builder.query<Pagination<ProductPreview>, SearchProductsPageRequest>({
            query : (arg) => ({
                url    : `search?${new URLSearchParams(Object.entries(arg))}`,
                method : 'GET',
            }),
        }),
        
        
        
        getCategoryPage             : builder.query<CategoryPreviewPagination, CategoryPageRequest>({
            query: (arg) => ({
                url    : 'products/categories',
                method : 'POST',
                body   : arg,
            }),
            providesTags: (data, error, arg) => [{ type: 'CategoryPage', id: `${arg.parent ?? ''}:${arg.page}` }],
        }),
        
        getCategoryDetail           : builder.query<CategoryDetail, string[]>({
            query : (arg) => ({
                url    : `products/categories?pathname=${encodeURIComponent(arg.join('/'))}`,
                method : 'GET',
            }),
            keepUnusedDataFor: 86400, // 1 day in seconds
        }),
        
        
        
        getShippingList             : builder.query<EntityState<ShippingPreview, string>, void>({
            query : () => ({
                url    : 'shippings',
                method : 'GET',
            }),
            transformResponse(response: ShippingPreview[]) {
                return shippingListAdapter.addMany(shippingListAdapter.getInitialState(), response);
            },
        }),
        
        getCountryList              : builder.query<string[], void>({
            query : () => ({
                url    : 'shippings/countries',
                method : 'GET',
            }),
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
        
        
        
        getMatchingShippingList     : builder.query<EntityState<MatchingShipping, string>, ShippingAddressDetail & { totalProductWeight: number }>({
            query : (shippingAddressDetail) => ({
                url    : 'matching-shippings',
                method : 'POST',
                body   : shippingAddressDetail,
            }),
            transformResponse(response: MatchingShipping[]) {
                return matchingShippingListAdapter.addMany(matchingShippingListAdapter.getInitialState(), response);
            },
        }),
        refreshMatchingShippingList : builder.mutation<EntityState<MatchingShipping, string>, ShippingAddressDetail & { totalProductWeight: number }>({
            query : (shippingAddressDetail) => ({
                url    : 'matching-shippings',
                method : 'PATCH',
                body   : shippingAddressDetail,
            }),
            transformResponse(response: MatchingShipping[]) {
                return matchingShippingListAdapter.addMany(matchingShippingListAdapter.getInitialState(), response);
            },
            
            onQueryStarted: async (arg, api) => {
                // updated TModel data:
                const newMatchingShippingList = await (async () => {
                    try {
                        return (await api.queryFulfilled).data;
                    }
                    catch {
                        return undefined; // refresh failed
                    } // try
                })();
                if (!newMatchingShippingList) return;
                
                
                
                // find related TModel data(s):
                const endpointName                 = 'getMatchingShippingList';
                const updatedCollectionQueryCaches = getQueryCaches<EntityState<MatchingShipping, string>, ShippingAddressDetail & { totalProductWeight: number }>(api, endpointName, {
                    predicate : (originalArgs: unknown): boolean =>
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
                });
                
                
                
                // reconstructuring the mutated model, so the invalidatesTag can be avoided:
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
                                ...(Object.values(newMatchingShippingList.entities) as MatchingShipping[])
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
                // find related TModel data(s):
                const endpointName                 = 'restoreCart';
                const updatedCollectionQueryCaches = getQueryCaches<(CartDetail & Pick<CustomerPreferenceDetail, 'marketingOpt'>)|null, void>(api, endpointName);
                
                
                
                // reconstructuring the mutated model, so the invalidatesTag can be avoided:
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
        
        
        
        placeOrder                  : builder.mutation<PlaceOrderDetail|PaymentDetail, PlaceOrderRequest>({
            query : (orderData) => ({
                url    : 'checkout',
                method : 'POST',
                body   : orderData,
            }),
            onQueryStarted: async (arg, api) => {
                const orderBookedOrPaid = await (async () => {
                    try {
                        return (await api.queryFulfilled).data;
                    }
                    catch {
                        return undefined; // place_order|payment failed
                    } // try
                })();
                if (!orderBookedOrPaid) return;
                if ('orderId' in orderBookedOrPaid) return; // not yet paid => ignore
                const paid = orderBookedOrPaid satisfies PaymentDetail;
                
                
                
                // a new PaymentMethod may have been added during checkout => clear the PaymentMethod cache:
                api.dispatch(
                    apiSlice.util.invalidateTags([
                        'PaymentMethod',
                    ])
                );
            },
        }),
        makePayment                 : builder.mutation<PaymentDetail, MakePaymentRequest>({
            query : (paymentData) => ({
                url    : 'checkout',
                method : 'PATCH',
                body   : paymentData,
            }),
            onQueryStarted: async (arg, api) => {
                const paid = await (async () => {
                    try {
                        return (await api.queryFulfilled).data;
                    }
                    catch {
                        return undefined; // payment failed
                    } // try
                })();
                if (!paid) return;
                
                
                
                // a new PaymentMethod may have been added during checkout => clear the PaymentMethod cache:
                api.dispatch(
                    apiSlice.util.invalidateTags([
                        'PaymentMethod',
                    ])
                );
            },
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
            keepUnusedDataFor: 0, // each request must be passed to server, never cached
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
            keepUnusedDataFor: 0, // each request must be passed to server, never cached
        }),
        
        
        
        getWishPage                 : builder.query<GetWishPageResponse, GetWishPageRequest>({
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
        updateWish                  : builder.mutation<WishDetail['productId'], CreateOrUpdateWishParam>({
            query: (arg) => ({
                url         : 'customer/wishes',
                method      : 'PATCH',
                body        : {
                    productId : arg.productPreview.id,
                    groupId   : arg.groupId,
                } satisfies CreateOrUpdateWishRequest,
            }),
            onQueryStarted: async (arg, api) => {
                //#region optimistic update
                // update related_affected_wish in `getProductPage`:
                const productId       = arg.productPreview.id;
                const originalGroupId = arg.productPreview.wished;
                const desiredGroupId  = arg.groupId;
                const wishedProduct   : ProductPreview = {
                    ...arg.productPreview,
                    wished : desiredGroupId, // set to grouped wishes -or- ungroup (but still wished)
                };
                cumulativeUpdatePaginationCache(api, 'getProductPage'    , 'UPDATE', 'ProductPage', { providedMutatedModel: wishedProduct as any });
                
                // update related_affected_wish in `getProductPreview`:
                api.dispatch(
                    apiSlice.util.updateQueryData('getProductPreview', productId, (data) => {
                        data.wished = desiredGroupId;
                    })
                );
                
                if (desiredGroupId !== originalGroupId) {
                    // create -or- update related_affected_pagination_of_wishGroup in `getWishPage('all')`:
                    if (originalGroupId === undefined) { // if was never wished
                        // create related_affected_pagination_of_wishGroup in `getWishPage('all')`:
                        cumulativeUpdatePaginationCache(api, 'getWishPage'       , 'CREATE', 'WishPage'   , { providedMutatedModel: wishedProduct as any, predicate: (originalArgs: unknown) => ((originalArgs as GetWishPageRequest).groupId === undefined) });
                    }
                    else {
                        // update related_affected_pagination_of_wishGroup in `getWishPage('all')`:
                        cumulativeUpdatePaginationCache(api, 'getWishPage'       , 'UPDATE', 'WishPage'   , { providedMutatedModel: wishedProduct as any, predicate: (originalArgs: unknown) => ((originalArgs as GetWishPageRequest).groupId === undefined) });
                    } // if
                    
                    // move related_affected_pagination_of_wishGroup from `getWishPage('from_group_id')` to `getWishPage('to_group_id')`:
                    if (originalGroupId) { // if the wish is MOVED from old_group to new_group => DELETE the wish from old_group
                        // delete related_affected_pagination_of_wishGroup in `getWishPage('from_group_id')`:
                        cumulativeUpdatePaginationCache(api, 'getWishPage'       , 'DELETE', 'WishPage'   , { providedMutatedModel: wishedProduct as any, predicate: (originalArgs: unknown) => ((originalArgs as GetWishPageRequest).groupId === originalGroupId) });
                    } // if
                    if (desiredGroupId) { // if the user select the OPTIONAL WishGroup => add to WishGroup too
                        // create related_affected_pagination_of_wishGroup in `getWishPage('to_group_id')`:
                        cumulativeUpdatePaginationCache(api, 'getWishPage'       , 'CREATE', 'WishPage'   , { providedMutatedModel: wishedProduct as any, predicate: (originalArgs: unknown) => ((originalArgs as GetWishPageRequest).groupId === desiredGroupId) });
                    } // if
                } // if
                
                
                
                // when the optimistic update fails => invalidates the related_affected_wish and the related_affected_wishGroup:
                api.queryFulfilled.catch(() => {
                    api.dispatch(
                        apiSlice.util.invalidateTags([
                            // invalidate the related_affected_wish:
                            { type: 'Wishable'       , id: productId },
                            
                            // invalidate the related_affected_pagination_of_wishGroup:
                            { type: 'OfWishGroupable', id: undefined },
                            ...(((desiredGroupId)                                          ? [{ type: 'OfWishGroupable', id: desiredGroupId  }] : []) satisfies { type: 'OfWishGroupable', id: string }[]),
                            ...(((originalGroupId && (originalGroupId !== desiredGroupId)) ? [{ type: 'OfWishGroupable', id: originalGroupId }] : []) satisfies { type: 'OfWishGroupable', id: string }[]),
                        ])
                    );
                });
                //#endregion optimistic update
            },
        }),
        deleteWish                  : builder.mutation<WishDetail['productId'], DeleteWishParam>({
            query: (arg) => ({
                url         : `customer/wishes?productId=${encodeURIComponent(arg.productPreview.id)}`,
                method      : 'DELETE',
            }),
            onQueryStarted: async (arg, api) => {
                //#region optimistic update
                // update related_affected_wish in `getProductPage`:
                const productId       = arg.productPreview.id;
                const originalGroupId = arg.productPreview.wished;
                const unwishedProduct : ProductPreview = {
                    ...arg.productPreview,
                    wished : undefined, // set to unwished
                };
                cumulativeUpdatePaginationCache(api, 'getProductPage'    , 'UPDATE', 'ProductPage', { providedMutatedModel: unwishedProduct as any });
                
                // update related_affected_wish in `getProductPreview`:
                api.dispatch(
                    apiSlice.util.updateQueryData('getProductPreview', productId, (data) => {
                        data.wished = undefined;
                    })
                );
                
                // delete related_affected_pagination_of_wishGroup in `getWishPage('all')`:
                cumulativeUpdatePaginationCache(api, 'getWishPage'       , 'DELETE', 'WishPage'   , { providedMutatedModel: unwishedProduct as any, predicate: (originalArgs: unknown) => ((originalArgs as GetWishPageRequest).groupId === undefined) });
                if (originalGroupId) { // if the wish is having existing_group => DELETE the wish from existing_group
                    // delete related_affected_pagination_of_wishGroup in `getWishPage('from_group_id')`:
                    cumulativeUpdatePaginationCache(api, 'getWishPage'       , 'DELETE', 'WishPage'   , { providedMutatedModel: unwishedProduct as any, predicate: (originalArgs: unknown) => ((originalArgs as GetWishPageRequest).groupId === originalGroupId) });
                } // if
                
                
                
                // when the optimistic update fails => invalidates the related_affected_wish and the related_affected_wishGroup:
                api.queryFulfilled.catch(() => {
                    api.dispatch(
                        apiSlice.util.invalidateTags([
                            // invalidate the related_affected_wish:
                            { type: 'Wishable'       , id: productId },
                            
                            // invalidate the related_affected_pagination_of_wishGroup:
                            { type: 'OfWishGroupable', id: undefined },
                            ...(((originalGroupId) ? [{ type: 'OfWishGroupable', id: originalGroupId }] : []) satisfies { type: 'OfWishGroupable', id: string }[]),
                        ])
                    );
                });
                //#endregion optimistic update
            },
        }),
        
        
        
        getPaymentMethodOfCurreny   : builder.query<PaymentMethodDetail[], PaymentMethodOfCurrencyRequest>({
            query : (arg) => ({
                url    : `customer/payment-methods?currency=${encodeURIComponent(arg.currency)}`,
                method : 'GET',
            }),
            providesTags: (data, error, arg) => [
                { type: 'PaymentMethod', id: undefined /* any_page */ }, // very fragile cache, any operation of create|update|delete|sort of PaymentMethod will invalidate this cache
                'PaymentMethodList'
            ],
        }),
        getPaymentMethodPage        : builder.query<Pagination<PaymentMethodDetail>, PaginationArgs>({
            query : (arg) => ({
                url    : 'customer/payment-methods',
                method : 'POST',
                body   : arg,
            }),
            providesTags: (data, error, arg) => [{ type: 'PaymentMethod', id: arg.page }],
        }),
        createPaymentMethodSetup    : builder.mutation<PaymentMethodSetupDetail|[PaymentMethodDetail, AffectedPaymentMethods], PaymentMethodSetupRequest>({
            query : (arg) => ({
                url    : 'customer/payment-methods/setup',
                method : 'POST',
                body   : arg
            }),
            onQueryStarted: async (arg, api) => {
                const paymentMethodSetupOrAddedOrUpdatedPaymentMethod = await (async () => {
                    try {
                        return (await api.queryFulfilled).data;
                    }
                    catch {
                        return undefined; // setup|create|update failed
                    } // try
                })();
                if (!paymentMethodSetupOrAddedOrUpdatedPaymentMethod) return;
                if (!Array.isArray(paymentMethodSetupOrAddedOrUpdatedPaymentMethod)) return; // ignore for setup_paymentMethod (only interested of CREATED|UPDATED paymentMethod)
                const [addedOrUpdatedPaymentMethod, affectedPaymentMethods] = paymentMethodSetupOrAddedOrUpdatedPaymentMethod satisfies [PaymentMethodDetail, AffectedPaymentMethods];
                await cumulativeUpdatePaginationCache(api as any, 'getPaymentMethodPage', (arg.id === '') ? 'CREATE' : 'UPDATE', 'PaymentMethod', {
                    providedMutatedModel : addedOrUpdatedPaymentMethod,
                });
                
                
                
                // find related TModel data(s):
                // update neighboring paymentMethods:
                const addedPaymentMethodId = !arg.id /* blank id => CREATE */ ? addedOrUpdatedPaymentMethod.id : /* has id => UPDATE*/ null;
                updateAffectedPaymentMethods(api, addedPaymentMethodId, affectedPaymentMethods);
            },
        }),
        updatePaymentMethod         : builder.mutation<[PaymentMethodDetail, AffectedPaymentMethods], PaymentMethodUpdateRequest>({
            query: (arg) => ({
                url    : 'customer/payment-methods',
                method : 'PATCH',
                body   : arg,
            }),
            onQueryStarted: async (arg, api) => {
                const mutatedModel = await (async () => {
                    try {
                        return (await api.queryFulfilled).data;
                    }
                    catch {
                        return undefined; // create|update failed
                    } // try
                })();
                if (!mutatedModel) return;
                const [addedOrUpdatedPaymentMethod, affectedPaymentMethods] = mutatedModel;
                await cumulativeUpdatePaginationCache(api as any, 'getPaymentMethodPage', (arg.id === '') ? 'CREATE' : 'UPDATE', 'PaymentMethod', {
                    providedMutatedModel : addedOrUpdatedPaymentMethod,
                });
                
                
                
                // find related TModel data(s):
                // update neighboring paymentMethods:
                const addedPaymentMethodId = !arg.id /* blank id => CREATE */ ? addedOrUpdatedPaymentMethod.id : /* has id => UPDATE*/ null;
                updateAffectedPaymentMethods(api, addedPaymentMethodId, affectedPaymentMethods);
            },
        }),
        deletePaymentMethod         : builder.mutation<AffectedPaymentMethods, MutationArgs<Pick<PaymentMethodDetail, 'id'>>>({
            query: (arg) => ({
                url    : `customer/payment-methods?id=${encodeURIComponent(arg.id)}`,
                method : 'DELETE',
                body   : arg
            }),
            onQueryStarted: async (arg, api) => {
                const affectedPaymentMethods = await (async () => {
                    try {
                        return (await api.queryFulfilled).data;
                    }
                    catch {
                        return undefined; // delete failed
                    } // try
                })();
                if (!affectedPaymentMethods) return;
                
                
                
                // find related TModel data(s):
                // update neighboring paymentMethods:
                const addedPaymentMethodId = null;
                updateAffectedPaymentMethods(api, addedPaymentMethodId, affectedPaymentMethods);
            },
        }),
        sortPaymentMethod           : builder.mutation<PaymentMethodSortDetail, PaymentMethodSortRequest>({
            query : (arg) => ({
                url    : 'customer/payment-methods/sort',
                method : 'POST',
                body   : arg
            }),
            onQueryStarted: async (arg, api) => {
                const sortedIds = arg.ids;
                const optimisticSortIndices = new Map<string, number>(
                    sortedIds
                    .map((id, indexAsc, array) =>
                        [
                            id,                            // the id
                            (array.length - indexAsc - 1), // descending index
                        ]
                    )
                );
                
                
                
                // find related TModel data(s):
                const endpointName                 = 'getPaymentMethodPage';
                const updatedCollectionQueryCaches = getQueryCaches<Pagination<PaymentMethodDetail>, PaginationArgs>(api, endpointName, {
                    predicate : (originalArgs: unknown, data: Pagination<PaymentMethodDetail>): boolean =>
                        data.entities.some(({id}) => sortedIds.includes(id))
                });
                
                
                
                // reconstructuring the mutated model, so the invalidatesTag can be avoided:
                for (const { originalArgs } of updatedCollectionQueryCaches) {
                    api.dispatch(
                        apiSlice.util.updateQueryData(endpointName, originalArgs as any, (currentQueryCacheData) => {
                            const {
                                page,
                                perPage,
                            } = originalArgs as PaginationArgs;
                            const indexStart = page * perPage;
                            
                            
                            const totalRecords = currentQueryCacheData.total;
                            currentQueryCacheData.entities = (
                                currentQueryCacheData.entities
                                .map((item, indexAsc, array) => ({
                                    // the original data:
                                    ...item,
                                    
                                    // a temporary sort index for the optimistic update:
                                    sort : (
                                        optimisticSortIndices.get(item.id) // the optimistic sort index (if found)
                                        ??
                                        (array.length - indexAsc - 1) + indexStart // descending index
                                    ),
                                }))
                                .sort(({sort: sortA}, {sort: sortB}) => (sortB - sortA)) // sort descending
                                .map(({sort, ...restPaymentMethodDetail}) => ({
                                    // the original data:
                                    ...restPaymentMethodDetail,
                                    
                                    // update the priority based on the sort index:
                                    priority : totalRecords - sort - 1, // zero_based priority
                                }))
                            );
                        })
                    );
                } // for
                
                
                
                // verify optimistic vs real data from the server:
                let isUpdateSucceeded = true;
                try {
                    const { ids: serverSortIndices } = (await api.queryFulfilled).data;
                    isUpdateSucceeded = (
                        (optimisticSortIndices.size === serverSortIndices.length)
                        &&
                        serverSortIndices.every((serverSortIndex) => optimisticSortIndices.has(serverSortIndex))
                    )
                }
                catch {
                    isUpdateSucceeded = false; // sort failed
                } // try
                
                if (!isUpdateSucceeded) {
                    // when the optimistic update fails => invalidates the related pagination of PaymentMethod(s):
                    api.dispatch(
                        apiSlice.util.invalidateTags(
                            updatedCollectionQueryCaches
                            .map(({originalArgs}) => ({
                                type : 'PaymentMethod',
                                id   : (originalArgs as PaginationArgs).page,
                            }))
                        )
                    );
                } // if
                
                
                
                // the paymentMethodList is indirectly affected by the sort, so we need to clear the cache:
                api.dispatch(
                    apiSlice.util.invalidateTags(['PaymentMethodList'])
                );
            },
        }),
    }),
});



// utilities:
const setPaymentMethodPriorities   = (api: Api, options: { predicate: (paymentMethodDetail: PaymentMethodDetail) => boolean, set: number }): void => {
    // options:
    const {
        predicate,
        set,
    } = options;
    
    
    
    const endpointName                 = 'getPaymentMethodPage';
    const updatedCollectionQueryCaches = getQueryCaches<Pagination<PaymentMethodDetail>, PaginationArgs>(api, endpointName, {
        predicate : (originalArgs: unknown, data: Pagination<PaymentMethodDetail>): boolean =>
            data.entities.some((paymentMethodDetail) => predicate(paymentMethodDetail))
    });
    
    
    
    // reconstructuring the mutated model, so the invalidatesTag can be avoided:
    for (const { originalArgs } of updatedCollectionQueryCaches) {
        api.dispatch(
            apiSlice.util.updateQueryData(endpointName, originalArgs as any, (currentQueryCacheData) => {
                for (const entity of currentQueryCacheData.entities) {
                    if (predicate(entity)) entity.priority = set;
                } // for
            })
        );
    } // for
}
const shiftPaymentMethodPriorities = (api: Api, options: { predicate: (paymentMethodDetail: PaymentMethodDetail) => boolean, delta: number }): void => {
    // options:
    const {
        predicate,
        delta,
    } = options;
    
    
    
    const endpointName                 = 'getPaymentMethodPage';
    const updatedCollectionQueryCaches = getQueryCaches<Pagination<PaymentMethodDetail>, PaginationArgs>(api, endpointName, {
        predicate : (originalArgs: unknown, data: Pagination<PaymentMethodDetail>): boolean =>
            data.entities.some((paymentMethodDetail) => predicate(paymentMethodDetail))
    });
    
    
    
    // reconstructuring the mutated model, so the invalidatesTag can be avoided:
    for (const { originalArgs } of updatedCollectionQueryCaches) {
        api.dispatch(
            apiSlice.util.updateQueryData(endpointName, originalArgs as any, (currentQueryCacheData) => {
                for (const entity of currentQueryCacheData.entities) {
                    if (predicate(entity)) entity.priority += delta;
                } // for
            })
        );
    } // for
}
const updateAffectedPaymentMethods = (api: Api, addedPaymentMethodId: string|null, affectedPaymentMethods: AffectedPaymentMethods): void => {
    const {
        deleted : deletedPaymentMethods,
        shifted : shiftedPaymentMethods,
    } = affectedPaymentMethods;
    
    
    
    // noop added_paymentMethod:
    // the data is still fresh, nothing to update
    
    
    
    // remove deleted_paymentMethods:
    for (const deletedPaymentMethod of deletedPaymentMethods) {
        /* no need to await because `providedMutatedModel` is provided */ cumulativeUpdatePaginationCache(api as any, 'getPaymentMethodPage', 'DELETE', 'PaymentMethod', {
            providedMutatedModel : { id: deletedPaymentMethod } satisfies Pick<PaymentMethodDetail, 'id'>,
        });
    } // for
    
    
    
    // update shifted_paymentMethods:
    for (const [shiftedId, priority] of shiftedPaymentMethods) {
        setPaymentMethodPriorities(api, {
            predicate : ({id}) => (id === shiftedId),
            set       : priority,
        });
    } // for
    
    
    
    // update rest_paymentMethods:
    // because the paymentMethod_count may DECREASED|INCREASED, so the rest_paymentMethods are indirectly AFFECTED by `priority = paymentMethod_count - sort`:
    ((): void => {
        const addedCount   = (addedPaymentMethodId !== null) ? 1 : 0;
        const deletedCount = deletedPaymentMethods.length;
        const deltaCount   = addedCount - deletedCount;
        if (!(deltaCount)) return; // paymentMethod_count is NOT DECREASED|INCREASED => ignore
        
        
        
        shiftPaymentMethodPriorities(api, {
            predicate : ({id}) => (
                ((addedPaymentMethodId === null) || (id !== addedPaymentMethodId)) // not added_paymentMethod
                &&
                !deletedPaymentMethods.includes(id)                                // not deleted_paymentMethods
                &&
                !shiftedPaymentMethods.some(([shiftedId]) => (id === shiftedId))   // not shifted_paymentMethods
            ),
            delta     : deltaCount,
        });
    })();
}



export const {
    useLazyGetProductPageQuery             : useLazyGetProductPage,
    useGetProductPageQuery                 : useGetProductPage,
    
    useGetProductPreviewQuery              : useGetProductPreview,
    useLazyGetProductDetailQuery           : useLazyGetProductDetail,
    useGetProductDetailQuery               : useGetProductDetail,
    useLazySearchProductsQuery             : useSearchProducts,
    
    
    
    useLazyGetCategoryPageQuery            : useLazyGetCategoryPage,
    useGetCategoryPageQuery                : useGetCategoryPage,
    
    useLazyGetCategoryDetailQuery          : useLazyGetCategoryDetail,
    useGetCategoryDetailQuery              : useGetCategoryDetail,
    
    
    
    useGetShippingListQuery                : useGetShippingList,
    
    useGetCountryListQuery                 : useGetCountryList,
    useLazyGetStateListQuery               : useGetStateList,
    useLazyGetCityListQuery                : useGetCityList,
    
    
    
    useLazyGetMatchingShippingListQuery    : useGetMatchingShippingList,
    useRefreshMatchingShippingListMutation : useRefreshMatchingShippingList,
    
    
    
    // useLazyRestoreCartQuery                : useRestoreCart,
    // useBackupCartMutation                  : useBackupCart,
    
    
    
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
    
    
    
    useGetPaymentMethodOfCurrenyQuery      : useGetPaymentMethodOfCurreny,
    useGetPaymentMethodPageQuery           : useGetPaymentMethodPage,
    useCreatePaymentMethodSetupMutation    : useCreatePaymentMethodSetup,
    useUpdatePaymentMethodMutation         : useUpdatePaymentMethod,
    useDeletePaymentMethodMutation         : useDeletePaymentMethod,
    useSortPaymentMethodMutation           : useSortPaymentMethod,
} = apiSlice;

export const {
    restoreCart       : { initiate : restoreCart       },
    backupCart        : { initiate : backupCart        },
    
    
    
    placeOrder        : { initiate : placeOrder        },
    makePayment       : { initiate : makePayment       },
} = apiSlice.endpoints;



// utilities:
const selectTotalFromData   = (data: unknown): number => {
    return (
        ('ids' in (data as EntityState<unknown, string|number>|Pagination<unknown>))
        ? (data as EntityState<unknown, string|number>).ids.length
        : (data as Pagination<unknown>).total
    );
};
const selectModelsFromData  = <TModel extends Model|string>(data: unknown): TModel[] => {
    const items = (
        ('ids' in (data as EntityState<TModel, string|number>|Pagination<TModel>))
        ? Object.values((data as EntityState<TModel, string|number>).entities).filter((entity) : entity is Exclude<typeof entity, undefined> => (entity !== undefined))
        : (data as Pagination<TModel>).entities
    );
    return items;
};
const selectIdFromModel     = <TModel extends Model|string>(model: TModel): string => {
    return (typeof(model) === 'string') ? model : model.id;
};
const selectIndexOfId       = <TModel extends Model|string>(data: unknown, id: string): number => {
    return (
        ('ids' in (data as EntityState<TModel, string|number>|Pagination<TModel>))
        ? (
            (data as EntityState<TModel, string|number>).ids
            .findIndex((searchId) =>
                (searchId === id)
            )
        )
        : (
            (data as Pagination<TModel>).entities
            .findIndex((searchModel) =>
                (selectIdFromModel<TModel>(searchModel) === id)
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
        index   [page, perpage]     indexStart          indexEnd
        012	    [0, 3]              0 * 3   = 0       (0 + 3) - 1   = 2
        345	    [1, 3]              1 * 3   = 3       (3 + 3) - 1   = 5
        678	    [2, 3]              2 * 3   = 6       (6 + 3) - 1   = 8
    */
    const indexStart = page * perPage; // the model_index of the first_model of current pagination
    const indexEnd   = indexStart + (perPage - 1);
    return {
        indexStart,
        indexEnd,
        page,
        perPage,
    };
};



interface GetQueryCachesOptions<TModel> {
    predicate ?: (originalArgs: unknown, data: TModel) => boolean
}
export type Api = Parameters<Exclude<Parameters<Parameters<Parameters<typeof createApi>[0]['endpoints']>[0]['mutation']>[0]['onQueryStarted'], undefined>>[1]
const getQueryCaches = <TModel, TQueryArg, TBaseQuery extends BaseQueryFn = BaseQueryFn>(api: Api, endpointName: keyof (typeof apiSlice)['endpoints'], options?: GetQueryCachesOptions<TModel>) => {
    // options:
    const {
        predicate,
    } = options ?? {};
    
    
    
    // find related TModel data(s):
    const state                 = api.getState();
    const allQueryCaches        = state.api.queries;
    const collectionQueryCaches = (
        Object.values(allQueryCaches)
        .filter((allQueryCache): allQueryCache is Exclude<typeof allQueryCache, undefined> =>
            (allQueryCache !== undefined)
            &&
            (allQueryCache.status === QueryStatus.fulfilled)
            &&
            (allQueryCache.endpointName === endpointName)
            &&
            (allQueryCache.data !== undefined)
            &&
            ((predicate === undefined) || predicate(allQueryCache.originalArgs, allQueryCache.data as TModel))
        )
    );
    return collectionQueryCaches as QuerySubState<BaseEndpointDefinition<TQueryArg, TBaseQuery, TModel>>[];
};

type PaginationUpdateType =
    |'CREATE'
    |'UPDATE'
    |'UPSERT'
    |'UPDATE_OR_INVALIDATE'
    |'DELETE'
interface PaginationUpdateOptions<TModel extends Model|string>
    extends
        GetQueryCachesOptions<Pagination<TModel>>
{
    providedMutatedModel ?: TModel
    invalidatePageTag    ?: (tag: Exclude<Parameters<typeof apiSlice.util.invalidateTags>[0][number], null|undefined>, page: number) => string|number
}
const cumulativeUpdatePaginationCache = async <TModel extends Model|string, TQueryArg, TBaseQuery extends BaseQueryFn>(api: Api, endpointName: Extract<keyof (typeof apiSlice)['endpoints'], 'getProductPage'|'getWishGroupPage'|'getWishPage'|'getPaymentMethodPage'>, updateType: PaginationUpdateType, invalidateTag: Exclude<Parameters<typeof apiSlice.util.invalidateTags>[0][number], null|undefined>, options?: PaginationUpdateOptions<TModel>) => {
    // options:
    const {
        providedMutatedModel,
        invalidatePageTag = ((tag, page) => {
            if (typeof(tag) === 'string') {
                return page; // the tag doesn't have id => just use page number
            }
            else {
                const { id } = tag;
                return `${id}:${page}`; // merges tag's id and page number
            } // if
        }) satisfies PaginationUpdateOptions<TModel>['invalidatePageTag'],
    } = options ?? {};
    
    
    
    // mutated TModel data:
    const mutatedModel : TModel|undefined = (providedMutatedModel !== undefined) ? providedMutatedModel : await (async (): Promise<TModel|undefined> => {
        try {
            const { data: mutatedModel } = await api.queryFulfilled;
            return mutatedModel as TModel|undefined;
        }
        catch {
            return undefined;
        } // try
    })();
    if (mutatedModel === undefined) return; // api request aborted|failed => nothing to update
    const mutatedId = selectIdFromModel<TModel>(mutatedModel);
    
    
    
    // find related TModel data(s):
    const collectionQueryCaches = getQueryCaches<Pagination<TModel>, TQueryArg, TBaseQuery>(api, endpointName, options);
    
    
    
    const lastCollectionQueryCache       = collectionQueryCaches.length ? collectionQueryCaches[collectionQueryCaches.length - 1] : undefined;
    if (lastCollectionQueryCache === undefined) {
        // there's no queryCaches to update => nothing to do
        return;
    } // if
    
    
    
    /* update existing data: SIMPLE: the number of collection_items is unchanged */
    if ((updateType === 'UPDATE') || (updateType === 'UPSERT') || (updateType === 'UPDATE_OR_INVALIDATE')) {
        const mutatedPaginationIndices = (
            collectionQueryCaches
            .map(({ originalArgs, data }) => ({
                indexStart        : selectRangeFromArg(originalArgs).indexStart,
                indexLocalMutated : selectIndexOfId<TModel>(data, mutatedId),
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
        
        
        
        // reconstructuring the updated model, so the invalidatesTag can be avoided:
        
        
        
        // update cache:
        for (const { originalArgs } of mutatedCollectionQueryCaches) {
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as PaginationArgs, (data) => {
                    const currentModelIndex = selectIndexOfId<TModel>(data, mutatedId);
                    if (currentModelIndex < 0) return; // not found => nothing to update
                    const currentModel = (data.entities as unknown as TModel[])[currentModelIndex];
                    (data.entities as unknown as TModel[])[currentModelIndex] = (
                        ((typeof(currentModel) === 'object') && (typeof(mutatedModel) === 'object'))
                        ? {
                            ...currentModel,
                            ...mutatedModel, // partially|fully replace oldModel with mutatedModel
                        }
                        : mutatedModel       // fully           replace oldModel with mutatedModel
                    );
                })
            );
        } // for
    }
    
    /* add new data: COMPLEX: the number of collection_items is scaled_up */
    else if (updateType === 'CREATE') {
        /*
            Adding a_new_model causing the restPagination(s) shifted their models to neighboringPagination(s).
            [876] [543] [210] + 9 => [987] [654] [321] [0]
            page1 page2 page3        page1 page2 page3 pageTail
        */
        const shiftedCollectionQueryCaches = collectionQueryCaches;
        
        
        
        // reconstructuring the shifted models, so the invalidatesTag can be avoided:
        
        
        
        //#region BACKUP the models from paginations (which will be shifted) 
        const mergedModelList : TModel[] = []; // use an `Array<TModel>` instead of `Map<number, TModel>`, so we can SHIFT the key easily
        for (const { originalArgs, data } of shiftedCollectionQueryCaches) {
            const {
                indexStart, // the global first_model_index
                indexEnd,   // the global last_model_index
            } = selectRangeFromArg(originalArgs);
            
            
            
            /*
                Assumes the next paginations having the same perPage size:
                Only the last_model of current pagination is useful for backup.
                After the whole `mergedModelList` shifted_down, the last_model becomes the first_model of the next pagination chains.
            */
            const paginationModels = selectModelsFromData<TModel>(data);
            const relativeIndexEnd = indexEnd - indexStart; // a zero based starting index, select the LAST pagination model
            const modelEnd = (relativeIndexEnd < paginationModels.length) ? paginationModels[relativeIndexEnd] : undefined;
            if (modelEnd !== undefined) mergedModelList[indexEnd] = modelEnd; // if exists, copy the LAST pagination model
        } // for
        //#endregion BACKUP the models from paginations (which will be shifted) 
        
        
        
        // INSERT the new_model at the BEGINNING of the list:
        mergedModelList.unshift(mutatedModel);
        
        
        
        //#region RESTORE the shifted paginations from the backup
        for (const { originalArgs } of shiftedCollectionQueryCaches) {
            const {
                indexStart, // the global first_model_index
                page,
                perPage,
            } = selectRangeFromArg(originalArgs);
            
            const modelStart = mergedModelList[indexStart] as TModel|undefined; // take the *valid* first_model of current pagination, the old_first_model...the_2nd_last_model will be 2nd_first_model...last_model
            
            
            
            if (modelStart === undefined) {
                // UNABLE to reconstruct current pagination cache => invalidate the cache:
                api.dispatch(
                    apiSlice.util.invalidateTags([{ type: (typeof(invalidateTag) === 'string') ? invalidateTag : invalidateTag.id as any, id: invalidatePageTag(invalidateTag, page) }])
                );
            }
            else {
                // reconstruct current pagination cache:
                api.dispatch(
                    apiSlice.util.updateQueryData(endpointName, originalArgs as PaginationArgs, (data) => {
                        // RESTORE the modelStart at the BEGINNING of the pagination:
                        (data.entities as unknown as TModel[]).unshift(modelStart);
                        
                        
                        
                        // update the total data:
                        data.total++;
                        
                        
                        
                        // if OVERFLOW pagination size => remove the last model:
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
                indexLocalDeleted : selectIndexOfId<TModel>(data, mutatedId),
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
        
        
        
        // reconstructuring the deleted model, so the invalidatesTag can be avoided:
        
        
        
        //#region BACKUP the models from paginations (which will be shifted) 
        const mergedModelList : TModel[] = []; // use an `Array<TModel>` instead of `Map<number, TModel>`, so we can SHIFT the key easily
        for (const { originalArgs, data } of shiftedCollectionQueryCaches) {
            const {
                indexStart, // the global first_model_index
            } = selectRangeFromArg(originalArgs);
            
            
            
            /*
                Assumes the prev paginations having the same perPage size:
                Only the first_model of current pagination is useful for backup.
                After the whole `mergedModelList` shifted_up, the first_model becomes the last_model of the prev pagination chains.
            */
            const paginationModels = selectModelsFromData<TModel>(data);
            const modelStart = paginationModels[0] as TModel|undefined; // a zero based starting index, select the FIRST pagination model
            if (modelStart !== undefined) mergedModelList[indexStart] = modelStart; // if exists, copy the FIRST pagination model
        } // for
        //#endregion BACKUP the models from paginations (which will be shifted) 
        
        
        
        // REMOVE the del_model at the DELETED_INDEX of the list:
        mergedModelList.splice(indexDeleted, 1);
        
        
        
        //#region RESTORE the shifted paginations from the backup
        for (const { originalArgs, data } of shiftedCollectionQueryCaches) {
            const {
                indexStart, // the global first_model_index
                indexEnd,   // the global last_model_index
                page,
            } = selectRangeFromArg(originalArgs);
            const indexLast = (
                indexStart
                +
                (selectTotalFromData(data) - 1)
            );
            
            const modelEnd = mergedModelList[indexEnd] as TModel|undefined; // take the *valid* last_model of current pagination, the old_2nd_first_model...the_last_model will be first_model...2nd_last_model
            
            
            
            // reconstruct current pagination cache:
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as PaginationArgs, (data) => {
                    // Shift up at the top/middle of pagination:
                    if ((indexDeleted >= indexStart) && (indexDeleted <= indexLast)) { // the deleted_pagination => within indexStart to indexLast
                        // REMOVE the deleted model at specific index:
                        const relativeIndexDeleted = indexDeleted - indexStart;
                        data.entities.splice(relativeIndexDeleted, 1);
                    }
                    else { // the shifted_up_pagination => below the deleted_pagination
                        // because ONE model in prev pagination has been DELETED => ALL subsequent paginations are SHIFTED_UP:
                        // REMOVE the first model for shifting:
                        data.entities.shift();
                    } // if
                    
                    
                    
                    // a shifting compensation to maintain pagination size (if possible):
                    // RESTORE the modelStart at the END of the pagination:
                    if (modelEnd !== undefined /* if possible */) (data.entities as unknown as TModel[]).push(modelEnd);
                    
                    
                    
                    // update the total data:
                    data.total--;
                    
                    
                    
                    // if UNDERFLOW (empty) pagination size => invalidate the cache:
                    if (!data.entities.length) {
                        api.dispatch(
                            apiSlice.util.invalidateTags([{ type: (typeof(invalidateTag) === 'string') ? invalidateTag : invalidateTag.id as any, id: invalidatePageTag(invalidateTag, page) }])
                        );
                    } // if
                })
            );
        } // for
        //#endregion RESTORE the shifted paginations from the backup
    } // if
};

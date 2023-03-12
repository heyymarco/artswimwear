import type { RootState } from '@/store/store';
import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



export interface ProductEntry {
    _id   : string
    name  : string
    price : number
    image : string
    path  : string
}
const productListAdapter = createEntityAdapter<ProductEntry>({
    selectId : (productEntry) => productEntry._id,
});

export interface PriceEntry {
    _id   : string
    price : number
}
const priceListAdapter = createEntityAdapter<PriceEntry>({
    selectId : (priceEntry) => priceEntry._id,
});

export interface CountryEntry {
    code : string
    name : string
}
const countryListAdapter = createEntityAdapter<CountryEntry>({
    selectId : (countryEntry) => countryEntry.code,
});

export interface ShippingEntry {
    _id                 : string
    name                : string
    estimate           ?: string
    weightStep          : number
    shippingRate        : Array<{
        startingWeight  : number
        rate            : number
    }>
}
const shippingListAdapter = createEntityAdapter<ShippingEntry>({
    selectId : (shippingEntry) => shippingEntry._id,
});



export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery : fetchBaseQuery({
        baseUrl: '/api'
    }),
    endpoints : (builder) => ({
        getProductList: builder.query<EntityState<ProductEntry>, void>({
            query : () => 'product',
            transformResponse(response: ProductEntry[]) {
                return productListAdapter.addMany(productListAdapter.getInitialState(), response);
            },
        }),
        getProductDetail: builder.query<any, string>({
            query : (productPath: string) => `product?path=${productPath}`,
        }),
        
        getPriceList: builder.query<EntityState<PriceEntry>, void>({
            query : () => 'priceList',
            transformResponse(response: PriceEntry[]) {
                return priceListAdapter.addMany(priceListAdapter.getInitialState(), response);
            },
        }),
        
        getCountryList: builder.query<EntityState<CountryEntry>, void>({
            query : () => 'countryList',
            transformResponse(response: CountryEntry[]) {
                return countryListAdapter.addMany(countryListAdapter.getInitialState(), response);
            },
        }),
        
        getShippingList: builder.query<EntityState<ShippingEntry>, void>({
            query : () => 'shippingList',
            transformResponse(response: ShippingEntry[]) {
                return shippingListAdapter.addMany(shippingListAdapter.getInitialState(), response);
            },
        }),
    }),
});



export const {
    useGetProductListQuery,
    useGetProductDetailQuery,
    
    useGetPriceListQuery,
    
    useGetCountryListQuery,
    
    useGetShippingListQuery,
} = apiSlice;



// // selectors:
// export const {
//     selectById : getProductPrice,
// } = priceListAdapter.getSelectors<RootState>(
//     (state) => state.api as any
// );



// utilities:
export const calculateShippingCost = (totalWeight: number|undefined|null, {weightStep, shippingRate}: Pick<ShippingEntry, 'weightStep'|'shippingRate'>): number|null => {
    if ((totalWeight === undefined) || (totalWeight === null) || isNaN(totalWeight) || !isFinite(totalWeight)) return null;
    
    
    
    let totalCost = 0;
    for (
        let index = 0,
            maxIndex              = shippingRate.length,
            
            remainingWeight       = Math.max(Math.ceil(totalWeight / weightStep) * weightStep, weightStep),
            currentWeight         : number,
            
            currentRate           : typeof shippingRate[number],
            currentStartingWeight : number,
            nextStartingWeight    : number|undefined,
            
            currentCost           : number
        ;
        index < maxIndex
        ;
        index++
    ) {
        currentRate           = shippingRate[index];
        currentStartingWeight = currentRate.startingWeight;
        nextStartingWeight    = shippingRate[index + 1]?.startingWeight;
        
        
        
        currentWeight         = (nextStartingWeight !== undefined) ? (nextStartingWeight - currentStartingWeight) : remainingWeight;
        currentWeight         = Math.min(currentWeight, remainingWeight);
        
        currentCost           = currentWeight * currentRate.rate
        totalCost            += currentCost;
        
        
        
        remainingWeight -= currentWeight;
        if (remainingWeight <= 0) break;
    } // for
    return totalCost;
};

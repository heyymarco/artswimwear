import type { RootState } from '@/store/store';
import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { CartState } from '../cart/cartSlice';
import type { PaymentToken, CheckoutState } from '../checkout/checkoutSlice';



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
    _id             : string
    price           : number
    shippingWeight ?: number
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
    shippingRates       : Array<{
        startingWeight  : number
        rate            : number
    }>
}
const shippingListAdapter = createEntityAdapter<ShippingEntry>({
    selectId : (shippingEntry) => shippingEntry._id,
});

export interface PaymentEntry
    extends
        Omit<CartState, 'showCart'>,
        Omit<CheckoutState, 'checkoutStep'>
{
}
export interface PaymentResult
{
    succeeded ?: string
    failed    ?: string
}


export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery : fetchBaseQuery({
        baseUrl: '/api'
    }),
    endpoints : (builder) => ({
        getProductList   : builder.query<EntityState<ProductEntry>, void>({
            query : () => 'product',
            transformResponse(response: ProductEntry[]) {
                return productListAdapter.addMany(productListAdapter.getInitialState(), response);
            },
        }),
        getProductDetail : builder.query<any, string>({
            query : (productPath: string) => `product?path=${productPath}`,
        }),
        
        
        
        getPriceList : builder.query<EntityState<PriceEntry>, void>({
            query : () => 'priceList',
            transformResponse(response: PriceEntry[]) {
                return priceListAdapter.addMany(priceListAdapter.getInitialState(), response);
            },
        }),
        
        
        
        getCountryList : builder.query<EntityState<CountryEntry>, void>({
            query : () => 'countryList',
            transformResponse(response: CountryEntry[]) {
                return countryListAdapter.addMany(countryListAdapter.getInitialState(), response);
            },
        }),
        
        
        
        getShippingList : builder.query<EntityState<ShippingEntry>, void>({
            query : () => 'shippingList',
            transformResponse(response: ShippingEntry[]) {
                return shippingListAdapter.addMany(shippingListAdapter.getInitialState(), response);
            },
        }),
        
        
        
        generatePaymentToken : builder.mutation<PaymentToken, void>({
            query : () => ({
                url    : 'payment',
                method : 'GET',
            }),
        }),
        placeOrder           : builder.mutation<PaymentResult, PaymentEntry>({
            query : (payment) => ({
                url    : 'payment',
                method : 'POST',
                body   : payment,
            }),
        }),
        makePayment          : builder.mutation<PaymentResult, PaymentEntry>({
            query : (payment) => ({
                url    : 'payment',
                method : 'PATCH',
                body   : payment,
            }),
        }),
    }),
});



export const {
    useGetProductListQuery,
    useGetProductDetailQuery,
    
    useGetPriceListQuery,
    
    useGetCountryListQuery,
    
    useGetShippingListQuery,
    
    useGeneratePaymentTokenMutation,
    useMakePaymentMutation,
} = apiSlice;



// // selectors:
// export const {
//     selectById : getProductPrice,
// } = priceListAdapter.getSelectors<RootState>(
//     (state) => state.api as any
// );



// utilities:
export const calculateShippingCost = (totalWeight: number|undefined|null, {weightStep, shippingRates}: Pick<ShippingEntry, 'weightStep'|'shippingRates'>): number|null => {
    if ((totalWeight === undefined) || (totalWeight === null) || isNaN(totalWeight) || !isFinite(totalWeight)) return null;
    
    
    
    weightStep = Math.max(0, weightStep);
    let totalCost = 0;
    for (
        let index = 0,
            maxIndex              = shippingRates.length,
            
            remainingWeight       = !weightStep ? totalWeight : Math.max(Math.ceil(totalWeight / weightStep) * weightStep, weightStep),
            currentWeight         : number,
            
            currentRate           : typeof shippingRates[number],
            currentStartingWeight : number,
            nextStartingWeight    : number|undefined,
            
            currentCost           : number
        ;
        index < maxIndex
        ;
        index++
    ) {
        currentRate           = shippingRates[index];
        currentStartingWeight = currentRate.startingWeight;
        nextStartingWeight    = shippingRates[index + 1]?.startingWeight;
        
        
        
        currentWeight         = (nextStartingWeight !== undefined) ? (nextStartingWeight - currentStartingWeight) : remainingWeight;
        currentWeight         = Math.min(currentWeight, remainingWeight);
        
        currentCost           = currentWeight * currentRate.rate;
        totalCost            += currentCost;
        
        
        
        remainingWeight      -= currentWeight;
        if (remainingWeight <= 0) break;
    } // for
    return totalCost;
};

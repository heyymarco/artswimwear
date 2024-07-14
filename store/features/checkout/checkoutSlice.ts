// redux:
import {
    createSlice,
    PayloadAction,
}                           from '@reduxjs/toolkit'

// stores:
import type {
    // types:
    RootState,
}                           from '../../store'

// models:
import {
    type ShippingAddressDetail,
    type BillingAddressDetail,
    type CheckoutStep,
    type PaymentMethod,
}                           from '@/models'

// apis:
import type {
    PaymentToken,
    
    ExtraData,
    CustomerData,
    ShippingData,
    BillingData,
}                           from '@/app/api/checkout/route'
export type {
    PaymentToken,
    
    ExtraData,
    CustomerData,
    ShippingData,
    BillingData,
}                           from '@/app/api/checkout/route'



export interface CheckoutState
    extends
        ExtraData,
        CustomerData,
        ShippingData,
        BillingData
{
    // version control:
    version           ?: number,
    
    
    
    // states:
    checkoutStep       : CheckoutStep
    
    
    
    // customer data:
    customerValidation : boolean
    
    
    
    // shipping data:
    shippingValidation : boolean
    
    
    
    // billing data:
    billingValidation  : boolean
    billingAsShipping  : boolean
    
    
    
    // payment data:
    paymentValidation  : boolean
    
    paymentMethod     ?: PaymentMethod
    
    paymentToken      ?: PaymentToken
}

const initialState : CheckoutState = {
    // version control:
    version            : 3,
    
    
    
    // states:
    checkoutStep       : 'info',
    
    
    
    // extra data:
    marketingOpt       : true,
    
    
    
    // customer data:
    customerValidation : false,
    
    customerName       : '',
    customerEmail      : '',
    
    
    
    // shipping data:
    shippingValidation : false,
    shippingAddress    : null,
    shippingProvider   : undefined,
    
    
    
    // billing data:
    billingValidation  : false,
    billingAsShipping  : true,
    billingAddress     : null,
    
    
    
    // payment data:
    paymentValidation  : false,
    
    paymentMethod      : undefined,
    
    paymentToken       : undefined,
};
export const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        // version control:
        resetIfInvalid        : (state) => {
            if (state.version === 3) return state; // valid   => ignore
            return initialState;                   // invalid => reset
        },
        
        
        
        // states:
        setCheckoutStep       : (state, {payload: value}: PayloadAction<CheckoutStep>) => {
            state.checkoutStep = value;
        },
        
        
        
        // extra data:
        setMarketingOpt       : (state, {payload: value}: PayloadAction<boolean>) => {
            state.marketingOpt = value;
        },
        
        
        
        // customer data:
        setCustomerValidation : (state, {payload: value}: PayloadAction<boolean>) => {
            state.customerValidation = value;
        },
        
        setCustomerName       : (state, {payload: value}: PayloadAction<string>) => {
            state.customerName = value;
        },
        setCustomerEmail      : (state, {payload: value}: PayloadAction<string>) => {
            state.customerEmail = value;
        },
        
        
        
        // shipping data:
        setShippingValidation : (state, {payload: value}: PayloadAction<boolean>) => {
            state.shippingValidation = value;
        },
        setShippingAddress    : (state, {payload: value}: PayloadAction<ShippingAddressDetail|null>) => {
            state.shippingAddress = value;
        },
        setShippingProvider   : (state, {payload: value}: PayloadAction<string>) => {
            state.shippingProvider = value;
        },
        
        
        
        // billing data:
        setBillingValidation  : (state, {payload: value}: PayloadAction<boolean>) => {
            state.billingValidation = value;
        },
        
        setBillingAsShipping  : (state, {payload: value}: PayloadAction<boolean>) => {
            state.billingAsShipping = value;
        },
        
        setBillingAddress     : (state, {payload: value}: PayloadAction<BillingAddressDetail|null>) => {
            state.billingAddress = value;
        },
        
        
        
        // payment data:
        setPaymentValidation  : (state, {payload: value}: PayloadAction<boolean>) => {
            state.paymentValidation = value;
        },
        
        setPaymentMethod      : (state, {payload: value}: PayloadAction<PaymentMethod|undefined>) => {
            state.paymentMethod = value;
        },
        
        setPaymentToken       : (state, {payload: value}: PayloadAction<PaymentToken|undefined>) => {
            state.paymentToken = value;
        },
        
        
        
        // actions:
        resetCheckoutData     : (state) => {
            Object.assign(state, initialState);
        },
    },
});



export default checkoutSlice.reducer;
export const {
    // version control:
    resetIfInvalid,
    
    
    
    // states:
    setCheckoutStep,
    
    
    
    // extra data:
    setMarketingOpt,
    
    
    
    // customer data:
    setCustomerValidation,
    
    setCustomerName,
    setCustomerEmail,
    
    
    
    // shipping data:
    setShippingValidation,
    setShippingAddress,
    setShippingProvider,
    
    
    
    // billing data:
    setBillingValidation,
    setBillingAsShipping,
    setBillingAddress,
    
    
    
    // payment data:
    setPaymentValidation,
    
    setPaymentMethod,
    
    setPaymentToken,
    
    
    
    // actions:
    resetCheckoutData,
} = checkoutSlice.actions;



// selectors:
export const selectCheckoutState = (state: RootState): CheckoutState => {
    const {
        // @ts-ignore
        _persist, // remove
    ...restCheckoutState} = state.checkout;
    
    return restCheckoutState;
};

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



export type CheckoutStep =
    |'info'
    |'shipping'
    |'payment'
    |'pending'
    |'paid'
export type PaymentMethod =
    |'card'
    |'paypal'
    |'qris'
    |'gopay'
    |'shopeepay'
    |'manual'
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
    version            : 2,
    
    
    
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
    
    shippingFirstName  : '',
    shippingLastName   : '',
    
    shippingPhone      : '',
    
    shippingAddress    : '',
    shippingCity       : '',
    shippingZone       : '',
    shippingZip        : '',
    shippingCountry    : '',
    
    shippingProvider   : undefined,
    
    
    
    // billing data:
    billingValidation  : false,
    
    billingAsShipping  : true,
    
    billingFirstName   : '',
    billingLastName    : '',
    
    billingPhone       : '',
    
    billingAddress     : '',
    billingCity        : '',
    billingZone        : '',
    billingZip         : '',
    billingCountry     : '',
    
    
    
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
            if (state.version === 2) return state; // valid   => ignore
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
        
        setShippingFirstName  : (state, {payload: value}: PayloadAction<string>) => {
            state.shippingFirstName = value;
        },
        setShippingLastName   : (state, {payload: value}: PayloadAction<string>) => {
            state.shippingLastName = value;
        },
        
        setShippingPhone      : (state, {payload: value}: PayloadAction<string>) => {
            state.shippingPhone = value;
        },
        
        setShippingAddress    : (state, {payload: value}: PayloadAction<string>) => {
            state.shippingAddress = value;
        },
        setShippingCity       : (state, {payload: value}: PayloadAction<string>) => {
            state.shippingCity = value;
        },
        setShippingZone       : (state, {payload: value}: PayloadAction<string>) => {
            state.shippingZone = value;
        },
        setShippingZip        : (state, {payload: value}: PayloadAction<string>) => {
            state.shippingZip = value;
        },
        setShippingCountry    : (state, {payload: value}: PayloadAction<string>) => {
            state.shippingCountry = value;
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
        
        setBillingFirstName   : (state, {payload: value}: PayloadAction<string>) => {
            state.billingFirstName = value;
        },
        setBillingLastName    : (state, {payload: value}: PayloadAction<string>) => {
            state.billingLastName = value;
        },
        
        setBillingPhone       : (state, {payload: value}: PayloadAction<string>) => {
            state.billingPhone = value;
        },
        
        setBillingAddress     : (state, {payload: value}: PayloadAction<string>) => {
            state.billingAddress = value;
        },
        setBillingCity        : (state, {payload: value}: PayloadAction<string>) => {
            state.billingCity = value;
        },
        setBillingZone        : (state, {payload: value}: PayloadAction<string>) => {
            state.billingZone = value;
        },
        setBillingZip         : (state, {payload: value}: PayloadAction<string>) => {
            state.billingZip = value;
        },
        setBillingCountry     : (state, {payload: value}: PayloadAction<string>) => {
            state.billingCountry = value;
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
    
    setShippingFirstName,
    setShippingLastName,
    
    setShippingPhone,
    
    setShippingAddress,
    setShippingCity,
    setShippingZone,
    setShippingZip,
    setShippingCountry,
    
    setShippingProvider,
    
    
    
    // billing data:
    setBillingValidation,
    
    setBillingAsShipping,
    
    setBillingFirstName,
    setBillingLastName,
    
    setBillingPhone,
    
    setBillingAddress,
    setBillingCity,
    setBillingZone,
    setBillingZip,
    setBillingCountry,
    
    
    
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

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
    type CustomerOrGuestPreview,
    
    type ShippingAddressDetail,
    type BillingAddressDetail,
    type CheckoutStep,
    type PaymentMethod,
    type CheckoutPaymentSessionDetail,
}                           from '@/models'



export interface CheckoutSession {
    // version control:
    version           ?: number,
    
    
    
    // states:
    checkoutStep       : CheckoutStep
    
    
    
    // extra data:
    marketingOpt       : boolean
    
    
    
    // customer data:
    customerValidation : boolean
    customer           : CustomerOrGuestPreview|undefined
    
    
    
    // shipping data:
    shippingValidation : boolean
    shippingAddress    : ShippingAddressDetail|null
    shippingProviderId : string|null
    
    
    
    // billing data:
    billingValidation  : boolean
    billingAsShipping  : boolean
    billingAddress     : BillingAddressDetail|null
    
    
    
    // payment data:
    paymentValidation  : boolean
    paymentMethod      : PaymentMethod|null
    paymentSession    ?: CheckoutPaymentSessionDetail
}

const initialState : CheckoutSession = {
    // version control:
    version            : 4,
    
    
    
    // states:
    checkoutStep       : 'INFO',
    
    
    
    // extra data:
    marketingOpt       : true,
    
    
    
    // customer data:
    customerValidation : false,
    customer           : undefined,
    
    
    
    // shipping data:
    shippingValidation : false,
    shippingAddress    : null,
    shippingProviderId : null,
    
    
    
    // billing data:
    billingValidation  : false,
    billingAsShipping  : true,
    billingAddress     : null,
    
    
    
    // payment data:
    paymentValidation  : false,
    paymentMethod      : null,
    paymentSession     : undefined,
};
export const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        // version control:
        resetIfInvalid        : (state) => {
            if (state.version === 4) return state; // valid   => ignore
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
            state.customer ??= { name: '', email: '' };
            state.customer.name = value;
        },
        setCustomerEmail      : (state, {payload: value}: PayloadAction<string>) => {
            state.customer ??= { name: '', email: '' };
            state.customer.email = value;
        },
        
        
        
        // shipping data:
        setShippingValidation : (state, {payload: value}: PayloadAction<boolean>) => {
            state.shippingValidation = value;
        },
        setShippingAddress    : (state, {payload: value}: PayloadAction<ShippingAddressDetail|null>) => {
            state.shippingAddress = value;
        },
        setShippingProviderId : (state, {payload: value}: PayloadAction<string|null>) => {
            state.shippingProviderId = value;
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
        setPaymentMethod      : (state, {payload: value}: PayloadAction<PaymentMethod|null>) => {
            state.paymentMethod = value;
        },
        setPaymentSession     : (state, {payload: value}: PayloadAction<CheckoutPaymentSessionDetail|undefined>) => {
            state.paymentSession = value;
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
    setShippingProviderId,
    
    
    
    // billing data:
    setBillingValidation,
    setBillingAsShipping,
    setBillingAddress,
    
    
    
    // payment data:
    setPaymentValidation,
    setPaymentMethod,
    setPaymentSession,
    
    
    
    // actions:
    resetCheckoutData,
} = checkoutSlice.actions;



// selectors:
export const selectCheckoutSession = (state: RootState): CheckoutSession => {
    const {
        // @ts-ignore
        _persist, // remove
        ...restCheckoutSession
    } = state.checkout;
    
    return restCheckoutSession;
};

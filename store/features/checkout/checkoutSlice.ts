import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../store';



export type CheckoutStep = 'info'|'shipping'|'payment'|'pending'|'paid'
export interface PaymentToken {
    paymentToken : string
    expires      : number
}
export type PaymentMethod = 'card'|'paypal'|'manual'
export interface CheckoutState {
    // states:
    checkoutStep           : CheckoutStep
    isBusy                 : boolean
    
    
    
    // extra data:
    marketingOpt           : boolean
    
    
    
    // customer data:
    customerNickName       : string
    customerEmail          : string
    
    
    
    // shipping data:
    shippingValidation     : boolean
    
    shippingFirstName      : string
    shippingLastName       : string
    
    shippingPhone          : string
    
    shippingAddress        : string
    shippingCity           : string
    shippingZone           : string
    shippingZip            : string
    shippingCountry        : string
    
    shippingProvider      ?: string
    
    
    
    // billing data:
    billingValidation      : boolean
    billingAsShipping      : boolean
    
    billingFirstName       : string
    billingLastName        : string
    
    billingPhone           : string
    
    billingAddress         : string
    billingCity            : string
    billingZone            : string
    billingZip             : string
    billingCountry         : string
    
    
    
    // payment data:
    paymentValidation      : boolean
    paymentMethod         ?: PaymentMethod
    paymentToken          ?: PaymentToken
}

const initialState: CheckoutState = {
    // states:
    checkoutStep           : 'info',
    isBusy                 : false,
    
    
    
    // extra data:
    marketingOpt           : true,
    
    
    
    // customer data:
    customerNickName       : '',
    customerEmail          : '',
    
    
    
    // shipping data:
    shippingValidation     : false,
    
    shippingFirstName      : '',
    shippingLastName       : '',
    
    shippingPhone          : '',
    
    shippingAddress        : '',
    shippingCity           : '',
    shippingZone           : '',
    shippingZip            : '',
    shippingCountry        : '',
    
    shippingProvider       : undefined,
    
    
    
    // billing data:
    billingValidation      : false,
    billingAsShipping      : true,
    
    billingFirstName       : '',
    billingLastName        : '',
    
    billingPhone           : '',
    
    billingAddress         : '',
    billingCity            : '',
    billingZone            : '',
    billingZip             : '',
    billingCountry         : '',
    
    
    
    // payment data:
    paymentValidation      : false,
    paymentMethod          : undefined,
    paymentToken           : undefined,
};
export const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        // states:
        setCheckoutStep: (state, {payload: value}: PayloadAction<CheckoutStep>) => {
            state.checkoutStep = value;
        },
        setIsBusy      : (state, {payload: value}: PayloadAction<boolean>) => {
            state.isBusy = value;
        },
        
        
        
        // extra data:
        setMarketingOpt: (state, {payload: value}: PayloadAction<boolean>) => {
            state.marketingOpt = value;
        },
        
        
        
        // customer data:
        setCustomerNickName: (state, {payload: value}: PayloadAction<string>) => {
            state.customerNickName = value;
        },
        setCustomerEmail: (state, {payload: value}: PayloadAction<string>) => {
            state.customerEmail = value;
        },
        
        
        
        // shipping data:
        setShippingValidation: (state, {payload: value}: PayloadAction<boolean>) => {
            state.shippingValidation = value;
        },
        
        setShippingFirstName: (state, {payload: value}: PayloadAction<string>) => {
            state.shippingFirstName = value;
        },
        setShippingLastName: (state, {payload: value}: PayloadAction<string>) => {
            state.shippingLastName = value;
        },
        
        setShippingPhone: (state, {payload: value}: PayloadAction<string>) => {
            state.shippingPhone = value;
        },
        
        setShippingAddress : (state, {payload: value}: PayloadAction<string>) => {
            state.shippingAddress = value;
        },
        setShippingCity: (state, {payload: value}: PayloadAction<string>) => {
            state.shippingCity = value;
        },
        setShippingZone: (state, {payload: value}: PayloadAction<string>) => {
            state.shippingZone = value;
        },
        setShippingZip: (state, {payload: value}: PayloadAction<string>) => {
            state.shippingZip = value;
        },
        setShippingCountry : (state, {payload: value}: PayloadAction<string>) => {
            state.shippingCountry = value;
        },
        
        setShippingProvider: (state, {payload: value}: PayloadAction<string>) => {
            state.shippingProvider = value;
        },
        
        
        
        // billing data:
        setBillingValidation: (state, {payload: value}: PayloadAction<boolean>) => {
            state.billingValidation = value;
        },
        setBillingAsShipping: (state, {payload: value}: PayloadAction<boolean>) => {
            state.billingAsShipping = value;
        },
        
        setBillingFirstName: (state, {payload: value}: PayloadAction<string>) => {
            state.billingFirstName = value;
        },
        setBillingLastName : (state, {payload: value}: PayloadAction<string>) => {
            state.billingLastName = value;
        },
        
        setBillingPhone: (state, {payload: value}: PayloadAction<string>) => {
            state.billingPhone = value;
        },
        
        setBillingAddress: (state, {payload: value}: PayloadAction<string>) => {
            state.billingAddress = value;
        },
        setBillingCity: (state, {payload: value}: PayloadAction<string>) => {
            state.billingCity = value;
        },
        setBillingZone: (state, {payload: value}: PayloadAction<string>) => {
            state.billingZone = value;
        },
        setBillingZip: (state, {payload: value}: PayloadAction<string>) => {
            state.billingZip = value;
        },
        setBillingCountry: (state, {payload: value}: PayloadAction<string>) => {
            state.billingCountry = value;
        },
        
        
        
        // payment data:
        setPaymentValidation: (state, {payload: value}: PayloadAction<boolean>) => {
            state.paymentValidation = value;
        },
        setPaymentMethod: (state, {payload: value}: PayloadAction<PaymentMethod|undefined>) => {
            state.paymentMethod = value;
        },
        setPaymentToken: (state, {payload: value}: PayloadAction<PaymentToken|undefined>) => {
            state.paymentToken = value;
        },
    },
});



export default checkoutSlice.reducer;
export const {
    // states:
    setCheckoutStep,
    setIsBusy,
    
    
    
    // extra data:
    setMarketingOpt,
    
    
    
    // customer data:
    setCustomerNickName,
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
} = checkoutSlice.actions;



// selectors:
export const selectCheckoutState = (state: RootState): CheckoutState => {
    const {
        // @ts-ignore
        _persist, // remove
    ...restCheckoutState} = state.checkout;
    
    return restCheckoutState;
};

export const selectCheckoutProgress = ({checkout: {checkoutStep}}: RootState): number => {
    return ['info', 'shipping', 'payment', 'pending', 'paid'].findIndex((progress) => progress === checkoutStep);
};

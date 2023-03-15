import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../store';



export type CheckoutStep = 'info'|'shipping'|'payment'
export interface PaymentToken {
    paymentToken : string
    expires      : number
}
export interface CheckoutState {
    checkoutStep       : CheckoutStep
    marketingOpt       : boolean
    
    
    
    shippingValidation : boolean
    
    shippingFirstName  : string
    shippingLastName   : string
    
    shippingPhone      : string
    shippingEmail      : string
    
    shippingCountry    : string
    shippingAddress    : string
    shippingCity       : string
    shippingZone       : string
    shippingZip        : string
    
    shippingProvider  ?: string
    
    
    
    billingAsShipping  : boolean
    billingValidation  : boolean
    
    billingFirstName   : string
    billingLastName    : string
    
    billingPhone       : string
    billingEmail       : string
    
    billingCountry     : string
    billingAddress     : string
    billingCity        : string
    billingZone        : string
    billingZip         : string
    
    
    
    paymentMethod     ?: number
    paymentToken      ?: PaymentToken
}

const initialState: CheckoutState = {
    checkoutStep       : 'info',
    marketingOpt       : true,
    
    
    
    shippingValidation : false,
    
    shippingFirstName  : '',
    shippingLastName   : '',
    
    shippingPhone      : '',
    shippingEmail      : '',
    
    shippingCountry    : '',
    shippingAddress    : '',
    shippingCity       : '',
    shippingZone       : '',
    shippingZip        : '',
    
    
    
    billingAsShipping  : true,
    billingValidation  : false,
    
    billingFirstName   : '',
    billingLastName    : '',
    
    billingPhone       : '',
    billingEmail       : '',
    
    billingCountry     : '',
    billingAddress     : '',
    billingCity        : '',
    billingZone        : '',
    billingZip         : '',
    
    
    
    paymentMethod      : undefined,
    paymentToken       : undefined,
};
export const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setCheckoutStep: (state, {payload: value}: PayloadAction<CheckoutStep>) => {
            state.checkoutStep = value;
        },
        setMarketingOpt: (state, {payload: value}: PayloadAction<boolean>) => {
            state.marketingOpt = value;
        },
        
        
        
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
        setShippingEmail: (state, {payload: value}: PayloadAction<string>) => {
            state.shippingEmail = value;
        },
        
        setShippingCountry: (state, {payload: value}: PayloadAction<string>) => {
            state.shippingCountry = value;
        },
        setShippingAddress: (state, {payload: value}: PayloadAction<string>) => {
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
        
        setShippingProvider: (state, {payload: value}: PayloadAction<string>) => {
            state.shippingProvider = value;
        },
        
        
        
        setBillingAsShipping: (state, {payload: value}: PayloadAction<boolean>) => {
            state.billingAsShipping = value;
        },
        setBillingValidation: (state, {payload: value}: PayloadAction<boolean>) => {
            state.billingValidation = value;
        },
        
        setBillingFirstName: (state, {payload: value}: PayloadAction<string>) => {
            state.billingFirstName = value;
        },
        setBillingLastName: (state, {payload: value}: PayloadAction<string>) => {
            state.billingLastName = value;
        },
        
        setBillingPhone: (state, {payload: value}: PayloadAction<string>) => {
            state.billingPhone = value;
        },
        setBillingEmail: (state, {payload: value}: PayloadAction<string>) => {
            state.billingEmail = value;
        },
        
        setBillingCountry: (state, {payload: value}: PayloadAction<string>) => {
            state.billingCountry = value;
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
        
        
        
        setPaymentMethod: (state, {payload: value}: PayloadAction<number|undefined>) => {
            state.paymentMethod = value;
        },
        setPaymentToken: (state, {payload: value}: PayloadAction<PaymentToken|undefined>) => {
            state.paymentToken = value;
        },
    },
});



export default checkoutSlice.reducer;
export const {
    setCheckoutStep,
    setMarketingOpt,
    
    
    
    setShippingValidation,
    
    setShippingFirstName,
    setShippingLastName,
    
    setShippingPhone,
    setShippingEmail,
    
    setShippingCountry,
    setShippingAddress,
    setShippingCity,
    setShippingZone,
    setShippingZip,
    
    setShippingProvider,
    
    
    
    setBillingAsShipping,
    setBillingValidation,
    
    setBillingFirstName,
    setBillingLastName,
    
    setBillingPhone,
    setBillingEmail,
    
    setBillingCountry,
    setBillingAddress,
    setBillingCity,
    setBillingZone,
    setBillingZip,
    
    
    
    setPaymentMethod,
    setPaymentToken,
} = checkoutSlice.actions;



// selectors:
export const selectCheckoutState = (state: RootState): CheckoutState => {
    const {
        checkoutStep,
        marketingOpt,
        
        
        
        shippingValidation,
        
        shippingFirstName,
        shippingLastName,
        
        shippingPhone,
        shippingEmail,
        
        shippingCountry,
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        
        shippingProvider,
        
        
        
        billingAsShipping,
        billingValidation,
        
        billingFirstName,
        billingLastName,
        
        billingPhone,
        billingEmail,
        
        billingCountry,
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        
        
        
        paymentMethod,
        paymentToken,
    } = state.checkout;
    
    return {
        checkoutStep,
        marketingOpt,
        
        
        
        shippingValidation,
        
        shippingFirstName,
        shippingLastName,
        
        shippingPhone,
        shippingEmail,
        
        shippingCountry,
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        
        shippingProvider,
        
        
        
        billingAsShipping,
        billingValidation,
        
        billingFirstName,
        billingLastName,
        
        billingPhone,
        billingEmail,
        
        billingCountry,
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        
        
        
        paymentMethod,
        paymentToken,
    };
};

export const selectCheckoutProgress = ({checkout: {checkoutStep}}: RootState): number => {
    return ['info', 'shipping', 'payment'].findIndex((progress) => progress === checkoutStep);
};

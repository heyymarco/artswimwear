import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../store';



export type CheckoutStep = 'info'|'shipping'|'payment'
export interface ClientToken {
    clientToken : string
    expires     : number
}
export interface CheckoutState {
    checkoutStep         : CheckoutStep
    marketingOpt         : boolean
    
    
    
    shippingValidation   : boolean
    
    shippingFirstName   ?: string
    shippingLastName    ?: string
    
    shippingPhone       ?: string
    shippingEmail       ?: string
    
    shippingCountry     ?: string
    shippingAddress     ?: string
    shippingCity        ?: string
    shippingZone        ?: string
    shippingZip         ?: string
    
    shippingProvider    ?: string
    
    
    
    clientToken         ?: ClientToken
}

const initialState: CheckoutState = {
    checkoutStep       : 'info',
    marketingOpt       : true,
    shippingValidation : false,
    clientToken        : undefined,
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
        
        
        
        setClientToken: (state, {payload: value}: PayloadAction<ClientToken|undefined>) => {
            state.clientToken = value;
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
    
    
    
    setClientToken,
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
        
        
        
        clientToken,
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
        
        
        
        clientToken,
    };
};

export const selectCheckoutProgress = ({checkout: {checkoutStep}}: RootState): number => {
    return ['info', 'shipping', 'payment'].findIndex((progress) => progress === checkoutStep);
};

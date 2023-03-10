import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../store';



export interface CheckoutState {
    firstName   ?: string
    lastName    ?: string
    
    phone       ?: string
    email       ?: string
    
    country     ?: string
    address     ?: string
    city        ?: string
    zone        ?: string
    zip         ?: string
    
    marketingOpt : boolean
}

const initialState: CheckoutState = {
    marketingOpt : true,
};
export const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setShippingFirstName: (state, {payload: value}: PayloadAction<string>) => {
            state.firstName = value;
        },
        setShippingLastName: (state, {payload: value}: PayloadAction<string>) => {
            state.lastName = value;
        },
        
        setShippingPhone: (state, {payload: value}: PayloadAction<string>) => {
            state.phone = value;
        },
        setShippingEmail: (state, {payload: value}: PayloadAction<string>) => {
            state.email = value;
        },
        
        setShippingCountry: (state, {payload: value}: PayloadAction<string>) => {
            state.country = value;
        },
        setShippingAddress: (state, {payload: value}: PayloadAction<string>) => {
            state.address = value;
        },
        setShippingCity: (state, {payload: value}: PayloadAction<string>) => {
            state.city = value;
        },
        setShippingZone: (state, {payload: value}: PayloadAction<string>) => {
            state.zone = value;
        },
        setShippingZip: (state, {payload: value}: PayloadAction<string>) => {
            state.zip = value;
        },
        
        setMarketingOpt: (state, {payload: value}: PayloadAction<boolean>) => {
            state.marketingOpt = value;
        },
    },
});



export default checkoutSlice.reducer;
export const {
    setShippingFirstName,
    setShippingLastName,
    
    setShippingPhone,
    setShippingEmail,
    
    setShippingCountry,
    setShippingAddress,
    setShippingCity,
    setShippingZone,
    setShippingZip,
    
    setMarketingOpt,
} = checkoutSlice.actions;



// selectors:
export const selectShippingData = (state: RootState) => {
    const {
        firstName,
        lastName,
        
        phone,
        email,
        
        country,
        address,
        city,
        zone,
        zip,
        
        marketingOpt,
    } = state.checkout;
    
    return {
        firstName,
        lastName,
        
        phone,
        email,
        
        country,
        address,
        city,
        zone,
        zip,
        
        marketingOpt,
    };
};

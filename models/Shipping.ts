import { Schema, models, model } from 'mongoose'



const shippingRateSchema = new Schema({
    startingWeight : { type: Number                  , required: true  , min: 0       , max: 100      },
    rate           : { type: Number                  , required: true  , min: 0       , max: 999      },
});

const coverageCitySchema = new Schema({
    city           : { type: String                  , required: true  , minLength: 3 , maxLength: 50 },
    
    estimate       : { type: String                  , required: false , minLength: 2 , maxLength: 50 },
    shippingRates  : { type: [shippingRateSchema]    , required: true  },
});
const coverageZoneSchema = new Schema({
    zone           : { type: String                  , required: true  , minLength: 3 , maxLength: 50 },
    
    estimate       : { type: String                  , required: false , minLength: 2 , maxLength: 50 },
    shippingRates  : { type: [shippingRateSchema]    , required: true  },
    
    cities         : { type: [coverageCitySchema]    , required: false },
});
const coverageCountrySchema = new Schema({
    country        : { type: String                  , required: true  , minLength: 2 , maxLength:  3 },
    
    estimate       : { type: String                  , required: false , minLength: 2 , maxLength: 50 },
    shippingRates  : { type: [shippingRateSchema]    , required: true  },
    
    zones          : { type: [coverageZoneSchema]    , required: false },
});

const shippingSchema = new Schema({
    enabled        : { type: Boolean                 , required: true  },
    name           : { type: String                  , required: true  , minLength: 2 , maxLength: 50 },
    
    weightStep     : { type: Number                  , required: true  , min: 0       , max: 100      },
    
    estimate       : { type: String                  , required: false , minLength: 2 , maxLength: 50 },
    shippingRates  : { type: [shippingRateSchema]    , required: true  },
    
    countries      : { type: [coverageCountrySchema] , required: false },
});

export default models.Shipping ?? model('Shipping', shippingSchema);

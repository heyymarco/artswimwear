import { Schema, Types, models, model, InferSchemaType } from 'mongoose'



const shippingRateSchema = new Schema({
    startingWeight  : { type: Number                  , required: true  , min: 0       , max: 1000      },
    rate            : { type: Number                  , required: true  , min: 0       , max: 999999999 },
});

const coverageCitySchema = new Schema({
    city            : { type: String                  , required: true  , minLength: 3 , maxLength: 50  },
    
    estimate        : { type: String                  , required: false , minLength: 2 , maxLength: 50  },
    shippingRates   : { type: [shippingRateSchema]    , required: false                                 },
});
const coverageZoneSchema = new Schema({
    zone            : { type: String                  , required: true  , minLength: 3 , maxLength: 50  },
    
    estimate        : { type: String                  , required: false , minLength: 2 , maxLength: 50  },
    shippingRates   : { type: [shippingRateSchema]    , required: false                                 },
    
    useSpecificArea : { type: Boolean                 , required: false                                 },
    cities          : { type: [coverageCitySchema]    , required: false                                 },
});
const coverageCountrySchema = new Schema({
    country         : { type: String                  , required: true  , minLength: 2 , maxLength:  3  },
    
    estimate        : { type: String                  , required: false , minLength: 2 , maxLength: 50  },
    shippingRates   : { type: [shippingRateSchema]    , required: false                                 },
    
    useSpecificArea : { type: Boolean                 , required: false                                 },
    zones           : { type: [coverageZoneSchema]    , required: false                                 },
});

const shippingSchema = new Schema({
    _id             : { type: Types.ObjectId          , required: false                                 },
    
    enabled         : { type: Boolean                 , required: true                                  },
    name            : { type: String                  , required: true  , minLength: 2 , maxLength: 50  },
    
    weightStep      : { type: Number                  , required: true  , min: 0       , max: 1000      },
    
    estimate        : { type: String                  , required: false , minLength: 2 , maxLength: 50  },
    shippingRates   : { type: [shippingRateSchema]    , required: false                                 },
    
    useSpecificArea : { type: Boolean                 , required: false                                 },
    countries       : { type: [coverageCountrySchema] , required: false                                 },
});
export type ShippingSchema = InferSchemaType<typeof shippingSchema>;

export default models.Shipping ?? model('Shipping', shippingSchema);

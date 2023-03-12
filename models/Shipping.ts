import { Schema, models, model } from 'mongoose'



const shippingRateSchema = new Schema({
    startingWeight : { type: Number               , required: true },
    rate           : { type: Number               , required: true },
});
const shippingSchema = new Schema({
    name           : { type: String               , required: true },
    weightStep     : { type: Number               , required: true },
    shippingRate   : { type: [shippingRateSchema] , required: true },
    enabled        : { type: Boolean              , required: true },
});

export default models.Shipping ?? model('Shipping', shippingSchema);

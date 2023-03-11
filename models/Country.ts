import { Schema, models, model } from 'mongoose'



const countrySchema = new Schema({
    name     : { type: String  , required: true },
    code     : { type: String  , required: true },
    dialCode : { type: String  , required: true },
    enabled  : { type: Boolean , required: true },
});

export default models.Country ?? model('Country', countrySchema);

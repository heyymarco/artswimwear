import { Schema, models, model } from 'mongoose'



const countrySchema = new Schema({
    enabled  : { type: Boolean , required: true },
    name     : { type: String  , required: true },
    
    code     : { type: String  , required: true },
    dialCode : { type: String  , required: true },
});

export default models.Country ?? model('Country', countrySchema);

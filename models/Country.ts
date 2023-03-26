import { Schema, models, model, InferSchemaType } from 'mongoose'



const countrySchema = new Schema({
    _id      : { type: String  , required: false },
    
    enabled  : { type: Boolean , required: true  },
    name     : { type: String  , required: true  },
    
    code     : { type: String  , required: true  },
    dialCode : { type: String  , required: true  },
});
export type CountrySchema = InferSchemaType<typeof countrySchema>;

export default models.Country ?? model('Country', countrySchema);

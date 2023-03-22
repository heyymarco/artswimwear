import { Schema, models, model } from 'mongoose'
import { addressSchema } from './Address'
import { cartEntrySchema } from './CartEntry'



const draftOrderSchema = new Schema({
    items              : { type: [cartEntrySchema]   , required: true  },
    
    shipping           : { type: addressSchema       , required: false },
    shippingProviderId : { type: String              , required: false },
    
    paypalOrderId      : { type: String              , required: true  },
});

export default models.DraftOrder ?? model('DraftOrder', draftOrderSchema);

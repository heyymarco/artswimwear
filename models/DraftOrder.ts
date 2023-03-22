import { Schema, models, model, Types } from 'mongoose'
import { addressSchema } from './Address'
import { cartEntrySchema } from './CartEntry'



const draftOrderSchema = new Schema({
    items            : { type: [cartEntrySchema]                , required: true  },
    
    shipping         : { type: addressSchema                    , required: false },
    shippingProvider : { type: Types.ObjectId , ref: 'Shipping' , required: false },
    shippingCost     : { type: Number                           , required: false },
    
    paypalOrderId    : { type: String                           , required: false },
});

export default models.DraftOrder ?? model('DraftOrder', draftOrderSchema);

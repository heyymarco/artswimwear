import { Schema, models, model, Types, InferSchemaType } from 'mongoose'
import { addressSchema } from './Address'
import { cartEntrySchema } from './CartEntry'



const draftOrderSchema = new Schema({
    items            : { type: [cartEntrySchema]                , required: true  },
    
    shippingAddress  : { type: addressSchema                    , required: false },
    shippingProvider : { type: Types.ObjectId , ref: 'Shipping' , required: false },
    shippingCost     : { type: Number                           , required: false },
    
    expires          : { type: Date                             , required: true  },
    
    paypalOrderId    : { type: String                           , required: false },
});
export type DraftOrderSchema = InferSchemaType<typeof draftOrderSchema>;

export default models.DraftOrder ?? model('DraftOrder', draftOrderSchema);

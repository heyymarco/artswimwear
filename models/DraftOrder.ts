import { Schema, models, model } from 'mongoose'
import { addressSchema } from './Address'



const cartEntrySchema = new Schema({
    productId         : { type: String            , required: true  },
    price             : { type: Number            , required: true  },
    shippingWeight    : { type: Number            , required: false },
    quantity          : { type: Number            , required: true  },
});
const draftOrderSchema = new Schema({
    items             : { type: [cartEntrySchema] , required: true  },
    
    shipping          : { type: addressSchema     , required: false },
    shippingProvider  : { type: String            , required: false },
    
    paypalOrderId     : { type: String            , required: true  },
});

export default models.DraftOrder ?? model('DraftOrder', draftOrderSchema);

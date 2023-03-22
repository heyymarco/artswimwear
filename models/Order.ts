import { Schema, models, model } from 'mongoose'
import { addressSchema } from './Address'
import { cartEntrySchema } from './CartEntry'



const paymentMethodSchema = new Schema({
    type               : { type: String              , required: true  },
    brand              : { type: String              , required: false },
    identifier         : { type: String              , required: false },
});
const orderSchema = new Schema({
    items              : { type: [cartEntrySchema]   , required: true  },
    
    shipping           : { type: addressSchema       , required: false },
    shippingProviderId : { type: String              , required: false },
    
    billing            : { type: addressSchema       , required: false },
    
    paymentMethod      : { type: paymentMethodSchema , required: true  },
});

export default models.Order ?? model('Order', orderSchema);

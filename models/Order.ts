import { Schema, models, model } from 'mongoose'
import { addressSchema } from './Address'



const cartEntrySchema = new Schema({
    productId         : { type: String              , required: true  },
    price             : { type: Number              , required: true  },
    shippingWeight    : { type: Number              , required: false },
    quantity          : { type: Number              , required: true  },
});
const paymentMethodSchema = new Schema({
    type              : { type: String              , required: true  },
    brand             : { type: String              , required: false },
});
const orderSchema = new Schema({
    items             : { type: [cartEntrySchema]   , required: true  },
    
    shipping          : { type: addressSchema       , required: false },
    shippingProvider  : { type: String              , required: false },
    
    billing           : { type: addressSchema       , required: false },
    
    paypalOrderId     : { type: String              , required: true  },
    paymentMethod     : { type: paymentMethodSchema , required: true  },
});

export default models.Order ?? model('Order', orderSchema);

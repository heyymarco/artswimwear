import { Schema } from 'mongoose'



export const cartEntrySchema = new Schema({
    productId         : { type: String , required: true  },
    price             : { type: Number , required: true  },
    shippingWeight    : { type: Number , required: false },
    quantity          : { type: Number , required: true  },
});

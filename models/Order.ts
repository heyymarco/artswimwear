import { Schema, models, model, Types, InferSchemaType } from 'mongoose'
import { addressSchema } from './Address'
import { cartEntrySchema } from './CartEntry'
import { customerSchema } from './Customer';



const paymentMethodSchema = new Schema({
    type             : { type: String                           , required: true           },
    brand            : { type: String                           , required: false          },
    identifier       : { type: String                           , required: false          },
});
export type PaymentMethodSchema = InferSchemaType<typeof paymentMethodSchema>;

const orderSchema = new Schema({
    orderId          : { type: String                           , required: true           },
    
    customer         : { type: customerSchema                   , required: true           },
    
    items            : { type: [cartEntrySchema]                , required: true           },
    
    shippingAddress  : { type: addressSchema                    , required: false          },
    shippingProvider : { type: Types.ObjectId , ref: 'Shipping' , required: false          },
    shippingCost     : { type: Number                           , required: false , min: 0 },
    
    billingAddress   : { type: addressSchema                    , required: false          },
    
    paymentMethod    : { type: paymentMethodSchema              , required: true           },
});
export type OrderSchema = InferSchemaType<typeof orderSchema>;

export default models.Order ?? model('Order', orderSchema);

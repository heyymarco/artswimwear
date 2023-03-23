import { Schema, Types, InferSchemaType } from 'mongoose'



export const cartEntrySchema = new Schema({
    product        : { type: Types.ObjectId , ref: 'Product' , required: true  },
    price          : { type: Number                          , required: true  },
    shippingWeight : { type: Number                          , required: false },
    quantity       : { type: Number                          , required: true  },
});
export type CartEntrySchema = InferSchemaType<typeof cartEntrySchema>;

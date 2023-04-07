import { Schema, Types, InferSchemaType } from 'mongoose'



export const cartEntrySchema = new Schema({
    product        : { type: Types.ObjectId , ref: 'Product' , required: true           },
    price          : { type: Number                          , required: true  , min: 0 },
    shippingWeight : { type: Number                          , required: false , min: 0 },
    quantity       : { type: Number                          , required: true  , min: 1 },
});
export type CartEntrySchema = InferSchemaType<typeof cartEntrySchema>;

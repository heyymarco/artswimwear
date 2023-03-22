import { Schema, InferSchemaType } from 'mongoose'



export const customerSchema = new Schema({
    marketingOpt : { type: Boolean , required: false },
    
    nickName     : { type: String  , required: true  },
    email        : { type: String  , required: false },
});
export type CustomerSchema = InferSchemaType<typeof customerSchema>;

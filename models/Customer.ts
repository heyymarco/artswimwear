import { Schema, InferSchemaType } from 'mongoose'



export const customerSchema = new Schema({
    marketingOpt : { type: Boolean , required: false },
    
    nickName     : { type: String  , required: true  , minLength: 2 , maxLength: 30 },
    email        : { type: String  , required: true  , minLength: 5 , maxLength: 50 },
});
export type CustomerSchema = InferSchemaType<typeof customerSchema>;

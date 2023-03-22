import { Schema } from 'mongoose'



export const customerSchema = new Schema({
    nickName : { type: String , required: true  },
    email    : { type: String , required: false },
});

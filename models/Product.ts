import { Schema, Types, models, model, InferSchemaType } from 'mongoose'



const productSchema = new Schema({
    _id            : { type: Types.ObjectId , required: false },
    
    visibility     : { type: String         , required: true  , enum: ['published', 'hidden', 'draft']},
    
    name           : { type: String         , required: true  },
    
    price          : { type: Number         , required: true  },
    shippingWeight : { type: Number         , required: false },
    
    stock          : { type: Number         , required: false },
    
    description    : { type: String         , required: false },
    images         : { type: [String]       , required: false },
    path           : { type: String         , required: false },
});
export type ProductSchema = InferSchemaType<typeof productSchema>;

export default models.Product ?? model('Product', productSchema);

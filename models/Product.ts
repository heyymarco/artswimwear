import { Schema, InferSchemaType, models, model } from 'mongoose'



// interface Product {
//     name         : string;
//     price        : number;
//     description ?: string;
// }
const productSchema = new Schema({
    name        : { type: String, required: true },
    price       : { type: Number, required: true },
    description : String,
    images      : [String],
});
// type Product = InferSchemaType<typeof productSchema>;

export default models.Product ?? model('Product', productSchema);

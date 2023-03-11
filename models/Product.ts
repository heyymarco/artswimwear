import { Schema, models, model } from 'mongoose'



const productSchema = new Schema({
    name        : { type: String, required: true },
    price       : { type: Number, required: true },
    description : String,
    images      : [String],
    path        : String,
});

export default models.Product ?? model('Product', productSchema);

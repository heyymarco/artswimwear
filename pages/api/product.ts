import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

import { connectDB } from '@/libs/dbConn'
import { default as Product, ProductSchema } from '@/models/Product'
import { formatPath } from '@/libs/formatters';
import { HydratedDocument } from 'mongoose';



// types:
export type DetailedProduct = Required<Pick<ProductSchema, '_id'>> & Pick<ProductSchema, 'name'|'price'|'images'|'path'|'description'>
export type PreviewProduct  = Required<Pick<ProductSchema, '_id'>> & Pick<ProductSchema, 'name'|'price'|'path'> & { image?: Required<ProductSchema>['images'][number] }


try {
    await connectDB(); // top level await
    console.log('connected to mongoDB!');
}
catch (error) {
    console.log('FAILED to connect mongoDB!');
    throw error;
} // try



const router = createRouter<
    NextApiRequest,
    NextApiResponse<
        | DetailedProduct|null
        | Array<PreviewProduct>
        | { error: string }
    >
>();



router
.get(async (req, res) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    
    
    if (req.query.path) {
        const detailedProduct = await Product.findOne<DetailedProduct>({
            path       : req.query.path,   // find by url path
            visibility : { $ne: 'draft' }, // allows access to Product with visibility: 'published'|'hidden' but NOT 'draft'
        }, { _id: true, name: true, price: true, images: true, path: true, description: true });
        return res.json(detailedProduct);
    } // if
    
    
    
    const previewProducts = await Product.find<HydratedDocument<PreviewProduct>>({
        visibility: { $eq: 'published' }, // allows access to Product with visibility: 'published' but NOT 'hidden'|'draft'
    }, { _id: true, name: true, price: true, image: { $first: "$images" }, path: true });
    let productPaths : string[]|undefined = undefined;
    for (const previewProduct of previewProducts) {
        if (!previewProduct.path) {
            let productPath = formatPath(previewProduct.name);
            
            // check for duplicates:
            if (!productPaths) productPaths = previewProducts.map((product) => product.path).filter((path): path is Exclude<typeof path, undefined> => !!path);
            if (productPaths.includes(productPath)) {
                let newProductPath = productPath;
                for (let counter = 2; counter < 100 && productPaths.includes(newProductPath = `${productPath}-${counter}`); counter++) ;
                productPath = newProductPath;
            } // if
            
            // assign new pre-computed path:
            previewProduct.path = productPath;
            await previewProduct.save();
            console.log('path updated: ', productPath);
        }
    }
    return res.json(previewProducts);
})
.post(async (req, res) => {
    const newProduct = await Product.create<ProductSchema>({
        name        : req.query.name,
        price       : Number.parseFloat(req.query.price as any),
        description : req.query.description,
    });
    console.log('a product added: ', newProduct);
    return res.json(newProduct);
});



export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
    onNoMatch: (req, res) => {
        res.status(404).json({ error: 'Page is not found' });
    },
});

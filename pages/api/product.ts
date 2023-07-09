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
    return res.json(previewProducts);
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

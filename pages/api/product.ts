import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

import { connectDB } from '@/libs/dbConn'
import { default as Product, ProductSchema } from '@/models/Product'
import { HydratedDocument } from 'mongoose';
import type { WysiwygEditorState } from '@/components/WysiwygEditor'



// types:
export interface ProductDetail
    extends
        Pick<ProductSchema,
            |'name'
            |'price'
            |'path'
            |'excerpt'
            |'images'
        >
{
    _id         : string
    description : WysiwygEditorState|null|undefined
}
export interface ProductPreview
    extends
        Pick<ProductSchema,
            |'name'
            |'price'
            |'path'
        >
{
    _id         : string
    image       : Required<ProductSchema>['images'][number]
}



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
        |ProductDetail|null
        |Array<ProductPreview>
        |{ error: string }
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
        return res.json(
            await Product.findOne<ProductDetail>({
                path       : req.query.path,   // find by url path
                visibility : { $ne: 'draft' }, // allows access to Product with visibility: 'published'|'hidden' but NOT 'draft'
            }, {
                _id         : true,
                
                name        : true,
                
                price       : true,
                
                path        : true,
                
                excerpt     : true,
                description : true,
                
                images      : true,
            })
        );
    } // if
    
    
    
    const previewProducts = await Product.find<HydratedDocument<ProductPreview>>({
        visibility: { $eq: 'published' }, // allows access to Product with visibility: 'published' but NOT 'hidden'|'draft'
    }, {
        _id   : true,
        
        name  : true,
        
        price : true,
        
        path  : true,
        
        image : { $first: "$images" },
    });
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

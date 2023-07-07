import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

import { connectDB } from '@/libs/dbConn'
import { default as Product, ProductSchema } from '@/models/Product'



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
        | Array<Required<Pick<ProductSchema, '_id'>> & Pick<ProductSchema, 'price'|'shippingWeight'>>
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
    
    
    
    const priceList = await Product.find<Required<Pick<ProductSchema, '_id'>> & Pick<ProductSchema, 'price'|'shippingWeight'>>({
        visibility : { $ne: 'draft' }, // allows access to Product with visibility: 'published'|'hidden' but NOT 'draft'
    }, { _id: true, price: true, shippingWeight: true });
    return res.json(priceList);
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

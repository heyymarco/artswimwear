// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/libs/dbConn'
import Product from '@/models/Product'



try {
    await connectDB(); // top level await
    console.log('connected to mongoDB!');
}
catch (error) {
    console.log('FAILED to connect mongoDB!');
    throw error;
} // try



export default async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    switch(req.method) {
        case 'GET':
            if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
                await new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 2000);
                });
            } // if
            
            
            
            const priceList = await Product.find({}, { price: true, shippingWeight: true });
            return res.status(200).json(priceList);
    } // switch
};

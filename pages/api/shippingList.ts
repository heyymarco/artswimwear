// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/libs/dbConn'
import Shipping from '@/models/Shipping'



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
            
            
            
            const shippingList = await Shipping.find({
                // enabled: true
            }, { name: true, weightStep: true, shippingRate: true, enabled: true });
            if (!shippingList.length) {
                const newShippingList = (await import('@/libs/shippingList')).default;
                await Shipping.collection.insertMany(
                    newShippingList.map((shipping) => ({
                        name           : shipping.name,
                        weightStep     : shipping.weightStep,
                        shippingRate   : shipping.shippingRate,
                        enabled        : true,
                    }))
                );
            }
            return res.status(200).json(
                shippingList
                .filter((shipping) => shipping.enabled)
                .map((shipping) => ({
                    _id            : shipping._id,
                    name           : shipping.name,
                    weightStep     : shipping.weightStep,
                    shippingRate   : shipping.shippingRate.map((shippingRate: any) => ({
                        startingWeight : shippingRate.startingWeight,
                        rate           : shippingRate.rate,
                    })),
                }))
            );
    } // switch
};

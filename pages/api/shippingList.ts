import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

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



export default nextConnect<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Something broke!' });
    },
    onNoMatch: (req, res) => {
        res.status(404).json({ error: 'Page is not found' });
    },
})
.get(async (req, res) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    
    
    const shippingList = await Shipping.find({
        // enabled: true
    }, { name: true, estimate: true, weightStep: true, shippingRates: true, enabled: true });
    if (!shippingList.length) {
        const newShippingList = (await import('@/libs/shippingList')).default;
        await Shipping.collection.insertMany(
            newShippingList.map((shipping) => ({
                name           : shipping.name,
                estimate       : shipping.estimate,
                weightStep     : shipping.weightStep,
                shippingRates  : shipping.shippingRates,
                enabled        : true,
            }))
        );
    } // if
    
    
    
    return res.json(
        shippingList
        .filter((shipping) => shipping.enabled)
        .map((shipping) => ({
            _id                : shipping._id,
            name               : shipping.name,
            estimate           : shipping.estimate,
            weightStep         : shipping.weightStep,
            shippingRates      : shipping.shippingRates.map((shippingRate: any) => ({
                startingWeight : shippingRate.startingWeight,
                rate           : shippingRate.rate,
            })),
        }))
    );
});

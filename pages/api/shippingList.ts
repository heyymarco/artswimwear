import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

import { connectDB } from '@/libs/dbConn'
import { default as Shipping, ShippingSchema } from '@/models/Shipping'
import { MatchingShipping, MatchingAddress, getMatchingShipping } from '@/libs/shippings'



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
.post<NextApiRequest, NextApiResponse<Array<MatchingShipping>>>(async (req, res) => {
    const {
        city,
        zone,
        country,
    } = req.body;
    if (
           !city    || (typeof(city)    !== 'string') || (city.length    < 3) || (city.length    > 50)
        || !zone    || (typeof(zone)    !== 'string') || (zone.length    < 3) || (zone.length    > 50)
        || !country || (typeof(country) !== 'string') || (country.length < 2) || (country.length >  3)
    ) {
        return res.status(400).end(); // bad req
    } // if
    
    
    
    // simulates error:
    // return res.status(400).end();
    // return res.json([]);
    
    
    
    let shippings = await Shipping.find<Required<Pick<ShippingSchema, '_id'>> & Omit<ShippingSchema, '_id'>>(); // get all shippings including the disabled ones
    if (!shippings.length) { // empty => first app setup => initialize the default shippings
        const defaultShippings = (await import('@/libs/defaultShippings')).default;
        await Shipping.insertMany(defaultShippings);
    } // if
    
    
    
    // filter out disabled shippings:
    shippings = shippings.filter(({enabled}) => enabled);
    
    // filter out non_compatible shippings:
    const shippingAddress: MatchingAddress = { city, zone, country };
    const matchingShippings = (
        shippings
        .map((shipping) => getMatchingShipping(shipping, shippingAddress))
        .filter((shipping): shipping is MatchingShipping => !!shipping)
    );
    
    
    
    return res.json(
        matchingShippings
    );
});

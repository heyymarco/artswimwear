import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

import { MatchingShipping, MatchingAddress, getMatchingShipping } from '@/libs/shippings'

// models:
import type {
    ShippingProvider,
}                           from '@prisma/client'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'



const router = createRouter<
    NextApiRequest,
    NextApiResponse<
        | Array<MatchingShipping>
        | { error: string }
    >
>();



router
.post(async (req, res) => {
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
    
    
    
    let shippings = await prisma.shippingProvider.findMany({
        select : {
            id              : true, // required for identifier
            
            enabled         : true, // required for check conditional
            name            : true, // required for labeling
            
            weightStep      : true, // required for getMatchingShipping
            
            estimate        : true, // optional for labeling
            shippingRates   : true, // required for getMatchingShipping
            
            useSpecificArea : true, // required for getMatchingShipping
            countries       : true, // required for getMatchingShipping
        },
    }); // get all shippings including the disabled ones
    if (!shippings.length) { // empty => first app setup => initialize the default shippings
        const defaultShippings = (await import('@/libs/defaultShippings')).default;
        await prisma.shippingProvider.createMany({
            data: defaultShippings,
        });
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



export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
    onNoMatch: (req, res) => {
        res.status(404).json({ error: 'Page is not found' });
    },
});

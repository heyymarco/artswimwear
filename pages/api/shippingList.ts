import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

import { connectDB } from '@/libs/dbConn'
import Shipping, { ShippingSchema } from '@/models/Shipping'



// utilities:
const undefinedIfEmptyArray = <TArray extends Array<TItem>, TItem>(array: TArray|undefined): TArray|undefined => {
    if (!array?.length) return undefined;
    return array;
}



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
})
.post(async (req, res) => {
    const {
        city,
        zone,
        country,
    } = req.body;
    if (
           !city    || (typeof(city) !== 'string')    || (city.length    < 3) || (city.length    > 50)
        || !zone    || (typeof(zone) !== 'string')    || (zone.length    < 3) || (zone.length    > 50)
        || !country || (typeof(country) !== 'string') || (country.length < 2) || (country.length >  3)
    ) {
        return res.status(400).end(); // bad req
    } // if
    
    
    
    let compatibleShippings = await Shipping.find<ShippingSchema>();
    if (!compatibleShippings.length) {
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
    
    
    
    // filter out disabled shippings:
    compatibleShippings = compatibleShippings.filter(({enabled}) => enabled);
    
    // if countries specified => filter out shippings not_having supported countries:
    compatibleShippings = compatibleShippings.filter((compatibleShipping): boolean => {
        if (!(compatibleShipping.useSpecificArea ?? false)) {
            if (compatibleShipping.countries) compatibleShipping.countries = undefined;    // unselect all countries
            return true;
        } // if
        if (!compatibleShipping.countries?.length) return false;                           // no countries specified => not supports all countries
        
        
        
        const matchingCountry = compatibleShipping.countries.find((coverageCountry) => (coverageCountry.country.toLowerCase() === country.toLowerCase()));
        if (!matchingCountry) return false;                                                // the country is not in list => unsupported shipping
        compatibleShipping.countries = [matchingCountry] as any;                           // select the first matching country
        return true;
    });
    
    // if zones specified => filter out shippings not_having supported zones:
    compatibleShippings = compatibleShippings.filter((compatibleShipping): boolean => {
        if (!(compatibleShipping.countries?.[0]?.useSpecificArea ?? false)) {
            if (compatibleShipping.countries?.[0]?.zones) compatibleShipping.countries[0].zones = undefined; // unselect all zones
            return true;
        } // if
        if (!compatibleShipping.countries?.[0]?.zones?.length)   return false;             // no zones specified => not supports all zones
        
        
        
        const matchingZone = compatibleShipping.countries[0].zones.find((coverageZone) => (coverageZone.zone.toLowerCase() === zone.toLowerCase()));
        if (!matchingZone) return false;                                                   // the zone is not in list => unsupported shipping
        compatibleShipping.countries[0].zones = [matchingZone] as any;                     // select the first matching zone
        return true;
    });
    
    // if cities specified => filter out shippings not_having supported cities:
    compatibleShippings = compatibleShippings.filter((compatibleShipping): boolean => {
        if (!(compatibleShipping.countries?.[0]?.zones?.[0]?.useSpecificArea ?? false)) {
            if (compatibleShipping.countries?.[0]?.zones?.[0]?.cities) compatibleShipping.countries[0].zones[0].cities = undefined; // unselect all cities
            return true;
        } // if
        if (!compatibleShipping.countries?.[0]?.zones?.[0]?.cities?.length)  return false; // no cities specified => not supports all cities
        
        
        
        const matchingCity = compatibleShipping.countries[0].zones[0].cities.find((coverageCity) => (coverageCity.city.toLowerCase() === city.toLowerCase()));
        if (!matchingCity) return false;                                                   // the city is not in list => unsupported shipping
        compatibleShipping.countries[0].zones[0].cities = [matchingCity] as any;           // select the first matching city
        return true;
    });
    
    
    
    return res.json(
        compatibleShippings
        .map((compatibleShipping): Pick<ShippingSchema, 'name'|'weightStep'|'estimate'|'shippingRates'> => {
            const estimate : ShippingSchema['estimate'] = (
                compatibleShipping.countries?.[0]?.zones?.[0]?.cities?.[0]?.estimate
                ||
                compatibleShipping.countries?.[0]?.zones?.[0]?.estimate
                ||
                compatibleShipping.countries?.[0]?.estimate
                ||
                compatibleShipping.estimate
            );
            const shippingRates : ShippingSchema['shippingRates'] = (
                undefinedIfEmptyArray(compatibleShipping.countries?.[0]?.zones?.[0]?.cities?.[0]?.shippingRates)
                ??
                undefinedIfEmptyArray(compatibleShipping.countries?.[0]?.zones?.[0]?.shippingRates)
                ??
                undefinedIfEmptyArray(compatibleShipping.countries?.[0]?.shippingRates)
                ??
                compatibleShipping.shippingRates
            );
            
            
            
            return {
                name           : compatibleShipping.name,
                
                weightStep     : compatibleShipping.weightStep,
                
                estimate       : estimate,
                shippingRates  : shippingRates,
            };
        })
        .filter((compatibleShipping): boolean => !!compatibleShipping.shippingRates.length)
    );
});

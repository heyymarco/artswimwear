import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

import { connectDB } from '@/libs/dbConn'
import { default as Shipping, ShippingSchema, MatchingShippingSchema } from '@/models/Shipping'



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
        const newShippingList = (await import('@/libs/defaultShippings')).default;
        await Shipping.insertMany(
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
.post<NextApiRequest, NextApiResponse<Array<MatchingShippingSchema>>>(async (req, res) => {
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
    
    
    
    let compatibleShippings = await Shipping.find<ShippingSchema>(); // get all shippings including the disabled ones
    if (!compatibleShippings.length) { // empty => first app setup => initialize the default shippings
        const defaultShippings = (await import('@/libs/defaultShippings')).default;
        await Shipping.insertMany(defaultShippings);
    } // if
    
    
    
    // filter out disabled shippings:
    compatibleShippings = compatibleShippings.filter(({enabled}) => enabled);
    
    // if countries specified => filter out shippings not_having supported countries:
    compatibleShippings = compatibleShippings.filter((compatibleShipping): boolean => {
        const countries = compatibleShipping.countries;
        let matchingArea = (
            (compatibleShipping.useSpecificArea ?? false)
            &&
            countries?.find((coverageCountry) => (coverageCountry.country.toLowerCase() === country.toLowerCase()))
        );
        // if ((matchingArea === undefined) || (matchingArea === false) || (matchingArea < 0)) matchingArea = undefined;
        if (countries) {
            // // doesn't work -- because the array is buggy_proxied:
            // countries.splice(matchingArea || 0, (matchingArea !== undefined) ? 1 : 0); // select the first matching country (if any)
            
            // works:
            countries.splice(0); // clear
            if (matchingArea) countries.push(matchingArea);
        } // if
        return true;
    });
    
    // if zones specified => filter out shippings not_having supported zones:
    compatibleShippings = compatibleShippings.filter((compatibleShipping): boolean => {
        const zones = compatibleShipping.countries?.[0]?.zones;
        let matchingArea = (
            (compatibleShipping.countries?.[0]?.useSpecificArea ?? false)
            &&
            zones?.find((coverageZone) => (coverageZone.zone.toLowerCase() === zone.toLowerCase()))
        );
        // if ((matchingArea === undefined) || (matchingArea === false) || (matchingArea < 0)) matchingArea = undefined;
        if (zones) {
            // // doesn't work -- because the array is buggy_proxied:
            // zones.splice(matchingArea || 0, (matchingArea !== undefined) ? 1 : 0); // select the first matching zone (if any)
            
            // works:
            zones.splice(0); // clear
            if (matchingArea) zones.push(matchingArea);
        } // if
        return true;
    });
    
    // if cities specified => filter out shippings not_having supported cities:
    compatibleShippings = compatibleShippings.filter((compatibleShipping): boolean => {
        const cities = compatibleShipping.countries?.[0]?.zones?.[0]?.cities;
        let matchingArea = (
            (compatibleShipping.countries?.[0]?.zones?.[0]?.useSpecificArea ?? false)
            &&
            cities?.find((coverageCity) => (coverageCity.city.toLowerCase() === city.toLowerCase()))
        );
        // if ((matchingArea === undefined) || (matchingArea === false) || (matchingArea < 0)) matchingArea = undefined;
        if (cities) {
            // // doesn't work -- because the array is buggy_proxied:
            // cities.splice(matchingArea || 0, (matchingArea !== undefined) ? 1 : 0); // select the first matching city (if any)
            
            // works:
            cities.splice(0); // clear
            if (matchingArea) cities.push(matchingArea);
        } // if
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
                undefinedIfEmptyArray(compatibleShipping.shippingRates)
            );
            
            
            
            return {
                name           : compatibleShipping.name,
                
                weightStep     : compatibleShipping.weightStep,
                
                estimate       : estimate || '',
                shippingRates  : shippingRates,
            };
        })
        .filter((compatibleShipping): compatibleShipping is MatchingShippingSchema => !!compatibleShipping.shippingRates?.length)
    );
});

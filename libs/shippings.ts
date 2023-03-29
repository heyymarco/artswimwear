import type { ShippingSchema } from '@/models/Shipping'
import type { AddressSchema } from '@/models/Address'



// types:
export type MatchingShipping = Partial<Omit<ShippingSchema, 'weightStep'|'shippingRates'|'useSpecificArea'|'countries'>> & Required<Pick<ShippingSchema, 'weightStep'|'shippingRates'>>
export type MatchingAddress  = Pick<AddressSchema, 'country'|'zone'|'city'>



// utilities:
export const getMatchingShipping = (shipping: Partial<Pick<ShippingSchema, 'enabled'|'name'>> & Omit<ShippingSchema, 'enabled'|'name'>, shippingAddress: MatchingAddress): MatchingShipping|undefined => {
    let estimate          = shipping.estimate;
    let shippingRates     = shipping.shippingRates;
    
    
    
    const matchingCountry = (shipping.useSpecificArea ?? false) && shipping.countries?.find((coverageCountry) => (coverageCountry.country.toLowerCase() === shippingAddress.country.toLowerCase()));
    if (matchingCountry) {
        if (matchingCountry.estimate             )      estimate      = matchingCountry.estimate;
        if (matchingCountry.shippingRates?.length)      shippingRates = matchingCountry.shippingRates;
        
        
        
        const matchingZone = (matchingCountry.useSpecificArea ?? false) && matchingCountry.zones?.find((coverageZone) => (coverageZone.zone.toLowerCase() === shippingAddress.zone.toLowerCase()));
        if (matchingZone) {
            if (matchingZone.estimate             )     estimate      = matchingZone.estimate;
            if (matchingZone.shippingRates?.length)     shippingRates = matchingZone.shippingRates;
            
            
            
            const matchingCity = (matchingZone.useSpecificArea ?? false) && matchingZone.cities?.find((coverageCity) => (coverageCity.city.toLowerCase() === shippingAddress.city.toLowerCase()));
            if (matchingCity) {
                if (matchingCity.estimate             ) estimate      = matchingCity.estimate;
                if (matchingCity.shippingRates?.length) shippingRates = matchingCity.shippingRates;
            } // if
        } // if
    } // if
    
    
    
    if (!shippingRates?.length) return undefined;
    return {
        _id             : shipping._id,        // optional
        
        enabled         : shipping.enabled,    // optional
        name            : shipping.name,       // optional
        
        weightStep      : shipping.weightStep, // required
        
        estimate        : estimate,            // optional
        shippingRates   : shippingRates,       // required
    };
};
export const calculateShippingCost = (totalWeight: number|undefined, {weightStep, shippingRates}: Pick<MatchingShipping, 'weightStep'|'shippingRates'>): number|undefined => {
    if ((totalWeight === undefined) || isNaN(totalWeight) || !isFinite(totalWeight)) return undefined;
    
    
    
    weightStep = Math.max(0, weightStep);
    let totalCost = 0;
    for (
        let index = 0,
            maxIndex              = shippingRates.length,
            
            remainingWeight       = !weightStep ? totalWeight : Math.max(Math.ceil(totalWeight / weightStep) * weightStep, weightStep),
            currentWeight         : number,
            
            currentRate           : typeof shippingRates[number],
            currentStartingWeight : number,
            nextStartingWeight    : number|undefined,
            
            currentCost           : number
        ;
        index < maxIndex
        ;
        index++
    ) {
        currentRate           = shippingRates[index];
        currentStartingWeight = currentRate.startingWeight;
        nextStartingWeight    = shippingRates[index + 1]?.startingWeight;
        
        
        
        currentWeight         = (nextStartingWeight !== undefined) ? (nextStartingWeight - currentStartingWeight) : remainingWeight;
        currentWeight         = Math.min(currentWeight, remainingWeight);
        
        currentCost           = currentWeight * currentRate.rate;
        totalCost            += currentCost;
        
        
        
        remainingWeight      -= currentWeight;
        if (remainingWeight <= 0) break;
    } // for
    return totalCost;
};

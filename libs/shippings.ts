// models:
import {
    type ShippingProvider,
    type Address,
}                           from '@prisma/client'



// types:
export type MatchingShipping = Partial<Omit<ShippingProvider, 'createdAt'|'updatedAt'|'weightStep'|'shippingRates'|'useSpecificArea'|'countries'>> & Required<Pick<ShippingProvider, 'weightStep'|'shippingRates'>>
export type MatchingAddress  = Pick<Address, 'country'|'zone'|'city'>



// utilities:
export const getMatchingShipping = (shipping: Partial<Pick<ShippingProvider, 'id'|'visibility'|'name'|'estimate'>> & Omit<ShippingProvider, 'id'|'createdAt'|'updatedAt'|'visibility'|'name'|'estimate'>, shippingAddress: MatchingAddress): MatchingShipping|null => {
    let estimate          = shipping.estimate;
    let shippingRates     = shipping.shippingRates;
    
    
    
    const matchingCountry = shipping.useSpecificArea && shipping.countries?.find((coverageCountry) => (coverageCountry.country.toLowerCase() === shippingAddress.country.toLowerCase()));
    if (matchingCountry) {
        if (matchingCountry.estimate             )      estimate      = matchingCountry.estimate;
        if (matchingCountry.shippingRates?.length)      shippingRates = matchingCountry.shippingRates;
        
        
        
        const matchingZone = matchingCountry.useSpecificArea && matchingCountry.zones?.find((coverageZone) => (coverageZone.zone.toLowerCase() === shippingAddress.zone.toLowerCase()));
        if (matchingZone) {
            if (matchingZone.estimate             )     estimate      = matchingZone.estimate;
            if (matchingZone.shippingRates?.length)     shippingRates = matchingZone.shippingRates;
            
            
            
            const matchingCity = matchingZone.useSpecificArea && matchingZone.cities?.find((coverageCity) => (coverageCity.city.toLowerCase() === shippingAddress.city.toLowerCase()));
            if (matchingCity) {
                if (matchingCity.estimate             ) estimate      = matchingCity.estimate;
                if (matchingCity.shippingRates?.length) shippingRates = matchingCity.shippingRates;
            } // if
        } // if
    } // if
    
    
    
    if (!shippingRates?.length) return null;
    return {
        id              : shipping.id,         // optional
        
        visibility      : shipping.visibility, // optional
        
        name            : shipping.name,       // optional
        estimate        : estimate,            // optional
        
        weightStep      : shipping.weightStep, // required
        shippingRates   : shippingRates,       // required
    };
};
export const calculateShippingCost = (totalWeight: number|null, {weightStep, shippingRates}: Pick<MatchingShipping, 'weightStep'|'shippingRates'>): number|null => {
    if ((totalWeight === null) || isNaN(totalWeight) || !isFinite(totalWeight)) return null;
    
    
    
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

// models:
import {
    type ShippingProvider,
    type Address,
}                           from '@prisma/client'



// types:
export type MatchingShipping = Partial<Omit<ShippingProvider, 'createdAt'|'updatedAt'|'weightStep'|'shippingRates'|'useZones'|'countries'>> & Required<Pick<ShippingProvider, 'weightStep'|'shippingRates'>>
export type MatchingAddress  = Pick<Address, 'country'|'state'|'city'>



// utilities:
export const getMatchingShipping = (shipping: Partial<Pick<ShippingProvider, 'id'|'visibility'|'name'|'eta'>> & Omit<ShippingProvider, 'id'|'createdAt'|'updatedAt'|'visibility'|'name'|'eta'>, shippingAddress: MatchingAddress): MatchingShipping|null => {
    let eta           = shipping.eta;
    let shippingRates = shipping.shippingRates;
    
    
    
    const matchingCountry = shipping.useZones && shipping.zones?.find((coverageCountry) => (coverageCountry.name.trim().toLowerCase() === shippingAddress.country.trim().toLowerCase()));
    if (matchingCountry) {
        if (matchingCountry.eta                  )      eta           = matchingCountry.eta;
        if (matchingCountry.shippingRates?.length)      shippingRates = matchingCountry.shippingRates;
        
        
        
        const matchingState = matchingCountry.useZones && matchingCountry.zones?.find((coverageState) => (coverageState.name.trim().toLowerCase() === shippingAddress.state.trim().toLowerCase()));
        if (matchingState) {
            if (matchingState.eta                  )    eta           = matchingState.eta;
            if (matchingState.shippingRates?.length)    shippingRates = matchingState.shippingRates;
            
            
            
            const matchingCity = matchingState.useZones && matchingState.zones?.find((coverageCity) => (coverageCity.name.trim().toLowerCase() === shippingAddress.city.trim().toLowerCase()));
            if (matchingCity) {
                if (matchingCity.eta                  ) eta           = matchingCity.eta;
                if (matchingCity.shippingRates?.length) shippingRates = matchingCity.shippingRates;
            } // if
        } // if
    } // if
    
    
    
    if (!shippingRates?.length) return null;
    return {
        id            : shipping.id,         // optional
        
        visibility    : shipping.visibility, // optional
        
        name          : shipping.name,       // optional
        
        weightStep    : shipping.weightStep, // required
        eta           : eta,                 // optional
        shippingRates : shippingRates,       // required
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

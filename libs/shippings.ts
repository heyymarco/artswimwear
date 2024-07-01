// models:
import {
    type ShippingProvider,
    type Address,
}                           from '@prisma/client'



// types:
export type MatchingShipping = Partial<Omit<ShippingProvider, 'createdAt'|'updatedAt'|'weightStep'|'rates'|'useZones'|'countries'>> & Required<Pick<ShippingProvider, 'weightStep'|'rates'>>
export type MatchingAddress  = Pick<Address, 'country'|'state'|'city'>



// utilities:
export const getMatchingShipping = (shipping: Partial<Pick<ShippingProvider, 'id'|'visibility'|'name'|'eta'>> & Omit<ShippingProvider, 'id'|'createdAt'|'updatedAt'|'visibility'|'name'|'eta'>, shippingAddress: MatchingAddress): MatchingShipping|null => {
    let eta   = shipping.eta;
    let rates = shipping.rates;
    
    
    
    const matchingCountry = shipping.useZones && shipping.zones?.find((coverageCountry) => (coverageCountry.name.trim().toLowerCase() === shippingAddress.country.trim().toLowerCase()));
    if (matchingCountry) {
        if (matchingCountry.eta          )      eta   = matchingCountry.eta;
        if (matchingCountry.rates?.length)      rates = matchingCountry.rates;
        
        
        
        const matchingState = matchingCountry.useZones && matchingCountry.zones?.find((coverageState) => (coverageState.name.trim().toLowerCase() === shippingAddress.state.trim().toLowerCase()));
        if (matchingState) {
            if (matchingState.eta          )    eta   = matchingState.eta;
            if (matchingState.rates?.length)    rates = matchingState.rates;
            
            
            
            const matchingCity = matchingState.useZones && matchingState.zones?.find((coverageCity) => (coverageCity.name.trim().toLowerCase() === shippingAddress.city.trim().toLowerCase()));
            if (matchingCity) {
                if (matchingCity.eta          ) eta   = matchingCity.eta;
                if (matchingCity.rates?.length) rates = matchingCity.rates;
            } // if
        } // if
    } // if
    
    
    
    if (!rates?.length) return null;
    return {
        id         : shipping.id,         // optional
        
        visibility : shipping.visibility, // optional
        
        name       : shipping.name,       // optional
        
        weightStep : shipping.weightStep, // required
        eta        : eta,                 // optional
        rates      : rates,               // required
    };
};
export const calculateShippingCost = (totalWeight: number|null, {weightStep, rates}: Pick<MatchingShipping, 'weightStep'|'rates'>): number|null => {
    if ((totalWeight === null) || isNaN(totalWeight) || !isFinite(totalWeight)) return null;
    
    
    
    weightStep = Math.max(0, weightStep);
    let totalCost = 0;
    for (
        let index = 0,
            maxIndex              = rates.length,
            
            remainingWeight       = !weightStep ? totalWeight : Math.max(Math.ceil(totalWeight / weightStep) * weightStep, weightStep),
            currentWeight         : number,
            
            currentRate           : typeof rates[number],
            currentStartingWeight : number,
            nextStartingWeight    : number|undefined,
            
            currentCost           : number
        ;
        index < maxIndex
        ;
        index++
    ) {
        currentRate           = rates[index];
        currentStartingWeight = currentRate.startingWeight;
        nextStartingWeight    = rates[index + 1]?.startingWeight;
        
        
        
        currentWeight         = (nextStartingWeight !== undefined) ? (nextStartingWeight - currentStartingWeight) : remainingWeight;
        currentWeight         = Math.min(currentWeight, remainingWeight);
        
        currentCost           = currentWeight * currentRate.rate;
        totalCost            += currentCost;
        
        
        
        remainingWeight      -= currentWeight;
        if (remainingWeight <= 0) break;
    } // for
    return totalCost;
};

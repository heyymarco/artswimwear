// models:
import {
    type ShippingProvider,
    type Address,
}                           from '@prisma/client'



// utilities:
export interface GetMatchingShippingData
    extends
        // required:
        Pick<ShippingProvider,
            // records:
            |'id'       // required for identifier
            
            
            
            // data:
            |'name'     // required for identifier
            
            |'rates'    // required for matching_shipping algorithm
            
            |'useZones' // required for matching_shipping algorithm
            |'zones'    // required for matching_shipping algorithm
        >,
        CalculateShippingCostData, // required for returning result
        
        // optional:
        Partial<Pick<ShippingProvider,
            // data:
            |'eta'      // optional for matching_shipping algorithm
        >>
{
}

export interface MatchingAddress
    extends
        Pick<Address,
            // data:
            |'country'
            |'state'
            |'city'
        >
{
}

export interface MatchingShipping
    extends
        // required:
        Pick<ShippingProvider,
            // records:
            |'id'       // required for identifier
            
            
            
            // data:
            |'name'     // required for identifier
            
            |'rates'    // required for matching_shipping algorithm
        >,
        CalculateShippingCostData, // required for returning result
        
        // optional:
        Partial<Pick<ShippingProvider,
            // data:
            |'eta'      // optional for matching_shipping algorithm
        >>
{
}

export const getMatchingShipping = <TGetMatchingShippingData extends GetMatchingShippingData>(shippingProvider: TGetMatchingShippingData, shippingAddress: MatchingAddress): (MatchingShipping & Omit<TGetMatchingShippingData, 'useZones'|'zones'>)|null => {
    let {
        eta,
        rates,
        
        ...restShippingProvider
    } = shippingProvider;
    
    const {
        useZones,
        zones,
        
        ...restrestShippingProvider
    } = shippingProvider;
    
    
    
    const matchingCountry = useZones && zones?.find((coverageCountry) => (coverageCountry.name.trim().toLowerCase() === shippingAddress.country.trim().toLowerCase()));
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
        ...restrestShippingProvider,
        
        eta   : eta,   // optional // overwrite with the most specific place
        rates : rates, // required // overwrite with the most specific place
    } satisfies (MatchingShipping & Omit<TGetMatchingShippingData, 'useZones'|'zones'>);
};



export interface CalculateShippingCostData
    extends
        // required:
        Pick<ShippingProvider,
            // data:
            |'weightStep' // required for calculate_shipping_cost algorithm
            |'rates'      // required for calculate_shipping_cost algorithm
        >
{
}
export const calculateShippingCost = (shippingProvider: CalculateShippingCostData, totalWeight: number|null): number|null => {
    // conditions:
    if ((totalWeight === null) || isNaN(totalWeight) || !isFinite(totalWeight)) return null;
    
    
    
    // params:
    const {
        // data:
        weightStep : weightStepRaw,
        rates,
    } = shippingProvider;
    
    
    
    const weightStep = Math.max(0, weightStepRaw);
    let   totalCost  = 0;
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
        currentStartingWeight = currentRate.start;
        nextStartingWeight    = rates[index + 1]?.start;
        
        
        
        currentWeight         = (nextStartingWeight !== undefined) ? (nextStartingWeight - currentStartingWeight) : remainingWeight;
        currentWeight         = Math.min(currentWeight, remainingWeight);
        
        currentCost           = currentWeight * currentRate.rate;
        totalCost            += currentCost;
        
        
        
        remainingWeight      -= currentWeight;
        if (remainingWeight <= 0) break;
    } // for
    return totalCost;
};

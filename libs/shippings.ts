// models:
import {
    type ShippingDetail,
}                           from '@/models'
import {
    type Address,
}                           from '@prisma/client'

// ORMs:
import {
    type prisma,
}                           from '@/libs/prisma.server'



// utilities:
export interface GetMatchingShippingData
    extends
        // required:
        Pick<ShippingDetail,
            // records:
            |'id'       // required for identifier
            
            
            
            // data:
            |'name'     // required for identifier
            
            |'rates'    // required for matching_shipping algorithm
            
            |'useZones' // required for matching_shipping algorithm
        >,
        CalculateShippingCostData, // required for returning result
        
        // optional:
        Partial<Pick<ShippingDetail,
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
        Pick<ShippingDetail,
            // records:
            |'id'       // required for identifier
            
            
            
            // data:
            |'name'     // required for identifier
            
            |'rates'    // required for matching_shipping algorithm
        >,
        CalculateShippingCostData, // required for returning result
        
        // optional:
        Partial<Pick<ShippingDetail,
            // data:
            |'eta'      // optional for matching_shipping algorithm
        >>
{
}

export const getMatchingShipping = async <TGetMatchingShippingData extends GetMatchingShippingData>(prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], shippingProvider: TGetMatchingShippingData, shippingAddress: MatchingAddress): Promise<(MatchingShipping & Omit<TGetMatchingShippingData, 'useZones'>)|null> => {
    let {
        eta,
        rates,
    } = shippingProvider;
    
    const {
        useZones,
        
        ...restrestShippingProvider
    } = shippingProvider;
    
    
    
    if (useZones) {
        const matchingCountry = await prismaTransaction.coverageCountry.findFirst({
            where  : {
                parentId : shippingProvider.id,
                name     : { mode: 'insensitive', equals: shippingAddress.country },
            },
            take   : 1,
            select : {
                // data:
                eta         : {
                    select : {
                        // data:
                        min : true,
                        max : true,
                    },
                },
                rates       : {
                    select : {
                        // data:
                        start : true,
                        rate  : true,
                    },
                },
                
                // relations:
                useZones : true,
                zones : {
                    where  : {
                        name : { mode: 'insensitive', equals: shippingAddress.state },
                    },
                    take   : 1,
                    select : {
                        // data:
                        eta         : {
                            select : {
                                // data:
                                min : true,
                                max : true,
                            },
                        },
                        rates       : {
                            select : {
                                // data:
                                start : true,
                                rate  : true,
                            },
                        },
                        
                        // relations:
                        useZones : true,
                        zones : {
                            where  : {
                                name : { mode: 'insensitive', equals: shippingAddress.city },
                            },
                            take   : 1,
                            select : {
                                // data:
                                eta         : {
                                    select : {
                                        // data:
                                        min : true,
                                        max : true,
                                    },
                                },
                                rates       : {
                                    select : {
                                        // data:
                                        start : true,
                                        rate  : true,
                                    },
                                },
                                
                                // relations:
                                // useZones : true, // no more nested zones
                            },
                        },
                    },
                },
            },
        });
        
        
        
        if (matchingCountry) {
            if (matchingCountry.eta         )              eta   = matchingCountry.eta;
            if (matchingCountry.rates.length)              rates = matchingCountry.rates;
            
            
            
            if (matchingCountry.useZones) {
                const matchingState = matchingCountry.zones?.[0];
                if (matchingState) {
                    if (matchingState.eta         )        eta   = matchingState.eta;
                    if (matchingState.rates.length)        rates = matchingState.rates;
                    
                    
                    
                    if (matchingState.useZones) {
                        const matchingCity = matchingState.zones?.[0];
                        if (matchingCity) {
                            if (matchingCity.eta         ) eta   = matchingCity.eta;
                            if (matchingCity.rates.length) rates = matchingCity.rates;
                        } // if
                    } // if
                } // if
            } // if
        } // if
    } // if
    
    
    
    if (!rates.length) return null;
    return {
        ...restrestShippingProvider,
        
        eta   : eta,   // optional // overwrite with the most specific place
        rates : rates, // required // overwrite with the most specific place
    } satisfies (MatchingShipping & Omit<TGetMatchingShippingData, 'useZones'>);
};



export interface CalculateShippingCostData
    extends
        // required:
        Pick<ShippingDetail,
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

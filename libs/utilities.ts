import type { ShippingEntry } from '@/store/features/api/apiSlice'



// utilities:
export const calculateShippingCost = (totalWeight: number|undefined, {weightStep, shippingRates}: Pick<ShippingEntry, 'weightStep'|'shippingRates'>): number|undefined => {
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

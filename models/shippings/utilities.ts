// models:
import {
    type Prisma,
}                           from '@prisma/client'
import {
    type CoverageCountryDetail,
    type CoverageStateDetail,
    type CoverageCityDetail,
}                           from '@/models'



// utilities:

export const shippingPreviewSelect = {
    // records:
    id         : true,
    
    // data:
    name       : true,
} satisfies Prisma.ShippingProviderSelect;



export const shippingDetailSelect = {
    // records:
    id         : true,
    
    // data:
    visibility : true,
    
    autoUpdate : true,
    origin     : {
        select : {
            // data:
            country : true,
            state   : true,
            city    : true,
        },
    },
    
    name       : true,
    
    weightStep : true,
    eta        : true,
    rates      : true,
    
    // relations:
    useZones   : true,
    zones      : {
        select : {
            // records:
            id        : true,
            
            // data:
            sort      : true,
            
            name      : true,
            
            eta       : true,
            rates     : true,
            
            useZones  : true,
            zones     : {
                select : {
                    // records:
                    id        : true,
                    
                    // data:
                    sort      : true,
                    
                    name      : true,
                    
                    eta       : true,
                    rates     : true,
                    
                    useZones  : true,
                    zones     : {
                        select : {
                            // records:
                            id        : true,
                            updatedAt : false,
                            
                            // data:
                            sort      : true,
                            
                            name      : true,
                            
                            eta       : true,
                            rates     : true,
                        },
                        orderBy : {
                            sort: 'asc',
                        },
                    },
                },
                orderBy : {
                    sort: 'asc',
                },
            },
        },
        orderBy : {
            sort: 'asc',
        },
    },
} satisfies Prisma.ShippingProviderSelect;



export interface CoverageCountryDiff {
    coverageCountryOris : CoverageCountryDetail[]
    coverageCountryDels : string[]
    coverageCountryAdds : (Omit<CoverageCountryDetail, 'id'|'zones'> & Pick<CoverageStateDiff, 'coverageStateAdds'>)[]
    coverageCountryMods : (Omit<CoverageCountryDetail,      'zones'> & CoverageStateDiff)[]
}
export interface CoverageStateDiff {
    coverageStateDels : string[]
    coverageStateAdds : (Omit<CoverageStateDetail, 'id'|'zones'> & Pick<CoverageCityDiff, 'coverageCityAdds'>)[]
    coverageStateMods : (Omit<CoverageStateDetail,      'zones'> & CoverageCityDiff)[]
}
export interface CoverageCityDiff {
    coverageCityDels : string[]
    coverageCityAdds : Omit<CoverageCityDetail, 'id'>[]
    coverageCityMods : CoverageCityDetail[]
}
export const createCoverageCountryDiff = (coverageCountries: CoverageCountryDetail[], coverageCountryOris : CoverageCountryDetail[]): CoverageCountryDiff => {
    const coverageCountryDels : CoverageCountryDiff['coverageCountryDels'] = (() => {
        const postedIds  : string[] = coverageCountries.map(({id}) => id);
        const currentIds : string[] = coverageCountryOris.map(({id}) => id);
        return currentIds.filter((currentId) => !postedIds.includes(currentId));
    })();
    const coverageCountryAdds : CoverageCountryDiff['coverageCountryAdds'] = [];
    const coverageCountryMods : CoverageCountryDiff['coverageCountryMods'] = [];
    let coverageCountrySortCounter = 0;
    for (const {id: countryId, sort, zones: coverageStates, ...restCoverageCountry} of coverageCountries) {
        const {
            coverageStateDels,
            coverageStateAdds,
            coverageStateMods,
        } = ((): CoverageStateDiff => {
            const coverageStateDels : CoverageStateDiff['coverageStateDels'] = (() => {
                const postedIds  : string[] = coverageStates.map(({id}) => id);
                const currentIds : string[] = coverageCountryOris.find(({id: parentId}) => (parentId === countryId))?.zones.map(({id}) => id) ?? [];
                return currentIds.filter((currentId) => !postedIds.includes(currentId));
            })();
            const coverageStateAdds : CoverageStateDiff['coverageStateAdds'] = [];
            const coverageStateMods : CoverageStateDiff['coverageStateMods'] = [];
            let coverageStateSortCounter = 0;
            for (const {id: stateId, sort, zones: coverageCities, ...restCoverageState} of coverageStates) {
                const {
                    coverageCityDels,
                    coverageCityAdds,
                    coverageCityMods,
                } = ((): CoverageCityDiff => {
                    const coverageCityDels : CoverageCityDiff['coverageCityDels'] = (() => {
                        const postedIds  : string[] = coverageCities.map(({id}) => id);
                        const currentIds : string[] = coverageCountryOris.find(({id: grandParentId}) => (grandParentId === countryId))?.zones.find(({id: parentId}) => (parentId === stateId))?.zones.map(({id}) => id) ?? [];
                        return currentIds.filter((currentId) => !postedIds.includes(currentId));
                    })();
                    const coverageCityAdds : CoverageCityDiff['coverageCityAdds'] = [];
                    const coverageCityMods : CoverageCityDiff['coverageCityMods'] = [];
                    let coverageCitySortCounter = 0;
                    for (const {id: cityId, sort, ...restCoverageCity} of coverageCities) {
                        if (!cityId || (cityId[0] === ' ')) {
                            coverageCityAdds.push({
                                // data:
                                sort: coverageCitySortCounter++, // normalize sort, zero based
                                ...restCoverageCity,
                            });
                            continue;
                        } // if
                        
                        
                        
                        coverageCityMods.push({
                            // data:
                            id   : cityId,
                            sort : coverageCitySortCounter++, // normalize sort, zero based
                            ...restCoverageCity,
                        });
                    } // for
                    return {
                        coverageCityDels,
                        coverageCityAdds,
                        coverageCityMods,
                    };
                })();
                
                
                
                if (!stateId || (stateId[0] === ' ')) {
                    coverageStateAdds.push({
                        // data:
                        sort: coverageStateSortCounter++, // normalize sort, zero based
                        ...restCoverageState,
                        
                        // relations:
                        coverageCityAdds,
                    });
                    continue;
                } // if
                
                
                
                coverageStateMods.push({
                    // data:
                    id   : stateId,
                    sort : coverageStateSortCounter++, // normalize sort, zero based
                    ...restCoverageState,
                    
                    // relations:
                    coverageCityDels,
                    coverageCityAdds,
                    coverageCityMods,
                });
            } // for
            return {
                coverageStateDels,
                coverageStateAdds,
                coverageStateMods,
            };
        })();
        
        
        
        if (!countryId || (countryId[0] === ' ')) {
            coverageCountryAdds.push({
                // data:
                sort: coverageCountrySortCounter++, // normalize sort, zero based
                ...restCoverageCountry,
                
                // relations:
                coverageStateAdds,
            });
            continue;
        } // if
        
        
        
        coverageCountryMods.push({
            // data:
            id   : countryId,
            sort : coverageCountrySortCounter++, // normalize sort, zero based
            ...restCoverageCountry,
            
            // relations:
            coverageStateDels,
            coverageStateAdds,
            coverageStateMods,
        });
    } // for
    return {
        coverageCountryOris,
        
        coverageCountryDels,
        coverageCountryAdds,
        coverageCountryMods,
    };
}
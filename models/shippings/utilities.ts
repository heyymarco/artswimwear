// models:
import {
    type Prisma,
}                           from '@prisma/client'
import {
    // types:
    type CoverageCountryDetail,
    type CoverageStateDetail,
    type CoverageCityDetail,
}                           from '@/models'
import {
    // utilities:
    selectId,
}                           from '../utilities'



// utilities:

export const shippingPreviewSelect = {
    // records:
    id          : true,
    
    // data:
    name        : true,
} satisfies Prisma.ShippingProviderSelect;



export const shippingDetailSelect = {
    // records:
    id          : true,
    
    // data:
    visibility  : true,
    
    autoUpdate  : true,
    origin      : {
        select : {
            // data:
            country : true,
            state   : true,
            city    : true,
        },
    },
    
    name        : true,
    
    weightStep  : true,
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
        orderBy : {
            sort  : 'asc',
        },
    },
    
    // relations:
    useZones    : true,
    zones       : {
        select : {
            // records:
            id          : true,
            
            // data:
            sort        : true,
            
            name        : true,
            
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
                orderBy : {
                    sort  : 'asc',
                },
            },
            
            useZones    : true,
            zones       : {
                select : {
                    // records:
                    id          : true,
                    
                    // data:
                    sort        : true,
                    
                    name        : true,
                    
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
                        orderBy : {
                            sort  : 'asc',
                        },
                    },
                    
                    useZones    : true,
                    zones       : {
                        select : {
                            // records:
                            id          : true,
                            updatedAt   : false,
                            
                            // data:
                            sort        : true,
                            
                            name        : true,
                            
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
                                orderBy : {
                                    sort  : 'asc',
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
    coverageStateOris : CoverageStateDetail[]
    
    coverageStateDels : string[]
    coverageStateAdds : (Omit<CoverageStateDetail, 'id'|'zones'> & Pick<CoverageCityDiff, 'coverageCityAdds'>)[]
    coverageStateMods : (Omit<CoverageStateDetail,      'zones'> & CoverageCityDiff)[]
}
export interface CoverageCityDiff {
    coverageCityOris : CoverageCityDetail[]
    
    coverageCityDels : string[]
    coverageCityAdds : Omit<CoverageCityDetail, 'id'>[]
    coverageCityMods : CoverageCityDetail[]
}
export const createCoverageCountryDiff = (coverageCountries: CoverageCountryDetail[], coverageCountryOris : CoverageCountryDetail[]): CoverageCountryDiff => {
    const coverageCountryDels : CoverageCountryDiff['coverageCountryDels'] = (() => {
        const postedIds  : string[] = coverageCountries.map(selectId);
        const currentIds : string[] = coverageCountryOris.map(selectId);
        return currentIds.filter((currentId) => !postedIds.includes(currentId));
    })();
    const coverageCountryAdds : CoverageCountryDiff['coverageCountryAdds'] = [];
    const coverageCountryMods : CoverageCountryDiff['coverageCountryMods'] = [];
    let coverageCountrySortCounter = 0;
    for (const {id: countryId, sort, zones: coverageStates, ...restCoverageCountry} of coverageCountries) {
        const {
            coverageStateOris,
            
            coverageStateDels,
            coverageStateAdds,
            coverageStateMods,
        } = ((): CoverageStateDiff => {
            const coverageStateOris : CoverageStateDiff['coverageStateOris'] = coverageCountryOris.find(({id: parentId}) => (parentId === countryId))?.zones ?? [];
            
            const coverageStateDels : CoverageStateDiff['coverageStateDels'] = (() => {
                const postedIds  : string[] = coverageStates.map(selectId);
                const currentIds : string[] = coverageStateOris.map(selectId) ?? [];
                return currentIds.filter((currentId) => !postedIds.includes(currentId));
            })();
            const coverageStateAdds : CoverageStateDiff['coverageStateAdds'] = [];
            const coverageStateMods : CoverageStateDiff['coverageStateMods'] = [];
            let coverageStateSortCounter = 0;
            for (const {id: stateId, sort, zones: coverageCities, ...restCoverageState} of coverageStates) {
                const {
                    coverageCityOris,
                    
                    coverageCityDels,
                    coverageCityAdds,
                    coverageCityMods,
                } = ((): CoverageCityDiff => {
                    const coverageCityOris : CoverageCityDiff['coverageCityOris'] = coverageStateOris.find(({id: parentId}) => (parentId === stateId))?.zones ?? [];
                    
                    const coverageCityDels : CoverageCityDiff['coverageCityDels'] = (() => {
                        const postedIds  : string[] = coverageCities.map(selectId);
                        const currentIds : string[] = coverageCityOris.map(selectId) ?? [];
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
                        coverageCityOris,
                        
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
                    coverageCityOris,
                    
                    coverageCityDels,
                    coverageCityAdds,
                    coverageCityMods,
                });
            } // for
            return {
                coverageStateOris,
                
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
            coverageStateOris,
            
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
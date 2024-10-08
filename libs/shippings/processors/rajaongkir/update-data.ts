// models:
import {
    // types:
    type Prisma,
    type DefaultShippingOriginDetail,
    type ShippingEta,
    type ShippingRate,
    
    
    
    // utilities:
    selectWithSort,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internals:
import {
    // types:
    type MatchingAddress,
}                           from '@/libs/shippings/shippings'
import {
    stateCityToIdMap,
}                           from './stateCityToIdMap'
import {
    convertForeignToSystemCurrencyIfRequired,
}                           from '@/libs/currencyExchanges'
import {
    getNormalizedStateName,
    getNormalizedCityName,
}                           from './utilities'



// utilities:
const systemShippings : string[] = [
    'jne reguler',
    'jne yes',
    'jne oke',
    
    'pos reguler',
    'pos nextday',
    
    'tiki reguler',
    'tiki ons',
    'tiki economy',
];
const isNotNullOrUndefined = <TValue>(value: TValue): value is Exclude<TValue, null|undefined> => (value !== null) && (value !== undefined);



export interface UpdateShippingProviderData {

}
export const updateShippingProviders = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], origin: DefaultShippingOriginDetail|null|undefined, shippingAddress: MatchingAddress): Promise<void> => {
    if (!process.env.RAJAONGKIR_SECRET || !origin) return;
    
    
    
    if (origin.country.trim().toLowerCase() !== 'id') return; // indonesia only, international is not supported yet
    const originId = stateCityToIdMap.get(`${origin.state.trim().toLowerCase()}/${origin.city.trim().toLowerCase()}`);
    if (originId === undefined) return; // the origin id is not known => abort updating
    
    
    
    const {
        country,
        state,
        city,
    } = shippingAddress;
    if (country.trim().toLowerCase() !== 'id') return; // indonesia only, international is not supported yet
    const destinationId = stateCityToIdMap.get(`${state.trim().toLowerCase()}/${city.trim().toLowerCase()}`);
    if (destinationId === undefined) return; // the destination id is not known => abort updating
    
    
    
    const now        = new Date();
    const maxExpired = new Date(now.valueOf() - (30 * 24 * 3600 * 1000)); // max 30 days ago
    const shippingProviders = await prismaTransaction.shippingProvider.findMany({
        where  : {
            autoUpdate : true, // autoUpdate is enabled
            name : {
                mode   : 'insensitive',
                in     : systemShippings,
            },
        },
        select : {
            id         : true, // required for updating later
            name       : true, // required for updating later
            
            useZones   : true,
            zones      : { // countries
                where  : {
                    // data:
                    name       : { mode: 'insensitive', equals: country },
                },
                select : {
                    // records:
                    id         : true,
                    
                    // data:
                    // name       : true,
                    eta        : {
                        select : {
                            // data:
                            min : true,
                            max : true,
                        },
                    },
                    rates      : {
                        select : {
                            // data:
                            start : true,
                            rate  : true,
                        },
                    },
                    
                    // relations:
                    useZones : true,
                    zones    : { // states
                        where  : {
                            // data:
                            name       : { mode: 'insensitive', equals: state },
                        },
                        select : {
                            // records:
                            id         : true,
                            
                            // data:
                            eta        : {
                                select : {
                                    // data:
                                    min : true,
                                    max : true,
                                },
                            },
                            rates      : {
                                select : {
                                    // data:
                                    start : true,
                                    rate  : true,
                                },
                            },
                            
                            // relations:
                            useZones : true,
                            zones    : { // cities
                                where  : {
                                    // data:
                                    name       : { mode: 'insensitive', equals: city },
                                },
                                select : {
                                    // records:
                                    id         : true,
                                    updatedAt  : true,
                                    
                                    // data:
                                    eta        : {
                                        select : {
                                            // records:
                                            id : true,
                                        },
                                    },
                                },
                                take   : 1,
                            },
                        },
                        take   : 1,
                    },
                },
                take   : 1,
            },
        },
    });
    if (!shippingProviders.length) return; // no shippingProvider => abort updating
    const expiredShippingProviders = (
        shippingProviders
        .filter((shippingProvider) => {
            const updatedAt = shippingProvider.zones?.[0]?.zones?.[0]?.zones?.[0]?.updatedAt;
            return !updatedAt || (updatedAt < maxExpired);
        })
    );
    if (!expiredShippingProviders.length) return; // no expired shippingProvider => abort updating
    // console.log('prividers: ', expiredShippingProviders);
    // return;
    
    
    
    const shippingProvidersWithUnique = (
        expiredShippingProviders
        .map((shippingProvider) => {
            let baseName = shippingProvider.name.trim().toLowerCase();
            switch (baseName) {
                case 'jne reguler':
                case 'jne oke':
                case 'jne yes':
                    baseName = 'jne';
                    break;
                
                case 'pos reguler':
                case 'pos sameday':
                case 'pos nextday':
                    baseName = 'pos';
                    break;
                
                case 'tiki reguler':
                case 'tiki economy':
                case 'tiki ons':
                    baseName = 'tiki';
                    break;
            } // switch
            
            
            
            return {
                // key: the uniqueness by combination of baseName /* + country + state + city */
                unique: baseName,
                
                // value:
                baseName,
                ...shippingProvider,
            };
        })
        .filter(isNotNullOrUndefined)
    );
    // console.log('all: ', shippingProvidersWithUnique);
    const uniqueShippingProviders = new Map(
        shippingProvidersWithUnique
        .map(({unique, ...value}) => [unique, value])
    );
    // console.log('unique: ', uniqueShippingProviders);
    
    
    
    const newShippingData : ShippingDataWithOrigin[] = (
        (await Promise.allSettled(
            Array.from(
                uniqueShippingProviders
                .values()
            )
            .map(({baseName}) => {
                try {
                    switch (baseName) {
                        case 'jne':
                            return shippingDataWithOrigin(getShippingJne(originId, destinationId), origin);
                        
                        case 'pos':
                            return shippingDataWithOrigin(getShippingPos(originId, destinationId), origin);
                        
                        case 'tiki':
                            return shippingDataWithOrigin(getShippingTiki(originId, destinationId), origin);
                        
                        default:
                            return null;
                    } // switch
                }
                catch {
                    return null;
                } // try
            })
        ))
        .filter((result): result is Exclude<typeof result, PromiseRejectedResult> => (result.status !== 'rejected'))
        .map((successResult) => successResult.value)
        .filter(isNotNullOrUndefined)
        .flat() // flatten the shippingProvider (Reguler|Oke|Yes)
    );
    // console.log('data: ', newShippingData);
    if (!newShippingData.length) return;
    
    
    
    await Promise.all(
        expiredShippingProviders
        .map((shippingProvider) => {
            const shippingDataItem        = newShippingData.find(({name, origin}) =>
                (shippingProvider.name.trim().toLowerCase() === name.trim().toLowerCase())
            );
            if (!shippingDataItem) return null;
            return {
                // records:
                id      : shippingProvider.id,
                
                // data:
                eta     : shippingDataItem.eta,
                rates   : shippingDataItem.rates,
                
                // relations:
                zones   : shippingProvider.zones,
                
                oldData : shippingProvider,
            };
        })
        .filter(isNotNullOrUndefined)
        .map(async ({id, eta: newCityEta, rates: newCityRates, zones, oldData}) => {
            const countryModel      = zones?.at(0);
            const countryId         = countryModel?.id;
            const oldCountryEta     = countryModel?.eta;
            const hasCountryEta     = oldCountryEta !== undefined;
            const oldCountryRates   = countryModel?.rates;
            
            const stateModel        = countryModel?.zones?.at(0);
            const stateId           = stateModel?.id;
            const oldStateEta       = stateModel?.eta;
            const hasStateEta       = oldStateEta !== undefined;
            const oldStateRates     = stateModel?.rates;
            
            const cityModel         = stateModel?.zones?.at(0);
            const cityId            = cityModel?.id;
            const hasCityEta        = cityModel?.eta?.id !== undefined;
            
            
            
            let newStateEta : ShippingEta|null = {
                min : Math.min(...[oldStateEta?.min, newCityEta?.min].filter(isNotNullOrUndefined)), // the minimum duration of city's eta::min(s)
                max : Math.max(...[oldStateEta?.max, newCityEta?.max].filter(isNotNullOrUndefined)), // the maximum duration of city's eta::max(s)
            };
            if (!isFinite(newStateEta.min) || !isFinite(newStateEta.max)) newStateEta = null; // no min|max data => empty
            
            let newStateRates : ShippingRate[]|undefined = (
                (!oldStateRates || (oldStateRates.length !== 1) || !newCityRates || (newCityRates.length !== 1) || (oldStateRates[0].start !== newCityRates[0].start))
                ? (!oldStateRates ? [] : undefined) // blank old_data => blank_array -OR- no new_data -or- confusing to update => keeps unchanged
                : [
                    {
                        start : newCityRates[0].start,
                        rate  : Math.max(oldStateRates[0].rate, newCityRates[0].rate), // the maximum price of city's price(s)
                    },
                ]
            );
            
            
            
            let newCountryEta : ShippingEta|null = {
                min : Math.min(...[oldCountryEta?.min, newStateEta?.min].filter(isNotNullOrUndefined)), // the minimum duration of state's eta::min(s)
                max : Math.max(...[oldCountryEta?.max, newStateEta?.max].filter(isNotNullOrUndefined)), // the maximum duration of state's eta::max(s)
            };
            if (!isFinite(newCountryEta.min) || !isFinite(newCountryEta.max)) newCountryEta = null; // no min|max data => empty
            
            let newCountryRates : ShippingRate[]|undefined = (
                (!oldCountryRates || (oldCountryRates.length !== 1) || !newStateRates || (newStateRates.length !== 1) || (oldCountryRates[0].start !== newStateRates[0].start))
                ? (!oldCountryRates ? [] : undefined) // blank old_data => blank_array -OR- no new_data -or- confusing to update => keeps unchanged
                : [
                    {
                        start : newStateRates[0].start,
                        rate  : Math.max(oldCountryRates[0].rate, newStateRates[0].rate), // the maximum price of state's price(s)
                    },
                ]
            );
            
            
            
            const countryUppercased = country.toUpperCase();
            
            
            
            const createCityData    : Omit<Prisma.CoverageCityCreateInput, 'parent'>|undefined = (
                !!cityId
                ? undefined
                : {
                    // records:
                    updatedAt      : now,
                    
                    // data:
                    sort           : 999,
                    
                    name           : getNormalizedCityName(countryUppercased, state, city) ?? city,
                    
                    eta            : (newCityEta === undefined) /* do NOT modify if undefined */ ? undefined : { // compound_like relation
                        // moved to createCityData:
                        // one_conditional nested_update if create:
                        create : (newCityEta === null) /* do NOT update if null */ ? undefined : newCityEta,
                    },
                    rates          : (newCityRates === undefined) /* do NOT modify if undefined */ ? undefined : { // array_like relation
                        // create all item(s) with sequential order:
                        create : !newCityRates.length /* do NOT update if empty */ ? undefined : newCityRates.map(selectWithSort),
                    },
                }
            );
            const updateCityData    : Prisma.CoverageCityUpdateArgs|undefined = (
                !cityId
                ? undefined
                : {
                    where  : {
                        // records:
                        id         : cityId,
                    },
                    data   : {
                        // records:
                        updatedAt  : now,
                        
                        // data:
                        eta        : (newCityEta === undefined) /* do NOT modify if undefined */ ? undefined : { // compound_like relation
                            // nested_delete if set to null:
                            delete : ((newCityEta !== null) /* do NOT delete if NOT null */ || !hasCityEta /* do NOT delete if NOTHING to delete */) ? undefined : {
                                // do DELETE
                                // no condition needed because one to one relation
                            },
                            
                            // moved to createCityData:
                            // one_conditional nested_update if create:
                         // create : (newCityEta === null) /* do NOT update if null */ ? undefined : newCityEta,
                            
                            // two_conditional nested_update if update:
                            upsert : (newCityEta === null) /* do NOT update if null */ ? undefined : {
                                update : newCityEta, // prefer   to `update` if already exist
                                create : newCityEta, // fallback to `create` if not     exist
                            },
                        },
                        rates      : (newCityRates === undefined) /* do NOT modify if undefined */ ? undefined : { // array_like relation
                            // clear the existing item(s), if any:
                            deleteMany : {
                                // do DELETE ALL related item(s)
                                // no condition is needed because we want to delete all related item(s)
                            },
                            
                            // create all item(s) with sequential order:
                            create : !newCityRates.length /* do NOT update if empty */ ? undefined : newCityRates.map(selectWithSort),
                        },
                    },
                }
            );
            
            const createStateData   : Omit<Prisma.CoverageStateCreateInput, 'parent'>|undefined = (
                !!stateId
                ? undefined
                : {
                    // data:
                    sort           : 999,
                    
                    name           : getNormalizedStateName(countryUppercased, state) ?? state,
                    
                    eta            : (newStateEta === undefined) /* do NOT modify if undefined */ ? undefined : { // compound_like relation
                        // moved to createStateData:
                        // one_conditional nested_update if create:
                        create : (newStateEta === null) /* do NOT update if null */ ? undefined : newStateEta,
                    },
                    rates          : (newStateRates === undefined) /* do NOT modify if undefined */ ? undefined : { // array_like relation
                        // create all item(s) with sequential order:
                        create : !newStateRates.length /* do NOT update if empty */ ? undefined : newStateRates.map(selectWithSort),
                    },
                    
                    // relations:
                    useZones       : true,
                    zones          : {
                        create     : createCityData,
                    },
                }
            );
            const updateStateData   : Prisma.CoverageStateUpdateArgs|undefined = (
                !stateId
                ? undefined
                : {
                    where  : {
                        // records:
                        id         : stateId,
                    },
                    data   : {
                        // data:
                        eta        : (newStateEta === undefined) /* do NOT modify if undefined */ ? undefined : { // compound_like relation
                            // nested_delete if set to null:
                            delete : ((newStateEta !== null) /* do NOT delete if NOT null */ || !hasStateEta /* do NOT delete if NOTHING to delete */) ? undefined : {
                                // do DELETE
                                // no condition needed because one to one relation
                            },
                            
                            // moved to createStateData:
                            // one_conditional nested_update if create:
                         // create : (newStateEta === null) /* do NOT update if null */ ? undefined : newStateEta,
                            
                            // two_conditional nested_update if update:
                            upsert : (newStateEta === null) /* do NOT update if null */ ? undefined : {
                                update : newStateEta, // prefer   to `update` if already exist
                                create : newStateEta, // fallback to `create` if not     exist
                            },
                        },
                        rates      : (newStateRates === undefined) /* do NOT modify if undefined */ ? undefined : { // array_like relation
                            // clear the existing item(s), if any:
                            deleteMany : {
                                // do DELETE ALL related item(s)
                                // no condition is needed because we want to delete all related item(s)
                            },
                            
                            // create all item(s) with sequential order:
                            create : !newStateRates.length /* do NOT update if empty */ ? undefined : newStateRates.map(selectWithSort),
                        },
                        
                        // relations:
                        zones      : {
                            create : createCityData,
                            update : updateCityData,
                        },
                    },
                }
            );
            
            const createCountryData : Omit<Prisma.CoverageCountryCreateInput, 'parent'>|undefined = (
                !!countryId
                ? undefined
                : {
                    // data:
                    sort           : 999,
                    
                    name           : countryUppercased,
                    
                    eta            : (newCountryEta === undefined) /* do NOT modify if undefined */ ? undefined : { // compound_like relation
                        // moved to createCountryData:
                        // one_conditional nested_update if create:
                        create : (newCountryEta === null) /* do NOT update if null */ ? undefined : newCountryEta,
                    },
                    rates          : (newCountryRates === undefined) /* do NOT modify if undefined */ ? undefined : { // array_like relation
                        // create all item(s) with sequential order:
                        create : !newCountryRates.length /* do NOT update if empty */ ? undefined : newCountryRates.map(selectWithSort),
                    },
                    
                    // relations:
                    useZones       : true,
                    zones          : {
                        create     : createStateData,
                    },
                }
            );
            const updateCountryData : Prisma.CoverageCountryUpdateArgs|undefined = (
                !countryId
                ? undefined
                : {
                    where  : {
                        // records:
                        id         : countryId,
                    },
                    data   : {
                        // data:
                        eta        : (newCountryEta === undefined) /* do NOT modify if undefined */ ? undefined : { // compound_like relation
                            // nested_delete if set to null:
                            delete : ((newCountryEta !== null) /* do NOT delete if NOT null */ || !hasCountryEta /* do NOT delete if NOTHING to delete */) ? undefined : {
                                // do DELETE
                                // no condition needed because one to one relation
                            },
                            
                            // moved to createCountryData:
                            // one_conditional nested_update if create:
                         // create : (newCountryEta === null) /* do NOT update if null */ ? undefined : newCountryEta,
                            
                            // two_conditional nested_update if update:
                            upsert : (newCountryEta === null) /* do NOT update if null */ ? undefined : {
                                update : newCountryEta, // prefer   to `update` if already exist
                                create : newCountryEta, // fallback to `create` if not     exist
                            },
                        },
                        rates      : (newCountryRates === undefined) /* do NOT modify if undefined */ ? undefined : { // array_like relation
                            // clear the existing item(s), if any:
                            deleteMany : {
                                // do DELETE ALL related item(s)
                                // no condition is needed because we want to delete all related item(s)
                            },
                            
                            // create all item(s) with sequential order:
                            create : !newCountryRates.length /* do NOT update if empty */ ? undefined : newCountryRates.map(selectWithSort),
                        },
                        
                        // relations:
                        zones : {
                            create : createStateData,
                            update : updateStateData,
                        },
                    },
                }
            );
            
            
            
            await prismaTransaction.shippingProvider.update({
                where  : {
                    id : id,
                },
                data : {
                    zones : {
                        create : createCountryData,
                        update : updateCountryData,
                    },
                },
            });
        })
    );
}



interface ShippingDataWithOrigin
    extends
        ShippingData
{
    origin : DefaultShippingOriginDetail
}
const shippingDataWithOrigin = async (shippingData: Promise<ShippingData[]>, origin: DefaultShippingOriginDetail): Promise<ShippingDataWithOrigin[]> => {
    return (
        (await shippingData)
        .map((item) => ({
            ...item,
            origin,
        }))
    );
}



interface ShippingData {
    name  : string
    eta   : ShippingEta|null
    rates : ShippingRate[]
}
const getShippingJne  = async (originId: string, destinationId: string): Promise<ShippingData[]> => {
    // console.log('fetching rajaongkir');
    const res = await fetch('https://api.rajaongkir.com/starter/cost', {
        method  : 'POST',
        headers : {
            'key': process.env.RAJAONGKIR_SECRET ?? '',
            'Content-Type': 'application/json',
        },
        body    : JSON.stringify({
            origin      : originId,
            destination : destinationId,
            weight      : 1000 /* gram */,
            courier     : 'jne',
        }),
    });
    
    
    
    const shippingServices       = await handleRajaongkirResponse(await res.json());
    const shippingServiceReguler = shippingServices.find(({type}) => (/REG|CTC/i).test(type));
    const shippingServiceOke     = shippingServices.find(({type}) => (/OKE/i).test(type));
    const shippingServiceYes     = shippingServices.find(({type}) => (/YES|CTCYES/i).test(type));
    return (
        [
            !shippingServiceReguler ? null : {
                name          : 'JNE Reguler',
                eta           : shippingServiceReguler.eta,
                rates : [
                    {
                        start : 0,
                        rate  : shippingServiceReguler.cost,
                    }
                ],
            } satisfies ShippingData,
            
            !shippingServiceOke ? null : {
                name          : 'JNE Oke',
                eta           : shippingServiceOke.eta,
                rates : [
                    {
                        start : 0,
                        rate  : shippingServiceOke.cost,
                    }
                ],
            } satisfies ShippingData,
            
            !shippingServiceYes ? null : {
                name          : 'JNE Yes',
                eta           : shippingServiceYes.eta,
                rates : [
                    {
                        start : 0,
                        rate  : shippingServiceYes.cost,
                    }
                ],
            } satisfies ShippingData,
        ]
        .filter(isNotNullOrUndefined)
    );
}
const getShippingPos  = async (originId: string, destinationId: string): Promise<ShippingData[]> => {
    // console.log('fetching rajaongkir');
    const res = await fetch('https://api.rajaongkir.com/starter/cost', {
        method  : 'POST',
        headers : {
            'key': process.env.RAJAONGKIR_SECRET ?? '',
            'Content-Type': 'application/json',
        },
        body    : JSON.stringify({
            origin      : originId,
            destination : destinationId,
            weight      : 1000 /* gram */,
            courier     : 'pos',
        }),
    });
    
    
    
    const shippingServices       = await handleRajaongkirResponse(await res.json());
    const shippingServiceReguler = shippingServices.find(({type}) => (/Pos Reguler/i).test(type));
    const shippingServiceNextday = shippingServices.find(({type}) => (/Pos Nextday/i).test(type));
    return (
        [
            !shippingServiceReguler ? null : {
                name          : 'Pos Reguler',
                eta           : shippingServiceReguler.eta,
                rates : [
                    {
                        start : 0,
                        rate  : shippingServiceReguler.cost,
                    }
                ],
            } satisfies ShippingData,
            
            !shippingServiceNextday ? null : {
                name          : 'Pos Nextday',
                eta           : shippingServiceNextday.eta,
                rates : [
                    {
                        start : 0,
                        rate  : shippingServiceNextday.cost,
                    }
                ],
            } satisfies ShippingData,
        ]
        .filter(isNotNullOrUndefined)
    );
}
const getShippingTiki = async (originId: string, destinationId: string): Promise<ShippingData[]> => {
    // console.log('fetching rajaongkir');
    const res = await fetch('https://api.rajaongkir.com/starter/cost', {
        method  : 'POST',
        headers : {
            'key': process.env.RAJAONGKIR_SECRET ?? '',
            'Content-Type': 'application/json',
        },
        body    : JSON.stringify({
            origin      : originId,
            destination : destinationId,
            weight      : 1000 /* gram */,
            courier     : 'tiki',
        }),
    });
    
    
    
    const shippingServices       = await handleRajaongkirResponse(await res.json());
    const shippingServiceReguler = shippingServices.find(({type}) => (/REG/i).test(type));
    const shippingServiceEconomy = shippingServices.find(({type}) => (/ECO/i).test(type));
    const shippingServiceOns     = shippingServices.find(({type}) => (/ONS/i).test(type));
    return (
        [
            !shippingServiceReguler ? null : {
                name          : 'Tiki Reguler',
                eta           : shippingServiceReguler.eta,
                rates : [
                    {
                        start : 0,
                        rate  : shippingServiceReguler.cost,
                    }
                ],
            } satisfies ShippingData,
            
            !shippingServiceEconomy ? null : {
                name          : 'Tiki Economy',
                eta           : shippingServiceEconomy.eta,
                rates : [
                    {
                        start : 0,
                        rate  : shippingServiceEconomy.cost,
                    }
                ],
            } satisfies ShippingData,
            
            !shippingServiceOns ? null : {
                name          : 'Tiki ONS',
                eta           : shippingServiceOns.eta,
                rates : [
                    {
                        start : 0,
                        rate  : shippingServiceOns.cost,
                    }
                ],
            } satisfies ShippingData,
        ]
        .filter(isNotNullOrUndefined)
    );
}



interface ShippingService {
    type : string
    eta  : ShippingEta|null
    cost : number
}
const handleRajaongkirResponse = async (json: any): Promise<ShippingService[]> => {
    if (typeof(json) !== 'object') throw Error('unexpected response');
    const {
        rajaongkir : {
            results : [
                {
                    costs : costsRaw,
                },
            ],
        },
    } = json;
    if (!Array.isArray(costsRaw)) throw Error('unexpected response');
    
    
    
    const serviceTypes : ShippingService[] = await Promise.all(costsRaw.map(async (serviceType: any): Promise<ShippingService> => {
        if ((typeof(serviceType) !== 'object') || !serviceType) throw Error('unexpected response');
        const {
            service : type,
            cost    : [
                { etd, value: costIDR },
            ],
        } = serviceType;
        if ((typeof(type)    !== 'string') || !type        ) throw Error('unexpected response');
        if ((typeof(etd )    !== 'string') || !etd         ) throw Error('unexpected response');
        if ((typeof(costIDR) !== 'number') || (costIDR < 0)) throw Error('unexpected response');
        
        
        
        const etas = (
            etd
            .split('-')
            .map((etaStr) => {
                if (!etaStr) return null;
                const eta = Number.parseFloat(etaStr);
                if (!isFinite(eta)) return null;
                return eta;
            })
        );
        const [etaMin, etaMax] = etas;
        return {
            type    : type,
            eta     : ((etaMin === null) || (etaMin === undefined)) ? null : {
                min : etaMin,
                max : ((etaMax === null) || (etaMax === undefined) || (etaMax < etaMin)) ? etaMin : etaMax,
            } satisfies ShippingEta,
            cost    : await convertForeignToSystemCurrencyIfRequired(costIDR, 'IDR'),
        };
    }));
    return serviceTypes;
}
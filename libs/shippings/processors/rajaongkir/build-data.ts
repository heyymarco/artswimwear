import { default as data } from './dump-results-jne.js'
import { type PathLike } from 'fs'
import { type FileHandle, writeFile } from 'fs/promises'
import { customAlphabet } from 'nanoid/async'
import { type ShippingEta, type ShippingRate } from '@/models'



export interface BuildDataOptions {
    serviceType             : RegExp
    serviceName             : string
    fallbacksToHighestPrice : boolean
    outputFile              : PathLike|FileHandle
}
export const buildData = async (options: BuildDataOptions): Promise<void> => {
    // options:
    const {
        serviceType,
        serviceName,
        fallbacksToHighestPrice,
        outputFile,
    } = options;
    
    
    
    const services = (
        data
        .map(([destination, items]) => {
            const service = (items as any[]).find(([type]) => serviceType.test(type));
            if (!service) return undefined
            
            
            
            const [
                type, // serviceType
                [{
                    value,
                    etd : eta,
                }]
            ] = service;
            const etas = (eta as string).split('-').map((etaStr: string) => {
                if (!etaStr) return null;
                const eta = Number.parseFloat(etaStr);
                if (!isFinite(eta)) return null;
                return eta;
            });
            const [etaMin, etaMax] = etas;
            return {
                destination : destination,
                rate        : value,
                eta         : ((etaMin === null) || (etaMin === undefined)) ? null : {
                    min     : etaMin,
                    max     : ((etaMax === null) || (etaMax === undefined) || (etaMax < etaMin)) ? etaMin : etaMax,
                },
            };
        })
        .filter((item): item is Exclude<typeof item, undefined|null> => !!item)
    );
    const groupByStates = (
        services
        .reduce((states: Map<string, any[]>, service: any) => {
            try {
                const dests  = service.destination.split('/');
                const state  = dests[0];
                const city   = dests[1];
                const cities = states.get(state) ?? (() => {
                    const cities : any[] = [];
                    states.set(state, cities);
                    return cities;
                })();
                cities.push({
                    name          : city,
                    
                    eta           : service.eta,
                    rates         : [
                        {
                            start : 0,
                            rate  : service.rate,
                        }
                    ],
                });
            }
            finally {
                return states;
            } // try
        }, new Map<string, any[]>())
    );
    const states = (
        Array.from(groupByStates.entries())
        .map(([state, cities]) => ({
            name          : state,
            
            eta           : (
                fallbacksToHighestPrice
                ? cities.reduce((accum, {eta}) => {
                    if (accum === null) {
                        return eta;
                    }
                    else {
                        return {
                            min : Math.min(accum.min, eta.min),
                            max : Math.max(accum.max, eta.max),
                        };
                    } // if
                }, null as ShippingEta|null)
                : null
            ),
            rates         : (
                fallbacksToHighestPrice
                ? (cities.reduce((accum, {rates}) => {
                    if (accum === null) {
                        return rates;
                    }
                    else {
                        const rate = rates[0];
                        return [
                            {
                                start : 0,
                                rate  : Math.max(accum[0].rate, rate.rate),
                            }
                        ];
                    } // if
                }, null as ShippingRate[]|null) ?? [])
                : []
            ),
            
            useZones      : true,
            zones         : cities,
        }))
    );
    const countries = [
        {
            name          : 'ID',
            
            eta           : (
                fallbacksToHighestPrice
                ? states.reduce((accum, {eta}) => {
                    if (accum === null) {
                        return eta;
                    }
                    else {
                        return {
                            min : Math.min(accum.min, eta.min),
                            max : Math.max(accum.max, eta.max),
                        };
                    } // if
                }, null as ShippingEta|null)
                : null
            ),
            rates         : (
                fallbacksToHighestPrice
                ? (states.reduce((accum, {rates}) => {
                    if (accum === null) {
                        return rates;
                    }
                    else {
                        const rate = rates[0];
                        return [
                            {
                                start : 0,
                                rate  : Math.max(accum[0].rate, rate.rate),
                            }
                        ];
                    } // if
                }, null as ShippingRate[]|null) ?? [])
                : []
            ),
            
            useZones      : true,
            zones         : states,
        }
    ];
    
    
    
    const now = new Date();
    const shippingProvider = {
        // records:
        _id           : await (async (): Promise<string> => {
            const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 25);
            return await nanoid();
        })(),
        createdAt     : {
            $date     : now.toISOString(),
        },
        updatedAt     : {
            $date     : now.toISOString(),
        },
        
        
        
        // data:
        visibility    : 'PUBLISHED',
        
        name          : serviceName,
        
        weightStep    : 1,
        eta           : null,
        rates         : [],
        
        useZones      : true,
        zones         : countries,
    }
    
    
    
    writeFile(outputFile, JSON.stringify(shippingProvider, undefined, 2));
}

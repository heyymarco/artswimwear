import { default as data } from './dump-results-jne.js'
import { appendFile, writeFile } from 'fs/promises'



const serviceType = /REG|CTC/;
const serviceName = 'JNE Reguler';
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
        const etas = eta.split('-').map((etaStr: string) => {
            if (!etaStr) return null;
            const eta = Number.parseFloat(etaStr);
            if (!isFinite(eta)) return null;
            return eta;
        });
        const [etaMin, etaMax] = etas;
        return {
            destination : destination,
            rate        : value,
            eta         : (etaMin === null) ? null : {
                min     : etaMin,
                max     : ((etaMax === null) || (etaMax < etaMin)) ? etaMin : etaMax,
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
        
        eta           : null,
        rates         : [],
        
        useZones      : true,
        zones         : cities,
    }))
);
const countries = [
    {
        name          : 'ID',
        
        eta           : null,
        rates         : [],
        
        useZones      : true,
        zones         : states,
    }
];
const shippingProvider = {
    visibility    : 'PUBLISHED',
    
    name          : serviceName,
    
    weightStep    : 1,
    eta           : null,
    rates         : [],
    
    useZones      : true,
    zones         : countries,
}

writeFile('./data-jne-reg.json', JSON.stringify(shippingProvider, undefined, undefined));
